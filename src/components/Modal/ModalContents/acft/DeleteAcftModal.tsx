import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import Translator from '../../../../utils/Translate/Translator';
import GenericModal from '../GenericModal/GenericModal';
import classes from './AcftModal.module.css';
import { deleteUserAircraft } from '../../../../Http/requests/acft';
import { API_ROUTES } from '../../../../Http/routes';
import modalStore from '../../../../store/modal/modalStore';
import ModalEnterBtn from '../ModalEnterBtn';

const translator = new Translator({
  title: { 'en-US': 'Remove aircraft', 'pt-BR': 'Remover aeronave' },
  areYouSure: { 'en-US': 'Are you sure you want to remove the aircraft:', 'pt-BR': 'Tem certeza que deseja remover a aeronave:' },
  btn: { 'en-US': 'Remove', 'pt-BR': 'Remover' },
});

const DeleteAcftModal = ({ registration, _id }: {registration: string, _id: string}) => {
  const queryClient = useQueryClient();
  const closeModal = modalStore((state) => state.closeModal);
  const onDeleteClick = useCallback(async () => {
    await deleteUserAircraft({ acftId: _id });
    queryClient.invalidateQueries({ queryKey: [API_ROUTES.aircraft.findUserAcft] });
    closeModal();
  }, [_id, queryClient, closeModal]);

  return (
    <GenericModal title={translator.translate('title')}>
      <div className={classes.Wrapper}>
        <div className={classes.Text}>
          {`${translator.translate('areYouSure')} ${registration}`}
        </div>
        <div className={classes.ButtonWrapper}>
          <ModalEnterBtn btnStyleType='danger' onClick={onDeleteClick}>
            {translator.translate('btn')}
          </ModalEnterBtn>
        </div>
      </div>
    </GenericModal>
  );
};

export default DeleteAcftModal;
