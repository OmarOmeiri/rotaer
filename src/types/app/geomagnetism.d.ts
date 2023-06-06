declare module 'geomagnetism' {
  export class MagneticElements {
    x: number;
    y: number;
    z: number;
    h: number;
    f: number;
    incl: number;
    decl: number;
    gv: number | undefined;
    xdot: number | undefined;
    ydot: number | undefined;
    zdot: number | undefined;
    hdot: number | undefined;
    fdot: number | undefined;
    incldot: number | undefined;
    decldot: number | undefined;
    gvdot: number | undefined;
  }

  export class MagneticModel {
    point(coord: [number, number]): MagneticElements
  }

  var geo = {
    model(date?: Date): MagneticModel
  }

  export default geo;
}