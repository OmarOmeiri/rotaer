import React, { useCallback } from 'react';
import CardWithTitle from '../../../../../components/Card/CardWithTitle';
import Input, { IInput } from '../../../../../components/Forms/Input';
import Translator from '../../../../../utils/Translate/Translator';
import classes from '../../styles/NewFlightPlanInfo.module.css';

const translator = new Translator({
  info: { 'pt-BR': 'Informação de voo', 'en-US': 'Flight Info' },
});

const NewFlightPlanInfo = ({
  forms,
  onFormChange,
  onAerodromeBlur,
}: {
  forms: IInput[],
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
    </CardWithTitle>
  );
};

export default NewFlightPlanInfo;
