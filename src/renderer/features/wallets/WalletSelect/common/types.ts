import type { Chain, Wallet, Account, ChainId, BaseAccount, ChainAccount } from '@renderer/shared/core';

export type ChainWithAccounts = Chain & { accounts: ChainAccount[] };
export type RootAccount = BaseAccount & { chains: ChainWithAccounts[]; amount: number };
export type MultishardStructure = { rootAccounts: RootAccount[]; amount: number };
export type MultishardWallet = Wallet & MultishardStructure;

type Selectable<T> = T & { isSelected: boolean };
export type SelectableAccount = Selectable<ChainAccount>;
export type SelectableChain = Selectable<Chain & { accounts: SelectableAccount[]; selectedAmount: number }>;
export type SelectableRoot = Selectable<BaseAccount & { chains: SelectableChain[]; selectedAmount: number }>;
export type SelectableShards = { rootAccounts: SelectableRoot[]; amount: number };

export type WalletGroupItem = Account | MultishardWallet;
export type ChainsRecord = Record<ChainId, Chain>;
