import { useEffect, useState } from 'react';
import { useFlightPlansQuery } from '../../../../../../../frameworks/react-query/queries/flightPlan';
import type { NextAuthSession } from '../../../../../../../hooks/Auth/useAuth';
import type { TAerodromeData } from '../../../../../../../types/app/aerodrome';
import type { WithStrId } from '../../../../../../../types/app/mongo';
import type { FlightPlan } from '../../../../../../../types/app/fPlan';
import type { newFlightPlanInfoFormData } from '../forms';
import type alertStore from '../../../../../../../store/alert/alertStore';
import newFlightPlanTranslator from '../utils/newPlanTranslator';

const useNewPlanUserLoaded = ({
  id,
  session,
  setAlert,
  setArrival,
  setDeparture,
  setAlternate,
  setFlightInfoFormData,
}:{
  id: string | null,
  session: NextAuthSession
  setAlert: ReturnType<typeof alertStore['getState']>['setAlert'],
  setArrival: SetState<TAerodromeData | null>,
  setDeparture: SetState<TAerodromeData | null>,
  setAlternate: SetState<TAerodromeData | null>,
  setFlightInfoFormData: SetState<typeof newFlightPlanInfoFormData>
}) => {
  const userPlansQuery = useFlightPlansQuery(session.user);
  const [userLoadedPlan, setUserLoadedPlan] = useState<WithStrId<FlightPlan> | null>(null);
  useEffect(() => {
    if (id && userPlansQuery.data) {
      const userPlan = userPlansQuery.data.find((p) => p._id === id);
      if (userPlan) {
        setUserLoadedPlan(userPlan);
      } else {
        setUserLoadedPlan(null);
        setAlert({ msg: newFlightPlanTranslator.translate('userPlanNotFound'), type: 'error' });
      }
    } else {
      setUserLoadedPlan(null);
    }
  }, [
    id,
    userPlansQuery.data,
    setAlert,
  ]);

  useEffect(() => {
    if (userLoadedPlan) {
      setArrival(userLoadedPlan.arr);
      setDeparture(userLoadedPlan.dep);
      setAlternate(userLoadedPlan.alt || null);
      setFlightInfoFormData({
        name: userLoadedPlan.name,
        dep: userLoadedPlan.dep.icao,
        arr: userLoadedPlan.arr.icao,
        altrn: userLoadedPlan.alt?.icao || '',
      });
    } else {
      setArrival(null);
      setDeparture(null);
      setAlternate(null);
      setFlightInfoFormData({
        name: '',
        dep: '',
        arr: '',
        altrn: '',
      });
    }
  }, [
    userLoadedPlan,
    setArrival,
    setDeparture,
    setAlternate,
    setFlightInfoFormData,
  ]);

  return userLoadedPlan;
};

export default useNewPlanUserLoaded;
