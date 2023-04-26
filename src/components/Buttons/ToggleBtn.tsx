import React from 'react';
import classes from './ToggleBtn.module.css';

interface IToggleBtnProps {
  id: string,
  onToggle: (id: string, value: boolean) => void,
  extraInputProps?: {[key: string]: string}
  checked?: boolean,
}

const ToggleBtn: React.FC<IToggleBtnProps> = ({
  id,
  onToggle,
  extraInputProps,
  checked = false,
}) => {
  const onChange = (e: React.ChangeEvent) => {
    const target = e.target as HTMLInputElement;
    onToggle(target.id, target.checked);
  };

  return (
    <div className={classes.Form}>
      <label className={classes.Toggle}>
        <div className={classes.ToggleWrapper}>
          <input id={id} type="checkbox" className={classes.Input} onChange={onChange} checked={checked} {...extraInputProps} />
          <div className={classes.ToggleBg}>
            <div className={classes.ToggleSphere}>
              <div className={classes.ToggleSphereBg} />
              <div className={classes.ToggleSphereOverlay} />
            </div>
          </div>
        </div>
      </label>
    </div>
  );
};

export default ToggleBtn;
