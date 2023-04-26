'use client';

import './styles/globals.css';
import RotaerIcon from '@icons/rotaer_icon.svg';
import Link from 'next/link';
import ClientLayout from '../utils/ClientLayout/ClientLayout';
import Providers from './Providers';
import AssetSearch from '../components/AssetSearch/AssetSearch';
import classes from './layout.module.css';
import BreadCrumbs from '../components/BreadCrumbs/BreadCrumb';

/** */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div id="overlay-alert" className='alert-overlay'/>
        <div id="overlay-modal" />
        <div id="overlay-color-picker" />
        <div id="overlay-date-picker" />
        <div id="overlay-tooltip" />
        <Providers>
          <ClientLayout/>
          <BreadCrumbs/>
          <nav className={classes.Nav}>
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
            </div>
          </nav>
          <main>
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
