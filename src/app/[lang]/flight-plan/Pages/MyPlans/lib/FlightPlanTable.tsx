'use client';

import type { ColumnDefCustom } from '@tanstack/react-table';
import dynamic from 'next/dynamic';
import { useMemo } from 'react';
import Translator from '../../../../../../utils/Translate/Translator';
import { WithStrId } from '../../../../../../types/app/mongo';
import type { FlightPlan } from '../../../../../../types/app/fPlan';
import { useNextAuth } from '../../../../../../hooks/Auth/useAuth';
import { useFlightPlansQuery } from '../../../../../../frameworks/react-query/queries/flightPlan';
import { formatDate } from '../../../../../../utils/format/date';

const Table = dynamic(() => import('../../../../../../components/Table/Table'));

const translator = new Translator({
  name: { 'pt-BR': 'Nome', 'en-US': 'Name' },
  acft: { 'pt-BR': 'Aeronave', 'en-US': 'Aircraft' },
  dep: { 'pt-BR': 'Partida', 'en-US': 'Departure' },
  arr: { 'pt-BR': 'Chegada', 'en-US': 'Arrival' },
  date: { 'pt-BR': 'Data', 'en-US': 'Date' },
  noPlans: { 'pt-BR': 'Nenhum plano encontrado...', 'en-US': 'No flight plans to display...' },
});

const flightPlanCols = (): ColumnDefCustom<WithStrId<FlightPlan>>[] => [
  {
    header: translator.translate('name'),
    id: 'name',
    accessorKey: 'name',
    draggable: false,
    style: { padding: '0', textAlign: 'center' },
    accessorFn: (data) => data.name,

  },
  {
    header: translator.translate('dep'),
    id: 'dep',
    accessorKey: 'dep',
    accessorFn: (data) => data.dep.icao,
    draggable: false,
  },
  {
    header: translator.translate('arr'),
    id: 'arr',
    accessorKey: 'arr',
    accessorFn: (data) => data.arr.icao,
    draggable: false,
  },
  {
    header: translator.translate('date'),
    id: 'createdAt',
    accessorKey: 'createdAt',
    accessorFn: (data) => (data.createdAt ? formatDate(new Date(data.createdAt)) : ''),
    draggable: false,
  },
];

const FlightPlanTable = () => {
  const { user } = useNextAuth();
  const userPlansQuery = useFlightPlansQuery(user);
  console.log('userPlansQuery: ', userPlansQuery.data);
  const cols = useMemo(() => flightPlanCols() as ColumnDefCustom<Record<string, unknown>>[], []);
  return (
    <Table
      data={(userPlansQuery.data || []) as any}
      cols={cols}
      noData={!(userPlansQuery.data || []).length}
      noDataMsg={translator.translate('noPlans')}
      loading={userPlansQuery.isLoading}
    />
  );
};

export default FlightPlanTable;
