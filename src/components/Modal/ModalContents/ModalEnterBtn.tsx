import ButtonClient from '../../Buttons/ButtonClient';
import classes from './ModalEnterBtn.module.css';

const ModalEnterBtn = (props: Parameters<typeof ButtonClient>[number]) => (
  <ButtonClient className={classes.Btn} {...props}/>
);

export default ModalEnterBtn;
