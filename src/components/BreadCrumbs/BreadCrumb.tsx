import { usePathname } from 'next/navigation';

const BreadCrumbs = () => {
  const pathName = usePathname();
  console.log('pathName: ', pathName);
  return null;
};

export default BreadCrumbs;
