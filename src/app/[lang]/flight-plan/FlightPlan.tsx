'use client';

import ListIcon from '@icons/list.svg';
import NewFileIcon from '@icons/file-circle-plus-solid.svg';
import PlaneIcon from '@icons/plane-solid.svg';
import {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Translator from '../../../utils/Translate/Translator';
import FlightPlanDrawer from './FlightPlanDrawer';
import langStore from '../../../store/lang/langStore';
import MyAcft from './Pages/MyAcft/MyAcft';
import MyPlans from './Pages/MyPlans/MyPlans';
import NewPlan from './Pages/NewPlan/NewPlan';
import { APP_ROUTES } from '../../../consts/routes';

const FlightPlanPages = ({
  page,
}: {
  page: string
}) => {
  switch (page) {
    case 'myPlans':
      return <MyPlans/>;
    case 'newPlan':
      return <NewPlan/>;
    case 'myAcft':
      return <MyAcft/>;
    default:
      return null;
  }
};

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

const getPageName = (name: string | null) => {
  if (name && getDrawerContents().map((c) => c.id as string).includes(name)) {
    return name;
  }
  return 'myPlans';
};

const FlightPlan = () => {
  const router = useRouter();
  const params = useSearchParams();
  const page = getPageName(params.get('page'));
  const lang = langStore((state) => state.lang);

  const onPageChange = useCallback((page: string) => {
    router.push(`${APP_ROUTES.flightPlan(lang)}?page=${page}`);
  }, [lang, router]);

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

