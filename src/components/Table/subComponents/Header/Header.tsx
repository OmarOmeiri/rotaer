/* eslint-disable no-param-reassign */
import React, {
  forwardRef,
  useImperativeHandle,
} from 'react';
import styled, { css } from 'styled-components';
import { useSetRefWithCallback } from '@/hooks/React/useSetRefWithCallback';
import GripHandle from '@assets/icons/grip-lines-solid.svg';
import Pin from '@assets/icons/pin-solid.svg';
/* eslint-disable require-jsdoc */
import {
  ColumnResizeMode,
  CustomColumn,
  flexRender,
  HeaderCustom,
  Table,
} from '@tanstack/react-table';
import { useSyncStateRef } from '../../../../hooks/React/useSyncStateRef';
import { TableStyles } from '../../styles';
import { StyledTableTooltip } from '../Tooltips/StyledTooltip';
import classes from './Header.module.css';
import {
  getHeaderProps,
  getHeaderResizerProps,
} from './helpers';

import type { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';
import type { DraggableAttributes } from '@dnd-kit/core';
type Props<T extends Record<string, unknown>> = {
  header: HeaderCustom<T, unknown>
  listeners?: SyntheticListenerMap | undefined
  attributes?: DraggableAttributes
  style?: React.CSSProperties,
  columnResizeMode: ColumnResizeMode
  table: Table<T>,
  className?: string,
  sorting?: DBSorting<any>,
  styles: TableStyles
  pinned?: boolean,
  pinnedColumns?: string[],
  tooltip?: JSX.Element
  onColumnPin?: (id: string) => void
  onSortingChange?: (e: React.MouseEvent | React.KeyboardEvent, col: CustomColumn<T>) => void,
}

declare module 'react' {
  function forwardRef<T, P = object>(
    render: (props: P, ref: React.Ref<T>) => React.ReactElement | null
  ): (props: P & React.RefAttributes<T>) => React.ReactElement | null;
}

const columnPinEvent = (
  header: HeaderCustom<any, unknown>,
  onColumnPin: (id: string) => void,
) => (e: React.MouseEvent | React.KeyboardEvent) => {
  if (e.nativeEvent instanceof KeyboardEvent && e.nativeEvent.key !== 'Enter') return;
  e.preventDefault();
  e.stopPropagation();
  onColumnPin(header.id);
};

const Th = styled.div`
${(props: {sorted: 'asc' | 'desc' | undefined, styles: TableStyles}) => {
    const base = css`
        background-color: ${props.styles.header.background};`;
    const sortedShadow = props.sorted
      ? css`
        box-shadow: inset 0px -2px 0 0 ${props.styles.header.sortingIndicator.color};`
      : '';
    switch (props.sorted) {
      case 'asc':
        return css`
          ${base}
          ${sortedShadow}
          &:after {
            border-bottom: 7px solid ${props.styles.header.sortingIndicator.color};
          }`;
      case 'desc':
        return css`
          ${base}
          ${sortedShadow}
          &:after {
            border-top: 7px solid ${props.styles.header.sortingIndicator.color};
          }`;
      default:
        return base;
    }
  }}`;

const Resizer = styled.div`
${({ styles: { header: { resizer } }, isResizing }: {styles: TableStyles, isResizing: boolean}) => {
    if (isResizing) {
      return css`
      background-color: ${resizer.resizingColor};
      opacity: 1;`;
    }
    return css`
      background-color: ${resizer.hoverColor};
      &:hover: {
        opacity: 1;
      }`;
  }}`;

const getHeaderControls = <T extends Record<string, unknown>>({
  header,
  attributes,
  listeners,
  styles,
  pinned,
  onColumnPin = () => {},
}: {
  header: HeaderCustom<T, unknown>,
  attributes: DraggableAttributes | undefined
  listeners: SyntheticListenerMap | undefined
  styles: TableStyles,
  pinned?: boolean
  onColumnPin?: (id: string) => void
}) => {
  const { columnDef } = header.column;
  const components: React.ReactElement[] = [];
  if (header.id === 'row-select') return null;
  if (columnDef.draggable || typeof columnDef.draggable === 'undefined') {
    components.push(
      <div key="column-drag-control" className={classes.DragHandle} {...attributes} {...listeners}>
        <GripHandle/>
      </div>,
    );
  }
  if (columnDef.stickable) {
    const color = pinned
      ? styles.header.controlIcons.appliedColor
      : styles.header.controlIcons.color;
    components.push(
      <div
        className={classes.ColumnPin}
        key="column-pin-control"
        style={{ color }}
        data-clickable
        role="button"
        tabIndex={0}
        onClick={columnPinEvent(header, onColumnPin)}
        onKeyDown={columnPinEvent(header, onColumnPin)}
      >
        <Pin/>
      </div>,
    );
  }

  if (!components.length) return null;
  return (
    <div className={`${classes.ThControls} tbl-header-control`}>
      {components}
    </div>
  );
};

const WithHeaderTooltip = forwardRef(({
  children,
  content,
  styles,
}: {
  children: React.ReactElement,
  content?: JSX.Element
  styles: TableStyles,
}, ref: React.ForwardedRef<HTMLElement>) => {
  if (content) {
    return (
      <StyledTableTooltip
        ref={ref}
        placement='bottom-start'
        type='hover'
        delay={300}
        content={content}
        styles={styles}
      >
        {children}
      </StyledTableTooltip>
    );
  }

  return (
    <>
      {children}
    </>
  );
});

function TableHeaderFwdRef<T extends Record<string, unknown>>(
  {
    header,
    listeners,
    attributes,
    style,
    columnResizeMode,
    table,
    className,
    sorting,
    styles,
    pinned,
    tooltip,
    onColumnPin,
    onSortingChange,
  }: Props<T>,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  const { onClick, ...headerProps } = getHeaderProps(
    header,
    className,
    sorting,
    pinned,
    onSortingChange,
  );
  const [localRef, setLocalRef] = useSyncStateRef<HTMLDivElement | null>({ value: null });
  const resizerProps = getHeaderResizerProps({ table, header, columnResizeMode });
  useImperativeHandle(ref, () => localRef.current as HTMLDivElement);
  const onRefChg = useSetRefWithCallback((node: HTMLDivElement) => {
    if (node) {
      if (ref) ref = node as unknown as React.ForwardedRef<HTMLDivElement>;
      setLocalRef(node);
    }
  });

  return (
    <Th
      ref={onRefChg}
      style={{ ...(style || {}), width: header.getSize() }}
      styles={styles}
      {...headerProps}
    >
      <WithHeaderTooltip
        ref={localRef}
        content={tooltip}
        styles={styles}
      >
        <div onClick={onClick as React.MouseEventHandler} className={classes.Hd} tabIndex={0} onKeyDown={onClick as React.KeyboardEventHandler} role="button">
          <span
          className={classes.HeaderText}
        >
            {
            header.isPlaceholder
              ? null
              : flexRender(header.column.columnDef.header, header.getContext())
          }
          </span>
          {
          getHeaderControls({
            header,
            attributes,
            listeners,
            styles,
            pinned,
            onColumnPin,
          })
        }
        </div>
      </WithHeaderTooltip>
      <Resizer
        styles={styles}
        {...resizerProps}
      />
      <div
        className={classes.DropIndicator}
      />
    </Th>
  );
}

export const TableHeader = forwardRef(TableHeaderFwdRef);
