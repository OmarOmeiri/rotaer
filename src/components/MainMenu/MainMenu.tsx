import MenuIcon from '@icons/ellipsis-vertical.svg';
import PlaneIcon from '@icons/plane-solid.svg';
import { APP_ROUTES } from '../../consts/routes';
import TooltipClick from '../Tooltips/TooltipClick';
import classes from './MainMenu.module.css';
import Translator from '../../utils/Translate/Translator';
import MainMenuLink from './MainMenuLink';
import MainMenuLogIn from './MenuLogIn';

const translator = new Translator({
  myAcft: { 'pt-BR': 'Minhas aeronaves', 'en-US': 'My aircraft' },
  flightPlans: { 'pt-BR': 'Plano de vôo', 'en-US': 'Flight plan' },
});

const Menu = ({ lang }: {lang: Langs}) => (
  <div className={classes.Container}>
    <MainMenuLogIn/>
    <MainMenuLink icon={<PlaneIcon/>} href={APP_ROUTES.myAircraft(lang)}>
      {translator.capitalize().translate('myAcft')}
    </MainMenuLink>
    <MainMenuLink icon={<PlaneIcon/>} href={APP_ROUTES.flightPlan(lang)}>
      {translator.capitalize().translate('flightPlans')}
    </MainMenuLink>
  </div>
);

export const MainMenu = ({ lang }: {lang: Langs}) => {
  Translator.setLang(lang);
  return (
    <TooltipClick
      tooltip={<Menu lang={lang}/>}
      placement='bottom'
    >
      <div className={classes.ToggleMenuBtn}>
        <MenuIcon width="5"/>
      </div>
    </TooltipClick>
  );
};
