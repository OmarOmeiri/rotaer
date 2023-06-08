/* eslint-disable max-classes-per-file */
import { windowArray } from 'lullo-utils/Arrays';
import geomag, { type MagneticModel } from 'geomagnetism';
import { round } from 'lullo-utils/Math';
import { loxodromicBearing, loxodromicDistance, loxodromicMidPoint } from './routeUtils';
import { getNearestAllowedAltitude } from '../altitude/altitude';
import { calcGS, calcTAS, getDriftCorrectionAngle } from '../speed/speed';

type TWaypointType = 'ad' | 'coord'

export type TWaypoint = {
  name: string;
  type: TWaypointType
  coord: {
    degMinSec: string;
    decimal: {
        lat: number;
        lon: number;
    };
  } | null;
  ias: number,
  windSpeed: number | null;
  windDirection: number | null;
  altitude: number | null;
  fixed: boolean;
  alternate: boolean;
}

type _TLeg = {
  type: 'leg',
  mh: number,
  altitude: number,
  ias: number,
  tas: number,
  distance: number,
  windSpeed: number | null,
  windDirection: number | null,
  gs: number,
  ete: string,
  eto: string,
  index: number,
  alternate: boolean;
}

type _TWpt = {
  type: 'wpt',
  wptType: TWaypointType,
  name: string,
  coord: string | null,
  index: number,
  fixed: boolean,
  alternate: boolean;
}

export type TLeg = _TLeg | _TWpt

const readableHoursDecimal = (hours: number) => {
  const n = new Date(0, 0);
  n.setSeconds(hours * 60 * 60);
  return n.toTimeString().slice(0, 8);
};

export class RouteWaypoint {
  name: string;
  type: TWaypointType;
  coord: {
    degMinSec: string;
    decimal: {
        lat: number;
        lon: number;
    };
  } | null;
  windSpeed: number | null;
  windDirection: number | null;
  ias: number;
  altitude: number | null;
  fixed: boolean;
  alternate: boolean;

  constructor(wpt: TWaypoint) {
    this.name = wpt.name;
    this.type = wpt.type;
    this.coord = wpt.coord;
    this.ias = wpt.ias;
    this.windSpeed = wpt.windSpeed;
    this.windDirection = wpt.windDirection;
    this.altitude = wpt.altitude;
    this.fixed = wpt.fixed;
    this.alternate = wpt.alternate;
  }

  merge(wpt: Partial<TWaypoint>) {
    if (wpt.name) this.name = wpt.name;
    if (wpt.type) this.type = wpt.type;
    if (wpt.coord) this.coord = wpt.coord;
    if (wpt.ias) this.ias = wpt.ias;
    if (wpt.windSpeed) this.windSpeed = wpt.windSpeed;
    if (wpt.windDirection) this.windDirection = wpt.windDirection;
    if (wpt.altitude) this.altitude = wpt.altitude;
    if (wpt.fixed) this.fixed = wpt.fixed;
    if (wpt.alternate) this.alternate = wpt.alternate;
  }
}

class Legs {
  private ix = 0;
  constructor(private legs: TLeg[]) {}

  get length() {
    return this.legs.length;
  }

  push(leg: DistributiveOmit<TLeg, 'index'>) {
    this.legs.push({ ...leg, index: this.ix });
    this.ix += 1;
  }

  mutate(index: number, data: Partial<TLeg>) {
    this.legs[index] = {
      ...this.legs[index],
      ...data as TLeg,
    };
  }

  toArray() {
    return this.legs;
  }
}

export class Route {
  private route: TWaypoint[];
  private magModel: MagneticModel;
  private legs?: Legs;

  constructor(route: TWaypoint[]) {
    this.route = route;
    this.magModel = geomag.model();
  }

  get legLength() {
    return this.legs?.length || 0;
  }

  hasLegs() {
    return (this.legs?.length || 0) > 0;
  }

  private getDistance(legs: TWaypoint[]) {
    if (!legs[0].coord || !legs[1].coord) return NaN;
    return loxodromicDistance({
      lat1: legs[0].coord.decimal.lat,
      lon1: legs[0].coord.decimal.lon,
      lat2: legs[1].coord.decimal.lat,
      lon2: legs[1].coord.decimal.lon,
    }, 'nm');
  }

