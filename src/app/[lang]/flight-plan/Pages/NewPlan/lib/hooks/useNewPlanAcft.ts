import { useCallback, useMemo, useState } from 'react';
import type { NextAuthSession } from '../../../../../../../hooks/Auth/useAuth';
import type { ParsedForms } from '../../../../../../../hooks/Forms/useForm';
import type alertStore from '../../../../../../../store/alert/alertStore';
import type { WithStrId } from '../../../../../../../types/app/mongo';
import type { newFlightPlanAcftFormData } from '../forms';
import type { newFlightPlanAcftValidator } from '../validation';
import { useAcftQuery } from '../../../../../../../frameworks/react-query/queries/acft';
import { formatAcftRegistration } from '../../../../../../../utils/Acft/acft';
import { editUserAircraft } from '../../../../../../../Http/requests/acft';
import newFlightPlanTranslator from '../utils/newPlanTranslator';

const hasUserChangedAcftData = (
  originalAcft: WithStrId<IUserAcft>,
  formData: {
    ias: number | undefined;
    climbFuelFlow: number | undefined;
    descentFuelFlow: number | undefined;
    cruiseFuelFlow: number | undefined;
    climbRate: number | undefined;
    descentRate: number | undefined;
    usableFuel: number | undefined;
},
) => (
  Object.entries(formData).some(([k, v]) => v !== originalAcft[k as keyof typeof originalAcft])
);

const useNewPlanAcft = ({
  session,
  setAcftFormData,
  setAlert,
  validateAcftData,
  isAcftValid,
  parseAcftData,
}:{
  session: NextAuthSession
  setAcftFormData: (fn: () => WithStrId<IUserAcft>) => void
  setAlert: ReturnType<typeof alertStore['getState']>['setAlert'],
  validateAcftData: (key?: keyof typeof newFlightPlanAcftFormData) => ParsedForms<typeof newFlightPlanAcftFormData, typeof newFlightPlanAcftValidator>
  isAcftValid: () => boolean,
  parseAcftData: () => ParsedForms<typeof newFlightPlanAcftFormData, typeof newFlightPlanAcftValidator>
}) => {
  const [selectedAcft, setSelectedAcft] = useState<WithStrId<IUserAcft> | null>(null);
  const acftQuery = useAcftQuery(session);
  const acftDropDownItems = useMemo(() => (
    (acftQuery.data || []).map((a) => ({
      value: formatAcftRegistration(a.registration),
      id: a._id,
    }))
  ), [acftQuery.data]);

  const onAcftChange = useCallback((id: string) => {
    const selectedAcft = (acftQuery.data || [])
      .find((a) => a._id === id);
    if (!selectedAcft) return;
    setAcftFormData(() => selectedAcft);
    setSelectedAcft(selectedAcft);
  }, [acftQuery.data, setAcftFormData]);

  const onAcftSave = useCallback(async () => {
    const parsed = validateAcftData();
    if (isAcftValid() && selectedAcft) {
      try {
        await editUserAircraft({
          ...selectedAcft,
          ...parsed,
        }, {
          onError: () => newFlightPlanTranslator.translate('acftSaveFail'),
          onSuccess: () => setAlert({ msg: newFlightPlanTranslator.translate('acftSave'), type: 'success' }),
        });
        acftQuery.invalidate();
      } catch {
        setAlert({ msg: newFlightPlanTranslator.translate('acftSaveFail'), type: 'error' });
      }
    } else {
      setAlert({ msg: newFlightPlanTranslator.translate('invalidAcft'), type: 'error' });
    }
  }, [isAcftValid, selectedAcft, setAlert, validateAcftData, acftQuery]);

  const parsedAcftData = useMemo(() => (
    parseAcftData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  ), [selectedAcft, parseAcftData]);

  const changedAcft = useMemo(() => {
    if (!parsedAcftData || !selectedAcft) return false;
    return hasUserChangedAcftData(selectedAcft, parsedAcftData);
  }, [parsedAcftData, selectedAcft]);

  return {
    acftDropDownItems,
    onAcftChange,
    onAcftSave,
    parsedAcftData,
    changedAcft,
    selectedAcft,
  };
};

export default useNewPlanAcft;
