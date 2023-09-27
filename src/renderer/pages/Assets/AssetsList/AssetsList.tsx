import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useUnit } from 'effector-react';

import { BodyText, Button, Icon, SmallTitleText } from '@renderer/shared/ui';
import { useI18n, useNetworkContext } from '@renderer/app/providers';
import { useBalance } from '@renderer/entities/asset';
import { Chain } from '@renderer/entities/chain';
import { ConnectionType } from '@renderer/domain/connection';
import { SigningType } from '@renderer/domain/shared-kernel';
import { useToggle } from '@renderer/shared/lib/hooks';
import { chainsService } from '@renderer/entities/network';
import { useSettingsStorage } from '@renderer/entities/settings';
import { Account, isMultisig, useAccount } from '@renderer/entities/account';
import { AssetsFilters, NetworkAssets, SelectShardModal } from './components';
import { Header } from '@renderer/components/common';
import { currencyModel, priceProviderModel } from '@renderer/entities/price';

export const AssetsList = () => {
  const { t } = useI18n();
  const { connections } = useNetworkContext();
  const { getActiveAccounts } = useAccount();
  const { getLiveBalances } = useBalance();
  const { setHideZeroBalance, getHideZeroBalance } = useSettingsStorage();

  const assetsPrices = useUnit(priceProviderModel.$assetsPrices);
  const fiatFlag = useUnit(priceProviderModel.$fiatFlag);
  const currency = useUnit(currencyModel.$activeCurrency);

  const [isSelectShardsOpen, toggleSelectShardsOpen] = useToggle();

  const [query, setQuery] = useState('');
  const [sortedChains, setSortedChains] = useState<Chain[]>([]);

  const [activeAccounts, setActiveAccounts] = useState<Account[]>([]);
  const [hideZeroBalance, setHideZeroBalanceState] = useState(getHideZeroBalance());

  const activeAccountsFromWallet = getActiveAccounts();
  const balances = getLiveBalances(activeAccounts.map((a) => a.accountId));

  const isMultishard = activeAccountsFromWallet.length > 1;

  const firstActiveAccount = activeAccountsFromWallet.length > 0 && activeAccountsFromWallet[0].accountId;
  const activeWallet = activeAccountsFromWallet.length > 0 && activeAccountsFromWallet[0].walletId;

  useEffect(() => {
    updateAccounts(activeAccountsFromWallet);
  }, [firstActiveAccount, activeWallet]);

  const updateAccounts = (accounts: Account[]) => {
    setActiveAccounts(accounts.length ? accounts : []);
  };

  useEffect(() => {
    const filteredChains = Object.values(connections).filter((c) => {
      const isDisabled = c.connection.connectionType === ConnectionType.DISABLED;
      const hasMultisigAccount = activeAccounts.some(isMultisig);
      const hasMultiPallet = !hasMultisigAccount || c.connection.hasMultisigPallet !== false;

      return !isDisabled && hasMultiPallet;
    });

    setSortedChains(
      chainsService.sortChainsByBalance(
        filteredChains,
        balances,
        assetsPrices,
        fiatFlag ? currency?.coingeckoId : undefined,
      ),
    );
  }, [balances]);

  const updateHideZeroBalance = (value: boolean) => {
    setHideZeroBalance(value);
    setHideZeroBalanceState(value);
  };

  const searchSymbolOnly = sortedChains.some((chain) => {
    return chain.assets.some((a) => a.symbol.toLowerCase() === query.toLowerCase());
  });

  const checkCanMakeActions = (): boolean => {
    return activeAccounts.some((account) =>
      [SigningType.MULTISIG, SigningType.PARITY_SIGNER].includes(account.signingType),
    );
  };

  const handleShardSelect = (selectedAccounts?: Account[]) => {
    toggleSelectShardsOpen();

    if (Array.isArray(selectedAccounts)) {
      updateAccounts(selectedAccounts);
    }
  };

  return (
    <>
      <section className="h-full flex flex-col items-start relative">
        <Header title={t('balances.title')} titleClass="py-[3px]" headerClass="pt-4 pb-[15px]">
          <AssetsFilters
            searchQuery={query}
            hideZeroBalances={hideZeroBalance}
            onSearchChange={setQuery}
            onZeroBalancesChange={updateHideZeroBalance}
          />
        </Header>

        {isMultishard && (
          <div className="w-[546px] mx-auto flex items-center mt-4">
            <SmallTitleText as="h3">{t('balances.shardsTitle')} </SmallTitleText>
            <Button
              variant="text"
              suffixElement={<Icon name="edit" size={16} className="text-icon-accent" />}
              className="outline-offset-reduced"
              onClick={toggleSelectShardsOpen}
            >
              {activeAccounts.length} {t('balances.shards')}
            </Button>
          </div>
        )}

        <div className="flex flex-col gap-y-4 w-full h-full overflow-y-scroll">
          {activeAccounts.length > 0 && (
            <ul className="flex flex-col gap-y-4 items-center w-full py-4">
              {sortedChains.map((chain) => (
                <NetworkAssets
                  key={chain.chainId}
                  hideZeroBalance={hideZeroBalance}
                  searchSymbolOnly={searchSymbolOnly}
                  query={query.toLowerCase()}
                  chain={chain}
                  accounts={activeAccounts}
                  canMakeActions={checkCanMakeActions()}
                />
              ))}

              <div className="hidden only:flex flex-col items-center justify-center gap-y-8 w-full h-full">
                <Icon as="img" name="emptyList" alt={t('balances.emptyStateLabel')} size={178} />
                <BodyText align="center" className="text-text-tertiary">
                  {t('balances.emptyStateLabel')}
                  <br />
                  {t('balances.emptyStateDescription')}
                </BodyText>
              </div>
            </ul>
          )}
        </div>
      </section>

      {isMultishard && (
        <SelectShardModal
          accounts={activeAccountsFromWallet}
          activeAccounts={activeAccounts}
          isOpen={isSelectShardsOpen}
          onClose={handleShardSelect}
        />
      )}

      <Outlet />
    </>
  );
};
