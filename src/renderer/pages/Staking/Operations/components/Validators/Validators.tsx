import { ApiPromise } from '@polkadot/api';
import { useEffect, useState } from 'react';
import { mapValues } from 'lodash';

import {
  Icon,
  Identicon,
  Shimmering,
  Loader,
  BodyText,
  InfoPopover,
  FootnoteText,
  Button,
  SearchInput,
  SmallTitleText,
  Checkbox,
} from '@renderer/shared/ui';
import { useI18n } from '@renderer/app/providers';
import { AssetBalance } from '@renderer/entities/asset';
import { ValidatorMap, useEra, useValidators } from '@renderer/entities/staking';
import { includes, getComposedIdentity, toShortAddress } from '@renderer/shared/lib/utils';
import { ExplorerLink } from '@renderer/components/common';
import type { Asset, Explorer, Address, ChainId } from '@renderer/shared/core';
import { AssetFiatBalance } from '@renderer/entities/price/ui/AssetFiatBalance';

type Props = {
  api: ApiPromise;
  chainId: ChainId;
  asset: Asset;
  explorers?: Explorer[];
  addressPrefix?: number;
  isLightClient?: boolean;
  onGoBack: () => void;
  onResult: (validators: ValidatorMap) => void;
};

export const Validators = ({ api, chainId, asset, explorers, isLightClient, onGoBack, onResult }: Props) => {
  const { t } = useI18n();
  const { subscribeActiveEra } = useEra();
  const { getMaxValidators, getValidatorsWithInfo } = useValidators();

  const [era, setEra] = useState<number>();
  const [validators, setValidators] = useState<ValidatorMap>({});
  const [isValidatorsLoading, setIsValidatorsLoading] = useState(true);

  const [query, setQuery] = useState('');
  const [maxValidators, setMaxValidators] = useState(0);
  const [selectedValidators, setSelectedValidators] = useState<Record<Address, boolean>>({});

  useEffect(() => {
    let unsubEra: () => void | undefined;
    (async () => {
      unsubEra = await subscribeActiveEra(api, setEra);
    })();

    return () => {
      unsubEra?.();
    };
  }, []);

  useEffect(() => {
    if (!era) return;

    getValidatorsWithInfo(chainId, api, era, isLightClient).then((validators) => {
      setValidators(validators);
      setMaxValidators(getMaxValidators(api));
      setIsValidatorsLoading(false);
      setSelectedValidators(mapValues(validators, () => false));
    });
  }, [era]);

  const validatorList = Object.values(validators).filter((validator) => {
    const addressMatch = includes(validator.address, query);
    const identityMatch = includes(validator.identity?.subName, query);
    const subIdentityMatch = includes(validator.identity?.parent.name, query);

    return addressMatch || identityMatch || subIdentityMatch;
  });

  const getExplorers = (address: Address, explorers: Explorer[] = []) => {
    const explorersContent = explorers.map((explorer) => ({
      id: explorer.name,
      value: <ExplorerLink explorer={explorer} address={address} />,
    }));

    return [{ items: explorersContent }];
  };

  const toggleSelectedValidators = (address: Address) => {
    setSelectedValidators((validators) => ({ ...validators, [address]: !validators[address] }));
  };

  const onCompleteValidators = () => {
    const finalValidators = Object.entries(selectedValidators).reduce<ValidatorMap>((acc, [address, flag]) => {
      if (flag) acc[address] = validators[address];

      return acc;
    }, {});

    onResult(finalValidators);
  };

  const selectedLength = Object.values(selectedValidators).reduce((acc, v) => acc + Number(v), 0);
  const nextStepDisabled = !selectedLength || selectedLength > maxValidators;

  return (
    <div className="w-[784px] max-h-[660px] py-4">
      <div className="flex items-center gap-x-1 px-5">
        <SmallTitleText as="p">{t('staking.validators.selectedValidatorsLabel')}</SmallTitleText>
        {isValidatorsLoading ? (
          <Shimmering className="ml-1" width={70} height={16} />
        ) : (
          <SmallTitleText as="p" className="text-text-tertiary">
            {t('staking.validators.maxValidatorsLabel', { max: maxValidators })}
          </SmallTitleText>
        )}
        <SearchInput
          wrapperClass="w-[220px] ml-auto"
          placeholder={t('staking.validators.searchPlaceholder')}
          value={query}
          onChange={setQuery}
        />
      </div>

      {isValidatorsLoading && (
        <div className="h-[288px] flex items-center justify-center">
          <Loader color="primary" size={25} />
        </div>
      )}

      {!isValidatorsLoading && validatorList.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-y-4">
          <Icon as="img" name="emptyList" alt={t('staking.validators.noValidatorsLabel')} size={178} />
          <BodyText className="w-52 text-center text-text-tertiary">
            {t('staking.validators.noValidatorsLabel')}
          </BodyText>
        </div>
      )}

      {!isValidatorsLoading && validatorList.length > 0 && (
        <div className="flex flex-col gap-y-2 mt-4">
          <div className="grid grid-cols-[400px,120px,120px,1fr] items-center gap-x-6 px-5">
            <FootnoteText className="text-text-secondary">{t('staking.validators.validatorTableHeader')}</FootnoteText>
            <FootnoteText className="text-text-secondary text-right">
              {t('staking.validators.ownStakeTableHeader')}
            </FootnoteText>
            <FootnoteText className="text-text-secondary text-right">
              {t('staking.validators.totalStakeTableHeader')}
            </FootnoteText>
          </div>

          <ul className="flex flex-col overflow-y-auto max-h-[448px]">
            {validatorList.map((v) => (
              <li
                key={v.address}
                className="grid grid-cols-[400px,120px,120px,1fr] items-center gap-x-6 px-5 shrink-0 h-14 hover:bg-hover"
              >
                <Checkbox
                  checked={selectedValidators[v.address]}
                  disabled={v.blocked}
                  onChange={() => toggleSelectedValidators(v.address)}
                >
                  <div className="flex gap-x-2">
                    <Identicon address={v.address} background={false} size={20} />
                    {v.identity ? (
                      <BodyText>{getComposedIdentity(v.identity)}</BodyText>
                    ) : (
                      <BodyText>{toShortAddress(v.address, 11)}</BodyText>
                    )}
                  </div>
                </Checkbox>
                <div className="flex flex-col items-end">
                  <BodyText>
                    <AssetBalance value={v.ownStake || '0'} asset={asset} />
                  </BodyText>
                  <AssetFiatBalance amount={v.ownStake} asset={asset} />
                </div>
                <div className="flex flex-col items-end">
                  <BodyText>
                    <AssetBalance value={v.totalStake || '0'} asset={asset} />
                  </BodyText>
                  <AssetFiatBalance amount={v.totalStake} asset={asset} />
                </div>
                <InfoPopover data={getExplorers(v.address, explorers)} position="top-full right-0">
                  <Icon name="info" size={14} className="ml-2 mr-auto" />
                </InfoPopover>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex justify-between mt-7 px-5">
        <Button variant="text" onClick={onGoBack}>
          {t('staking.bond.backButton')}
        </Button>
        <Button disabled={nextStepDisabled} onClick={onCompleteValidators}>
          {selectedLength
            ? t('staking.validators.continueButton', { selected: selectedLength })
            : t('staking.validators.selectValidatorButton')}
        </Button>
      </div>
    </div>
  );
};
