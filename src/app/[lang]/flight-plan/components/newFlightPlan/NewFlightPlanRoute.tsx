import React, {
  Fragment, useCallback, useEffect, useRef, useState,
} from 'react';
import styled, { type StyledComponent } from 'styled-components';
import { mapChunk } from 'lullo-utils/Arrays';
import GripLinesIcon from '@icons/grip-lines-solid.svg';
import AerodromePin from '@icons/aerodrome-pin.svg';
import CardWithTitle from '../../../../../components/Card/CardWithTitle';
import Translator from '../../../../../utils/Translate/Translator';
import classes from '../../styles/FlightPlanRoute.module.css';
import {
  TLeg,
} from '../../../../../utils/Route/Route';
import Sequence from '../../../../../utils/Sequence/Sequence';
import modalStore from '../../../../../store/modal/modalStore';
import { FlightPlanEditableIds } from '../../types';

type FlightPlanRoutesProps = {
  legs: TLeg[],
  onWaypointAdd: (wpt: {altitude: number, coords: {lat: number, lon: number}, name: string}) => void
  onEditableContent: (index: number, id: FlightPlanEditableIds, value: string) => void,
}

const translator = new Translator({
  route: { 'pt-BR': 'Rota', 'en-US': 'Route' },
});

const seqStep3 = new Sequence(3, 2);
const seqStep2 = new Sequence(2, 2);

const LegsWrapper = styled.div.attrs(({ count }: {count: number}) => ({
  style: { gridTemplateRows: `repeat(${count + 2}, 1fr)` },
}))`
display: grid;
grid-template-columns: repeat(10, 1fr);` as StyledComponent<'div', any, {
  style: {
      gridTemplateRows: string;
  };
} & {
  count: number;
}, 'style'>;

const RouteHeader = ({
  children,
}: {children: React.ReactNode}) => (
  <div
    className={classes.RouteHeader}
  >
    {children || null}
  </div>
);

const RouteItem = ({
  children,
  index,
  id,
  onEditableContent,
}: {
  children?: string,
  index: number,
  id?: FlightPlanEditableIds,
  onEditableContent?: (index: number, id: FlightPlanEditableIds, value: string) => void,
}) => {
  const [showInput, setShowInput] = useState(false);
  const [inputValue, setInputValue] = useState<string>('');
  const inputRef = useRef<HTMLInputElement | null>(null);
  const onClick = useCallback((e: React.MouseEvent | React.KeyboardEvent) => {
    if (e.nativeEvent instanceof KeyboardEvent && e.nativeEvent.key !== 'Enter') return;
    setTimeout(() => {
      setInputValue(children || '');
    }, 30);
    if (onEditableContent) setShowInput(true);
  }, [onEditableContent, children]);
  const onInputBlur = useCallback((e: React.FocusEvent) => {
    setShowInput(false);
    const target = e.currentTarget as HTMLInputElement;
    const { value } = target;
    const id = target.getAttribute('data-id') as FlightPlanEditableIds | null;
    const index = Number(target.getAttribute('data-index'));
    if (!id || Number.isNaN(index)) return;
    if (onEditableContent) onEditableContent(index, id, value);
  }, [onEditableContent]);
  const onChange = useCallback((e: React.ChangeEvent) => {
    const target = e.target as HTMLInputElement;
    setInputValue(target.value);
  }, []);
  useEffect(() => {
    if (!showInput) return;
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  }, [showInput]);
  return (
    <div
    className={classes.RouteItem}
    role="button"
    style={{ gridRow: `${seqStep3.get(index)}/ span 2` } as React.CSSProperties}
    data-index={index}
    data-id={id}
    onClick={onClick}
    data-canclick={onEditableContent ? 'true' : 'false'}
    // eslint-disable-next-line jsx-a11y/tabindex-no-positive
    tabIndex={1}
    onKeyDown={onClick}
  >
      {
        onEditableContent
          ? (
            <input
              ref={inputRef}
              data-index={index}
              data-id={id}
              className={`${classes.EditInput} ${showInput ? '' : classes.EditInputHidden}`}
              value={inputValue}
              onChange={onChange}
              onBlur={onInputBlur}
            />
          )
          : null
      }
      {
        !showInput
          ? children || null
          : null
      }
    </div>
  );
};

