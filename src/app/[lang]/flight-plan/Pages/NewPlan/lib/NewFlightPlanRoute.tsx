import React, {
  Fragment, useCallback, useEffect, useRef, useState,
} from 'react';
import styled, { type StyledComponent } from 'styled-components';
import { mapChunk } from 'lullo-utils/Arrays';
import GripLinesIcon from '@icons/grip-lines-solid.svg';
import AerodromePin from '@icons/aerodrome-pin.svg';
import LatLonIcon from '@icons/lat-lon.svg';

import TestIcon from '@icons/lat-lon.svg?url';
import TrashIcon from '@icons/X.svg';
import CardWithTitle from '../../../../../../components/Card/CardWithTitle';
import Translator from '../../../../../../utils/Translate/Translator';
import classes from './FlightPlanRoute.module.css';
import {
  TLeg,
} from '../../../../../../utils/Route/Route';
import Sequence from '../../../../../../utils/Sequence/Sequence';
import modalStore from '../../../../../../store/modal/modalStore';
import { FlightPlanEditableIds, OnUserWaypointEdit, UserWaypointAdded } from '../../../types';
import { getElmComputedDimension } from '../../../../../../utils/HTML/htmlPosition';
import Link from '../../../../../../components/Navigation/Link/Link';
import { APP_ROUTES } from '../../../../../../consts/routes';
import langStore from '../../../../../../store/lang/langStore';

type FlightPlanRoutesProps = {
  legs: TLeg[],
  onWaypointOrderChange: (target: string, setAfter: string) => void,
  onWaypointAdd: (wpt: UserWaypointAdded) => void
  onEditableContent: OnUserWaypointEdit,
  onWaypointDelete: (name: string) => void
}

const DragIcon = new Image();
DragIcon.src = TestIcon;

const translator = new Translator({
  route: { 'pt-BR': 'Rota', 'en-US': 'Route' },
  noSuficientData: { 'pt-BR': 'Adicione o aeródromo de partida e destino para começar', 'en-US': 'Add departure and arrival aerodrome to begin.' },
});

const seqStep3 = new Sequence(3, 2);
const seqStep2 = new Sequence(2, 2);