  private getHeading(legs: TWaypoint[]) {
    if (!legs[0].coord || !legs[1].coord) return NaN;
    return loxodromicBearing({
      lat1: legs[0].coord.decimal.lat,
      lon1: legs[0].coord.decimal.lon,
      lat2: legs[1].coord.decimal.lat,
      lon2: legs[1].coord.decimal.lon,
    });
  }

  private getMidPoint(legs: TWaypoint[]) {
    if (!legs[0].coord || !legs[1].coord) return { lat: NaN, lon: NaN };
    return loxodromicMidPoint({
      lat1: legs[0].coord.decimal.lat,
      lon1: legs[0].coord.decimal.lon,
      lat2: legs[1].coord.decimal.lat,
      lon2: legs[1].coord.decimal.lon,
    });
  }

  private getDmg(point: {lat: number, lon: number}) {
    if (Number.isNaN(point.lat) || Number.isNaN(point.lon)) return NaN;
    return this.magModel.point([point.lat, point.lon]).decl;
  }

  private getMagHeading(point: {lat: number, lon: number}, heading: number) {
    if (
      Number.isNaN(point.lat)
      || Number.isNaN(point.lon)
      || Number.isNaN(heading)
    ) return NaN;
    return heading - this.getDmg(point);
  }

  private getETE(distance: number, speed: number) {
    return distance / speed;
  }

  private getGS(
    tas: number,
    heading: number,
    windDirection: number,
    windSpeed: number,
  ) {
    return Math.round(calcGS({
      heading,
      windDirection,
      windSpeed,
      tas,
    }) || 0);
  }

  private getAltitude(pts: TWaypoint[], mh: number) {
    const alt = pts[0].altitude || pts[1].altitude || 0;
    return getNearestAllowedAltitude(mh, alt);
  }

  getLegs() {
    const legs = new Legs([]);
    let ETO = 0;
    let ix = 0;
    for (const leg of windowArray(this.route, 2)) {
      const {
        name,
        type,
        coord,
        windSpeed,
        windDirection,
        ias,
        fixed,
        alternate,
      } = leg[0];

      legs.push({
        type: 'wpt',
        wptType: type,
        name,
        coord: coord?.degMinSec || null,
        fixed,
        alternate,
      });
      if (!ix) ix += 1;
      const midPoint = this.getMidPoint(leg);
      const distance = this.getDistance(leg);
      const heading = this.getHeading(leg);
      const MHNoWind = this.getMagHeading(midPoint, heading);
      const altitudeNoWind = this.getAltitude(leg, MHNoWind);
      const TASNoWind = calcTAS(altitudeNoWind, ias);
      const driftCorrectionAngle = getDriftCorrectionAngle({
        heading,
        windDirection: windDirection || 0,
        windSpeed: windSpeed || 0,
        tas: TASNoWind,
      }) || 0;
      const MH = MHNoWind + driftCorrectionAngle;
      const altitude = this.getAltitude(leg, MH);
      const TAS = calcTAS(altitude, ias);
      const GS = this.getGS(TAS, MH, windDirection || 0, windSpeed || 0);
      const ETE = this.getETE(distance, GS);
      ETO += ETE;
      ix += 1;
      legs.push({
        type: 'leg',
        mh: Math.round(MH),
        altitude,
        distance: round(distance, 2),
        ias,
        tas: Math.round(TAS),
        windSpeed: windSpeed || 0,
        windDirection: windDirection || 0,
        gs: GS,
        ete: readableHoursDecimal(ETE),
        eto: `T+${readableHoursDecimal(ETO)}`,
        alternate: leg[1].alternate,
      });
    }
    ix += 1;
    const lastWpt = this.route[this.route.length - 1];
    legs.push({
      type: 'wpt',
      wptType: lastWpt.type,
      name: lastWpt.name,
      coord: lastWpt.coord?.degMinSec || null,
      fixed: lastWpt.fixed,
      alternate: lastWpt.alternate,
    });
    this.legs = legs;
    return this.legs.toArray();
  }

  private getLegByIndex(index: string | number) {
    if (!this.legs) return;
    const ix = Number(index);
    if (Number.isNaN(ix)) throw new Error(`Invalid leg index: ${index}`);
    const l = this.legs.toArray().filter((l) => l.type === 'leg')[ix];
    if (!l) throw new Error(`Invalid leg index: ${index}`);
    return l;
  }
}

