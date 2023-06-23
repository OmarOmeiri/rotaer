/* eslint-disable max-classes-per-file */
import { windowArray } from 'lullo-utils/Arrays';
import type {
  LegWaypointTuple, RouteAcftData, TLeg, TRouteAdType,
} from './Route';
import { getRouteAltitudeChangeDistance, getRouteAltitudeChangeTime } from './routeUtils';
import Translator from '../Translate/Translator';

export type RouteVProfile = {
  name: string,
  distance: number,
  time: number;
  altitude: number,
  nextAltitude: number,
  gs: number,
  tod?: true,
  toc?: true,
  adType?: TRouteAdType,
  index: number
  showName?: boolean
}

const translator = new Translator({
  badCalc: { 'pt-BR': 'Impossível calcular o perfil vertical. Cheque erros de rota.', 'en-US': 'Could not calculate vertical profile. Check for route errors.' },
  badAcft: { 'en-US': 'Could not calculate vertical profile. Check aircraft data.', 'pt-BR': 'Impossível calcular o perfil vertical. Cheque dados da aeronave.' },
});

const objCumSum = <T extends object, K extends KeysOfType<T, number>>(obj: T[], key: K) => (
  obj.reduce((sum, v) => sum + (v[key] as number), 0)
);

// const shouldAddTOC = (p1: RouteVProfile, p2: RouteVProfile) => {
//   if (p1.altitude < p2.altitude) return true;
//   return false;
// };

// const shouldAddTOD = (p1: RouteVProfile, p2: RouteVProfile) => {
//   if (p1.altitude > p2.altitude) return true;
//   return false;
// };

class RouteVerticalProfile {
  private todToc = {
    TOD: 0,
    TOC: 0,
  };
  private _errors: string[] = [];
  private helperPointIndex = 1;
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

  private getHelperPointName() {
    const name = `WPT${this.helperPointIndex}`;
    this.helperPointIndex += 1;
    return name;
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
      nextAltitude: NaN,
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
          nextAltitude: legs[i + 1].altitude,
          gs: this.getWaypointGroundSpeed(l, legs),
          adType: l.adType,
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
          nextAltitude: legs[i + 1]?.altitude || altitude,
          gs: this.getWaypointGroundSpeed(l, legs),
          adType: l.adType,
          index: l.index,
        });
      }
      return p;
    }, [] as RouteVProfile[]);
    return prof;
  }

  private cumSumPoints(vProf: RouteVProfile[]) {
    return vProf.map((p, i) => {
      const before = vProf.slice(0, i + 1).filter((p) => !p.toc && !p.tod);
      const distance = objCumSum(before, 'distance');
      const time = objCumSum(before, 'time');
      return {
        ...p,
        time,
        distance,
      };
    });
  }

  private createTodTocs(prof: RouteVProfile[]) {
    const pr = prof.flatMap((p, i) => {
      if (p.altitude === p.nextAltitude) return p;
      const todToc = this.getTocTod(p.altitude, p.nextAltitude, p.gs);
      if (todToc.toc) {
        return [p, {
          ...todToc,
          distance: todToc.distance + p.distance,
          time: todToc.time + p.time,
        }];
      }
      const next = prof[i + 1];
      return [p,
        {
          ...todToc,
          name: this.getHelperPointName(),
          altitude: p.nextAltitude,
          distance: todToc.distance + p.distance,
          time: todToc.time + p.time,
          showName: false,
        },
        {
          ...todToc,
          altitude: p.nextAltitude,
          distance: next.distance - todToc.distance,
          time: next.time - todToc.time,
        }];
    });
    return pr.flatMap((p, i) => {
      if (!i) return p;
      const last = pr[i - 1];
      if (
        (p.adType === 'arr' || p.adType === 'alt')
        && !last.tod
      ) {
        const todToc = this.getTocTod(last.altitude, p.altitude, p.gs);
        return [
          {
            ...todToc,
            distance: p.distance - todToc.distance,
            time: p.time - todToc.time,
          },
          p,
        ];
      }
      return p;
    });
  }

  getPoints() {
    if (this.legs.length < 3) return [];
    const legsAltitudeCorrected = this.legs.map((l) => {
      if (l.type === 'wpt') l.altitude = this.getWaypointAltitude(l, this.legs);
      return l;
    });
    return this.createTodTocs(
      this.cumSumPoints(
        this.legToProfile(
          legsAltitudeCorrected,
        ),
      ),
    );
  }
}

export default RouteVerticalProfile;

