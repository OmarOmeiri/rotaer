import LogoAbductedIcon from '@icons/logo-abducted.svg';
import classes from './LogoAbducted.module.css';
import Translator from '../../../utils/Translate/Translator';

const defaultMessageTranslator = new Translator({
  msg: { 'pt-BR': 'Não há nada aqui...', 'en-US': 'Nothing to see here...' },
});

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
        <LogoAbductedIcon opacity="0.7" fill="white"/>
      </div>
      <div>
        {message || defaultMessageTranslator.translate('msg')}
      </div>
    </div>
  </div>
);

export default LogoAbducted;
