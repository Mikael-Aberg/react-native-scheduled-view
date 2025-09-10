type PublicInterface<T> = Pick<T, keyof T>;

export type IDailyTimeRange = PublicInterface<
  import('./daily-time-range').default
>;

export type IWeeklyTimeRange = PublicInterface<
  import('./weekly-time-range').default
>;

// export type MonthlyTimeRange = PublicInterface<
//   import('./daily-time-range').default
// >;

type TimeConfigBase = {
  priority: number;
};

export interface IDailyTimeConfig extends TimeConfigBase {
  type: 'daily';
  start: string;
  end: string;
}

export interface IWeeklyTimeConfig extends TimeConfigBase {
  type: 'weekly';
  startTime: string;
  endTime: string;
  startDay: number;
  endDay: number;
}

export type TimeConfig = IDailyTimeConfig | IWeeklyTimeConfig;
