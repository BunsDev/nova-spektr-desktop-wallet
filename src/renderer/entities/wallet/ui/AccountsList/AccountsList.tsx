import { cnTw } from '@renderer/shared/lib/utils';
import { ChainTitle } from '@renderer/entities/chain';
import { AddressWithExplorers } from '@renderer/entities/wallet';
import { useI18n } from '@renderer/app/providers';
import { FootnoteText } from '@renderer/shared/ui';
import type { AccountId, Chain } from '@renderer/shared/core';

type Props = {
  accountId: AccountId;
  chains: Chain[];
  className?: string;
};

export const AccountsList = ({ accountId, chains, className }: Props) => {
  const { t } = useI18n();

  return (
    <>
      <div className="flex mx-3 py-4">
        <FootnoteText className="w-[214px] text-text-tertiary">
          {t('accountList.networksColumn', { chains: chains.length })}
        </FootnoteText>
        <FootnoteText className="w-[214px] text-text-tertiary">{t('accountList.addressColumn')}</FootnoteText>
      </div>

      <ul className={cnTw('flex flex-col z-0 divide-y divide-divider overflow-y-auto overflow-x-hidden', className)}>
        {chains.map((chain) => {
          const { chainId, addressPrefix, explorers } = chain;

          return (
            <li key={chainId} className="flex items-center mx-3 py-4">
              <ChainTitle className="w-[214px]" fontClass="text-text-primary" chain={chain} />

              <div className="w-[214]">
                <AddressWithExplorers
                  type="adaptive"
                  position="right-0"
                  className="w-[160px]"
                  accountId={accountId}
                  addressPrefix={addressPrefix}
                  explorers={explorers}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
};
