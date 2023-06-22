import { useCallback } from 'react';
import { useForms } from '../../../../../../../hooks/Forms/useForm';
import { TAerodromeData } from '../../../../../../../types/app/aerodrome';
import {
  newFlightPlanAcftFormData, newFlightPlanAcftForms, newFlightPlanInfoFormData, newFlightPlanInfoForms,
} from '../forms';
import { flightPlanInfoValidators, newFlightPlanAcftValidator } from '../validation';
import { fetchAerodromeInfo } from '../../../../../../../Http/requests/aerodrome';
import newFlightPlanTranslator from '../utils/newPlanTranslator';

const useNewPlanForms = ({
  setArrival,
  setDeparture,
  setAlternate,
}:{
  setArrival: SetState<TAerodromeData | null>,
  setDeparture: SetState<TAerodromeData | null>,
  setAlternate: SetState<TAerodromeData | null>,
}) => {
  const {
    inputs: flightInfoInputs,
    formData: flightInfoFData,
    setFormData: setFlightInfoFormData,
    onChange: onNewFlightInfoChange,
    setInputs: setNewFlightPlanInfoInputs,
    isFormsValid: isFlightInfoValid,
    validate: validateFlightInfo,
  } = useForms({
    formData: newFlightPlanInfoFormData,
    inputs: newFlightPlanInfoForms,
    validation: flightPlanInfoValidators,
  });

  const {
    inputs: flightPlanAcftInputs,
    manualFormDataChange: setAcftFormData,
    onChange: onFlightPlanAcftChange,
    parse: parseAcftData,
    validate: validateAcftData,
    isFormsValid: isAcftValid,
  } = useForms({
    formData: newFlightPlanAcftFormData,
    inputs: newFlightPlanAcftForms,
    validation: newFlightPlanAcftValidator,
    validateOnBlur: true,
  });

  const setFlightInfoValidation = useCallback((id: string, valid: boolean | null, message: string | null) => {
    setNewFlightPlanInfoInputs((state) => state.map(((i) => {
      if (i.id === id) {
        return {
          ...i,
          valid,
          validationMsg: message,
        };
      }
      return i;
    })));
  }, [setNewFlightPlanInfoInputs]);

  const setAerodrome = useCallback((type: keyof typeof flightInfoFData, ad: TAerodromeData | null) => {
    if (type === 'arr') setArrival(ad);
    if (type === 'dep') setDeparture(ad);
    if (type === 'altrn') setAlternate(ad);
  }, [
    setArrival,
    setDeparture,
    setAlternate,
  ]);

  const onDepArrInputBlur = useCallback(async (e: React.FocusEvent) => {
    const { id } = e.target;
    const type = id.split('-')[1] as keyof typeof flightInfoFData;
    const map: {[k: string]: string} = {
      'fplan-dep': flightInfoFData.dep,
      'fplan-arr': flightInfoFData.arr,
      'fplan-altrn': flightInfoFData.altrn,
    };
    const icao = map[id].toUpperCase();
    validateFlightInfo(type);

    if (isFlightInfoValid(type) && icao) {
      const ad = await fetchAerodromeInfo({ id: icao });
      setAerodrome(type, ad || null);
      if (ad) {
        setFlightInfoValidation(id, true, null);
      } else {
        setFlightInfoValidation(id, false, newFlightPlanTranslator.translate('adNotFound'));
      }
    } else if (!icao) {
      setAerodrome(type, null);
      setFlightInfoValidation(id, true, null);
    }
  }, [
    flightInfoFData,
    isFlightInfoValid,
    setFlightInfoValidation,
    setAerodrome,
    validateFlightInfo,
  ]);

  return {
    flightInfoInputs,
    flightInfoFData,
    setFlightInfoFormData,
    onNewFlightInfoChange,
    onDepArrInputBlur,
    flightPlanAcftInputs,
    setAcftFormData,
    onFlightPlanAcftChange,
    parseAcftData,
    validateAcftData,
    isAcftValid,
  };
};

export default useNewPlanForms;
