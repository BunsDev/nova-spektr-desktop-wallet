import ParitySignerBgImg, { ReactComponent as ParitySignerBgSvg } from '@images/walletTypes/paritySignerBg.svg';
import WatchOnlyBgImg, { ReactComponent as WatchOnlyBgSvg } from '@images/walletTypes/watchOnlyBg.svg';
import ParitySignerImg, { ReactComponent as ParitySignerSvg } from '@images/walletTypes/paritySigner.svg';
import WatchOnlyImg, { ReactComponent as WatchOnlySvg } from '@images/walletTypes/watchOnly.svg';
import WatchOnlyOnboardingImg, {
  ReactComponent as WatchOnlyOnboardingSvg,
} from '@images/walletTypes/watchOnlyOnboardiing.svg';
import MultisigBgImg, { ReactComponent as MultisigBgSvg } from '@images/walletTypes/multisigBg.svg';
import MultisigImg, { ReactComponent as MultisigSvg } from '@images/walletTypes/multisig.svg';
import VaultImg, { ReactComponent as VaultSvg } from '@images/walletTypes/vault.svg';
import VaultOnboardingImg, { ReactComponent as VaultOnboardingSvg } from '@images/walletTypes/vaultOnboarding.svg';
import MultishardImg, { ReactComponent as MultishardSvg } from '@images/walletTypes/multishard.svg';
import NovaWalletImg, { ReactComponent as NovaWalletSvg } from '@images/walletTypes/novaWallet.svg';
import LedgerImg, { ReactComponent as LedgerSvg } from '@images/walletTypes/ledger.svg';
import LedgerOnboardingImg, { ReactComponent as LedgerOnboardingSvg } from '@images/walletTypes/ledgerOnboarding.svg';
import WalletConnectImg, { ReactComponent as WalletConnectSvg } from '@images/walletTypes/walletConnect.svg';
import WalletConnectOnboardingImg, {
  ReactComponent as WalletConnectOnboardingSvg,
} from '@images/walletTypes/walletConnectOnboarding.svg';
import NovaWalletOnboardingImg, {
  ReactComponent as NovaWalletOnboardingSvg,
} from '@images/walletTypes/novaWalletOnboarding.svg';

// TODO: Remove old wallet images after wallets and accounts cleanup finished
const WalletTypeImages = {
  paritySigner: { svg: ParitySignerSvg, img: ParitySignerImg },
  paritySignerBg: { svg: ParitySignerBgSvg, img: ParitySignerBgImg },
  watchOnly: { svg: WatchOnlySvg, img: WatchOnlyImg },
  watchOnlyOnboarding: { svg: WatchOnlyOnboardingSvg, img: WatchOnlyOnboardingImg },
  watchOnlyBg: { svg: WatchOnlyBgSvg, img: WatchOnlyBgImg },
  multisigBg: { svg: MultisigBgSvg, img: MultisigBgImg },
  multisig: { svg: MultisigSvg, img: MultisigImg },
  vault: { svg: VaultSvg, img: VaultImg },
  vaultOnboarding: { svg: VaultOnboardingSvg, img: VaultOnboardingImg },
  multishard: { svg: MultishardSvg, img: MultishardImg },
  novaWallet: { img: NovaWalletImg, svg: NovaWalletSvg },
  novaWalletOnboarding: { img: NovaWalletOnboardingImg, svg: NovaWalletOnboardingSvg },
  ledger: { img: LedgerImg, svg: LedgerSvg },
  ledgerOnboarding: { img: LedgerOnboardingImg, svg: LedgerOnboardingSvg },
  walletConnect: { img: WalletConnectImg, svg: WalletConnectSvg },
  walletConnectOnboarding: { img: WalletConnectOnboardingImg, svg: WalletConnectOnboardingSvg },
} as const;

export type WalletImages = keyof typeof WalletTypeImages;

export default WalletTypeImages;
