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
    <div>
      Info
      <ul>
        <li style={{ listStyle: 'none' }}>{`${translator.translate('elev')}: ${Math.round(LengthConverter.M(aerodrome.elev).toFt())}`}ft</li>
        <li style={{ listStyle: 'none' }}>{`FIR: ${aerodrome.fir}`}</li>
      </ul>
    </div>
    <div>
      {translator.translate('rwy')}
      <ul>
        {aerodrome.rwys.map((rwy) => (
          <li key={rwy.rwy}>{rwy.rwy} - {rwy.length}m</li>
        ))}
      </ul>
    </div>
    {
      aerodrome.com?.length
        ? (
          <div>
            {translator.translate('freq')}
            <ul>
              {aerodrome.com.map((com) => (
                com.freq
                  ? <li key={com.name}>{com.name}: {com.freq.join(', ')}</li>
                  : null
              ))}
            </ul>
          </div>
        )
        : null
    }
    {
      aerodrome.CMB?.length
        ? (
          <div>
            {translator.translate('fuel')}
            <ul>
              {aerodrome.CMB.map((c) => (
                <li key={c}>{rotaerFuelAndServicesTranslator.fuel.translate(c)}</li>
              ))}
            </ul>
          </div>
        )
        : null
    }
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
