import { attach, combine, createApi, createStore, sample } from 'effector';
import { createForm } from 'effector-forms';
import { not } from 'patronum';

import { contactModel } from '@renderer/entities/contact';
import { Contact } from '@renderer/shared/core';
import { toAccountId, validateAddress } from '@renderer/shared/lib/utils';
import { validateFullUserName } from '@renderer/shared/api/matrix';

export type Callbacks = {
  onSubmit: () => void;
};

const $callbacks = createStore<Callbacks | null>(null);
const callbacksApi = createApi($callbacks, {
  callbacksChanged: (state, props: Callbacks) => ({ ...state, ...props }),
});

export const $contactToEdit = createStore<Contact | null>(null);
const contactApi = createApi($contactToEdit, {
  formInitiated: (state, props: Contact) => ({ ...state, ...props }),
});

export const contactForm = createForm({
  fields: {
    name: {
      init: '',
      rules: [
        { name: 'required', errorText: 'addressBook.editContact.nameRequiredError', validator: Boolean },
        {
          name: 'exist',
          errorText: 'addressBook.editContact.nameExistsError',
          source: combine({
            contactToEdit: $contactToEdit,
            contacts: contactModel.$contacts,
          }),
          validator: validateNameExist,
        },
      ],
    },
    address: {
      init: '',
      rules: [
        { name: 'required', errorText: 'addressBook.editContact.accountIdRequiredError', validator: Boolean },
        { name: 'invalid', errorText: 'addressBook.editContact.accountIdIncorrectError', validator: validateAddress },
        {
          name: 'exist',
          errorText: 'addressBook.editContact.accountIdExistsError',
          source: combine({
            contactToEdit: $contactToEdit,
            contacts: contactModel.$contacts,
          }),
          validator: validateAddressExist,
        },
      ],
    },
    matrixId: {
      init: '',
      rules: [{ name: 'invalid', errorText: 'addressBook.editContact.matrixIdError', validator: validateMatrixId }],
    },
  },
  validateOn: ['change', 'submit'],
});

sample({
  clock: contactApi.formInitiated,
  filter: contactForm.$isDirty,
  target: contactForm.reset,
});

sample({
  clock: contactApi.formInitiated,
  filter: not(contactForm.$isDirty),
  fn: ({ name, address, matrixId }) => ({ name, address, matrixId }),
  target: contactForm.setForm,
});

type SourceParams = {
  contactToEdit: Contact;
  contacts: Contact[];
};
function validateNameExist(value: string, _: unknown, params: SourceParams): boolean {
  if (!value) return true;

  const isSameName = value.toLowerCase() === params.contactToEdit.name.toLowerCase();
  const isUnique = params.contacts.every((contact) => contact.name.toLowerCase() !== value.toLowerCase());

  return isSameName || isUnique;
}

function validateAddressExist(value: string, _: unknown, params: SourceParams): boolean {
  if (!value) return true;

  const accountId = toAccountId(value);
  const isSameAddress = value.toLowerCase() === params.contactToEdit.address.toLowerCase();
  const isUnique = params.contacts.every((contact) => contact.accountId !== accountId);

  return isSameAddress || isUnique;
}

function validateMatrixId(value: string): boolean {
  if (!value) return true;

  return validateFullUserName(value);
}

sample({
  clock: contactForm.formValidated,
  source: $contactToEdit,
  filter: (contactToEdit) => contactToEdit !== null,
  fn: (contactToEdit, form) => {
    return { ...form, id: contactToEdit!.id, accountId: toAccountId(form.address) };
  },
  target: contactModel.effects.updateContactFx,
});

sample({
  clock: contactModel.effects.updateContactFx,
  target: attach({
    source: $callbacks,
    effect: (state) => state?.onSubmit(),
  }),
});

export const $submitPending = contactModel.effects.updateContactFx.pending;

export const events = {
  callbacksChanged: callbacksApi.callbacksChanged,
  formInitiated: contactApi.formInitiated,
};
