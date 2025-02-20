import { render, screen } from '@testing-library/react';

import { XcmChains } from './XcmChains';

jest.mock('@renderer/entities/walletConnect', () => ({
  walletConnectModel: { events: {} },
  DEFAULT_POLKADOT_METHODS: {},
  getWalletConnectChains: jest.fn(),
}));
jest.mock('@renderer/pages/Onboarding/WalletConnect/model/wc-onboarding-model', () => ({
  wcOnboardingModel: { events: {} },
}));

jest.mock('../ChainTitle/ChainTitle', () => ({
  ChainTitle: ({ chainId }: any) => <span>{chainId}</span>,
}));

describe('ui/XcmChains', () => {
  test('should render component', async () => {
    render(<XcmChains chainIdFrom="0x111" chainIdTo="0x111" />);

    const chains = screen.getAllByText('0x111');
    expect(chains).toHaveLength(2);
  });

  test('should render single chain', async () => {
    render(<XcmChains chainIdFrom="0x111" />);

    const chains = screen.getByText('0x111');
    expect(chains).toBeInTheDocument();
  });
});
