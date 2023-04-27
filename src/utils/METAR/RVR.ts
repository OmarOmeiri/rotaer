import { LengthConverter } from '../converters/length';
import { removeNonNumericChars } from '../string';

export type TMetarRVR = {
  runway: string,
  min: string,
  max: string | null,
  trend: string | null,
}

class RVRParser {
  private parseValue(
    minusPositiveIndicator: string | undefined,
    value: string,
    unit: string | undefined,
  ) {
    const valueMeters = Math.round((
      unit === 'FT'
        ? LengthConverter.ft(Number(value)).toM()
        : Number(value)
    ));
    switch (minusPositiveIndicator) {
      case 'M':
        return `↓${valueMeters}`;
      case 'P':
        return `↑${valueMeters}`;
      default:
        return `${valueMeters}`;
    }
  }

  parse(rvrString: string): TMetarRVR | null {
    const re = /(R\d{2})([L|R|C])?(\/)([P|M])?(\d+)(?:([V])([P|M])?(\d+))?([N|U|D])?(FT)?/g;
    const matches = re.exec(rvrString);

    if (matches) {
      const [
        _,
        runway,
        runwaySpec,
        _sep,
        minusPositiveIndicator1,
        value1,
        _variableIndicator,
        minusPositiveIndicator2,
        value2,
        trend,
        unit,
      ] = matches;
      return {
        runway: `${removeNonNumericChars(runway)}${runwaySpec || ''}`,
        min: this.parseValue(minusPositiveIndicator1, value1, unit),
        max: this.parseValue(minusPositiveIndicator2, value2, unit) || null,
        trend: trend || null,
      };
    }

    return null;
  }
}

const rvrParser = new RVRParser();
export default rvrParser;
