import { ComponentPropsWithoutRef, forwardRef } from 'react';

import { cnTw } from '@renderer/shared/lib/utils';
import { HTMLTextAreaProps } from '../common/types';
import { CommonInputStyles, CommonInputStylesTheme } from '../common/styles';
import { Theme } from '../../Dropdowns/common/types';

interface Props extends Pick<ComponentPropsWithoutRef<'textarea'>, HTMLTextAreaProps> {
  invalid?: boolean;
  theme?: Theme;
  onChange?: (value: string) => void;
}

const InputArea = forwardRef<HTMLTextAreaElement, Props>(
  ({ className, invalid, theme = 'light', onChange, ...props }, ref) => (
    <textarea
      className={cnTw(
        'resize-none text-footnote flex-1',
        CommonInputStyles,
        CommonInputStylesTheme[theme],
        'focus-within:enabled:border-active-container-border',
        invalid && 'border-filter-border-negative',
        'hover:enabled:shadow-card-shadow',
        'disabled:bg-input-background-disabled disabled:text-text-tertiary disabled:placeholder:text-text-tertiary',
        'flex-1 border-filter-border',
        className,
      )}
      ref={ref}
      onChange={(event) => onChange?.(event.target.value)}
      {...props}
    />
  ),
);

export default InputArea;
