import { useMemo } from 'react';

import { Wallet, MultisigAccount, Signatory } from '@renderer/shared/core';
import { BaseModal, BodyText, Tabs, FootnoteText, Icon, InfoPopover } from '@renderer/shared/ui';
import { DEFAULT_TRANSITION, RootExplorers, toAddress } from '@renderer/shared/lib/utils';
import { useToggle } from '@renderer/shared/lib/hooks';
import { AccountsList, WalletIcon, ContactItem, useAddressInfo } from '@renderer/entities/wallet';
import { chainsService } from '@renderer/entities/network';
import { useI18n } from '@renderer/app/providers';
// TODO: think about combining balances and wallets
import { WalletFiatBalance } from '@renderer/features/wallets/WalletSelect/ui/WalletFiatBalance';

type Props = {
  isOpen: boolean;
  wallet: Wallet;
  account: MultisigAccount;
  signatoryWallets: Wallet[];
  signatoryContacts: Signatory[];
  onClose: () => void;
};
export const MultisigWalletDetails = ({
  isOpen,
  wallet,
  account,
  signatoryWallets,
  signatoryContacts,
  onClose,
}: Props) => {
  const { t } = useI18n();

  const popoverItems = useAddressInfo(toAddress(account.accountId), RootExplorers);

  const [isModalOpen, toggleIsModalOpen] = useToggle(isOpen);

  const chains = useMemo(() => {
    const chains = chainsService.getChainsData();

    return chainsService.sortChains(chains);
  }, []);

  const closeWowModal = () => {
    toggleIsModalOpen();

    setTimeout(onClose, DEFAULT_TRANSITION);
  };

  return (
    <BaseModal
      closeButton
      contentClass=""
      panelClass="h-modal"
      title={t('walletDetails.common.title')}
      isOpen={isModalOpen}
      onClose={closeWowModal}
    >
      <div className="flex flex-col w-full">
        <div className="flex items-center gap-x-2 py-5 px-5 border-b border-divider">
          <WalletIcon type={wallet.type} size={32} />
          <BodyText>{wallet.name}</BodyText>
        </div>

        <Tabs
          unmount={false}
          tabsClassName="mx-4 mt-4"
          items={[
            {
              id: 1,
              title: 'Networks',
              panel: <AccountsList accountId={account.accountId} chains={chains} className="h-[365px]" />,
            },
            {
              id: 2,
              title: 'Signatories',
              panel: (
                <div className="flex flex-col">
                  <FootnoteText className="text-text-tertiary px-5">
                    Threshold {account.threshold} out of {account.signatories.length}
                  </FootnoteText>

                  <div className="overflow-y-auto mt-4 h-[357px]">
                    {signatoryWallets.length > 0 && (
                      <div className="flex flex-col gap-y-2 px-5">
                        <FootnoteText className="text-text-tertiary">Your wallets</FootnoteText>

                        <ul className="flex flex-col gap-y-2">
                          {signatoryWallets.map((wallet) => (
                            <li key={wallet.id} className="flex items-center gap-x-2 py-1.5">
                              <WalletIcon className="shrink-0" type={wallet.type} size={20} />

                              <div className="flex flex-col gap-y-1 overflow-hidden">
                                <BodyText className="text-text-secondary truncate">{wallet.name}</BodyText>
                                <WalletFiatBalance walletId={wallet.id} className="truncate" />
                              </div>

                              <InfoPopover data={popoverItems} containerClassName="ml-auto" position="right-0">
                                <Icon name="info" size={16} className="hover:text-icon-hover" />
                              </InfoPopover>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {signatoryContacts.length > 0 && (
                      <div className="flex flex-col gap-y-2 mt-4 px-5">
                        <FootnoteText className="text-text-tertiary">Contacts</FootnoteText>

                        <ul className="flex flex-col gap-y-2">
                          {signatoryContacts.map((sigmatory) => (
                            <li key={sigmatory.accountId} className="flex items-center gap-x-2 py-1.5">
                              <ContactItem
                                name={sigmatory.name}
                                accountId={sigmatory.accountId}
                                explorers={RootExplorers}
                              />
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              ),
            },
          ]}
        />
      </div>
    </BaseModal>
  );
};
