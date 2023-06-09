/* eslint-disable max-classes-per-file */
import { windowArray } from 'lullo-utils/Arrays';
import geomag, { type MagneticModel } from 'geomagnetism';
import { round } from 'lullo-utils/Math';
import { loxodromicBearing, loxodromicDistance, loxodromicMidPoint } from './routeUtils';
import { getNearestAllowedAltitude, isValidAltitude } from '../altitude/altitude';
import { calcGS, calcTAS, getDriftCorrectionAngle } from '../speed/speed';
import Translator from '../Translate/Translator';

type TWaypointType = 'ad' | 'coord'
export type TRouteAdType = 'dep' | 'arr' | 'alt';

export type TWaypoint = {
  name: string;
  type: TWaypointType;
  adType?: TRouteAdType,
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
  userEditedAltitude?: number,
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
  fuelConsumption: number
  errors?: {
    [key in keyof _TLeg]?: string
  }
  warnings?: {
    [key in keyof _TLeg]?: string
  }
}

type _TWpt = {
  type: 'wpt',
  wptType: TWaypointType,
  name: string,
  altitude: number,
  coord: string | null,
  index: number,
  fixed: boolean,
  alternate: boolean;
  adType?: TRouteAdType
}

type RouteAcftData = {
  ias: number | undefined;
  climbFuelFlow: number | undefined;
  descentFuelFlow: number | undefined;
  cruiseFuelFlow: number | undefined;
  climbRate: number | undefined;
  descentRate: number | undefined;
  usableFuel: number | undefined;
}

export type TLeg = _TLeg | _TWpt;
export type TLegKeys = keyof _TLeg;
export type LegWaypointTuple = [_TWpt, _TLeg, _TWpt];

const errorTranslator = new Translator({
  planeCannotReachAltitude: {
    'en-US': 'The aircraft cannot reach the desired altitude in the given distance',
    'pt-BR': 'A aeronave não conseguirá atingir a altitude desejada na distância disponível',
  },
  invalidVFRAltitude: {
    'en-US': 'The altitude is invalid for this magnetic heading under VFR',
    'pt-BR': 'A altitude é inválida para esta proa magnética voando VFR',
  },
});

const readableHoursDecimal = (hours: number) => {
  const n = new Date(0, 0);
  n.setSeconds(hours * 60 * 60);
  return n.toTimeString().slice(0, 8);
};

export class RouteWaypoint {
  name: string;
  type: TWaypointType;
  adType?: TRouteAdType;
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
  userEditedAltitude?: number;
  fixed: boolean;
  alternate: boolean;

  constructor(wpt: TWaypoint) {
    this.name = wpt.name;
    this.type = wpt.type;
    this.adType = wpt.adType;
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
    if (wpt.adType) this.adType = wpt.adType;
    if (wpt.coord) this.coord = wpt.coord;
    if (wpt.ias) this.ias = wpt.ias;
    if (wpt.windSpeed) this.windSpeed = wpt.windSpeed;
    if (wpt.windDirection) this.windDirection = wpt.windDirection;
    if (wpt.altitude) this.altitude = wpt.altitude;
    if (wpt.userEditedAltitude) this.userEditedAltitude = wpt.userEditedAltitude;
    if (wpt.fixed) this.fixed = wpt.fixed;
    if (wpt.alternate) this.alternate = wpt.alternate;
  }
}

class Legs {
  private ix = 0;
  constructor(private _legs: TLeg[]) {}

  get length() {
    return this._legs.length;
  }

  push(leg: DistributiveOmit<TLeg, 'index'>) {
    this._legs.push({ ...leg, index: this.ix });
    this.ix += 1;
  }

  mutate(index: number, data: Partial<TLeg>) {
    this._legs[index] = {
      ...this._legs[index],
      ...data as TLeg,
    };
  }

  addError(index: number, error: Exclude<_TLeg['errors'], undefined>) {
    const leg = this._legs[index];
    if (leg.type === 'wpt') return;
    this._legs[index] = {
      ...leg,
      errors: {
        ...(leg.errors || {}),
        ...error,
      },
    };
  }

