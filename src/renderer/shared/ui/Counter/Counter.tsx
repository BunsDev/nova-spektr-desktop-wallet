import { PropsWithChildren } from 'react';

import { Variant } from './common/types';
import { BadgeStyles } from './common/constants';
import { CaptionText } from '@renderer/shared/ui';
import { cnTw } from '@renderer/shared/lib/utils';

type Props = {
  variant: Variant;
  className?: string;
};

const Counter = ({ variant, className, children }: PropsWithChildren<Props>) => (
  <div className={cnTw('flex items-center justify-center rounded-[30px] px-1.5 h-4', BadgeStyles[variant], className)}>
    {['string', 'number'].includes(typeof children) ? (
      <CaptionText className="text-white">{children}</CaptionText>
    ) : (
      children
    )}
  </div>
);

export default Counter;
