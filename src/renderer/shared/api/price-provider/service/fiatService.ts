import CURRENCY from '@renderer/assets/currency/currencies.json';
import { localStorageService } from '@renderer/shared/api/local-storage';
import { CurrencyItem } from '../common/types';
import { CURRENCY_CODE_KEY, FIAT_FLAG_KEY, PRICE_PROVIDER_KEY, ASSETS_PRICES_KEY } from '../common/constants';

export const fiatService = {
  getCurrencyConfig,
  getActiveCurrencyCode,
  saveActiveCurrencyCode,
  getFiatFlag,
  saveFiatFlag,
  getPriceProvider,
  savePriceProvider,
  getAssetsPrices,
  saveAssetsPrices,
};

function getCurrencyConfig(): CurrencyItem[] {
  return CURRENCY as CurrencyItem[];
}

function getActiveCurrencyCode(defaultCode: string): string {
  return localStorageService.getFromStorage(CURRENCY_CODE_KEY, defaultCode.toLowerCase());
}

function saveActiveCurrencyCode(code: string): string {
  return localStorageService.saveToStorage(CURRENCY_CODE_KEY, code.toLowerCase());
}

function getFiatFlag(defaultFlag: boolean): boolean {
  return localStorageService.getFromStorage(FIAT_FLAG_KEY, defaultFlag);
}

function saveFiatFlag(flag: boolean): boolean {
  return localStorageService.saveToStorage(FIAT_FLAG_KEY, flag);
}

function getPriceProvider<T extends any>(defaultFiatProvider: T): T {
  return localStorageService.getFromStorage(PRICE_PROVIDER_KEY, defaultFiatProvider);
}

function savePriceProvider<T extends any>(provider: T): T {
  return localStorageService.saveToStorage(PRICE_PROVIDER_KEY, provider);
}

function getAssetsPrices<T extends any>(defaultPrices: T): T {
  return localStorageService.getFromStorage(ASSETS_PRICES_KEY, defaultPrices);
}

function saveAssetsPrices<T extends any>(prices: T): T {
  return localStorageService.saveToStorage(ASSETS_PRICES_KEY, prices);
}
