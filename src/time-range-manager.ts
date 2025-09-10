import DailyTimeRange from './daily-time-range';
import SpanTimeRange from './span-time-range';
import type {
  IDailyTimeConfig,
  IDailyTimeRange,
  ISpanTimeRange,
  ISpanTimeConfig,
  TimeConfig,
} from './types';

interface IListener {
  onShow: () => void;
  onHide: () => void;
  ranges: (IDailyTimeRange | ISpanTimeRange)[];
  id: number;
}

class TimeRangeManager {
  private id = 0;

  private timeCheckInterval: NodeJS.Timeout | null = null;
  private firstCheckTimeout: NodeJS.Timeout | null = null;

  private readonly dailyTimes: Record<string, IDailyTimeRange> = {};
  private readonly spanTimes: Record<string, ISpanTimeRange> = {};

  private readonly listeners = new Map<number, IListener>();

  public registerTime(
    times: TimeConfig[],
    onShow: () => void,
    onHide: () => void
  ) {
    const ranges: (IDailyTimeRange | ISpanTimeRange)[] = [];

    times.forEach((time) => {
      let range;
      switch (time.type) {
        case 'daily':
          range = this.createDailyTime(time);
          break;
        case 'span':
          range = this.createSpanTime(time);
          break;
      }

      range.addListener();
      ranges.push(range);
    });

    const o: IListener = {
      ranges,
      onShow,
      onHide,
      id: this.id++,
    };

    console.log('Adding listener with id: ', this.id);

    this.listeners.set(o.id, o);

    this.startCheckInterval();
    this.update(
      ranges.filter((x) => x.type === 'daily').map((x) => x.id),
      ranges.filter((x) => x.type === 'span').map((x) => x.id),
      [o.id]
    );

    return {
      remove: () => {
        console.log('Removing times');
        o.ranges.forEach((x) => {
          x.removeListener();
          if (x.listeners <= 0) {
            this.removeTime(x);
          }
        });
        this.listeners.delete(o.id);
      },
    };
  }

  private updateTimes(dailyKeys: string[], weeklyKeys: string[]) {
    const { time, dayOfWeek } = this.getUpdateParams();

    console.log(`Updating ${weeklyKeys.length} span times`);
    weeklyKeys.forEach((key) => {
      this.spanTimes[key]?.update(dayOfWeek, time);
    });

    console.log(`Updating ${dailyKeys.length} daily times`);
    dailyKeys.forEach((key) => {
      this.dailyTimes[key]?.update(time);
    });
  }

  private updateListeners(listenersKeys: number[]) {
    console.log(this.listenerKeys);

    console.log(`Updating ${listenersKeys.length} listeners`);
    listenersKeys.forEach((key) => {
      const config = this.listeners.get(key);
      if (!config) {
        return;
      }

      if (config.ranges.some((x) => x.isNow)) {
        config.onShow();
      } else {
        config?.onHide();
      }
    });
  }

  private getUpdateParams() {
    const now = this.getToday();
    const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    const timeUntilEndOfDay = Math.round(
      (new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        23,
        59,
        59,
        999
      ).getTime() -
        now.getTime()) /
        60000
    );
    const timeSinceStartOfDay = Math.round(
      (new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        0,
        0,
        0,
        0
      ).getTime() -
        now.getTime()) /
        60000
    );

    const dayOfWeek = now.getDay();

    return { now, time, timeUntilEndOfDay, timeSinceStartOfDay, dayOfWeek };
  }

  private update(
    daily: string[] = this.dailyKeys,
    span: string[] = this.spanKeys,
    listeners: number[] = this.listenerKeys
  ) {
    console.log('Update');
    this.updateTimes(daily, span);
    this.updateListeners(listeners);
  }

  private stopCheckInterval() {
    if (this.timeCheckInterval) {
      clearInterval(this.timeCheckInterval);
      this.timeCheckInterval = null;
    }

    if (this.firstCheckTimeout) {
      clearTimeout(this.firstCheckTimeout);
      this.firstCheckTimeout = null;
    }
  }

  private startCheckInterval() {
    if (!this.firstCheckTimeout && !this.timeCheckInterval) {
      this.stopCheckInterval();
      this.update();
      const today = new Date();
      const delay = 60 - today.getSeconds();
      this.firstCheckTimeout = setTimeout(() => {
        this.update();
        this.timeCheckInterval = setInterval(() => {
          this.update();
        }, 60 * 1000);
      }, delay * 1000);
    }
  }

  private removeTime(time: IDailyTimeRange | ISpanTimeRange) {
    switch (time.type) {
      case 'daily':
        delete this.dailyTimes[time.id];
        break;
      case 'span':
        delete this.spanTimes[time.id];
        break;
    }
  }

  private createDailyTime(time: IDailyTimeConfig) {
    const id = `${time.start}:${time.end}:${time.priority}`;

    this.dailyTimes[id] ??= new DailyTimeRange(time);

    return this.dailyTimes[id];
  }

  private createSpanTime(time: ISpanTimeConfig) {
    const id = `${time.startDay}:${time.startTime}:${time.endDay}:${time.endTime}:${time.priority}`;

    this.spanTimes[id] ??= new SpanTimeRange(time);

    return this.spanTimes[id];
  }

  private getToday() {
    return new Date();
  }

  private get spanKeys() {
    return Object.keys(this.spanTimes);
  }

  private get dailyKeys() {
    return Object.keys(this.dailyTimes);
  }

  private get listenerKeys() {
    return Array.from(this.listeners.keys());
  }
}

export { TimeRangeManager };
export default new TimeRangeManager();
