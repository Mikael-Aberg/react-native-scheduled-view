import type { ISpanTimeConfig, ISpanTimeRange } from './types';

const MINUTES_IN_A_DAY = 1440;

class SpanTimeRange implements ISpanTimeRange {
  public readonly priority;
  public readonly type;
  public readonly id;

  private readonly startMinutes;
  private readonly endMinutes;

  private _listeners = 0;
  private _isNow = false;

  constructor(config: ISpanTimeConfig) {
    this.priority = config.priority;
    this.type = config.type;
    this.id = `${config.startDay}:${config.startTime}:${config.endDay}:${config.endTime}:${config.priority}`;

    this.startMinutes = this.toWeeklyMinutes(config.startDay, config.startTime);
    this.endMinutes = this.toWeeklyMinutes(config.endDay, config.endTime);

    // Handle week-crossing case (e.g., Sunday 20:00 → Monday 04:00)
    if (this.endMinutes < this.startMinutes) {
      this.endMinutes += 7 * MINUTES_IN_A_DAY;
    }
  }

  public update(day: number, time: string) {
    let checkMinutes = this.toWeeklyMinutes(day, time);

    if (checkMinutes < this.startMinutes) {
      checkMinutes += 7 * MINUTES_IN_A_DAY;
    }

    this._isNow =
      this.startMinutes <= checkMinutes && checkMinutes < this.endMinutes;
  }

  public addListener() {
    this._listeners++;
  }

  public removeListener() {
    this._listeners--;
  }

  public get listeners() {
    return this._listeners;
  }

  public get isNow() {
    return this._isNow;
  }

  private toWeeklyMinutes(day: number, time: string) {
    const split = time.split(':').map(Number);
    return day * MINUTES_IN_A_DAY + split[0]! * 60 + split[1]!;
  }
}

export default SpanTimeRange;
