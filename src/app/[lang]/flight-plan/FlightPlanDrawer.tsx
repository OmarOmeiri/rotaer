'use client';

import React, { useCallback, useState } from 'react';
import ClickHandle from '../../../components/Handle/ClickHandle';
import FullDrawer from '../../../components/Drawer/FullDrawer';
import classes from './FlightPlanDrawer.module.css';
import Translator from '../../../utils/Translate/Translator';
import Config from '../../../config';

const translator = new Translator({
  openDrawerBtn: { 'pt-BR': 'Abrir opções', 'en-US': 'Open flight plan options drawer' },
});

const appStyles = Config.get('styles');

const FlightPlanDrawer = ({
  contents,
  page,
  onPageChange,
}: {
  contents: {id: string, label: string, icon: JSX.Element}[]
  page: string,
  onPageChange: (page: string) => void
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleOpen = useCallback(() => {
    setIsOpen((open) => !open);
  }, []);
  return (
    <>
      <FullDrawer open={isOpen} setOpen={setIsOpen}>
        <div className={classes.DrawerItemsWrapper}>
          {contents.map((d) => (
            <button key={d.label} className={`${classes.DrawerItemWrapper} ${d.id === page ? classes.Selected : ''}`} onClick={() => onPageChange(d.id)}>
              <div className={classes.DrawerItemIcon}>{d.icon}</div>
              <div className={classes.DrawerItemLabel}>{d.label}</div>
            </button>
          ))}
        </div>
      </FullDrawer>
      <div className={classes.DrawerBtn}>
        <ClickHandle
          isOpen={isOpen}
          width='15'
          type="left"
          onClick={toggleOpen}
          name={translator.translate('openDrawerBtn')}
          bgColor={appStyles.colors.darklight}
          chevronColor={appStyles.colors.white}
        />
      </div>
    </>
  );
};

export default FlightPlanDrawer;
