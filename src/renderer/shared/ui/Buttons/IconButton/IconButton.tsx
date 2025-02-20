import { ComponentProps, MouseEvent } from 'react';
import cn from 'classnames';

import { cnTw } from '@renderer/shared/lib/utils';
import Icon from '@renderer/shared/ui/Icon/Icon';
import './IconButton.css';

type IconProps = ComponentProps<typeof Icon>;

type Props = {
  ariaLabel?: string;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
} & IconProps;

export const IconButtonStyle = cn(
  'relative w-max justify-center rounded-full outline-offset-1 text-icon-default ',
  'hover:text-icon-hover hover:bg-hover active:bg-hover active:text-tab-icon-active',
);

const IconButton = ({ onClick, size = 16, className, ariaLabel, ...iconProps }: Props) => (
  <button
    type="button"
    className={cnTw('spektr-icon-button', IconButtonStyle, className)}
    aria-label={ariaLabel}
    onClick={onClick}
  >
    <Icon size={size} className="text-inherit" {...iconProps} />
  </button>
);

export default IconButton;
