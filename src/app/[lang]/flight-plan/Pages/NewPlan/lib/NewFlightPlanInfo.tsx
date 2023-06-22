import React, { useCallback } from 'react';
import CardWithTitle from '../../../../../../components/Card/CardWithTitle';
import Input, { IInput } from '../../../../../../components/Forms/Input';
import Translator from '../../../../../../utils/Translate/Translator';
import classes from './NewFlightPlanInfo.module.css';
import ButtonClient from '../../../../../../components/Buttons/ButtonClient';

const translator = new Translator({
  info: { 'pt-BR': 'Informação de voo', 'en-US': 'Flight Info' },
  save: { 'pt-BR': 'Salvar', 'en-US': 'Save' },
  clone: { 'pt-BR': 'Clonar', 'en-US': 'Clone' },
  edit: { 'pt-BR': 'Edit', 'en-US': 'Edit' },
  print: { 'pt-BR': 'Imprimir', 'en-US': 'Print' },
});

const GetButtons = ({
  isUserPlan,
  onSaveClick,
  onEditClick,
  onCloneClick,
  onPrintClick,
}:{
  isUserPlan: boolean
  onSaveClick: React.MouseEventHandler,
  onEditClick: React.MouseEventHandler,
  onCloneClick: React.MouseEventHandler,
  onPrintClick: React.MouseEventHandler
}) => {
  if (isUserPlan) {
    return (
      <>
        <ButtonClient onClick={onCloneClick}>
          {translator.translate('clone')}
        </ButtonClient>
        <ButtonClient onClick={onEditClick}>
          {translator.translate('edit')}
        </ButtonClient>
        <ButtonClient onClick={onPrintClick}>
          {translator.translate('print')}
        </ButtonClient>
      </>
    );
  }
  return (
    <ButtonClient onClick={onSaveClick}>
      {translator.translate('save')}
    </ButtonClient>
  );
};

const NewFlightPlanInfo = ({
  forms,
  canSave,
  isUserPlan,
  onSaveClick,
  onFormChange,
  onPrintClick,
  onAerodromeBlur,
}: {
  forms: IInput[],
  canSave: boolean,
  isUserPlan: boolean,
  onSaveClick: (action: 'clone' | 'save' | 'edit') => void
  onFormChange: React.ChangeEventHandler,
  onPrintClick: () => void,
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

  const _onSaveClick = useCallback(() => { onSaveClick('save'); }, [onSaveClick]);
  const onEditClick = useCallback(() => { onSaveClick('edit'); }, [onSaveClick]);
  const onCloneClick = useCallback(() => { onSaveClick('clone'); }, [onSaveClick]);

  return (
    <>
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
              <GetButtons
                isUserPlan={isUserPlan}
                onCloneClick={onCloneClick}
                onEditClick={onEditClick}
                onSaveClick={_onSaveClick}
                onPrintClick={onPrintClick}
              />
            </div>
          )
          : null
      }
      </CardWithTitle>

    </>
  );
};

export default NewFlightPlanInfo;
