import StyledTooltip from '../../../../../../components/Tooltips/StyledTooltip';
import TooltipHover from '../../../../../../components/Tooltips/TooltipHover';
import Translator from '../../../../../../utils/Translate/Translator';
import classes from './RouteWarning.module.css';

const translator = new Translator({
  title: { 'pt-BR': 'Aviso', 'en-US': 'Warning' },
});

const RouteWarningPopUp = ({ children }:{children: string}) => (
  <TooltipHover
    tooltip={(
      <StyledTooltip title={translator.translate('title')}>
        <div className={classes.Tooltip}>
          {children}
        </div>
      </StyledTooltip>
    )}
  >
    <div className={classes.WarningPin}/>
  </TooltipHover>
);

export default RouteWarningPopUp;
