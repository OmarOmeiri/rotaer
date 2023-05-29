import React, { useCallback, useMemo, useState } from 'react';
import z from 'zod';
import Translator from '../../../../utils/Translate/Translator';
import GenericModal from '../GenericModal/GenericModal';
import classes from './AcftModal.module.css';
import modalStore from '../../../../store/modal/modalStore';
import { IInput, inputTypes } from '../../../Forms/typings';
import Input from '../../../Forms/Input';
import { WithStrId } from '../../../../types/app/mongo';
import Config from '../../../../config';
import { editUserAircraft } from '../../../../Http/requests/acft';
import { useForms } from '../../../../hooks/Forms/useForm';
import ModalEnterBtn from '../ModalEnterBtn';

const styles = Config.get('styles');

const translator = new Translator({
  title: { 'en-US': 'Edit aircraft', 'pt-BR': 'Editar aeronave' },
  btn: { 'en-US': 'Edit', 'pt-BR': 'Editar' },
  ias: { 'en-US': 'Cruise IAS (kt)', 'pt-BR': 'VI de cruzeiro (kt)' },
  climb: { 'en-US': 'Climb rate (ft/min)', 'pt-BR': 'Razão de subida (ft/min)' },
  descent: { 'en-US': 'Descent rate (ft/min)', 'pt-BR': 'Razão de descida (ft/min)' },
  fuel: { 'en-US': 'Usable fuel (L)', 'pt-BR': 'Combustível utilizável (L)' },
  climbFuelFlow: { 'en-US': 'Climb fuel flow (L/h)', 'pt-BR': 'Consumo de subida (L/h)' },
  cruiseFuelFlow: { 'en-US': 'Cruise fuel flow (L/h)', 'pt-BR': 'Consumo de cruzeiro (L/h)' },
  descentFuelFlow: { 'en-US': 'Descent fuel flow (L/h)', 'pt-BR': 'Consumo de descida (L/h)' },
  fuelFlowInvalid: { 'en-US': 'Invalid fuel flow.', 'pt-BR': 'Consumo inválido.' },
  iasInvalid: { 'en-US': 'Invalid IAS', 'pt-BR': 'VI inválida' },
  climbInvalid: { 'en-US': 'Invalid climb rate', 'pt-BR': 'Razão de subida inválida' },
  fuelInvalid: { 'en-US': 'Invalid usable fuel', 'pt-BR': 'Combustível utilizável inválido' },
});

const fuelFlowValidator = (value: string) => {
  const num = Number(String(value).trim());
  return z.number({
    invalid_type_error: translator.translate('fuelFlowInvalid'),
  })
    .min(1, translator.translate('fuelFlowInvalid'))
    .max(15000, translator.translate('fuelFlowInvalid'))
    .optional()
    .parse(num || undefined);
};

const validators = {
  ias: (value: string) => {
    const num = Number(String(value).trim());
    return z.number({
      invalid_type_error: translator.translate('iasInvalid'),
    })
      .min(30, translator.translate('iasInvalid'))
      .max(1500, translator.translate('iasInvalid'))
      .optional()
      .parse(num || undefined);
  },
  climbRate: (value: string) => {
    const num = Number(String(value).trim());
    return z.number({
      invalid_type_error: translator.translate('climbInvalid'),
    })
      .min(30, translator.translate('climbInvalid'))
      .max(5000, translator.translate('climbInvalid'))
      .optional()
      .parse(num || undefined);
  },
  descentRate: (value: string) => {
    const num = Number(String(value).trim());
    return z.number({
      invalid_type_error: translator.translate('climbInvalid'),
    })
      .min(30, translator.translate('climbInvalid'))
      .max(5000, translator.translate('climbInvalid'))
      .optional()
      .parse(num || undefined);
  },
  usableFuel: (value: string) => {
    const num = Number(String(value).trim());
    return z.number({
      invalid_type_error: translator.translate('fuelInvalid'),
    })
      .min(5, translator.translate('fuelInvalid'))
      .optional()
      .parse(num || undefined);
  },
  climbFuelFlow: fuelFlowValidator,
  cruiseFuelFlow: fuelFlowValidator,
  descentFuelFlow: fuelFlowValidator,
};

