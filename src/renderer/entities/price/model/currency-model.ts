import { createEvent, createStore, createEffect, forward, sample } from 'effector';

import { kernelModel } from '@renderer/shared/core';
import { CurrencyItem, fiatService } from '@renderer/shared/api/price-provider';
import { DEFAULT_CURRENCY_CODE } from '../lib/constants';

const $currencyConfig = createStore<CurrencyItem[]>([]);
const $activeCurrency = createStore<CurrencyItem | null>(null);
const $activeCurrencyCode = createStore<CurrencyItem['code'] | null>(null);

const currencyChanged = createEvent<CurrencyItem['id']>();

const getCurrencyConfigFx = createEffect((): CurrencyItem[] => {
  return fiatService.getCurrencyConfig();
});

const getActiveCurrencyCodeFx = createEffect((): string => {
  return fiatService.getActiveCurrencyCode(DEFAULT_CURRENCY_CODE);
});

const saveActiveCurrencyCodeFx = createEffect((currency: CurrencyItem) => {
  fiatService.saveActiveCurrencyCode(currency.code);
});

type ChangeParams = {
  id?: CurrencyItem['id'];
  code?: CurrencyItem['code'];
  config: CurrencyItem[];
};
const currencyChangedFx = createEffect<ChangeParams, CurrencyItem | undefined>(({ id, code, config }) => {
  return config.find((currency) => {
    const hasId = currency.id === id;
    const hasCode = currency.code.toLowerCase() === code?.toLowerCase();

    return hasId || hasCode;
  });
});

forward({
  from: kernelModel.events.appStarted,
  to: [getActiveCurrencyCodeFx, getCurrencyConfigFx],
});

forward({ from: getActiveCurrencyCodeFx.doneData, to: $activeCurrencyCode });

forward({ from: getCurrencyConfigFx.doneData, to: $currencyConfig });

sample({
  clock: getCurrencyConfigFx.doneData,
  source: $activeCurrencyCode,
  filter: (code: CurrencyItem['code'] | null): code is CurrencyItem['code'] => Boolean(code),
  fn: (code, config) => ({ code, config }),
  target: currencyChangedFx,
});

sample({
  clock: currencyChanged,
  source: $currencyConfig,
  fn: (config, id) => ({ config, id }),
  target: currencyChangedFx,
});

sample({
  clock: currencyChangedFx.doneData,
  source: $activeCurrency,
  filter: (prev, next) => prev?.id !== next?.id,
  fn: (_, next) => next!,
  target: [$activeCurrency, saveActiveCurrencyCodeFx],
});

export const currencyModel = {
  $currencyConfig,
  $activeCurrency,
  events: {
    currencyChanged,
  },
  watch: {
    currencyChangedDone: currencyChangedFx.done,
    currencyChangedFail: currencyChangedFx.fail,
    activeCurrencyLoaded: getActiveCurrencyCodeFx.done,
  },
};