const RouteWpt = ({
  children,
  index,
  count,
  canDrag,
  alternate,
  onWaypointAdd,
}: {
  children?: React.ReactNode,
  index: number,
  count: number,
  canDrag?: boolean,
  alternate?: boolean,
  onWaypointAdd: (wpt: {altitude: number, coords: {lat: number, lon: number}, name: string}) => void
}) => {
  const setModal = modalStore((state) => state.setModalContent);
  const showModal = modalStore((state) => state.setShowModal);

  const onWaypointData = useCallback((d: {altitude: number, coords: {lat: number, lon: number}, name: string}) => {
    onWaypointAdd(d);
  }, [onWaypointAdd]);

  const onAddClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const target = e.target as HTMLButtonElement;
    const ix = Number(target.getAttribute('data-index'));
    setModal({
      name: 'addWptModal',
      propsToChildren: {
        onSubmit: onWaypointData,
      },
    });
    showModal(true);
  }, [setModal, showModal, onWaypointData]);
  return (
    <div
      className={classes.RouteWaypoint}
      style={{ gridRow: `${seqStep2.get(index)}/ span 2` } as React.CSSProperties}
      {...(alternate ? { 'data-alternate': 'true' } : null)}
    >
      {children || null}
      {
      count <= index
        ? null
        : (
          <div className={classes.RouteWaypointBtnWrapper}>
            <button className={classes.RouteWaypointBtnAdd} data-index={index} onClick={onAddClick}>
              +
            </button>
            {
              canDrag === false
                ? null
                : (
                  <button className={classes.RouteWaypointBtnDrag} data-index={index}>
                    <GripLinesIcon width='10'/>
                  </button>
                )
            }
          </div>
        )
    }
    </div>
  );
};

const Legs = ({
  legs,
  onEditableContent,
  onWaypointAdd,
}: {
  legs: TLeg[],
  onWaypointAdd: (wpt: {altitude: number, coords: {lat: number, lon: number}, name: string}) => void
  onEditableContent: (index: number, id: FlightPlanEditableIds, value: string) => void,
}) => {
  if (legs.length < 2) return null;
  return (
    <LegsWrapper count={legs.length}>
      <RouteHeader>Waypoint</RouteHeader>
      <RouteHeader>MH</RouteHeader>
      <RouteHeader>Altitude</RouteHeader>
      <RouteHeader>IAS</RouteHeader>
      <RouteHeader>Distance</RouteHeader>
      <RouteHeader>Wind</RouteHeader>
      <RouteHeader>GS</RouteHeader>
      <RouteHeader>ETE</RouteHeader>
      <RouteHeader>ETO</RouteHeader>
      <RouteHeader>ATO</RouteHeader>
      {
        mapChunk(legs, (l, i) => (
          l.map((_l, li) => {
            const isAlternate = _l.alternate || (l[li + 1]?.alternate || false);
            if (_l.type === 'wpt') {
              return (
                <RouteWpt key={_l.index} index={i} count={l.length} canDrag={!_l.fixed} alternate={isAlternate} onWaypointAdd={onWaypointAdd}>
                  <div className={classes.WptNameWrapper}>
                    <div>
                      <AerodromePin width="15"/>
                    </div>
                    <div className={classes.WptName}>
                      <div>{_l.name}</div>
                      <div className={classes.Coord}>{_l.coord}</div>
                    </div>
                  </div>
                </RouteWpt>
              );
            }
            return (
              <Fragment key={_l.index}>
                <RouteItem index={i}>{`${_l.mh}°`}</RouteItem>
                <RouteItem id="altitude" index={i} onEditableContent={onEditableContent}>{`${_l.altitude}ft`}</RouteItem>
                <RouteItem id="ias" index={i} onEditableContent={onEditableContent}>{`${_l.speed}kt`}</RouteItem>
                <RouteItem index={i}>{`${_l.distance}nm`}</RouteItem>
                <RouteItem id="wind" index={i} onEditableContent={onEditableContent}>{`${_l.windDirection}°/${_l.windSpeed}kt`}</RouteItem>
                <RouteItem index={i}>{`${_l.gs}kt`}</RouteItem>
                <RouteItem index={i}>{`${_l.ete}`}</RouteItem>
                <RouteItem index={i}>{`${_l.eto}`}</RouteItem>
                <RouteItem index={i}/>
              </Fragment>
            );
          })), 2)
      }
    </LegsWrapper>
  );
};

const NewFlightPlanRoute = ({
  legs,
  onEditableContent,
  onWaypointAdd,
}: FlightPlanRoutesProps) => (
  <CardWithTitle title={translator.translate('route')} styled>
    <Legs legs={legs} onEditableContent={onEditableContent} onWaypointAdd={onWaypointAdd}/>
  </CardWithTitle>
);

export default NewFlightPlanRoute;