const initFormData = (acft: WithStrId<IUserAcft>) => ({
  ias: acft.ias ? String(acft.ias) : '',
  climbRate: acft.climbRate ? String(acft.climbRate) : '',
  descentRate: acft.descentRate ? String(acft.descentRate) : '',
  usableFuel: acft.usableFuel ? String(acft.usableFuel) : '',
  climbFuelFlow: acft.climbFuelFlow ? String(acft.climbFuelFlow) : '',
  cruiseFuelFlow: acft.cruiseFuelFlow ? String(acft.cruiseFuelFlow) : '',
  descentFuelFlow: acft.descentFuelFlow ? String(acft.descentFuelFlow) : '',
});

const initForms: IInput[] = [
  {
    id: 'acft-ias',
    type: inputTypes.text as const,
    name: 'ias' as const,
    label: translator.translate('ias'),
  },
  {
    id: 'acft-climbrate',
    type: inputTypes.text as const,
    name: 'climbRate' as const,
    label: translator.translate('climb'),
  },
  {
    id: 'acft-descentrate',
    type: inputTypes.text as const,
    name: 'descentRate' as const,
    label: translator.translate('descent'),
  },
  {
    id: 'acft-fuel',
    type: inputTypes.text as const,
    name: 'usableFuel' as const,
    label: translator.translate('fuel'),
  },
  {
    id: 'acft-climb-fuel',
    type: inputTypes.text as const,
    name: 'climbFuelFlow' as const,
    label: translator.translate('climbFuelFlow'),
  },
  {
    id: 'acft-cruise-fuel',
    type: inputTypes.text as const,
    name: 'cruiseFuelFlow' as const,
    label: translator.translate('cruiseFuelFlow'),
  },
  {
    id: 'acft-descent-fuel',
    type: inputTypes.text as const,
    name: 'descentFuelFlow' as const,
    label: translator.translate('descentFuelFlow'),
  },
];

const labelStyle = {
  color: styles.colors.lightGrey,
  fontSize: '0.9rem',
  maxWidth: '265px',
};

const EditAcftModal = ({ acft, onEdit }: {acft: WithStrId<IUserAcft>, onEdit: () => void}) => {
  const [loading, setLoading] = useState(false);
  const closeModal = modalStore((state) => state.closeModal);

  const initializedForm = useMemo(() => initFormData(acft), [acft]);
  const {
    onChange,
    inputs,
    validate,
    isFormsValid,
  } = useForms({
    formData: initializedForm,
    inputs: initForms,
    validation: validators,
  });

  const onEditClick = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    const parsed = validate();
    if (isFormsValid()) {
      setLoading(true);
      try {
        await editUserAircraft({
          ...acft,
          ...parsed,
        });
      } finally {
        onEdit();
        setLoading(false);
        closeModal();
      }
    }
  }, [acft, closeModal, isFormsValid, loading, validate, onEdit]);

  return (
    <GenericModal title={translator.translate('title')}>
      <div className={classes.Wrapper}>
        <form className={classes.EditForm}>
          {
            inputs.map((f) => (
              <Input
                key={f.name}
                {...f}
                onChange={onChange}
                styleType='transparent'
                labelStyle={labelStyle}
                wrapperClassName={classes.InputWrapper}
              />
            ))
          }
        </form>
        <div className={classes.ButtonWrapper}>
          <ModalEnterBtn onClick={onEditClick} loading={loading}>
            {translator.translate('btn')}
          </ModalEnterBtn>
        </div>
      </div>
    </GenericModal>
  );
};

export default EditAcftModal;
