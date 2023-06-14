/* eslint-disable max-classes-per-file */
import { windowArray } from 'lullo-utils/Arrays';
import { orderBy } from 'lodash';
import type { LegWaypointTuple, RouteAcftData, TLeg } from './Route';
import { getRouteAltitudeChangeDistance, getRouteAltitudeChangeTime } from './routeUtils';
import Translator from '../Translate/Translator';

export type RouteVProfile = {
  name: string,
  distance: number,
  time: number;
  altitude: number,
  gs: number,
  tod?: true,
  toc?: true,
  ad?: boolean,
  index: number
}

const translator = new Translator({
  badCalc: { 'pt-BR': 'Impossível calcular o perfil vertical. Cheque erros de rota.', 'en-US': 'Could not calculate vertical profile. Check for route errors.' },
  badAcft: { 'en-US': 'Could not calculate vertical profile. Check aircraft data.', 'pt-BR': 'Impossível calcular o perfil vertical. Cheque dados da aeronave.' },
});

const objCumSum = <T extends object, K extends KeysOfType<T, number>>(obj: T[], key: K) => (
  obj.reduce((sum, v) => sum + (v[key] as number), 0)
);

class RouteVerticalProfile {
  private todToc = {
    TOD: 0,
    TOC: 0,
  };
  private _errors: string[] = [];
  constructor(
    private legs: TLeg[],
    private acft: RouteAcftData,
  ) {
    if (
      !this.acft.climbRate
        || !this.acft.descentRate
    ) {
      this._errors.push(
        translator.translate('badAcft'),
      );
    }
  }

  get errors() {
    if (this._errors.length) return Array.from(new Set(this._errors));
    return null;
  }

  private getTodTocName(altitude1: number, altitude2: number) {
    if (altitude1 > altitude2) {
      this.todToc.TOD += 1;
      return `TOD${this.todToc.TOD}`;
    }

    this.todToc.TOC += 1;
    return `TOC${this.todToc.TOC}`;
  }

  private getTocTod(altitude1: number, altitude2: number, gs: number): RouteVProfile {
    if (altitude1 === altitude2) {
      throw new Error(`Altitudes cannot match: ${altitude1}`);
    }
    let isClimb = true;
    if (altitude1 > altitude2) isClimb = false;
    const altitudeChangeTime = getRouteAltitudeChangeTime(altitude1, altitude2, this.acft);
    const distance = getRouteAltitudeChangeDistance(altitudeChangeTime, gs);
    const todToc: RouteVProfile = {
      name: this.getTodTocName(altitude1, altitude2),
      time: altitudeChangeTime,
      distance,
      altitude: isClimb ? altitude2 : altitude1,
      gs,
      index: NaN,
    };
    if (isClimb) todToc.toc = true;
    else todToc.tod = true;
    return todToc;
  }

  private getWaypointGroundSpeed(w: LegWaypointTuple[0], legs: TLeg[]) {
    const nextLeg = legs.find((l) => l.index > w.index && l.type === 'leg') as LegWaypointTuple[1];
    if (nextLeg) return nextLeg.gs;
    let prevLeg: LegWaypointTuple[1] | undefined;
    Array.from(Array(legs.length - 1).keys())
      .forEach((i) => {
        if (legs[i].type === 'leg' && legs[i].index < w.index) {
          prevLeg = legs[i] as LegWaypointTuple[1];
        }
      });
    if (!prevLeg) {
      throw new Error(`Could not find ground speed for waypoint: "${w.name}"`);
    }
    return prevLeg.gs;
  }

  private setErrors(vProf: RouteVProfile[]) {
    const altitudeErrors = vProf.some((p) => {
      if (p.time < 0 || p.distance < 0) {
        return true;
      }
      return false;
    });
    let distanceTimeErrors = false;
    for (const [p1, p2] of windowArray(vProf, 2)) {
      if (
        p2.distance < p1.distance
       || p2.time < p1.time
      ) {
        distanceTimeErrors = true;
        break;
      }
    }
    if (altitudeErrors || distanceTimeErrors) {
      this._errors.push(
        translator.translate('badCalc'),
      );
    }
  }

  private getWaypointAltitude(w: LegWaypointTuple[0], legs: TLeg[]) {
    const wAltitude = w.altitude;
    if (w.wptType === 'ad') return wAltitude;
    if (wAltitude) return wAltitude;
    return legs.find((l) => l.index === w.index - 1)?.altitude || wAltitude;
  }

