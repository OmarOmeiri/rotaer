import { tryCatch } from 'lullo-utils/Functions';
import { debounce } from 'lullo-utils/Timer';
import {
  forwardRef,
  Fragment,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import styled, { css } from 'styled-components';
import { useSetRefWithCallback } from '@/hooks/React/useSetRefWithCallback';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  MouseSensor,
  Over,
  PointerSensor,
  pointerWithin,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { restrictToHorizontalAxis } from '@dnd-kit/modifiers';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  getCanvasFont,
  getTextWidth,
} from '../../../../utils/HTML/htmlFuncs';
import { DraggableTableHeader } from './DraggableHeader';
import { TableHeader } from './Header';
import classes from './Header.module.css';

import type {
  ColumnOrderState,
  ColumnResizeMode,
  CustomColumn,
  Header,
  HeaderGroup as TableHeaderGroup,
  Table,
} from '@tanstack/react-table';
import type { TableStyles } from '../../styles';
import type { TableHeaderTooltips } from '../../Table';

declare module 'react' {
  function forwardRef<T, P = object>(
    render: (props: P, ref: React.Ref<T>) => React.ReactElement | null
  ): (props: P & React.RefAttributes<T>) => React.ReactElement | null;
}

/* eslint-disable require-jsdoc */
type Props<T extends Record<string, unknown>> = {
  table: Table<T>,
  columnResizeMode: ColumnResizeMode
  columnOrder: ColumnOrderState,
  sorting?: DBSorting<any>,
  headerRefs?: React.MutableRefObject<{id: string, element: HTMLDivElement | null}[] | null>,
  columnAutoSizing?: boolean
  styles: TableStyles
  pinnedColumns?: (keyof T)[]
  headerTooltips?: TableHeaderTooltips<T>,
  classNames?: {headerGroup?: string,}
  onColumnPin?: (id: string) => void,
  setColumnOrder: React.Dispatch<React.SetStateAction<ColumnOrderState>>,
  onSortingChange?: (e: React.MouseEvent | React.KeyboardEvent, col: CustomColumn<T>) => void,
}

type HeaderOverlayProps<T extends Record<string, unknown>> = {
  table: Table<T>,
  columnResizeMode: ColumnResizeMode
  dragId: string | null
  headerGroup: TableHeaderGroup<T>,
  style?: React.CSSProperties,
  styles: TableStyles
}

const StyledHeaderGroup = styled.div`
${({ styles: { header } }: {styles: TableStyles}) => (
    css`
      min-width: 100%;
      height: ${header.height};
      background-color: ${header.background};
      color: ${header.color};
      & > div {
        border-top: ${
    header.border.horizontal.width
    } ${
      header.border.horizontal.style
    } ${
      header.border.horizontal.color
    };
        border-right: ${
    header.border.vertical.width
    } ${
      header.border.vertical.style
    } ${
      header.border.vertical.color
    }
    };`
  )}`;

const HeaderOverlay = <T extends Record<string, unknown>>({
  table,
  columnResizeMode,
  dragId,
  headerGroup,
  style,
  styles,
}: HeaderOverlayProps<T>) => {
  const header = useMemo(() => (
    headerGroup.headers.find((h) => h.id === dragId)
  ), [dragId, headerGroup.headers]);

  return (
    <DragOverlay style={{ touchAction: 'none' }}>
      {
        dragId && header
          ? (
            <TableHeader
              className={classes.DragOverlay}
              header={header}
              table={table}
              columnResizeMode={columnResizeMode}
              style={{
                ...(style || {}),
              }}
              styles={styles}
            />
          )
          : null
      }
    </DragOverlay>
  );
};

