import type { IDailyTimeConfig, IDailyTimeRange } from './types';

class DailyTimeRange implements IDailyTimeRange {
  public readonly priority;
  public readonly type;
  public readonly id;

  private _listeners = 0;
  private _isNow = false;
  private readonly startTime;
  private readonly endTime;

  constructor(config: IDailyTimeConfig) {
    this.priority = config.priority;
    this.type = config.type;
    this.id = `${config.start}:${config.end}:${config.priority}`;

    this.startTime = this.toDailyMinutes(config.start);
    this.endTime = this.toDailyMinutes(config.end);
  }

  public update(time: string) {
    const check = this.toDailyMinutes(time);

    this._isNow = this.startTime <= check && check < this.endTime;
  }

  public addListener() {
    this._listeners++;
  }

  public removeListener() {
    this._listeners--;
  }

  get isNow() {
    return this._isNow;
  }

  get listeners() {
    return this._listeners;
  }

  private toDailyMinutes(time: string) {
    const split = time.split(':').map(Number);
    return split[0]! * 60 + split[1]!;
  }
}

export default DailyTimeRange;
