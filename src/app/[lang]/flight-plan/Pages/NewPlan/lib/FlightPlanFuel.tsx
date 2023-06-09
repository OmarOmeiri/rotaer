import { useEffect, useMemo, useState } from 'react';
import { windowArray } from 'lullo-utils/Arrays';
import type { LegWaypointTuple, TLeg } from '../../../../../../utils/Route/Route';
import Translator from '../../../../../../utils/Translate/Translator';
import CardWithTitle from '../../../../../../components/Card/CardWithTitle';
import { RouteErrorBanner } from './ErrorBanner';

const translator = new Translator({
  title: { 'en-US': 'Fuel', 'pt-BR': 'Combustível' },
  badCalc: { 'en-US': 'Cannot calculate fuel consumption', 'pt-BR': 'Impossível calcular consumo de combustível' },
});

const FlightPlanFuel = ({ legs }:{legs: TLeg[]}) => {
  const [fuelData, hasError] = useMemo(() => {
    if (!legs.length) return [[], false];
    const data: {name: string, fuel: number}[] = [];
    let hasError = false;
    for (const wLegs of windowArray(legs, 3, 2)) {
      const [w1, leg, w2] = wLegs as LegWaypointTuple;
      data.push({
        name: `${w1.name} -> ${w2.name}`,
        fuel: leg.fuelConsumption,
      });
      if (Object.keys(leg.errors || {}).length) {
        hasError = true;
      }
    }
    return [data, hasError] as [{name: string, fuel: number}[], boolean];
  }, [legs]);

  return (
    <CardWithTitle title={translator.translate('title')} styled>
      {
        hasError
          ? (
            <RouteErrorBanner>
              {translator.translate('badCalc')}
            </RouteErrorBanner>
          )
          : (
            <table>
              <tbody>
                {
                fuelData.map((fd) => (
                  <tr key={fd.name}>
                    <td>{fd.name}</td>
                    <td>{Math.round(fd.fuel)}L</td>
                  </tr>
                ))
              }
                <tr>
                  <td>Total</td>
                  <td>{Math.round(fuelData.reduce((a, b) => a + b.fuel, 0))}L</td>
                </tr>
              </tbody>
            </table>
          )
      }
    </CardWithTitle>
  );
};

export default FlightPlanFuel;
