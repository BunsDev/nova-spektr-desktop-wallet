import type { Meta, StoryObj } from '@storybook/react';
import noop from 'lodash/noop';

import { withVersion } from '@renderer/shared/lib/utils/storybook';
import { Identicon } from '../../Identicon/Identicon';
import { MultiSelect } from './MultiSelect';

const meta: Meta<typeof MultiSelect> = {
  title: 'Design system/Inputs/MultiSelect',
  component: MultiSelect,
  decorators: [withVersion('1.0.0')],
};

export default meta;
type Story = StoryObj<typeof MultiSelect>;

const data = [
  { value: 'Durward Reynolds', address: '13mK8AssyPekT5cFuYQ7ijKNXcjHPq8Gnx6TxF5eFCAwoLQ' },
  { value: 'Kenton Towne', address: '1A2ATy1FEu5yQ9ZzghPLsRckPQ7XLmq5MJQYcTvGnxGvCho' },
  { value: 'Therese Wunsch', address: '1bAVKRsNUbq1Qmvj7Cemkncjo17WgyWAusCFZQdUfeHSTYj' },
];

const options = data.map((d, index) => ({
  id: index.toString(),
  value: d.value,
  element: d.value,
}));

const customOptions = data.map((d, index) => ({
  id: index.toString(),
  value: d,
  element: (
    <div className="flex items-center gap-x-2.5">
      <Identicon address={d.address} background={false} size={20} canCopy={false} />
      <p>{d.value}</p>
    </div>
  ),
}));

export const Playground: Story = {
  args: {
    placeholder: 'Select an option',
    options,
    onChange: () => {},
  },
};

export const Selected: Story = {
  render: () => (
    <MultiSelect
      placeholder="Select an option"
      selectedIds={[options[0].id, options[1].id]}
      options={options}
      onChange={noop}
    />
  ),
};

export const WithLabel: Story = {
  render: () => <MultiSelect placeholder="Select an option" label="Payout account" options={options} onChange={noop} />,
};

export const Custom: Story = {
  render: () => (
    <MultiSelect
      placeholder="Select an option"
      label="Payout account"
      selectedIds={[customOptions[2].id]}
      options={customOptions}
      onChange={noop}
    />
  ),
};
