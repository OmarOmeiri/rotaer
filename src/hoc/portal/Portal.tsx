import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export type PortalProps = {
  id: string,
  children: JSX.Element
}

const Portal: React.FC<PortalProps> = ({ id, children }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    return () => setMounted(false);
  }, []);

  return mounted
    ? (createPortal(
      children,
      document.querySelector(/^#/.test(id) ? id : `#${id}`) as Element,
    ))
    : null;
};

export default Portal;
