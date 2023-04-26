import LogoAbductedIcon from '@icons/logo-abducted.svg';
import classes from './LogoAbducted.module.css';

const LogoAbducted = ({
  message,
  animate,
}: {
  message?: string,
  animate?: boolean
}) => (
  <div className={classes.Wrapper}>
    <div className={classes.InnerWrapper}>
      <div className={`${classes.IconWrapper} ${animate ? classes.Animate : ''}`}>
        <LogoAbductedIcon/>
      </div>
      <div>
        {message || 'Não tem nada aqui...'}
      </div>
    </div>
  </div>
);

export default LogoAbducted;
