import { ApiPromise } from '@polkadot/api';
import { useEffect, useState } from 'react';

import { Duration, Shimmering } from '@renderer/shared/ui';
import { useEra } from '@renderer/entities/staking';

interface Props {
  api?: ApiPromise;
  era?: number;
  className?: string;
}

export const TimeToEra = ({ api, era, className }: Props) => {
  const { getTimeToEra } = useEra();

  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!api) return;

    getTimeToEra(api, era).then(setSeconds);
  }, [era, api]);

  useEffect(() => {
    if (seconds > 0) {
      const timer = setTimeout(() => setSeconds(seconds - 1), 1000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [seconds]);

  if (seconds <= 0) {
    return <Shimmering width={40} height={10} className={className} />;
  }

  return <Duration seconds={seconds.toString()} className={className} />;
};
