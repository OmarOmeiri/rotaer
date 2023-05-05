import '../styles/globals.css';
import { Analytics } from '@vercel/analytics/react';
import RotaerIcon from '@icons/rotaer_icon.svg';
import Link from 'next/link';
import ClientLayout from '../../utils/ClientLayout/ClientLayout';
import Providers from '../Providers';
import AssetSearch from '../../components/AssetSearch/AssetSearch';
import classes from './layout.module.css';
import Config from '../../config';
import langStore from '../../store/lang/langStore';
import LangStoreInitializer from '../../store/LangStoreInitializer';
import { LanguageDropDown } from '../../components/Language/LanguageDropDown';

const navBarHeight = Config.get('styles').navBar.height;

type Props = {
  children: React.ReactNode;
  params: {
    lang: Langs
  }
};

/** */
export default function RootLayout({
  children,
  params: { lang },
}: Props) {
  langStore.setState({ lang });

  return (
    <html lang={lang}>
      <title>ROTAER</title>
      <body>
        <div id="overlay-alert" className='alert-overlay'/>
        <div id="overlay-modal" />
        <div id="overlay-color-picker" />
        <div id="overlay-date-picker" />
        <div id="overlay-tooltip" />
        <LangStoreInitializer lang={lang} />
        <Providers>
          <ClientLayout/>
          <nav className={classes.Nav} style={{ height: `${navBarHeight}px` }}>
            <div className={classes.NavRight}>
              <div className={classes.NavRightIcon}>
                <Link href="/">
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
            </div>
          </nav>
          <main>
            {children}
          </main>
        </Providers>
      </body>
      <Analytics/>
    </html>
  );
}
