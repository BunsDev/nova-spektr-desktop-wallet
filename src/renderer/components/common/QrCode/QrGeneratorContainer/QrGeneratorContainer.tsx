import { PropsWithChildren } from 'react';

import { Button, FootnoteText, InfoLink, SmallTitleText, Icon, Shimmering, Countdown } from '@renderer/shared/ui';
import { useI18n } from '@renderer/app/providers';
import { getMetadataPortalMetadataUrl, TROUBLESHOOTING_URL } from '../common/constants';
import type { ChainId } from '@renderer/shared/core';

type Props = {
  countdown: number;
  onQrReset: () => void;
  chainId: ChainId;
};

const QrGeneratorContainer = ({ countdown, onQrReset, chainId, children }: PropsWithChildren<Props>) => {
  const { t } = useI18n();

  return (
    <section className="flex flex-col items-center flex-1">
      <SmallTitleText>{t('signing.scanQrTitle')}</SmallTitleText>

      <Countdown countdown={children ? countdown : 0} />

      <div className="w-[240px] h-[240px] relative flex flex-col items-center justify-center gap-y-4">
        {children &&
          (countdown > 0 ? (
            children
          ) : (
            <>
              {/* qr expired */}
              <Icon name="qrFrame" className="absolute w-full h-full" />
              <FootnoteText>{t('signing.qrNotValid')}</FootnoteText>
              <Button className="z-10" size="sm" prefixElement={<Icon size={16} name="refresh" />} onClick={onQrReset}>
                {t('signing.generateNewQrButton')}
              </Button>
            </>
          ))}

        {!children && <Shimmering />}
      </div>

      <div className="flex flex-row items-center gap-x-2 mt-2 mb-4.5 h-[78px]">
        <InfoLink url={TROUBLESHOOTING_URL}>{t('signing.troubleshootingLink')}</InfoLink>

        <span className="border border-divider h-4"></span>

        <InfoLink url={getMetadataPortalMetadataUrl(chainId)}>{t('signing.metadataPortalLink')}</InfoLink>
      </div>
    </section>
  );
};

export default QrGeneratorContainer;
