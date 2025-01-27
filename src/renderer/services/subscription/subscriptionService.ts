import { useRef } from 'react';

import { ISubscriptionService, SubsType, UnsubscribeType } from './common/types';

export const useSubscription = <T extends string>(): ISubscriptionService<T> => {
  const subscriptions = useRef<SubsType<T>>({} as SubsType<T>);

  const subscribe = (key: T, unsubscribe: UnsubscribeType): void => {
    subscriptions.current[key]
      ? subscriptions.current[key].push(unsubscribe)
      : (subscriptions.current[key] = [unsubscribe]);
  };

  const unsubscribe = async (key: T): Promise<void> => {
    if (!subscriptions.current[key]) return;
    const promises = subscriptions.current[key].reduce<Promise<any>[]>((acc, fn) => {
      if (fn instanceof Promise) {
        acc.push(fn);
      } else {
        fn();
      }

      return acc;
    }, []);

    await Promise.all(promises);

    const { [key]: _, ...newSubscriptions } = subscriptions.current;
    subscriptions.current = newSubscriptions as SubsType<T>;
  };

  const unsubscribeAll = async (): Promise<void> => {
    await Promise.all(Object.values(subscriptions.current).flat());

    subscriptions.current = {} as SubsType<T>;
  };

  const hasSubscription = (key: T): boolean => {
    return Boolean(subscriptions.current[key]);
  };

  return {
    subscribe,
    hasSubscription,
    unsubscribe,
    unsubscribeAll,
  };
};
