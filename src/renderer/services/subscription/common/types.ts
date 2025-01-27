// =====================================================
// ============ IStakingService interface ==============
// =====================================================

export type ISubscriptionService<T extends string = string> = {
  hasSubscription: (key: T) => boolean;
  subscribe: (key: T, unsubscribe: UnsubscribeType) => void;
  unsubscribe: (key: T) => Promise<void>;
  unsubscribeAll: () => Promise<void>;
};

// =====================================================
// ===================== General =======================
// =====================================================

export type UnsubscribeType = (() => any) | Promise<any>;
export type SubsType<K extends string> = Record<K, UnsubscribeType[]>;
