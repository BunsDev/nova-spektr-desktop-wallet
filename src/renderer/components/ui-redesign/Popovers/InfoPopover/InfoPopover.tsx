import { Menu } from '@headlessui/react';
import cn from 'classnames';
import React, { PropsWithChildren } from 'react';

import CalloutText from '@renderer/components/ui-redesign/Typography/components/CalloutText';
import TextBase from '@renderer/components/ui-redesign/Typography/common/TextBase';

type Props = {
  data: InfoSection[];
  className?: string;
  offsetPx?: number;
};

interface MenuItem {
  id: string;
  value: string | React.ReactElement;
}

export interface InfoSection {
  title: string;
  items: MenuItem[];
}

const InfoPopover = ({ data, className, children, offsetPx = 7 }: PropsWithChildren<Props>) => {
  return (
    <Menu>
      {({ open }) => (
        <div className={cn('relative', open && 'z-10')}>
          <Menu.Button>{children}</Menu.Button>
          <Menu.Items
            style={{ marginTop: offsetPx + 'px' }}
            className={cn(
              'bg-white z-10 absolute left-0 top-[100%] rounded-md',
              'shadow-popover w-max p-3 min-w-[220px]',
              className,
            )}
          >
            {data.map((section, i) => (
              <div key={i}>
                <TextBase className="text-3xs text-redesign-shade-48 uppercase pb-2" key={section.title}>
                  {section.title}
                </TextBase>

                <CalloutText key={i} className="text-3xs pb-4 flex flex-col last:p-0">
                  {section.items.map(({ value, id }) =>
                    typeof value === 'string' ? (
                      value
                    ) : (
                      <Menu.Item key={id}>
                        {/* // TODO check out why headless ui menu item type dont support className */}
                        <div className="rounded-xs text-shade-100 ui-active:bg-redesign-primary ui-active:text-white h-8 w-full">
                          {value}
                        </div>
                      </Menu.Item>
                    ),
                  )}
                </CalloutText>
                {i !== data.length - 1 && <hr className="border-redesign-shade-12 pb-3" />}
              </div>
            ))}
          </Menu.Items>
        </div>
      )}
    </Menu>
  );
};

export default InfoPopover;