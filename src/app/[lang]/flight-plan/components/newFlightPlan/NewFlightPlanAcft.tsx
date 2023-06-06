import type { SxProps } from '@mui/material';
import { CSSTransition } from 'react-transition-group';
import { useCallback, useRef } from 'react';
import CardWithTitle from '../../../../../components/Card/CardWithTitle';
import DropDown, { DropDownItem } from '../../../../../components/Dropdown/DropDown';
import Input, { IInput } from '../../../../../components/Forms/Input';
import Translator from '../../../../../utils/Translate/Translator';
import classes from '../../styles/NewFlightPlanInfo.module.css';
import ButtonClient from '../../../../../components/Buttons/ButtonClient';

const translator = new Translator({
  acft: { 'pt-BR': 'Aeronave', 'en-US': 'Aircraft' },
  regNo: { 'pt-BR': 'Matrícula', 'en-US': 'Registration' },
  save: { 'pt-BR': 'Salvar', 'en-US': 'Save' },
});

const dropDownStyles: SxProps = {
  minWidth: '130px',
  '& .MuiInputBase-root': {
    height: '35px',
  },
  '& .MuiFormLabel-root': {
    lineHeight: '1.1em',
  },
};

const NewFlightPlanAcft = ({
  forms,
  isChanged,
  acftDropDown,
  onAcftSave,
  onAcftChange,
  onFormChange,
}: {
  forms: IInput[],
  acftDropDown: DropDownItem[],
  isChanged: boolean,
  onAcftChange: (id: string) => void,
  onAcftSave: () => void,
  onFormChange: React.ChangeEventHandler
}) => {
  const buttonRef = useRef<HTMLDivElement | null>(null);
  return (
    <CardWithTitle title={translator.translate('acft')} styled>
      <div className={classes.Wrapper}>
        <DropDown
          label={translator.translate('regNo')}
          items={acftDropDown}
          wrapperClassName={classes.DropdownWrapper}
          formStyles={dropDownStyles}
          formClassName={classes.DropDown}
          onChange={onAcftChange}
        />
        {
          forms.map((f) => (
            <Input
              key={f.id}
              {...f}
              inputClassName={`${f.inputClassName} ${classes.FPlanInput}`}
              wrapperClassName={`${f.wrapperClassName} ${classes.FPlanInputWrapper}`}
              onChange={onFormChange}
              styleType='transparent'
            />
          ))
        }
      </div>
      <CSSTransition
        in={isChanged}
        timeout={300}
        nodeRef={buttonRef}
        classNames={{
          enter: classes.BtnEnter,
          enterActive: classes.BtnEnterActive,
          exit: classes.BtnExit,
          exitActive: classes.BtnExitActive,
        }}
        unmountOnExit
      >
        <div ref={buttonRef} className={classes.BtnWrapper}>
          <ButtonClient onClick={onAcftSave}>
            {translator.translate('save')}
          </ButtonClient>
        </div>
      </CSSTransition>
    </CardWithTitle>
  );
};

export default NewFlightPlanAcft;
