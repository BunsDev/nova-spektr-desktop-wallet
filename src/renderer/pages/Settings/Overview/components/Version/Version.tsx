import { Icon, HelpText } from '@renderer/shared/ui';
import { useI18n } from '@renderer/app/providers';

export const Version = () => {
  const { t } = useI18n();

  return (
    <div className="flex flex-col items-center gap-y-2 mt-4 pb-6">
      <Icon name="logo" size={48} />
      <HelpText className="text-text-tertiary">
        {t('settings.overview.versionLabel')} {process.env.VERSION}
      </HelpText>
    </div>
  );
};
