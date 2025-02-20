import { WellKnownChain } from '@substrate/connect';

import { Chains } from './common/constants';
import { IChainSpecService } from './common/types';
import type { ChainId } from '@renderer/shared/core';

const KnownChains: Record<ChainId, WellKnownChain> = {
  [Chains.POLKADOT]: WellKnownChain.polkadot,
  [Chains.KUSAMA]: WellKnownChain.ksmcc3,
};

export const useChainSpec = (): IChainSpecService => {
  const getLightClientChains = (): ChainId[] => {
    return Object.keys(KnownChains) as ChainId[];
  };

  const getKnownChain = (chainId: ChainId): WellKnownChain | undefined => {
    return KnownChains[chainId];
  };

  return {
    getLightClientChains,
    getKnownChain,
  };
};
