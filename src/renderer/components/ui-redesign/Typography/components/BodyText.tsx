import cn from 'classnames';

import { TypographyProps } from '@renderer/components/ui-redesign/Typography/common/types';
import TextBase from '@renderer/components/ui-redesign/Typography/common/TextBase';

const BodyText = ({ className, ...props }: TypographyProps) => (
  <TextBase className={cn('text-body', className)} {...props} />
);

export default BodyText;