  addWarning(index: number, error: Exclude<_TLeg['warnings'], undefined>) {
    const leg = this._legs[index];
    if (leg.type === 'wpt') return;
    this._legs[index] = {
      ...leg,
      warnings: {
        ...(leg.warnings || {}),
        ...error,
      },
    };
  }

  toArray() {
    return this._legs;
  }
}

export class Route {
  private route: TWaypoint[];
  private magModel: MagneticModel;
  private legs?: Legs;
  private acftData: RouteAcftData;

  constructor(route: TWaypoint[], acftData: RouteAcftData) {
    this.route = route;
    this.acftData = acftData;
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

  private getAltitudeChangeTime(altitude1: number, altitude2: number) {
    if (
      !this.legs
      || !this.acftData.climbRate
      || !this.acftData.descentRate
    ) return NaN;
    let isClimb = true;

    const altitudeChange = altitude2 - altitude1;
    if (altitudeChange === 0) return 0;
    if (altitudeChange < 0) isClimb = false;
    const altitudeChangeTime = (
      isClimb
        ? Math.abs(altitudeChange) / Math.abs(this.acftData.climbRate)
        : Math.abs(altitudeChange) / Math.abs(this.acftData.descentRate)
    ) / 60;
    return altitudeChangeTime;
  }

  private getAerodromeIndex(type: TRouteAdType) {
    if (!this.legs) return -1;
    return this.legs.toArray().findIndex((l) => {
      if (l.type === 'leg') return false;
      if (l.adType === type) return true;
      return false;
    });
  }

  private getLegSections() {
    if (!this.legs) return;
    const depIx = this.getAerodromeIndex('dep');
    const arrIx = this.getAerodromeIndex('arr');
    const altIx = this.getAerodromeIndex('alt');
    if (depIx < 0 || arrIx < 0) return;
    const legs = this.legs.toArray();
    const mainLegs = legs
      .filter((l, i) => i > depIx && i < arrIx && l.type === 'leg') as _TLeg[];
    const alternateLegs = legs
      .filter((l, i) => i > arrIx && l.type === 'leg') as _TLeg[];
    return {
      mainLegs,
      alternateLegs,
      indexes: {
        dep: depIx,
        arr: arrIx,
        alt: altIx,
      },
    };
  }

  private _checkErrors(legs: _TLeg[], startAltitude:number) {
    if (!this.legs) return;

    legs
      .forEach((l, i) => {
        const _startAltitude = i === 0
          ? startAltitude
          : legs[i - 1].altitude;
        const altitudeChangeTime = this.getAltitudeChangeTime(_startAltitude, l.altitude);
        const totalTime = l.distance / l.gs;
        const cruiseTime = totalTime - altitudeChangeTime;
        if (cruiseTime < 0) {
          this.legs?.addError(l.index, { altitude: errorTranslator.translate('planeCannotReachAltitude') });
        }
      });
  }

  private setWarnings() {
    if (!this.legs) return;
    this.legs.toArray()
      .forEach((l) => {
        if (l.type === 'wpt') return;
        const isAltitudeValid = isValidAltitude(l.mh, l.altitude);
        if (!isAltitudeValid) {
          this.legs?.addWarning(l.index, { altitude: errorTranslator.translate('invalidVFRAltitude') });
        }
      });
  }

  private setErrors() {
    if (!this.legs) return;
    const legSections = this.getLegSections();
    if (!legSections) return;
    const {
      mainLegs,
      alternateLegs,
      indexes: { dep: depIx, arr: arrIx, alt: altIx },
    } = legSections;
    const legs = this.legs.toArray();
    const initialAltitude = legs[depIx].altitude;

    this._checkErrors(mainLegs, initialAltitude);
    if (altIx < 0) return;
    const alternateInitialAltitude = legs[arrIx].altitude;
    this._checkErrors(alternateLegs, alternateInitialAltitude);
  }

  private getFuelConsumption(leg: _TLeg, startAltitude:number) {
    if (
      !this.legs
      || !this.acftData.climbFuelFlow
      || !this.acftData.descentFuelFlow
      || !this.acftData.cruiseFuelFlow
      || !this.acftData.climbRate
      || !this.acftData.descentRate
    ) return NaN;

    const altitudeChangeTime = this.getAltitudeChangeTime(startAltitude, leg.altitude);
    const totalTime = leg.distance / leg.gs;
    const cruiseTime = totalTime - altitudeChangeTime;
    if (cruiseTime < 0) {
      return NaN;
    }

    const altitudeChangeFuelConsumption = (
      startAltitude < leg.altitude
        ? this.acftData.climbFuelFlow
        : this.acftData.descentFuelFlow
    ) * altitudeChangeTime;
    const cruiseFuelConsumption = cruiseTime * this.acftData.cruiseFuelFlow;
    return cruiseFuelConsumption + altitudeChangeFuelConsumption;
  }

  private _calculateFuelConsumption(legs: _TLeg[], startAltitude:number) {
    if (
      !this.legs
      || !this.acftData.climbFuelFlow
      || !this.acftData.descentFuelFlow
      || !this.acftData.cruiseFuelFlow
      || !this.acftData.climbRate
      || !this.acftData.descentRate
    ) return NaN;

    legs
      .forEach((l, i) => {
        const _startAltitude = i === 0
          ? startAltitude
          : legs[i - 1].altitude;
        const fuelConsumption = this.getFuelConsumption(l, _startAltitude);
        this.legs?.mutate(l.index, { fuelConsumption });
      });
  }

  private calculateFuelConsumption() {
    if (
      !this.legs
      || !this.acftData.climbFuelFlow
      || !this.acftData.descentFuelFlow
      || !this.acftData.cruiseFuelFlow
      || !this.acftData.climbRate
      || !this.acftData.descentRate
    ) return NaN;

    const legSections = this.getLegSections();
    if (!legSections) return;
    const {
      mainLegs,
      alternateLegs,
      indexes: { dep: depIx, arr: arrIx, alt: altIx },
    } = legSections;
    const legs = this.legs.toArray();
    const initialAltitude = legs[depIx].altitude;

    this._calculateFuelConsumption(mainLegs, initialAltitude);

    if (altIx < 0) return;
    const alternateInitialAltitude = legs[arrIx].altitude;
    this._calculateFuelConsumption(alternateLegs, alternateInitialAltitude);
  }

  private addThousandFeetIfAerodrome(pt: TWaypoint) {
    if (pt.type === 'ad') return (pt.altitude || 0) + 1000;
    return pt.altitude || 0;
  }

  private getAltitude(pts: TWaypoint[], mh: number) {
    const alt = this.addThousandFeetIfAerodrome(
      pts[0].altitude
        ? pts[0]
        : pts[1],
    );
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
        altitude: wptAltitude,
        userEditedAltitude,
        ias,
        fixed,
        alternate,
        adType,
      } = leg[0];

      legs.push({
        type: 'wpt',
        wptType: type,
        name,
        altitude: wptAltitude || 0,
        coord: coord?.degMinSec || null,
        fixed,
        alternate,
        adType,
      });
      if (!ix) ix += 1;
      const midPoint = this.getMidPoint(leg);
      const distance = this.getDistance(leg);
      const heading = this.getHeading(leg);
      const MHNoWind = this.getMagHeading(midPoint, heading);
      const altitudeNoWind = userEditedAltitude || this.getAltitude(leg, MHNoWind);
      const TASNoWind = calcTAS(altitudeNoWind, ias);
      const driftCorrectionAngle = getDriftCorrectionAngle({
        heading,
        windDirection: windDirection || 0,
        windSpeed: windSpeed || 0,
        tas: TASNoWind,
      }) || 0;
      const MH = MHNoWind + driftCorrectionAngle;
      const altitude = userEditedAltitude || this.getAltitude(leg, MH);
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
        fuelConsumption: NaN,
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
      altitude: lastWpt.altitude || 0,
      coord: lastWpt.coord?.degMinSec || null,
      fixed: lastWpt.fixed,
      alternate: lastWpt.alternate,
      adType: lastWpt.adType,
    });

    this.legs = legs;
    this.calculateFuelConsumption();
    this.setErrors();
    this.setWarnings();
    console.log('this.legs: ', this.legs);
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

