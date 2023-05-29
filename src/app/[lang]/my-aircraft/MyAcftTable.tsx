'use client';

import type { ColumnDefCustom } from '@tanstack/react-table';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import TrashIcon from '@icons/trash.svg';
import EditIcon from '@icons/edit.svg';
import { useCallback, useEffect, useMemo } from 'react';
import classes from './MyAcftTable.module.css';
import Translator from '../../../utils/Translate/Translator';
import { ACFT_IMG_URL } from '../../../consts/urls';
import { formatAcftRegistration } from '../../../utils/Acft/acft';
import { findUserAircraft } from '../../../Http/requests/acft';
import authStore from '../../../store/auth/authStore';
import { API_ROUTES } from '../../../Http/routes';
import modalStore from '../../../store/modal/modalStore';
import { WithStrId } from '../../../types/app/mongo';

const Table = dynamic(() => import('../../../components/Table/Table'));

const translator = new Translator({
  registration: { 'pt-BR': 'Matrícula', 'en-US': 'Registration' },
  model: { 'pt-BR': 'Modelo', 'en-US': 'Model' },
  type: { 'pt-BR': 'Tipo', 'en-US': 'Type' },
  manufacturer: { 'pt-BR': 'Fabricante', 'en-US': 'Manufacturer' },
  noData: { 'pt-BR': 'Você não possui aeronaves...', 'en-US': 'No aircraft to display...' },
  deleteAcft: { 'pt-BR': 'Remover aeronave', 'en-US': 'Remove aircraft' },
  editAcft: { 'pt-BR': 'Editar aeronave', 'en-US': 'Edit aircraft' },
});

const myAcftCols = (onEdit: () => void): ColumnDefCustom<WithStrId<IUserAcft>>[] => [
  {
    header: '',
    id: 'image',
    accessorKey: 'image',
    draggable: false,
    style: { padding: '0', textAlign: 'center' },
    accessorFn: (data) => data.registration,
    cell: (cell) => (
      <Image
        src={ACFT_IMG_URL(cell.row.original.registration)}
        alt={cell.row.original.registration}
        width={89}
        height={50}
        placeholder='empty'
      />
    ),
  },
  {
    header: translator.translate('registration'),
    id: 'registration',
    accessorKey: 'registration',
    accessorFn: (data) => data.registration,
    cell: (cell) => formatAcftRegistration(cell.row.original.registration),
    draggable: false,
  },
  {
    header: translator.translate('manufacturer'),
    id: 'manufacturer',
    accessorKey: 'manufacturer',
    accessorFn: (data) => data.manufacturer,
    draggable: false,
  },
  {
    header: translator.translate('model'),
    id: 'model',
    accessorKey: 'model',
    accessorFn: (data) => data.model,
    draggable: false,
  },
  {
    header: translator.translate('type'),
    id: 'type',
    accessorKey: 'type',
    accessorFn: (data) => data.type,
    draggable: false,
  },
  {
    header: '',
    id: 'actions',
    accessorKey: 'actions',
    draggable: false,
    cell: (cell) => (
      <div className={classes.TableIcons}>
        <button
          className={classes.TableIconBtn}
          name={`${translator.translate('deleteAcft')} ${cell.row.original.registration}`}
          onClick={() => {
            const modalStr = modalStore.getState();
            modalStr.setModalContent({
              name: 'deleteAcftModal',
              propsToChildren: { registration: cell.row.original.registration, _id: cell.row.original._id },
            });
            modalStr.setShowModal(true);
          }}
          >
          <TrashIcon width="17"/>
        </button>
        <button
          className={classes.TableIconBtn}
          name={`${translator.translate('editAcft')} ${cell.row.original.registration}`}
          onClick={() => {
            const modalStr = modalStore.getState();
            modalStr.setModalContent({
              name: 'editAcftModal',
              propsToChildren: { acft: cell.row.original, onEdit },
            });
            modalStr.setShowModal(true);
          }}
        >
          <EditIcon width="17"/>
        </button>
      </div>
    ),
  },
];

const MyAcftTable = () => {
  const isAuthenticated = authStore((state) => state.isAuthenticated);
  const userId = authStore((state) => state.user?._id);
  const queryClient = useQueryClient();

  const userAcftQuery = useQuery({
    queryKey: [API_ROUTES.aircraft.findUserAcft, userId],
    queryFn: () => (userId ? findUserAircraft({ userId }) : []),
    enabled: !!(isAuthenticated && userId),
    cacheTime: Infinity,
    staleTime: Infinity,
  });

  const invalidateAcfts = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: [API_ROUTES.aircraft.findUserAcft] });
  }, [queryClient]);

  useEffect(() => {
    invalidateAcfts();
  }, [userId, invalidateAcfts]);

  const data = isAuthenticated ? (userAcftQuery.data || []) : [];
  const cols = useMemo(() => myAcftCols(invalidateAcfts) as ColumnDefCustom<Record<string, unknown>>[], [invalidateAcfts]);

  return (
    <Table
      data={data as any}
      cols={cols}
      noData={!data.length}
      noDataMsg={translator.translate('noData')}
      loading={userAcftQuery.isLoading}
    />
  );
};

export default MyAcftTable;
