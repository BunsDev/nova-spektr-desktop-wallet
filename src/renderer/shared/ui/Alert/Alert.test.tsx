import { render, screen } from '@testing-library/react';
import noop from 'lodash/noop';

import Alert from './Alert';

jest.mock('@renderer/entities/walletConnect', () => ({
  walletConnectModel: { events: {} },
  DEFAULT_POLKADOT_METHODS: {},
  getWalletConnectChains: jest.fn(),
}));
jest.mock('@renderer/pages/Onboarding/WalletConnect/model/wc-onboarding-model', () => ({
  wcOnboardingModel: { events: {} },
}));

describe('ui/Alert', () => {
  test('should render title and items', () => {
    render(
      <Alert title="My title">
        <Alert.Item>item one</Alert.Item>
        <Alert.Item>item two</Alert.Item>
        <Alert.Item>item three</Alert.Item>
      </Alert>,
    );

    const title = screen.getByText('My title');
    const items = screen.getAllByRole('listitem');
    expect(title).toBeInTheDocument();
    expect(items).toHaveLength(3);
  });

  test('should render close button', () => {
    render(
      <Alert title="My title" onClose={noop}>
        <Alert.Item>item one</Alert.Item>
      </Alert>,
    );

    const closeButton = screen.getByRole('button');
    expect(closeButton).toBeInTheDocument();
  });
});
