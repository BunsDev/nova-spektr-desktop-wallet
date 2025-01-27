import { render, screen } from '@testing-library/react';

import { Transaction, TransactionType } from '@renderer/entities/transaction';
import { TEST_ADDRESS, TEST_CHAIN_ID } from '@renderer/shared/lib/utils';
import { TransactionTitle } from './TransactionTitle';

jest.mock('@renderer/entities/walletConnect', () => ({
  walletConnectModel: { events: {} },
  DEFAULT_POLKADOT_METHODS: {},
  getWalletConnectChains: jest.fn(),
}));
jest.mock('@renderer/pages/Onboarding/WalletConnect/model/wc-onboarding-model', () => ({
  wcOnboardingModel: { events: {} },
}));

jest.mock('@renderer/app/providers', () => ({
  useI18n: jest.fn().mockReturnValue({
    t: (key: string) => key,
  }),
}));

const transaction = {
  type: TransactionType.TRANSFER,
  address: TEST_ADDRESS,
  chainId: TEST_CHAIN_ID,
  args: {
    dest: TEST_ADDRESS,
    value: '100000000000',
  },
} as Transaction;

describe('pages/Operations/components/TransactionTitle', () => {
  test('should render component', () => {
    render(<TransactionTitle tx={transaction} />);

    const title = screen.getByText('operations.titles.transfer');
    expect(title).toBeInTheDocument();
  });
});
