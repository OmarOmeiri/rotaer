import METARParser from '../../utils/METAR/METAR';
import redeMetUrl from '../../utils/REDEMET/RedeMetUrl';
import Api from '../HTTPRequest';

export const fetchParsedAerodromeMETAR = async (args: Parameters<typeof redeMetUrl.metar>[number]) => {
  const { data } = await new Api(redeMetUrl.metar(args))
    .get<IMETARResponse>();
  const lastMetar = (data?.data.data || []).reduce((lm, m) => {
    const dtNext = new Date(m.validade_inicial);
    if (Number.isNaN(dtNext.getTime())) return lm;
    if (!lm) return m;
    const dtCurr = new Date(lm.validade_inicial);
    if (dtNext.getTime() > dtCurr.getTime()) return m;
    return lm;
  }, null as IMETARResponse['data']['data'][number] | null);

  return lastMetar ? new METARParser(lastMetar.mens).parse().toObject() : null;
};

export const fetchAerodromeMETAR = async (args: Parameters<typeof redeMetUrl.metar>[number]) => {
  const { data } = await new Api(redeMetUrl.metar(args))
    .get<IMETARResponse>();
  const lastMetar = (data?.data.data || []).reduce((lm, m) => {
    const dtNext = new Date(m.validade_inicial);
    if (Number.isNaN(dtNext.getTime())) return lm;
    if (!lm) return m;
    const dtCurr = new Date(lm.validade_inicial);
    if (dtNext.getTime() > dtCurr.getTime()) return m;
    return lm;
  }, null as IMETARResponse['data']['data'][number] | null);

  return lastMetar?.mens || null;
};
