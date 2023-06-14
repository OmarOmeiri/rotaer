import CardWithTitle from '../../../../../../components/Card/CardWithTitle';
import { TAerodromeData } from '../../../../../../types/app/aerodrome';
import rotaerFuelAndServicesTranslator from '../../../../../../utils/Translate/RotaerFuelAnsServicesTranslator';
import Translator from '../../../../../../utils/Translate/Translator';
import { LengthConverter } from '../../../../../../utils/converters/length';
import classes from './FlightPlanAerodromeData.module.css';

const translator = new Translator({
  title: { 'en-US': 'Aerodrome Info', 'pt-BR': 'Informação de Aeródromos' },
  rwy: { 'en-US': 'Runways', 'pt-BR': 'Pistas' },
  freq: { 'en-US': 'Frequencies', 'pt-BR': 'Frequências' },
  fuel: { 'en-US': 'Fuel', 'pt-BR': 'Combustível' },
  elev: { 'pt-BR': 'Elevação', 'en-US': 'Elevation' },
});

const AerodromeData = ({
  aerodrome,
}:{aerodrome: TAerodromeData}) => (
  <div>
    <div className={classes.AerodromeIcao}>{aerodrome.icao}</div>
    <div className={classes.TablesWrapper}>
      <div>
        <span>Info</span>
        <table>
          <tbody>
            <tr>
              <td align='left'>{translator.translate('elev')}</td>
              <td>{Math.round(LengthConverter.M(aerodrome.elev).toFt())}</td>
            </tr>
            <tr>
              <td align='left'>FIR</td>
              <td>{aerodrome.fir}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div>
        <span>{translator.translate('rwy')}</span>
        <table>
          <tbody>
            {aerodrome.rwys.map((rwy) => (
              <tr key={rwy.rwy}>
                <td align='left'>{rwy.rwy}</td>
                <td>{rwy.length}m</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {
        aerodrome.com?.length
          ? (
            <div>
              <span>{translator.translate('freq')}</span>
              <table>
                <tbody>
                  {aerodrome.com.map((com) => (
                    com.freq
                      ? (
                        <tr key={com.name}>
                          <td align='left'>{com.name}</td>
                          <td>{com.freq.join(', ')}</td>
                        </tr>
                      )
                      : null
                  ))}
                </tbody>
              </table>
            </div>
          )
          : null
      }
      {
        aerodrome.CMB?.length
          ? (
            <div>
              <span>{translator.translate('fuel')}</span>
              <table>
                <tbody>
                  {aerodrome.CMB.map((c) => (
                    <tr key={c}>
                      <td>{rotaerFuelAndServicesTranslator.fuel.translate(c)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
          : null
      }
    </div>
  </div>
);

const FlightPlanAerodromeData = ({
  departure,
  arrival,
  alternate,
}:{
  departure: TAerodromeData | null,
  arrival: TAerodromeData | null,
  alternate: TAerodromeData | null,
}) => {
  if (!departure || !arrival) return null;
  return (
    <CardWithTitle
      title={translator.translate('title')}
      className={classes.Wrapper}
      contentClassName={classes.AerodromesWrapper}
      styled
    >
      <AerodromeData aerodrome={departure}/>
      <AerodromeData aerodrome={arrival}/>
      {
        alternate
          ? <AerodromeData aerodrome={alternate}/>
          : null
      }
    </CardWithTitle>
  );
};

export default FlightPlanAerodromeData;
