import React, { useCallback } from 'react';
import CardWithTitle from '../../../../../../components/Card/CardWithTitle';
import Input, { IInput } from '../../../../../../components/Forms/Input';
import Translator from '../../../../../../utils/Translate/Translator';
import classes from './NewFlightPlanInfo.module.css';
import ButtonClient from '../../../../../../components/Buttons/ButtonClient';

const translator = new Translator({
  info: { 'pt-BR': 'Informação de voo', 'en-US': 'Flight Info' },
  save: { 'pt-BR': 'Salvar', 'en-US': 'Save' },
});

const NewFlightPlanInfo = ({
  forms,
  canSave,
  onSaveClick,
  onFormChange,
  onAerodromeBlur,
}: {
  forms: IInput[],
  canSave: boolean,
  onSaveClick: () => void
  onFormChange: React.ChangeEventHandler,
  onAerodromeBlur: React.FocusEventHandler
}) => {
  const onAdBlur = useCallback((e: React.FocusEvent) => {
    const { target } = e;
    if (
      target.id === 'fplan-dep'
      || target.id === 'fplan-arr'
      || target.id === 'fplan-altrn'
    ) onAerodromeBlur(e);
  }, [onAerodromeBlur]);
  return (
    <CardWithTitle title={translator.translate('info')} styled>
      <div className={classes.Wrapper}>
        {
          forms.map((f) => (
            <Input
              key={f.id}
              {...f}
              inputClassName={`${f.inputClassName} ${classes.FPlanInput}`}
              wrapperClassName={`${f.wrapperClassName} ${classes.FPlanInputWrapper}`}
              onChange={onFormChange}
              onBlur={onAdBlur}
              styleType='transparent'
            />
          ))
        }
      </div>
      {
        canSave
          ? (
            <div className={classes.SaveBtnWrapper}>
              <ButtonClient onClick={onSaveClick}>
                {translator.translate('save')}
              </ButtonClient>
            </div>
          )
          : null
      }
    </CardWithTitle>
  );
};

export default NewFlightPlanInfo;
