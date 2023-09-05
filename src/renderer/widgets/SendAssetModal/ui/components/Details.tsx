import { useI18n } from '@renderer/app/providers';
import { Account, MultisigAccount, AddressWithExplorers } from '@renderer/entities/account';
import { ExtendedChain } from '@renderer/entities/network';
import { Transaction } from '@renderer/entities/transaction';
import { Wallet } from '@renderer/entities/wallet';
import { DetailRow } from '@renderer/shared/ui';

const AddressStyle = 'text-footnote text-inherit';

type Props = {
  transaction: Transaction;
  account?: Account | MultisigAccount;
  signatory?: Account;
  wallet?: Wallet;
  connection?: ExtendedChain;
  withAdvanced?: boolean;
};

const Details = ({ transaction, wallet, account, signatory, connection, withAdvanced = true }: Props) => {
  const { t } = useI18n();

  const addressPrefix = connection?.addressPrefix;
  const explorers = connection?.explorers;

  const valueClass = withAdvanced ? 'text-text-secondary' : 'text-text-primary';

  return (
    <dl className="flex flex-col gap-y-4 w-full">
      {wallet && account && (
        <DetailRow label={t('operation.details.wallet')} className={valueClass}>
          <AddressWithExplorers
            explorers={explorers}
            addressFont={AddressStyle}
            accountId={account.accountId}
            addressPrefix={addressPrefix}
            name={wallet.name}
          />
        </DetailRow>
      )}

      {account && (
        <DetailRow label={t('operation.details.sender')} className={valueClass}>
          <AddressWithExplorers
            type="short"
            explorers={explorers}
            addressFont={AddressStyle}
            accountId={account.accountId}
            addressPrefix={addressPrefix}
          />
        </DetailRow>
      )}

      {signatory && (
        <DetailRow label={t('transfer.signatoryLabel')} className={valueClass}>
          <AddressWithExplorers
            explorers={explorers}
            addressFont={AddressStyle}
            accountId={signatory.accountId}
            addressPrefix={addressPrefix}
            name={signatory.name}
          />
        </DetailRow>
      )}

      {transaction?.args.dest && (
        <DetailRow label={t('operation.details.recipient')} className={valueClass}>
          <AddressWithExplorers
            type="short"
            explorers={explorers}
            addressFont={AddressStyle}
            address={transaction.args.dest}
            addressPrefix={addressPrefix}
          />
        </DetailRow>
      )}
    </dl>
  );
};

export default Details;