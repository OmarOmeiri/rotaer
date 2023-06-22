import React, {
  forwardRef,
  useCallback, useEffect, useImperativeHandle, useRef, useState,
} from 'react';
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  usePDF,
} from '@react-pdf/renderer';
import type { Style } from '@react-pdf/types/style';
import alertStore from '../../../../../../store/alert/alertStore';
import { TAerodromeData } from '../../../../../../types/app/aerodrome';
import { WithStrId } from '../../../../../../types/app/mongo';
import { formatAcftRegistration } from '../../../../../../utils/Acft/acft';
import type { Route } from '../../../../../../utils/Route/Route';

type PrinterProps = {
  print?: () => void
} & DocProps

type DocProps = {
  title: string,
  dep: TAerodromeData,
  arr: TAerodromeData,
  alt: TAerodromeData | null,
  selectedAcft: WithStrId<IUserAcft> | null
  route: Route
}

const DOCUMENT_PROPS = {
  author: 'ROTAER',
};

// Create styles
const styles = StyleSheet.create({
  document: {
    fontSize: '10',
  },
  page: {
    padding: '30 50 30 50',
  },
  sectionTitle: {
    margin: 10,
    padding: 10,
    fontSize: 18,
  },
  flightInfo: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const cardStyles = StyleSheet.create({
  cardWrapper: {
    border: '1px solid grey',
    position: 'relative',
    padding: '6px 8px 2px 8px',
    borderRadius: '5px',
  },
  flexWrapper: {
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
  },
  title: {
    position: 'absolute',
    color: '#949494',
    top: -7,
    left: '5px',
    backgroundColor: 'white',
    padding: '0 2px',
    fontSize: '10',
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
  },
  cardItem: {
    display: 'flex',
    flexDirection: 'row',
  },
  cardName: {
    color: '#949494',
  },
});

const PDFCard = ({
  children,
  title,
  flexWrapperStyle,
  cardWrapperStyle,
}: {
  title: string,
  children: {
    values: {name: string, value?: string | null}[]
    nameWidth: number
  }[]
  flexWrapperStyle?: Style
  cardWrapperStyle?: Style
}) => (
  <View style={[cardStyles.cardWrapper, cardWrapperStyle || {}]}>
    <Text style={cardStyles.title}>{title}</Text>
    <View style={[cardStyles.flexWrapper, flexWrapperStyle || {}]}>
      {children.map((column, ci) => (
        <View key={ci} style={cardStyles.column}>
          {
                  column.values.map((row, ri) => (
                    <View key={ri} style={cardStyles.cardItem}>
                      {
                        row.value ? (
                          <>
                            <Text style={[cardStyles.cardName, { width: column.nameWidth }]}>{row.name}: </Text>
                            <Text>{row.value}</Text>
                          </>
                        )
                          : null
                      }
                    </View>
                  ))
                }
        </View>
      ))}
    </View>
  </View>
);

// Create Document Component
const MyDocument = ({
  title,
  dep,
  arr,
  alt,
  selectedAcft,
  route,
}: DocProps) => (
  <Document title={title} {...DOCUMENT_PROPS} style={styles.document}>
    <Page size="A4" style={styles.page}>
      <View style={styles.sectionTitle}>
        <Text>{title}</Text>
      </View>
      <View style={styles.flightInfo}>
        <PDFCard
          title='Flight Info'
          cardWrapperStyle={{ width: '70%' }}
          flexWrapperStyle={{ justifyContent: 'center' }}
        >
          {[{
            values: [
              { name: 'Departure', value: dep.icao },
              { name: 'Arrival', value: arr.icao },
              { name: 'Alternate', value: alt?.icao },
            ],
            nameWidth: 55,
          },
          {
            values: [
              { name: 'Aircraft', value: selectedAcft?.model },
              { name: 'Ident', value: selectedAcft ? formatAcftRegistration(selectedAcft?.registration) : null },
            ],
            nameWidth: 40,
          },
          {
            values: [
              { name: 'Tot. Distance', value: route.distance ? `${route.distance}nm` : null },
              { name: 'Tot. Time', value: route.time || null },
            ],
            nameWidth: 65,
          },
          ]}
        </PDFCard>
      </View>
    </Page>
  </Document>
);

const FlightPlanPrinter = forwardRef(({
  title,
  dep,
  arr,
  alt,
  selectedAcft,
  route,
}: PrinterProps, ref: React.ForwardedRef<HTMLAnchorElement>) => {
  const setAlert = alertStore((s) => s.setAlert);
  const linkRef = useRef<HTMLAnchorElement| null>(null);
  const [linkReady, setLinkReady] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [instance, updateInstance] = usePDF({ document: undefined });
  useImperativeHandle(ref, () => linkRef.current as HTMLAnchorElement);

  const linkCb = useCallback((node: HTMLAnchorElement | null) => {
    linkRef.current = node;
    setLinkReady(true);
  }, []);

  useEffect(() => {
    if (instance.error) {
      setAlert({ msg: instance.error, type: 'error' });
    }
  }, [instance.error, setAlert]);

  const onLinkClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    updateInstance(MyDocument({
      title,
      dep,
      arr,
      alt,
      selectedAcft,
      route,
    }));
    setUpdating(true);
  }, [
    title,
    selectedAcft,
    dep,
    arr,
    alt,
    route,
    updateInstance,
  ]);

  useEffect(() => {
    if (
      updating
      && !instance.loading
      && instance.url
    ) {
      window.open(instance.url, '_blank');
      setUpdating(false);
    }
  }, [updating, instance]);

  // console.log('instance: ', instance);
  // if (instance.loading) return null;
  // if (instance.error) return null;
  // if (!instance.url) return null;

  return (
    <a href={instance.url || '#'}
      ref={linkCb}
      onClick={onLinkClick}
      style={{ display: 'none' }}
      target="_blank"
      rel="noreferrer"
    >
      Download
    </a>
  );
});

export default FlightPlanPrinter;
