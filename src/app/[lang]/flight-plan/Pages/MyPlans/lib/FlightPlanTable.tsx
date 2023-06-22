'use client';

import type { ColumnDefCustom, CustomCellContext } from '@tanstack/react-table';
import dynamic from 'next/dynamic';
import React, { useCallback, useMemo } from 'react';
import GoToIcon from '@icons/go-to.svg';
import TrashIcon from '@icons/trash.svg';
import CopyIcon from '@icons/copy-regular.svg';
import { useRouter } from 'next/navigation';
import Translator from '../../../../../../utils/Translate/Translator';
import { WithStrId } from '../../../../../../types/app/mongo';
import type { FlightPlan } from '../../../../../../types/app/fPlan';
import { useNextAuth } from '../../../../../../hooks/Auth/useAuth';
import { useFlightPlansQuery } from '../../../../../../frameworks/react-query/queries/flightPlan';
import { formatDate } from '../../../../../../utils/format/date';
import classes from './FlightPlanTable.module.css';
import { APP_ROUTES } from '../../../../../../consts/routes';
import langStore from '../../../../../../store/lang/langStore';

const Table = dynamic(() => import('../../../../../../components/Table/Table'));

const translator = new Translator({
  name: { 'pt-BR': 'Nome', 'en-US': 'Name' },
  acft: { 'pt-BR': 'Aeronave', 'en-US': 'Aircraft' },
  dep: { 'pt-BR': 'Partida', 'en-US': 'Departure' },
  arr: { 'pt-BR': 'Chegada', 'en-US': 'Arrival' },
  date: { 'pt-BR': 'Data', 'en-US': 'Date' },
  noPlans: { 'pt-BR': 'Nenhum plano encontrado...', 'en-US': 'No flight plans to display...' },
  btnTitleView: { 'pt-BR': 'Visualizar', 'en-US': 'View' },
  btnTitleClone: { 'pt-BR': 'Clonar', 'en-US': 'Clone' },
  btnTitleDelete: { 'pt-BR': 'Remover', 'en-US': 'Delete' },
});

const FlightPlanTableButtons = ({
  cell,
  onView,
  onDelete,
}: {
  cell: CustomCellContext<WithStrId<FlightPlan>, unknown>,
  onView: React.MouseEventHandler,
  onDelete: React.MouseEventHandler,
}) => (
  <div className={classes.TableBtnsWrapper}>
    <button
      title={translator.translate('btnTitleView')}
      name={translator.translate('btnTitleView')}
      className={classes.ViewBtn}
      data-id={cell.row.original._id}
      onClick={onView}
    >
      <GoToIcon width="18"/>
    </button>
    <button
      title={translator.translate('btnTitleDelete')}
      name={translator.translate('btnTitleDelete')}
      className={classes.DeleteBtn}
      data-id={cell.row.original._id}
      onClick={onDelete}
    >
      <TrashIcon width="16"/>
    </button>
  </div>
);

const flightPlanCols = ({
  onDelete,
  onView,
}: {
  onView: React.MouseEventHandler,
  onDelete: React.MouseEventHandler,
}): ColumnDefCustom<WithStrId<FlightPlan>>[] => [
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
  {
    header: '',
    id: 'btns',
    accessorKey: '',
    cell: (data) => <FlightPlanTableButtons cell={data} onDelete={onDelete} onView={onView}/>,
    draggable: false,
  },
];

const FlightPlanTable = () => {
  const { user } = useNextAuth();
  const router = useRouter();
  const userPlansQuery = useFlightPlansQuery(user);
  const lang = langStore((s) => s.lang);
  const onDeletePlan = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLButtonElement;
    const id = target.getAttribute('data-id');
    console.log('Delete: ', id);
  }, []);

  const onViewPlan = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLButtonElement;
    const id = target.getAttribute('data-id');
    router.push(`${APP_ROUTES.flightPlan(lang)}?page=newPlan&id=${id}`);
  }, [router, lang]);

  const cols = useMemo(() => flightPlanCols({
    onDelete: onDeletePlan,
    onView: onViewPlan,
  }) as ColumnDefCustom<Record<string, unknown>>[], [
    onViewPlan,
    onDeletePlan,
  ]);
  return (
    <div className={classes.TableWrapper}>
      <Table
        data={(userPlansQuery.data || []) as any}
        cols={cols}
        noData={!(userPlansQuery.data || []).length}
        noDataMsg={translator.translate('noPlans')}
        loading={userPlansQuery.isLoading}
      />
    </div>
  );
};

export default FlightPlanTable;
