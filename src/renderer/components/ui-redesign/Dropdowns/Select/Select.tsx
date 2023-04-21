import { Listbox, Transition } from '@headlessui/react';
import cn from 'classnames';
import { Fragment, useId } from 'react';

import { Icon } from '@renderer/components/ui';
import { DropdownOption, DropdownResult, Position } from '../common/types';
import CommonInputStyles from '@renderer/components/ui-redesign/Inputs/common/styles';
import { FootnoteText, LabelText } from '@renderer/components/ui-redesign';
import { OptionsContainerStyle, OptionStyle, ViewClass } from '../common/constants';

type Props = {
  className?: string;
  placeholder: string;
  label?: string;
  disabled?: boolean;
  invalid?: boolean;
  selectedId?: DropdownOption['id'];
  options: DropdownOption[];
  position?: Position;
  onChange: (data: DropdownResult) => void;
};

const Select = ({
  className,
  placeholder,
  label,
  disabled,
  invalid,
  selectedId,
  options,
  onChange,
  position = 'down',
}: Props) => {
  const selectedOption = options.find((option) => option.id === selectedId);
  const id = useId();

  const selectElement = (
    <Listbox disabled={disabled} value={selectedOption || {}} onChange={onChange}>
      {({ open }) => (
        <div className={cn('relative', className)}>
          <Listbox.Button
            id={id}
            className={cn(
              open && 'border-active-container-border',
              !open && !invalid && 'border-filter-border',
              invalid && 'border-filter-border-negative',
              'disabled:bg-input-background-disabled disabled:text-text-tertiary enabled:hover:shadow-card-shadow',
              CommonInputStyles,
              'w-full flex items-center gap-x-2 justify-between pr-2',
            )}
          >
            {selectedOption ? (
              typeof selectedOption.element === 'string' ? (
                <FootnoteText as="span" className="truncate">
                  {selectedOption.element}
                </FootnoteText>
              ) : (
                selectedOption.element
              )
            ) : (
              <FootnoteText as="span" className="text-text-secondary">
                {placeholder}
              </FootnoteText>
            )}
            <Icon name="down" size={16} className="text-icon-default" />
          </Listbox.Button>

          <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
            <Listbox.Options className={cn(OptionsContainerStyle, position !== 'auto' && ViewClass[position])}>
              {options.map(({ id, value, element }) => (
                <Listbox.Option key={id} className={OptionStyle} value={{ id, value: value || id }}>
                  {typeof element === 'string' ? <FootnoteText>{element}</FootnoteText> : element}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      )}
    </Listbox>
  );

  if (!label) {
    return selectElement;
  }

  return (
    <div className="flex flex-col gap-2">
      <LabelText className="cursor-pointer" htmlFor={id}>
        {label}
      </LabelText>
      {selectElement}
    </div>
  );
};

export default Select;