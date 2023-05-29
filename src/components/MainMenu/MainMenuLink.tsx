import Link from 'next/link';
import classes from './MainMenu.module.css';

const MainMenuLink = ({
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

export default MainMenuLink;
