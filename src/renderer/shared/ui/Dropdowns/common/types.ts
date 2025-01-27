import { ReactNode } from 'react';

export type Position = 'up' | 'down' | 'auto';
export type Theme = 'dark' | 'light';

export type DropdownOption<T extends any = any> = {
  id: string;
  element: ReactNode;
  value: T;
  disabled?: boolean;
};

export type DropdownResult<T extends any = any> = {
  id: string;
  value: T;
};

export type ComboboxOption<T extends any = any> = DropdownOption<T>;

export type DropdownOptionGroup<T extends any = any> = {
  id: string;
  label: string | ReactNode;
  options: DropdownOption<T>[];
};
