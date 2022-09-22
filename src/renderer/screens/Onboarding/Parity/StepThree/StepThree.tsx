import { FormEvent, useEffect, useState } from 'react';

import useToggle from '@renderer/hooks/useToggle';
import { AccountsList } from '@renderer/components/common';
import { BaseModal, Button, Identicon, Input } from '@renderer/components/ui';
import { createMainAccount, createSimpleWallet, WalletType } from '@renderer/domain/wallet';
import { useChains } from '@renderer/services/network/chainsService';
import { Chain } from '@renderer/domain/chain';
import { useWallet } from '@renderer/services/wallet/walletService';
import { toPublicKey } from '@renderer/utils/address';
import { getShortAddress } from '@renderer/utils/strings';

type Props = {
  ss58Address: string;
  onNextStep: () => void;
  onPrevStep: () => void;
};

const StepThree = ({ ss58Address, onNextStep, onPrevStep }: Props) => {
  const { getChainsData, sortChains } = useChains();
  const { addWallet, setActiveWallet } = useWallet();
  const [isModalOpen, toggleModal] = useToggle();

  const [walletName, setWalletName] = useState('');
  const [chains, setChains] = useState<Chain[]>([]);

  useEffect(() => {
    (async () => {
      const chains = await getChainsData();
      setChains(sortChains(chains));
    })();
  }, []);

  const publicKey = toPublicKey(ss58Address) || '0x';

  const createWallet = async (event: FormEvent) => {
    event.preventDefault();

    if (!publicKey || publicKey.length === 0) return;

    const newWallet = createSimpleWallet({
      name: walletName,
      type: WalletType.PARITY,
      chainAccounts: [],
      mainAccounts: [createMainAccount({ accountId: ss58Address, publicKey })],
    });

    const walletId = await addWallet(newWallet);
    await setActiveWallet(walletId);
    onNextStep();
  };

  return (
    <div className="flex h-full flex-col gap-10 justify-center items-center pt-7.5">
      <h2 className="text-2xl leading-10 font-normal text-neutral-variant">Please choose a name for your wallet</h2>
      <div className="flex gap-10">
        <form
          id="stepForm"
          className="flex flex-col w-[480px] h-[260] p-4 bg-white shadow-surface rounded-2lg"
          onSubmit={createWallet}
        >
          <Input
            wrapperClass="flex items-center"
            label="Wallet name"
            placeholder="Wallet name"
            onChange={(e) => setWalletName(e.target.value)}
          />
          <p className="uppercase pt-2.5 pb-10 font-bold text-2xs text-shade-40">
            Name examples: Main account, My validator, Dotsama crowdloans, etc.
          </p>
          <Input
            disabled
            label="Account address"
            placeholder="Account address"
            value={getShortAddress(ss58Address, 10)}
            wrapperClass="flex items-center"
            prefixElement={<Identicon address={ss58Address} background={false} />}
            suffixElement={
              <Button variant="outline" pallet="primary" onClick={onPrevStep}>
                Rescan QR code
              </Button>
            }
          />
        </form>
        <div className="flex flex-col bg-white shadow-surface rounded-2lg w-[480px] max-h-[310px]">
          <div className="p-4 pt-3.5 pb-3.5">
            <h2 className="text-neutral font-semibold leading-5">Here are your accounts</h2>
            <p className="text-neutral-variant text-xs leading-4 font-normal">
              Following accounts have been successfully read from Parity Signer
            </p>
          </div>
          <AccountsList chains={chains} publicKey={publicKey} limit={publicKey && 4} />
          {publicKey && (
            <div>
              <Button
                weight="md"
                className="w-content p-4 mt-2 underline underline-offset-2"
                onClick={toggleModal}
                variant="text"
                pallet="primary"
              >
                Check your accounts
              </Button>
            </div>
          )}
        </div>
      </div>

      <Button
        form="stepForm"
        type="submit"
        weight="lg"
        variant="fill"
        pallet="primary"
        disabled={!publicKey || !walletName}
      >
        {!publicKey || !walletName ? 'Type a name to finish...' : 'Yes, these are my accounts'}
      </Button>

      <BaseModal
        closeButton
        className="p-4 max-w-2xl"
        title="Here are your accounts"
        description="Following accounts have been successfully read"
        isOpen={isModalOpen}
        onClose={toggleModal}
      >
        <AccountsList className="pt-6 -mx-4" chains={chains} publicKey={publicKey} />
      </BaseModal>
    </div>
  );
};

export default StepThree;