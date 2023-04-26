import React from 'react';
import classes from './NumberInput.module.css';

interface INumberInputProps {
  value: number,
  onChange: (inc: number) => void
}

const NumberInput: React.FC<INumberInputProps> = ({
  value,
  onChange,
}) => (
  <div className={classes.Wrapper}>
    <button className={classes.Btn} onClick={() => onChange(-1)}>-</button>
    <div className={classes.ValueContainer}>{value}</div>
    <button className={classes.Btn} onClick={() => onChange(1)}>+</button>
  </div>
);

export default NumberInput;
