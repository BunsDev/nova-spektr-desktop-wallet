import { DetailedHTMLProps, LabelHTMLAttributes } from 'react';

import { cnTw } from '@renderer/shared/lib/utils';

// eslint-plugin-react has problems with DetailedHTMLProps so this workaround needed
// https://github.com/jsx-eslint/eslint-plugin-react/issues/3284
interface LabelProps extends DetailedHTMLProps<LabelHTMLAttributes<HTMLLabelElement>, HTMLLabelElement> {}

export const LabelText = ({ className = 'text-text-primary', ...props }: LabelProps) => (
  <label className={cnTw('text-footnote', className)} {...props} />
);
