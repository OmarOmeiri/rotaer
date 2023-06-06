import React, { useCallback } from 'react';
import z from 'zod';
import Translator from '../../../../utils/Translate/Translator';
import GenericModal from '../GenericModal/GenericModal';
import classes from './AddWaypointModal.module.css';
import modalStore from '../../../../store/modal/modalStore';
import { IInput, inputTypes } from '../../../Forms/typings';
import Input from '../../../Forms/Input';
import Config from '../../../../config';
import { useForms } from '../../../../hooks/Forms/useForm';
import ModalEnterBtn from '../ModalEnterBtn';
import { zodCoordinateValidator } from '../../../../frameworks/zod/zodCoordinates';
import { zodAltitudeValidator } from '../../../../frameworks/zod/zodRoute';

const styles = Config.get('styles');

type ParsedData = {
  name: string;
  coords: {
      lat: number;
      lon: number;
  };
  altitude: number | null;
}

const translator = new Translator({
  title: { 'en-US': 'Add waypoint', 'pt-BR': 'Adicionar waypoint' },
  btn: { 'en-US': 'OK', 'pt-BR': 'Ok' },
  invalidName: { 'en-US': 'Invalid name', 'pt-BR': 'Nome inválido' },
  invalidCoord: { 'en-US': 'Invalid coordinates', 'pt-BR': 'Coordenadas inválidas' },
  name: { 'en-US': 'Name', 'pt-BR': 'Nome' },
  coords: { 'en-US': 'Coordinates', 'pt-BR': 'Coordenadas' },
  altitude: { 'en-US': 'Altitude', 'pt-BR': 'Altitude' },
});

const validators = {
  name: (value: string) => z.string({
    required_error: translator.translate('invalidName'),
    invalid_type_error: translator.translate('invalidName'),
  }).parse(value),
  coords: zodCoordinateValidator,
  altitude: (value: string) => (value === '' ? null : zodAltitudeValidator(value)),
};

const initFormData = {
  name: '',
  coords: '',
  altitude: '',
};

const initForms: IInput[] = [
  {
    id: 'route-name',
    type: inputTypes.text as const,
    name: 'name' as const,
    label: translator.translate('name'),
  },
  {
    id: 'route-coords',
    type: inputTypes.text as const,
    name: 'coords' as const,
    label: translator.translate('coords'),
  },
  {
    id: 'route-altitude',
    type: inputTypes.text as const,
    name: 'altitude' as const,
    label: translator.translate('altitude'),
  },
];

const labelStyle = {
  color: styles.colors.lightGrey,
  fontSize: '0.9rem',
  maxWidth: '265px',
};

const AddWaypointModal = ({ onSubmit }: { onSubmit: (data: ParsedData) => void}) => {
  const closeModal = modalStore((state) => state.closeModal);

  const {
    onChange,
    inputs,
    validate,
    isFormsValid,
  } = useForms({
    formData: initFormData,
    inputs: initForms,
    validation: validators,
  });

  const onEditClick = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = validate();
    if (isFormsValid()) {
      onSubmit(parsed);
      closeModal();
    }
  }, [onSubmit, closeModal, isFormsValid, validate]);

  return (
    <GenericModal title={translator.translate('title')}>
      <div className={classes.Wrapper}>
        <form className={classes.Form}>
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
          <ModalEnterBtn onClick={onEditClick}>
            {translator.translate('btn')}
          </ModalEnterBtn>
        </div>
      </div>
    </GenericModal>
  );
};

export default AddWaypointModal;
