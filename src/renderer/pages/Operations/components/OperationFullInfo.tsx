import { useEffect, useState } from 'react';
import { useUnit } from 'effector-react';

import { MultisigEvent, SigningStatus } from '@renderer/entities/transaction';
import { Icon, Button, CaptionText, InfoLink, SmallTitleText } from '@renderer/shared/ui';
import Details from '@renderer/pages/Operations/components/Details';
import RejectTx from '@renderer/pages/Operations/components/modals/RejectTx';
import ApproveTx from '@renderer/pages/Operations/components/modals/ApproveTx';
import { getMultisigExtrinsicLink, getSignatoryName } from '@renderer/pages/Operations/common/utils';
import { SignatoryCard } from '@renderer/entities/signatory';
import CallDataModal from '@renderer/pages/Operations/components/modals/CallDataModal';
import { nonNullable } from '@renderer/shared/lib/utils';
import { useMatrix, useNetworkContext, useI18n, useMultisigChainContext } from '@renderer/app/providers';
import { useMultisigTx, useMultisigEvent } from '@renderer/entities/multisig';
import { useToggle } from '@renderer/shared/lib/hooks';
import { MultisigTransactionDS } from '@renderer/shared/api/storage';
import { contactModel } from '@renderer/entities/contact';
import type { AccountId, CallData, ChainId, MultisigAccount, Signatory } from '@renderer/shared/core';
import LogModal from './Log';
import { walletModel } from '@renderer/entities/wallet';

type Props = {
  tx: MultisigTransactionDS;
  account?: MultisigAccount;
};

const OperationFullInfo = ({ tx, account }: Props) => {
  const { t } = useI18n();
  const contacts = useUnit(contactModel.$contacts);
  const accounts = useUnit(walletModel.$accounts);

  const { callData, signatories, accountId, chainId, callHash, blockCreated, indexCreated } = tx;

  const { matrix } = useMatrix();
  const { getLiveTxEvents } = useMultisigEvent({});

  const events = getLiveTxEvents(accountId, chainId, callHash, blockCreated, indexCreated);

  const { addTask } = useMultisigChainContext();
  const { updateCallData } = useMultisigTx({ addTask });
  const { connections } = useNetworkContext();
  const connection = connections[tx?.chainId as ChainId];
  const approvals = events.filter((e) => e.status === 'SIGNED');
  const cancellation = events.filter((e) => e.status === 'CANCELLED');

  const [isCallDataModalOpen, toggleCallDataModal] = useToggle();
  const [isLogModalOpen, toggleLogModal] = useToggle();

  const [signatoriesList, setSignatories] = useState<Signatory[]>([]);
  const explorerLink = getMultisigExtrinsicLink(tx.callHash, tx.indexCreated, tx.blockCreated, connection?.explorers);

  const setupCallData = async (callData: CallData) => {
    const api = connection.api;

    if (!api || !tx) return;

    updateCallData(api, tx, callData as CallData);

    if (!account?.matrixRoomId) return;

    matrix.sendUpdate(account?.matrixRoomId, {
      senderAccountId: tx.depositor || '0x00',
      chainId: tx.chainId,
      callHash: tx.callHash,
      callData,
      callTimepoint: {
        index: tx.indexCreated || 0,
        height: tx.blockCreated || 0,
      },
    });
  };

  useEffect(() => {
    const tempCancellation = [];

    if (cancellation.length) {
      const cancelSignatories = signatories.find((s) => s.accountId === cancellation[0].accountId);
      cancelSignatories && tempCancellation.push(cancelSignatories);
    }

    const tempApprovals = approvals
      .sort((a: MultisigEvent, b: MultisigEvent) => (a.eventBlock || 0) - (b.eventBlock || 0))
      .map((a) => signatories.find((s) => s.accountId === a.accountId))
      .filter(nonNullable);

    setSignatories([...new Set<Signatory>([...tempCancellation, ...tempApprovals, ...signatories])]);
  }, [signatories.length, approvals.length, cancellation.length]);

  const getSignatoryStatus = (signatory: AccountId): SigningStatus | undefined => {
    const cancelEvent = events.find((e) => e.status === 'CANCELLED' && e.accountId === signatory);
    if (cancelEvent) {
      return cancelEvent.status;
    }
    const signedEvent = events.find((e) => e.status === 'SIGNED' && e.accountId === signatory);

    return signedEvent?.status;
  };

  return (
    <div className="flex flex-1">
      <div className="flex flex-col w-[416px] p-4 border-r border-r-divider">
        <div className="flex justify-between items-center mb-4 py-1">
          <SmallTitleText className="mr-auto">{t('operation.detailsTitle')}</SmallTitleText>

          {(!callData || explorerLink) && (
            <div className="flex items-center">
              {!callData && (
                <Button pallet="primary" variant="text" size="sm" onClick={toggleCallDataModal}>
                  {t('operation.addCallDataButton')}
                </Button>
              )}
              {explorerLink && (
                <InfoLink url={explorerLink} className="flex items-center gap-x-0.5 ml-0.5 text-footnote">
                  <span>{t('operation.explorerLink')}</span>
                  <Icon name="right" size={16} />
                </InfoLink>
              )}
            </div>
          )}
        </div>

        <Details tx={tx} account={account} connection={connection} />

        <div className="flex items-center mt-3">
          {account && connection && <RejectTx tx={tx} account={account} connection={connection} />}
          {account && connection && <ApproveTx tx={tx} account={account} connection={connection} />}
        </div>
      </div>

      <div className="flex flex-col w-[320px] px-2 py-4">
        <div className="flex justify-between items-center mb-3">
          <SmallTitleText>{t('operation.signatoriesTitle')}</SmallTitleText>

          <Button
            pallet="secondary"
            variant="fill"
            size="sm"
            prefixElement={<Icon name="chatRedesign" size={16} />}
            suffixElement={
              <CaptionText className="!text-white bg-chip-icon rounded-full pt-[1px] pb-[2px] px-1.5">
                {events.length}
              </CaptionText>
            }
            onClick={toggleLogModal}
          >
            {t('operation.logButton')}
          </Button>
        </div>

        <ul className="flex flex-col gap-y-0.5">
          {signatoriesList.map(({ accountId, matrixId }) => (
            <li key={accountId}>
              <SignatoryCard
                addressPrefix={connection.addressPrefix}
                accountId={accountId}
                type="short"
                matrixId={matrixId}
                explorers={connection?.explorers}
                name={getSignatoryName(accountId, tx.signatories, contacts, accounts, connection.addressPrefix)}
                status={getSignatoryStatus(accountId)}
              />
            </li>
          ))}
        </ul>
      </div>

      <CallDataModal isOpen={isCallDataModalOpen} tx={tx} onSubmit={setupCallData} onClose={toggleCallDataModal} />
      <LogModal
        isOpen={isLogModalOpen}
        tx={tx}
        account={account}
        connection={connection}
        accounts={accounts}
        contacts={contacts}
        onClose={toggleLogModal}
      />
    </div>
  );
};

export default OperationFullInfo;
