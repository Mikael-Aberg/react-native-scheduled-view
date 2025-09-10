import SpanTimeRange from './span-time-range';
import type {
  IDailyTimeConfig,
  ISpanTimeConfig,
  TimeConfig,
  ITimeRange,
} from './types';

interface IListener {
  onShow: () => void;
  onHide: () => void;
  ranges: ITimeRange[];
  id: number;
}

class TimeRangeManager {
  private id = 0;

  private timeCheckInterval: NodeJS.Timeout | null = null;
  private firstCheckTimeout: NodeJS.Timeout | null = null;

  private readonly timeRanges: Record<string, ITimeRange> = {};
  private readonly listeners = new Map<number, IListener>();

  public registerTime(
    times: TimeConfig[],
    onShow: () => void,
    onHide: () => void
  ) {
    const ranges: ITimeRange[] = [];

    times.forEach((time) => {
      switch (time.type) {
        case 'daily':
          for (const day of time.days) {
            const range = this.createSpanTime(this.dailyToSpan(time, day));
            range.addListener();
            ranges.push(range);
          }
          break;
        case 'span':
          const range = this.createSpanTime(time);
          range.addListener();
          ranges.push(range);
          break;
      }
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
      ranges.map((x) => x.id),
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

  private dailyToSpan(time: IDailyTimeConfig, day: number): ISpanTimeConfig {
    return {
      startTime: time.start,
      endTime: time.end,
      startDay: day,
      endDay: day,
      priority: time.priority,
      type: 'span',
    };
  }

  private updateTimes(keys: string[]) {
    const { time, dayOfWeek } = this.getUpdateParams();

    console.log(`Updating ${keys.length} times`);
    keys.forEach((key) => {
      this.timeRanges[key]?.update(dayOfWeek, time);
    });
  }

  private updateListeners(listenersKeys: number[]) {
    console.log(this.listenerKeys);

    console.log(`Updating ${listenersKeys.length} listeners`);
    listenersKeys.forEach((key) => {
      const config = this.listeners.get(key);
      if (!config || config.ranges.length === 0) {
        return;
      }

      const highestPriority = config.ranges
        .filter((x) => x.isNow)
        .sort((a, b) => a.priority - b.priority)[0];

      if (highestPriority?.isNow) {
        config.onShow();
      } else {
        config.onHide();
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
    times: string[] = this.timeKeys,
    listeners: number[] = this.listenerKeys
  ) {
    console.log('Update');
    this.updateTimes(times);
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

  private removeTime(time: ITimeRange) {
    delete this.timeRanges[time.id];
  }

  private createSpanTime(time: ISpanTimeConfig): ITimeRange {
    const span = new SpanTimeRange(time);
    this.timeRanges[span.id] ??= span;

    return this.timeRanges[span.id]!;
  }

  private getToday() {
    return new Date();
  }

  private get timeKeys() {
    return Object.keys(this.timeRanges);
  }

  private get listenerKeys() {
    return Array.from(this.listeners.keys());
  }
}

export { TimeRangeManager };
export default new TimeRangeManager();
