import { useEffect } from 'react';

import { useI18n } from '@renderer/app/providers';
import { useToggle } from '@renderer/shared/lib/hooks';
import { DEFAULT_TRANSITION } from '@renderer/shared/lib/utils';
import { BaseModal } from '@renderer/shared/ui';
import { CreateContactForm } from '@renderer/features/contacts';

type Props = {
  isOpen?: boolean;
  onClose: () => void;
};
export const CreateContactModal = ({ isOpen = true, onClose }: Props) => {
  const { t } = useI18n();

  const [isModalOpen, toggleIsModalOpen] = useToggle(isOpen);

  useEffect(() => {
    if (isOpen && !isModalOpen) {
      toggleIsModalOpen();
    }

    if (!isOpen && isModalOpen) {
      closeContactModal();
    }
  }, [isOpen]);

  const closeContactModal = () => {
    toggleIsModalOpen();
    setTimeout(onClose, DEFAULT_TRANSITION);
  };

  return (
    <BaseModal
      closeButton
      isOpen={isModalOpen}
      title={t('addressBook.createContact.title')}
      headerClass="py-[15px] px-5"
      contentClass="px-5 pb-4 w-[440px]"
      onClose={closeContactModal}
    >
      <CreateContactForm onSubmit={closeContactModal} />
    </BaseModal>
  );
};
