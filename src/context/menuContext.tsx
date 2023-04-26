import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import warnHelper from '../utils/Errors/warnHelper';

type ContextMenu = {
  mouseX: number;
  mouseY: number;
} | null;

type ContextMenuItems = {key: string, value: string | JSX.Element}[]

type MenuContext = {
  contextMenu: ContextMenu,
  elements: ContextMenuItems,
  onItemClick: (e: React.MouseEvent) => void
  onClickCallback: (cb: (key: string) => void) => void
  setElements: SetState<ContextMenuItems>
  setContextMenu: SetState<ContextMenu>
  handleContextMenu: (event: React.MouseEvent, elements: ContextMenuItems) => void,
  handleClose: () => void
  cleanup: () => void
}

const MenuContextInitial: MenuContext = {
  contextMenu: null,
  elements: [],
  onItemClick: () => {},
  onClickCallback: () => {},
  setElements: () => {},
  setContextMenu: () => {},
  handleContextMenu: () => {},
  handleClose: () => {},
  cleanup: () => {},
};

export const ContextMenuContext = React.createContext<MenuContext>(MenuContextInitial);

export const ContextMenuContextProvider = ({ children }: {children: React.ReactNode}) => {
  const [elements, setElements] = useState<ContextMenuItems>([]);
  const clickCallback = useRef<((key: string) => void) | null>(null);
  const [contextMenu, setContextMenu] = React.useState<{
    mouseX: number;
    mouseY: number;
  } | null>(null);

  const handleContextMenu = React.useCallback((event: React.MouseEvent, menuItems: ContextMenuItems) => {
    event.preventDefault();
    if (!menuItems.length) {
      warnHelper({
        message: 'No items were supplied to the context menu.',
        stack: new Error().stack,
      });
      return;
    }
    setElements(menuItems);
    setContextMenu(
      contextMenu === null
        ? {
          mouseX: event.clientX + 2,
          mouseY: event.clientY - 6,
        }
        : null,
    );
  }, [contextMenu]);

  const handleClose = React.useCallback(() => {
    setContextMenu(null);
    // if (onClose) onClose();
  }, [setContextMenu]);

  const onItemClick = React.useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLDivElement;
    const itemKey = target.getAttribute('data-key');
    if (!clickCallback.current) {
      warnHelper({
        message: 'No callback function was provided.',
        stack: new Error().stack,
      });
      return;
    }
    if (itemKey) {
      clickCallback.current(itemKey);
    }
    handleClose();
  }, [handleClose]);

  const onClickCallback = useCallback((cb: (key: string) => void) => {
    clickCallback.current = cb;
  }, []);

  const cleanup = useCallback(() => {
    setElements([]);
    setContextMenu(null);
    clickCallback.current = null;
  }, []);

  const ctxValue: MenuContext = {
    contextMenu,
    elements,
    onItemClick,
    onClickCallback,
    setElements,
    setContextMenu,
    handleContextMenu,
    handleClose,
    cleanup,
  };

  return (
    <ContextMenuContext.Provider value={ctxValue}>
      {children}
    </ContextMenuContext.Provider>
  );
};