const LegsWrapper = styled.div.attrs(({ count }: {count: number}) => ({
  style: { gridTemplateRows: `repeat(${count + 2}, 1fr)` },
}))`
min-width: 790px;
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
  onEditableContent?: OnUserWaypointEdit,
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

  const onInputEnterPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && inputRef.current) {
      inputRef.current.blur();
    }
  };

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
    tabIndex={-1}
    onKeyUp={onClick}
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
              onKeyDown={onInputEnterPress}
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
  name,
  index,
  count,
  canDrag,
  alternate,
  onWaypointAdd,
  onWaypointDelete,
  dragstartHandler,
  dragendHandler,
  dragenterHandler,
  dropHandler,
  dragoverHandler,
  dragleaveHandler,
}: {
  children?: React.ReactNode,
  name: string,
  index: number,
  count: number,
  canDrag?: boolean,
  alternate?: boolean,
  onWaypointAdd: FlightPlanRoutesProps['onWaypointAdd'],
  onWaypointDelete: FlightPlanRoutesProps['onWaypointDelete']
  dragstartHandler: React.DragEventHandler,
  dragendHandler: React.DragEventHandler,
  dragenterHandler: React.DragEventHandler,
  dropHandler: React.DragEventHandler,
  dragoverHandler: React.DragEventHandler,
  dragleaveHandler: React.DragEventHandler,
}) => {
  const setModal = modalStore((state) => state.setModalContent);
  const showModal = modalStore((state) => state.setShowModal);

  const onWaypointData = useCallback((d: UserWaypointAdded) => {
    onWaypointAdd(d);
  }, [onWaypointAdd]);

  const onAddClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const target = e.target as HTMLButtonElement;
    const addAfter = target.getAttribute('data-name');
    if (!addAfter) return;
    setModal({
      name: 'addWptModal',
      propsToChildren: {
        onSubmit: (data) => onWaypointData({ ...data, addAfter }),
      },
    });
    showModal(true);
  }, [setModal, showModal, onWaypointData]);

  const onDeleteClick = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLButtonElement;
    const name = target.getAttribute('data-name');
    if (!name) return;
    onWaypointDelete(name);
  }, [onWaypointDelete]);

  const isLast = !(count <= index);
  return (
    <div
      className={classes.RouteWaypoint}
      style={{ gridRow: `${seqStep2.get(index)}/ span 2` } as React.CSSProperties}
      draggable={!!canDrag}
      onDragStart={dragstartHandler}
      onDragEnd={dragendHandler}
      onDragEnter={dragenterHandler}
      onDrop={isLast ? dropHandler : undefined}
      onDragOver={isLast ? dragoverHandler : undefined}
      onDragLeave={dragleaveHandler}
      data-name={name}
      {...(alternate ? { 'data-alternate': 'true' } : null)}
    >
      {children || null}
      {
        !isLast
          ? null
          : (
            <div className={classes.RouteWaypointBtnWrapper}>
              <button className={classes.RouteWaypointBtnAdd} data-name={name} onClick={onAddClick}>
                +
              </button>
              {
              canDrag === false
                ? null
                : (
                  <>
                    <button className={classes.RouteWaypointBtnDelete} data-name={name} onClick={onDeleteClick}>
                      <TrashIcon width='7' strokeWidth="2"/>
                    </button>
                    <button className={classes.RouteWaypointBtnDrag} data-name={name}>
                      <GripLinesIcon width='10'/>
                    </button>
                  </>
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
  lang,
  onEditableContent,
  onWaypointAdd,
  onWaypointDelete,
  onWaypointOrderChange,
}: {
  legs: TLeg[],
  lang: Langs
  onWaypointAdd: FlightPlanRoutesProps['onWaypointAdd'],
  onWaypointDelete: FlightPlanRoutesProps['onWaypointDelete']
  onEditableContent: FlightPlanRoutesProps['onEditableContent'],
  onWaypointOrderChange: (target: string, setAfter: string) => void
}) => {
  console.log('lang: ', lang);
  const [dragTargetName, setDragTargetName] = useState<string | null>(null);

  const dragstartHandler = useCallback((e: React.DragEvent) => {
    const target = e.target as HTMLDivElement;
    const name = target.getAttribute('data-name');
    const dims = getElmComputedDimension(target);
    const clone = target.cloneNode(true) as HTMLDivElement;
    clone.id = 'route-waypoint-drag-image';
    clone.style.height = dims.height;
    clone.style.width = dims.width;
    clone.style.position = 'absolute';
    clone.style.top = `calc(-50px - ${dims.height})`;
    document.body.appendChild(clone);
    e.dataTransfer.setDragImage(clone, 0, 0);
    setDragTargetName(name);
  }, []);

  const dragendHandler = useCallback(() => {
    const dragImage = document.getElementById('route-waypoint-drag-image');
    if (dragImage) dragImage.remove();
  }, []);

  const dropHandler = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const target = e.target as HTMLElement;
    if (target.tagName !== 'DIV') return;
    const name = target.getAttribute('data-name');
    target.classList.remove(classes.RouteWaypointDrop);
    if (
      dragTargetName
      && name
      && name !== dragTargetName
    ) onWaypointOrderChange(dragTargetName, name);
  }, [dragTargetName, onWaypointOrderChange]);

  const dragoverHandler = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const dragenterHandler = useCallback((e: React.DragEvent) => {
    const target = e.target as HTMLElement;
    if (target.tagName !== 'DIV') return;
    target.classList.add(classes.RouteWaypointDrop);
  }, []);

  const dragleaveHandler = useCallback((e: React.DragEvent) => {
    const target = e.target as HTMLElement;
    if (target.tagName !== 'DIV') return;
    target.classList.remove(classes.RouteWaypointDrop);
  }, []);

  if (legs.length < 2) {
    return (
      <div style={{ textAlign: 'center' }}>
        {translator.translate('noSuficientData')}
      </div>
    );
  }
  return (
    <LegsWrapper count={legs.length}>
      <RouteHeader>Waypoint</RouteHeader>
      <RouteHeader>MH</RouteHeader>
      <RouteHeader>Altitude</RouteHeader>
      <RouteHeader>Distance</RouteHeader>
      <RouteHeader>IAS</RouteHeader>
      <RouteHeader>TAS</RouteHeader>
      <RouteHeader>Wind</RouteHeader>
      <RouteHeader>GS</RouteHeader>
      <RouteHeader>ETE</RouteHeader>
      <RouteHeader>ETO</RouteHeader>
      {
        mapChunk(legs, (l, i) => (
          l.map((_l, li) => {
            const isAlternate = _l.alternate || (l[li + 1]?.alternate || false);
            if (_l.type === 'wpt') {
              return (
                <RouteWpt
                  key={_l.index}
                  name={_l.name}
                  index={i}
                  count={Math.floor(legs.length / 2)}
                  canDrag={!_l.fixed}
                  alternate={isAlternate}
                  onWaypointAdd={onWaypointAdd}
                  onWaypointDelete={onWaypointDelete}
                  dragstartHandler={dragstartHandler}
                  dragendHandler={dragendHandler}
                  dragenterHandler={dragenterHandler}
                  dropHandler={dropHandler}
                  dragoverHandler={dragoverHandler}
                  dragleaveHandler={dragleaveHandler}
                >
                  <div className={classes.WptNameWrapper}>
                    <div>
                      {
                        _l.wptType === 'ad'
                          ? <AerodromePin width="15"/>
                          : <LatLonIcon width="15"/>
                      }
                    </div>
                    <div className={classes.WptName}>
                      {
                        _l.wptType === 'ad'
                          ? (
                            <Link
                              to={APP_ROUTES.aerodromeInfo(_l.name, lang)}
                              locale={lang}
                              openInNewTab
                            >
                              {_l.name}
                            </Link>
                          )
                          : (
                            <div>{_l.name}</div>
                          )
                      }
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
                <RouteItem index={i}>{`${_l.distance}nm`}</RouteItem>
                <RouteItem id="ias" index={i} onEditableContent={onEditableContent}>{`${_l.ias}kt`}</RouteItem>
                <RouteItem index={i}>{`${_l.tas}kt`}</RouteItem>
                <RouteItem id="wind" index={i} onEditableContent={onEditableContent}>{`${_l.windDirection}°/${_l.windSpeed}kt`}</RouteItem>
                <RouteItem index={i}>{`${_l.gs}kt`}</RouteItem>
                <RouteItem index={i}>{`${_l.ete}`}</RouteItem>
                <RouteItem index={i}>{`${_l.eto}`}</RouteItem>
              </Fragment>
            );
          })), 2)
      }
    </LegsWrapper>
  );
};

const NewFlightPlanRoute = ({
  legs,
  onWaypointOrderChange,
  onEditableContent,
  onWaypointAdd,
  onWaypointDelete,
}: FlightPlanRoutesProps) => {
  const lang = langStore((state) => state.lang);
  return (
    <CardWithTitle title={translator.translate('route')} styled>
      <div>
        <Legs
        legs={legs}
        lang={lang}
        onEditableContent={onEditableContent}
        onWaypointAdd={onWaypointAdd}
        onWaypointDelete={onWaypointDelete}
        onWaypointOrderChange={onWaypointOrderChange}
      />
      </div>
    </CardWithTitle>
  );
};

export default NewFlightPlanRoute;
