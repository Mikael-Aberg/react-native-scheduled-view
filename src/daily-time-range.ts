import type { IDailyTimeConfig, IDailyTimeRange } from './types';

class DailyTimeRange implements IDailyTimeRange {
  public readonly priority;

  private _isNow = false;
  private startTime;
  private endTime;

  constructor(config: IDailyTimeConfig) {
    this.startTime = this.toDailyMinutes(config.start);
    this.endTime = this.toDailyMinutes(config.end);

    this.priority = config.priority;
  }

  public update(time: string) {
    const check = this.toDailyMinutes(time);

    this._isNow = this.startTime <= check && check < this.endTime;
  }

  get isNow() {
    return this._isNow;
  }

  private toDailyMinutes(time: string) {
    const split = time.split(':').map(Number);
    return split[0]! * 60 + split[1]!;
  }
}

export default DailyTimeRange;
