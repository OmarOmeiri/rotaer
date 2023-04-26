'use client';

import React from 'react';
import {
  CSSTransition,
  SwitchTransition,
} from 'react-transition-group';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import MuiTabs from '@mui/material/Tabs';
import Config from '../../config';
import { useRouteChange } from '../../hooks/React/useRouteChange';
import classes from './Tabs.module.css';

interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: number;
  value: number;
}

export type TabProps = {
  label: string;
  'data-label'?: undefined
} | {
  label?: undefined;
  'data-label': string
}

const { colors } = Config.get('styles');

const TabPanel = ({
  children,
  value,
  index,
  ...other
}: TabPanelProps) => (
  <div
    role="tabpanel"
    id={`full-width-tabpanel-${index}`}
    aria-labelledby={`full-width-tab-${index}`}
    {...other}
  >
    {children}
  </div>
);

const a11yProps = (index: number) => ({
  id: `full-width-tab-${index}`,
  'aria-controls': `full-width-tabpanel-${index}`,
});

type Props = {
  centered?: boolean
  children: React.ReactElement<TabProps>[],
  TabRightComponent?: React.ElementType
  className?: string
}

const Tabs = ({
  centered,
  children,
  TabRightComponent,
  className,
}: Props) => {
  const [index, setIndex] = React.useState(0);
  const nodeRef = React.useRef<HTMLDivElement | null>(null);
  const onRouteChangeStart = React.useCallback(() => {
    setIndex(0);
  }, []);

  useRouteChange(onRouteChangeStart);

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setIndex(newValue);
  };

  return (
    <>
      <Box sx={{
        width: '100%',
        bgcolor: colors.darklight,
        display: 'flex',
        flexWrap: 'wrap-reverse',
      }} className={className}>
        <MuiTabs
          value={index}
          onChange={handleChange}
          variant='scrollable'
          centered={centered}
          scrollButtons
          allowScrollButtonsMobile
          sx={{
            '& .MuiTabs-indicator': {
              backgroundColor: colors.green,
            },
            '& .MuiButtonBase-root': {
              color: colors.white,
            },
            '& .MuiButtonBase-root.Mui-selected': {
              color: colors.green,
            },
          }}
        >
          {/* <div>HEY</div> */}
          {
            React.Children.map(children, (child, i) => {
              if (React.isValidElement(child)) {
                return (
                  <Tab key={child.props['data-label'] || child.props.label} label={child.props['data-label'] || child.props.label} {...a11yProps(i)}/>
                );
              }
              return null;
            })
          }
        </MuiTabs>
        {
          TabRightComponent
            ? (
              <div className={classes.TabRightComponent}>
                <TabRightComponent/>
              </div>
            ) : null
        }
      </Box>
      <div>
        <SwitchTransition>
          <CSSTransition
            key={index}
            timeout={100}
            nodeRef={nodeRef}
            classNames={{
              enter: classes.fadeEnter,
              exit: classes.fadeExit,
              enterActive: classes.fadeEnterActive,
              exitActive: classes.fadeExitActive,
            }}
          >
            <div ref={nodeRef}>
              <TabPanel value={index} index={index} dir='ltr'>
                {
                  children[index]
                }
              </TabPanel>
            </div>
          </CSSTransition>
        </SwitchTransition>
      </div>
    </>
  );
};

export default Tabs;
