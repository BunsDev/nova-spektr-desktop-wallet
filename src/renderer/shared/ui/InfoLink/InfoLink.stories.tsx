import { ComponentStory, ComponentMeta } from '@storybook/react';

import InfoLink from './InfoLink';

export default {
  title: 'Redesign/Info Link',
  component: InfoLink,
  parameters: { actions: { argTypesRegex: '^on.*' } },
} as ComponentMeta<typeof InfoLink>;

const Template: ComponentStory<typeof InfoLink> = (args) => <InfoLink {...args} />;

export const WithIcon = Template.bind({});
WithIcon.args = {
  url: 'https://test.com',
  children: 'This is my link',
  showIcon: true,
  iconName: 'globe',
};

export const NoIcon = Template.bind({});
NoIcon.args = {
  url: 'https://test.com',
  children: 'This is my link',
};
