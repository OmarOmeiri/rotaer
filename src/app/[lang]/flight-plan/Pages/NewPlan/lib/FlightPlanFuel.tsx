import { useMemo } from 'react';
import { windowArray } from 'lullo-utils/Arrays';
import Arrow from '@icons/arrow-right-solid.svg';
import type { LegWaypointTuple, TLeg } from '../../../../../../utils/Route/Route';
import Translator from '../../../../../../utils/Translate/Translator';
import CardWithTitle from '../../../../../../components/Card/CardWithTitle';
import { RouteErrorBanner } from './ErrorBanner';
import { ParsedForms } from '../../../../../../hooks/Forms/useForm';
import type { newFlightPlanAcftFormData } from './forms';
import type { newFlightPlanAcftValidator } from './validation';
import classes from './FlightPlanFuel.module.css';

const translator = new Translator({
  title: { 'en-US': 'Fuel', 'pt-BR': 'Combustível' },
  badCalc: { 'en-US': 'Cannot calculate fuel consumption', 'pt-BR': 'Impossível calcular consumo de combustível' },
  notEnoughFuel: { 'en-US': 'Aircraft does not have enough fuel to complete the route', 'pt-BR': 'A aeronave não possui combustível suficiente.' },
});

const FlightPlanFuel = ({
  legs,
  acftData,
}:{
  legs: TLeg[],
  acftData: ParsedForms<typeof newFlightPlanAcftFormData, typeof newFlightPlanAcftValidator>
}) => {
  const [fuelData, hasError] = useMemo(() => {
    if (!legs.length) return [[], false];
    const data: {name: string, leg: JSX.Element, fuel: number}[] = [];
    let hasError = false;
    for (const wLegs of windowArray(legs, 3, 2)) {
      const [w1, leg, w2] = wLegs as LegWaypointTuple;
      data.push({
        name: `${w1.name} -> ${w2.name}`,
        leg: <>{w1.name} <Arrow width="10" fill="rgb(241, 20, 133)"/> {w2.name}</>,
        fuel: leg.fuelConsumption,
      });
      if (Number.isNaN(Number(leg.fuelConsumption))) {
        hasError = true;
      }
      if (Object.keys(leg.errors || {}).length) {
        hasError = true;
      }
    }
    return [data, hasError] as [{name: string, leg: JSX.Element, fuel: number}[], boolean];
  }, [legs]);

  const totalFuel = useMemo(() => (
    Math.round(fuelData.reduce((a, b) => a + b.fuel, 0))
  ), [fuelData]);

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
            <>
              {
                acftData.usableFuel && acftData.usableFuel <= totalFuel
                  ? (
                    <RouteErrorBanner type='warning'>
                      {translator.translate('notEnoughFuel')}
                    </RouteErrorBanner>
                  )
                  : null
              }
              <div className={classes.TableWrapper}>
                <table className={classes.Table}>
                  <tbody>
                    {
                      fuelData.map((fd) => (
                        <tr key={fd.name}>
                          <td align='left'>{fd.leg}</td>
                          <td align='center'>{Math.round(fd.fuel)}L</td>
                        </tr>
                      ))
                    }
                    <tr className={classes.TotalRow}>
                      <td align='left'>Total</td>
                      <td align='center'>{Math.round(fuelData.reduce((a, b) => a + b.fuel, 0))}L</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </>
          )
      }
    </CardWithTitle>
  );
};

export default FlightPlanFuel;
