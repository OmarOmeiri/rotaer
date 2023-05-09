import MenuIcon from '@icons/ellipsis-vertical.svg';
import LogInIcon from '@icons/log-in.svg';
import PlaneIcon from '@icons/plane-solid.svg';
import Link from 'next/link';
import { APP_ROUTES } from '../../consts/routes';
import { TooltipClick } from '../Tooltips/TooltipClick';
import classes from './MainMenu.module.css';
import authStore from '../../store/auth/authStore';
import Translator from '../../utils/Translate/Translator';

const translator = new Translator({
  myAcft: { 'pt-BR': 'Minhas aeronaves', 'en-US': 'My aircraft' },
});

const MenuBtn = ({
  icon,
  children,
}: {icon: JSX.Element, children: React.ReactNode}) => (
  <button className={classes.MenuBtn}>
    <div className={classes.BtnIconContainer}>
      {icon}
    </div>
    <div className={classes.BtnTextContainer}>
      {children}
    </div>
  </button>
);

const MenuLink = ({
  icon,
  href,
  children,
}: {icon: JSX.Element, children: React.ReactNode, href: string}) => (
  <Link className={classes.MenuBtn} href={href}>
    <div className={classes.BtnIconContainer}>
      {icon}
    </div>
    <div className={classes.BtnTextContainer}>
      {children}
    </div>
  </Link>
);

const Menu = ({ lang }: {lang: Langs}) => {
  const isAuthenticated = false;// authStore((state) => state.isAuthenticated);
  return (
    <div className={classes.Container}>
      <MenuBtn icon={<LogInIcon/>}>
        Log in
      </MenuBtn>
      <MenuLink icon={<PlaneIcon/>} href={APP_ROUTES.myAircraft(lang)}>
        {translator.capitalize().translate('myAcft')}
      </MenuLink>
    </div>
  );
};

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