  private legToProfile(legs: TLeg[]) {
    const prof = legs.reduce((p, l, i) => {
      if (l.type === 'leg') return p;
      if (!i) {
        p.push({
          name: l.name,
          time: 0,
          distance: 0,
          altitude: this.getWaypointAltitude(l, legs),
          gs: this.getWaypointGroundSpeed(l, legs),
          ad: l.wptType === 'ad',
          index: l.index,
        });
      } else {
        const lastLeg = legs[i - 1] as LegWaypointTuple[1];
        const altitude = l.wptType === 'ad'
          ? l.altitude
          : lastLeg.altitude;
        p.push({
          name: l.name,
          time: lastLeg.distance / lastLeg.gs,
          distance: lastLeg.distance,
          altitude,
          gs: this.getWaypointGroundSpeed(l, legs),
          ad: l.wptType === 'ad',
          index: l.index,
        });
      }
      return p;
    }, [] as RouteVProfile[]);

    return prof.flatMap((p, i) => {
      const next = prof[i + 1];
      if (!next) return p;
      if (p.ad || next.ad) {
        const helperleg = this.legs
          .find((l) => (
            l.index > p.index && l.type === 'leg'
          )) as LegWaypointTuple[1];
        const helperProfile: RouteVProfile = {
          name: 'helper',
          distance: NaN,
          altitude: helperleg.altitude,
          gs: helperleg.gs,
          time: NaN,
          index: NaN,
        };
        return [p, helperProfile];
      }
      return p;
    });
  }

  private cumSumPoints(vProf: RouteVProfile[]) {
    return vProf.map((p, i) => {
      if (!p.tod && !p.toc) {
        const before = vProf.slice(0, i + 1).filter((p) => !p.toc && !p.tod);
        const distance = objCumSum(before, 'distance');
        const time = objCumSum(before, 'time');
        return {
          ...p,
          time,
          distance,
        };
      }
      return p;
    });
  }

  private correctTodTocs(vProf: RouteVProfile[]) {
    return vProf.map((p, i) => {
      if (p.toc) {
        const lastProf = vProf.slice(0, i)
          .reverse().find((p) => !p.toc && !p.tod);
        return {
          ...p,
          distance: p.distance + (lastProf?.distance || 0),
          time: p.time + (lastProf?.time || 0),
        };
      } if (p.tod) {
        const nextProf = vProf.slice(i, vProf.length).find((p) => !p.toc && !p.tod);
        return {
          ...p,
          distance: (nextProf?.distance || 0) - p.distance,
          time: (nextProf?.time || 0) - p.time,
        };
      }
      return p;
    });
    // const cumSumTocTod = orderBy(, 'distance', 'asc');

    // cumSumTocTod
    //   .forEach((p, i) => {
    //     if (p.toc || p.tod || !i) return;
    //     const altitudeDiff = p.altitude - cumSumTocTod[i - 1].altitude;
    //     console.log('altitudeDiff: ', altitudeDiff);
    //   });

    // return orderBy(cumSumTocTod, 'distance', 'asc');
  }

  private createTodTocs(prof: RouteVProfile[]) {
    return prof.flatMap((p, i) => {
      if (!i) return p;
      const lastP = prof[i - 1];
      if (lastP.altitude === p.altitude) return p;
      if (lastP.altitude > p.altitude) {
        return [this.getTocTod(lastP.altitude, p.altitude, lastP.gs), p];
      }
      return [this.getTocTod(lastP.altitude, p.altitude, lastP.gs), p];
    }).filter((p) => p.name !== 'helper');
  }

  getPoints() {
    if (this.legs.length < 3) return [];
    const legsAltitudeCorrected = this.legs.map((l) => {
      if (l.type === 'wpt') l.altitude = this.getWaypointAltitude(l, this.legs);
      return l;
    });
    console.log(

      this.legToProfile(
        legsAltitudeCorrected,
      ),
    );
    return this.correctTodTocs(
      this.cumSumPoints(
        this.createTodTocs(
          this.legToProfile(
            legsAltitudeCorrected,
          ),
        ),
      ),
    );
  }
}

export default RouteVerticalProfile;

