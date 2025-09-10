type PublicInterface<T> = Pick<T, keyof T>;

export type ITimeRange = PublicInterface<import('./span-time-range').default>;

type TimeConfigBase = {
  priority?: number;
};

export interface IDailyTimeConfig extends TimeConfigBase {
  type: 'daily';
  start: string;
  end: string;
  days: number[];
}

export interface ISpanTimeConfig extends TimeConfigBase {
  type: 'span';
  startTime: string;
  endTime: string;
  startDay: number;
  endDay: number;
}

export type TimeConfig = IDailyTimeConfig | ISpanTimeConfig;
