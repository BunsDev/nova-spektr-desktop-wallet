import { Icon, BodyText } from '@renderer/shared/ui';
import { useI18n } from '@renderer/app/providers';

const EmptyNotifications = () => {
  const { t } = useI18n();

  return (
    <div className="flex flex-col h-full items-center justify-center">
      <Icon as="img" name="emptyList" size={178} />
      <BodyText className="text-text-tertiary">{t('notifications.noNotificationsDescription')}</BodyText>
    </div>
  );
};

export default EmptyNotifications;
