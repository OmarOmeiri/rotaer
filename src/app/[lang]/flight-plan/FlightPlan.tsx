'use client';

import ListIcon from '@icons/list.svg';
import NewFileIcon from '@icons/file-circle-plus-solid.svg';
import PlaneIcon from '@icons/plane-solid.svg';
import { useCallback, useMemo, useState } from 'react';
import Translator from '../../../utils/Translate/Translator';
import FlightPlanDrawer from './FlightPlanDrawer';
import FlightPlanPages from './FlightPlanPages';
import langStore from '../../../store/lang/langStore';

const translator = new Translator({
  openDrawerBtn: { 'pt-BR': 'Abrir opções', 'en-US': 'Open flight plan options drawer' },
  myPlans: { 'en-US': 'My Plans', 'pt-BR': 'Meus Planos' },
  newPlan: { 'en-US': 'New Plan', 'pt-BR': 'Novo Plano' },
  myAcft: { 'en-US': 'My Aircraft', 'pt-BR': 'Minhas aeronaves' },
});

const getDrawerContents = () => ([
  {
    id: 'myPlans' as const,
    label: translator.translate('myPlans'),
    icon: <ListIcon/>,
  },
  {
    id: 'newPlan' as const,
    label: translator.translate('newPlan'),
    icon: <NewFileIcon/>,
  },
  {
    id: 'myAcft' as const,
    label: translator.translate('myAcft'),
    icon: <PlaneIcon/>,
  },
]);

const FlightPlan = () => {
  const [page, setPage] = useState('myPlans');
  const lang = langStore((state) => state.lang);

  const onPageChange = useCallback((page: string) => {
    setPage(page);
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const drawerContents = useMemo(() => getDrawerContents(), [lang]);

  return (
    <div>
      <FlightPlanDrawer contents={drawerContents} onPageChange={onPageChange} page={page}/>
      <FlightPlanPages page={page} />
    </div>
  );
};

export default FlightPlan;

