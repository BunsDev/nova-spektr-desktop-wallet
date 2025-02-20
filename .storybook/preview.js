import '@renderer/index.css';
import '@renderer/theme/default.css';

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
      // disabled: /Boolean$/,
    },
  },
};
