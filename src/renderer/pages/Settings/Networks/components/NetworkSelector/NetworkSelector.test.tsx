import { act, render, screen } from '@testing-library/react';
import noop from 'lodash/noop';

import { ConnectionStatus, ConnectionType } from '@renderer/shared/core';
import { ExtendedChain } from '@renderer/entities/network';
import { NetworkSelector } from './NetworkSelector';
import { useScrollTo } from '@renderer/shared/lib/hooks';

jest.mock('@renderer/app/providers', () => ({
  useI18n: jest.fn().mockReturnValue({
    t: (key: string) => key,
  }),
}));

jest.mock('@renderer/shared/lib/hooks');

describe('pages/Settings/Networks/NetworkSelector', () => {
  beforeAll(() => {
    (useScrollTo as jest.Mock).mockReturnValue([{ current: {} }, noop]);
  });

  const defaultNetwork: ExtendedChain = {
    addressPrefix: 0,
    assets: [],
    chainId: '0x123',
    icon: '',
    name: '',
    nodes: [
      { url: 'wss://westend-rpc.polkadot.io', name: 'Parity node' },
      { url: 'wss://westend.api.onfinality.io/public-ws', name: 'OnFinality node' },
    ],
    connection: {
      chainId: '0x123',
      canUseLightClient: false,
      connectionStatus: ConnectionStatus.NONE,
      connectionType: ConnectionType.DISABLED,
    },
  };

  const lightClientNetworks: ExtendedChain = {
    ...defaultNetwork,
    connection: {
      ...defaultNetwork.connection,
      canUseLightClient: true,
    },
  };

  const connectedNetwork: ExtendedChain = {
    ...defaultNetwork,
    connection: {
      ...defaultNetwork.connection,
      connectionStatus: ConnectionStatus.CONNECTED,
      connectionType: ConnectionType.RPC_NODE,
      activeNode: { url: 'wss://westend-rpc.polkadot.io', name: 'Parity node' },
    },
  };

  const withCustomNetwork: ExtendedChain = {
    ...connectedNetwork,
    nodes: [{ url: 'wss://westend.api.onfinality.io/public-ws', name: 'OnFinality node' }],
    connection: {
      ...connectedNetwork.connection,
      activeNode: { url: 'wss://westend.api.onfinality.io/public-ws', name: 'OnFinality node' },
      customNodes: [{ url: 'wss://westend-rpc.polkadot.io', name: 'My custom node' }],
    },
  };

  const defaultProps = {
    networkItem: defaultNetwork,
    onDisconnect: noop,
    onConnect: noop,
    onRemoveCustomNode: noop,
    onChangeCustomNode: noop,
  };

  test('should render component', () => {
    render(<NetworkSelector {...defaultProps} />);

    const text = screen.getByText('settings.networks.selectorDisableNode');
    expect(text).toBeInTheDocument();
  });

  test('should render list of nodes', async () => {
    render(<NetworkSelector {...defaultProps} networkItem={lightClientNetworks} />);

    const button = screen.getByRole('button');
    await act(async () => button.click());

    const nodes = screen.getAllByRole('option');
    expect(nodes).toHaveLength(6);
  });

  test('should not show light client option', async () => {
    render(<NetworkSelector {...defaultProps} />);

    const button = screen.getByRole('button');
    await act(async () => button.click());

    const lightClient = screen.queryByText('settings.networks.lightClientLabel');
    expect(lightClient).not.toBeInTheDocument();
  });

  test('should call edit and delete for custom node', async () => {
    const changeSpy = jest.fn();
    const removeSpy = jest.fn();
    render(
      <NetworkSelector
        {...defaultProps}
        networkItem={withCustomNetwork}
        onChangeCustomNode={changeSpy}
        onRemoveCustomNode={removeSpy}
      />,
    );

    const selectorBtn = screen.getByRole('button');
    await act(async () => selectorBtn.click());

    const edit = screen.getByRole('button', { name: 'edit.svg' });
    await act(async () => edit.click());
    expect(changeSpy).toBeCalled();

    const remove = screen.getByRole('button', { name: 'delete.svg' });
    await act(async () => remove.click());
    expect(removeSpy).toBeCalled();
  });
});