const HeaderGroupFwdRef = <T extends Record<string, unknown>>({
  table,
  columnResizeMode,
  columnOrder,
  sorting,
  headerRefs: fwdHeaderRefs,
  columnAutoSizing,
  styles,
  pinnedColumns,
  headerTooltips,
  classNames,
  onColumnPin,
  setColumnOrder,
  onSortingChange,
}: Props<T>, headerGroupRef: React.ForwardedRef<HTMLDivElement>) => {
  const headerLength = table.getAllFlatColumns().length;
  const [dragId, setDragId] = useState<string | null>(null);
  const accessibilityOverlay = useRef<Element | null>(null);
  const headerRefs = useRef<{id: string, element: HTMLDivElement | null}[]>([]);
  const [headerHeight, setHeaderHeight] = useState<number>(0);

  const setHeaderRefs = useSetRefWithCallback((element: HTMLDivElement | null, header: Header<T, unknown>, i: number) => {
    const { id } = header;
    headerRefs.current[i] = { id, element };
    if (element) {
      if (!headerHeight) {
        setHeaderHeight(element.getBoundingClientRect().height);
      }
    }
  });

  useLayoutEffect(() => {
    if (headerRefs.current && columnAutoSizing) {
      for (const { id, element } of headerRefs.current) {
        if (element) {
          const col = tryCatch(
            () => (table.getColumn(id) as CustomColumn<T>),
            () => ({ columnDef: null }),
          ).columnDef;
          if (col?.autoSize === false) continue;
          const textElm = element.querySelector(`.${classes.HeaderText}`) as HTMLSpanElement;
          if (textElm) {
            const text = textElm.innerText.split('\n')[0];
            const headerWidth = element.getBoundingClientRect().width;
            const textElmWidth = textElm.getBoundingClientRect().width;
            const headerNoTextWidth = headerWidth - textElmWidth;
            const width = getTextWidth(
              text,
              getCanvasFont(element),
              30,
            );
            if (width) {
              table.setColumnSizing((s) => ({
                ...s,
                [id]: width + headerNoTextWidth,
              }));
            }
          }
        }
      }
    }
  }, [columnAutoSizing, table, headerLength]);

  useImperativeHandle(fwdHeaderRefs, () => headerRefs.current);

  useEffect(() => {
    accessibilityOverlay.current = document.body;
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
  );

  const onOverDebouncer = useRef(debounce((over: Over | null) => {
    headerRefs.current.forEach((r) => {
      if (over?.id && r.id === over.id) {
        const dropIndicator: HTMLDivElement | null = r.element?.querySelector(`.${classes.DropIndicator}`) || null;
        if (dropIndicator) {
          dropIndicator.style.backgroundColor = styles.header.dragHeaderIndicator.color;
        }
      } else {
        const dropIndicator: HTMLDivElement | null = r.element?.querySelector(`.${classes.DropIndicator}`) || null;
        if (dropIndicator) {
          dropIndicator.style.backgroundColor = 'transparent';
        }
      }
    });
  }, 100)).current;

  const onOver = useCallback((over: Over | null) => {
    onOverDebouncer(over);
  }, [onOverDebouncer]);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;
    setDragId(active.id as string);
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setColumnOrder((items) => {
        const oldIndex = items.indexOf(active.id as string);
        const newIndex = items.indexOf(over?.id as string);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }, [setColumnOrder]);
  return (
    <StyledHeaderGroup className={`${classes.THead} ${classNames?.headerGroup || ''}`} style={{
      width: table.getCenterTotalSize(),
    }} ref={headerGroupRef} styles={styles}>
      {table.getHeaderGroups().map((headerGroup) => (
        <Fragment key={headerGroup.id}>
          <DndContext
              id="table-headers-dnd"
              sensors={sensors}
              modifiers={[restrictToHorizontalAxis]}
              collisionDetection={pointerWithin}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              autoScroll={{ threshold: { x: 0.2, y: 0 } }}
              accessibility={{ container: accessibilityOverlay.current || undefined }}
            >
            <SortableContext
                items={columnOrder}
                strategy={verticalListSortingStrategy}
              >
              {headerGroup.headers.map((header, i) => (
                <DraggableTableHeader
                  key={`${header.id}-${i}`}
                  table={table}
                  header={header}
                  columnResizeMode={columnResizeMode}
                  tooltip={headerTooltips?.[header.id]}
                  onOver={onOver}
                  sorting={sorting}
                  styles={styles}
                  onColumnPin={onColumnPin}
                  pinned={pinnedColumns?.includes(header.id)}
                  onSortingChange={onSortingChange}
                  ref={(element) => {
                    setHeaderRefs(element, header, i);
                  }}
                />
              ))}
            </SortableContext>
            <HeaderOverlay
                table={table}
                columnResizeMode={columnResizeMode}
                headerGroup={headerGroup}
                dragId={dragId}
                styles={styles}
                style={{
                  height: `${headerHeight}px`,
                }}
              />
          </DndContext>
        </Fragment>
      ))}
    </StyledHeaderGroup>
  );
};

export const HeaderGroup = forwardRef(HeaderGroupFwdRef);
