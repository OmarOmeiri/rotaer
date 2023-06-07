import '../styles/globals.css';
import { Analytics } from '@vercel/analytics/react';
import RotaerIcon from '@icons/rotaer_icon.svg';
import Link from 'next/link';
import { NextWebVitalsMetric } from 'next/app';
import type { Session } from 'next-auth';
import { Metadata } from 'next';
import ClientLayout from '../../utils/ClientLayout/ClientLayout';
import Providers from '../Providers';
import AssetSearch from '../../components/AssetSearch/AssetSearch';
import classes from './layout.module.css';
import Config from '../../config';
import langStore from '../../store/lang/langStore';
import LangStoreInitializer from '../../store/LangStoreInitializer';
import { LanguageDropDown } from '../../components/Language/LanguageDropDown';
import { APP_ROUTES } from '../../consts/routes';
import { MainMenu } from '../../components/MainMenu/MainMenu';
import { Alert } from '../../components/Alert/Alert';
import ModalHandler from '../../components/Modal/ModalHandler';
import GoogleAuth from '../../components/GoogleAuth/GoogleAuth';

const styles = Config.get('styles');

type Props = {
  children: React.ReactNode;
  params: {
    lang: Langs,
    session?: Session
  }
};

export const metadata: Metadata = {
  title: 'ROTAER',
  description: 'A tool for planning and viewing brazilian aviation data',
};

/** */
export function reportWebVitals(metric: NextWebVitalsMetric) {
  if (metric.label === 'custom' && process.env.NODE_ENV === 'development') {
    console.info(metric);
  }
}

/** */
export default function RootLayout({
  children,
  params: { lang, session },
}: Props) {
  langStore.setState({ lang });

  return (
    <html lang={lang}>
      <script src="https://accounts.google.com/gsi/client" async defer></script>
      <body>
        <div id="overlay-alert" className='alert-overlay'/>
        <div id="overlay-modal" />
        <div id="overlay-color-picker" />
        <div id="overlay-date-picker" />
        <div id="overlay-tooltip" />
        <LangStoreInitializer lang={lang} />
        <Alert/>
        <Providers session={session}>
          <GoogleAuth/>
          <ClientLayout/>
          <ModalHandler/>
          <nav className={classes.Nav} style={{ height: `${styles.navBar.height}px` }}>
            <div className={classes.NavRight}>
              <div className={classes.NavRightIcon}>
                <Link href={APP_ROUTES.home(lang)}>
                  <RotaerIcon width="40"/>
                </Link>
              </div>
            </div>
            <div className={classes.NavLeft}>
              <div className={classes.NavLeftAssetSearch}>
                <AssetSearch/>
              </div>
              <div className={classes.NavLeftLanguage}>
                <LanguageDropDown/>
              </div>
              <div className={classes.NavLeftMenu}>
                <MainMenu lang={lang}/>
              </div>
            </div>
          </nav>
          <main className={classes.Main}>
            {children}
          </main>
        </Providers>
      </body>
      <Analytics/>
    </html>
  );
}
