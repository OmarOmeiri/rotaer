import pt from 'date-fns/locale/pt-BR';
import dayjs from 'dayjs';
import { ErrorCodes } from 'lullo-common-types';
import React, {
  useEffect,
  useRef,
} from 'react';
import DtPicker from 'react-datepicker';
import { createPortal } from 'react-dom';
import Calendar from '@/components/Icons/Date/Calendar';
import errorHelper from '@/utils/Errors/errorHelper';
import classes from './DatePicker.module.css';

export type IDatePickerProps = {
  // id?: string,
  // style?: React.CSSProperties,
  // placeholder?: string,
  value?: string,
  // defaultValue?: string,
  name: string,
  // disabled?: boolean,
  // required: boolean,
  withPortal?: boolean,
  // dateFormat?: string,
  withIcon?: boolean,
  onChange?: React.ChangeEventHandler<HTMLInputElement>,
  // onBlur?: React.FocusEventHandler<HTMLInputElement>,
  // onFocus?: (e: React.FocusEvent<Element>) => void,
  // onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>,
}

const CalendarIcon = ({
  onClick,
}: {
  onClick?: React.MouseEventHandler
}) => (
  <Calendar
    onClick={onClick}
    button
    size={20}
  />
);

const DatePicker = ({
  value,
  name,
  withPortal,
  withIcon,
  onChange,
}: IDatePickerProps, ref: React.ForwardedRef<any>) => {
  const valueRef = useRef<Date | undefined | null>();
  const dummyInput = useRef<null | HTMLInputElement>(null);

  useEffect(() => {
    const input = document.createElement('input');
    input.name = name;
    if (value) {
      const dayJsDate = dayjs(value);
      if (dayJsDate.isValid()) {
        input.value = dayJsDate.format('YYYY-MM-DD');
      }
    }
    dummyInput.current = input;
  }, []);

  useEffect(() => {
    try {
      if (value) {
        const dayJsdate = dayjs(value);
        if (!dayJsdate.isValid()) {
          const err = {
            msg: 'Houve um erro ao computar esta data.',
            internalCode: ErrorCodes.stateError,
            trace: new Error(),
          };
          throw err;
        }
        valueRef.current = dayJsdate.toDate();
      } else {
        valueRef.current = undefined;
      }
    } catch (err) {
      errorHelper({
        message: err.msg,
        code: err.code,
        stack: err.stack,
        save: err.save,
      });
      valueRef.current = new Date();
    }
  }, [value]);

  const onDateChange = (date: Date | [Date | null, Date | null] | null, e: React.SyntheticEvent<any, Event>) => {
    if (e && dummyInput.current) {
      if (date && !Array.isArray(date)) {
        dummyInput.current.value = dayjs(date).format('YYYY-MM-DD');
        e.target = dummyInput.current;
        if (onChange) onChange(e as React.ChangeEvent<HTMLInputElement>);
      }
    }
  };

  return (
    <DtPicker
      selected={valueRef.current}
      ref={ref}
      onChange={onDateChange}
      dateFormat="dd/MM/yyyy"
      customInput={withIcon ? <CalendarIcon /> : undefined}
      popperContainer={withPortal ? ({ children }) => createPortal(children, document.getElementById('overlay-date-picker') as Element) : undefined}
      locale={pt}
      name="test"
      wrapperClassName={withIcon ? classes.CenterIcon : ''}
    />
  );
};

export default React.forwardRef(DatePicker);
