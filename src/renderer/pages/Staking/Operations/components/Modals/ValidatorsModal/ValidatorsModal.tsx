import { BaseModal } from '@renderer/shared/ui';
import { useI18n } from '@renderer/app/providers';
import { Validator } from '@renderer/shared/core/types/validator';
import { getComposedIdentity, cnTw } from '@renderer/shared/lib/utils';
import { AddressWithExplorers } from '@renderer/entities/wallet';
import type { Explorer } from '@renderer/shared/core';

type Props = {
  isOpen: boolean;
  validators: Validator[];
  explorers?: Explorer[];
  onClose: () => void;
};

const ValidatorsModal = ({ isOpen, validators, explorers, onClose }: Props) => {
  const { t } = useI18n();

  return (
    <BaseModal
      closeButton
      contentClass="pb-3 px-3 pt-2"
      panelClass="w-[480px]"
      title={t('staking.confirmation.validatorsTitle')}
      isOpen={isOpen}
      onClose={onClose}
    >
      <ul className={cnTw('flex flex-col gap-y-3', validators.length > 7 && 'max-h-[388px] overflow-y-auto')}>
        {validators.map((validator) => (
          <li key={validator.address}>
            <AddressWithExplorers
              className="gap-x-1"
              name={getComposedIdentity(validator.identity)}
              addressFont="text-body text-text-secondary"
              type="full"
              size={16}
              address={validator.address}
              explorers={explorers}
            />
          </li>
        ))}
      </ul>
    </BaseModal>
  );
};

export default ValidatorsModal;
