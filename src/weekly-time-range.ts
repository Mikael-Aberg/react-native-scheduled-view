import type { IWeeklyTimeConfig, IWeeklyTimeRange } from './types';

const MINUTES_IN_A_DAY = 1440;

class WeeklyTimeRange implements IWeeklyTimeRange {
  public readonly priority;

  private startMinutes;
  private endMinutes;

  private _isNow = false;

  // private _minutesUntilStart = -1;
  // private _minutesUntilEnd = -1;
  // private _minutesSinceStart = -1;
  // private _minutesSinceEnd = -1;

  constructor(config: IWeeklyTimeConfig) {
    this.priority = config.priority;

    this.startMinutes = this.toWeeklyMinutes(config.startDay, config.startTime);
    this.endMinutes = this.toWeeklyMinutes(config.endDay, config.endTime);

    // Handle week-crossing case (e.g., Sunday 20:00 → Monday 04:00)
    if (this.endMinutes < this.startMinutes) {
      this.endMinutes += 7 * MINUTES_IN_A_DAY;
    }
  }

  public update(day: number, time: string) {
    let checkMinutes = this.toWeeklyMinutes(day, time);
    // const originalCheckMinutes = checkMinutes;

    // this._minutesUntilStart = this.startMinutes - checkMinutes;
    // this._minutesUntilEnd = this.endMinutes - checkMinutes;

    // this._minutesSinceStart = checkMinutes - this.startMinutes;
    // this._minutesSinceEnd = checkMinutes - this.endMinutes;

    if (checkMinutes < this.startMinutes) {
      checkMinutes += 7 * MINUTES_IN_A_DAY;
    }

    this._isNow =
      this.startMinutes <= checkMinutes && checkMinutes < this.endMinutes;

    // // Check times Until next week
    // if (originalCheckMinutes > this.startMinutes) {
    //   this._minutesUntilStart =
    //     this.startMinutes + 7 * MINUTES_IN_A_DAY - originalCheckMinutes;
    // }
    // if (originalCheckMinutes > this.endMinutes) {
    //   this._minutesUntilEnd =
    //     this.endMinutes + 7 * MINUTES_IN_A_DAY - originalCheckMinutes;
    // }

    // if (originalCheckMinutes < this.endMinutes) {
    //   this._minutesSinceEnd = Math.abs(
    //     this.endMinutes - 7 * MINUTES_IN_A_DAY - originalCheckMinutes
    //   );
    // }

    // if (originalCheckMinutes < this.startMinutes) {
    //   this._minutesSinceStart = Math.abs(
    //     this.startMinutes - 7 * MINUTES_IN_A_DAY - originalCheckMinutes
    //   );
    // }
  }

  public get isNow() {
    return this._isNow;
  }

  // public get minutesUntilEnd() {
  //   return this._minutesUntilEnd;
  // }

  // public get minutesUntilStart() {
  //   return this._minutesUntilStart;
  // }

  // public get minutesSinceEnd() {
  //   return this._minutesSinceEnd;
  // }

  // public get minutesSinceStart() {
  //   return this._minutesSinceStart;
  // }

  private toWeeklyMinutes(day: number, time: string) {
    const split = time.split(':').map(Number);
    return day * MINUTES_IN_A_DAY + split[0]! * 60 + split[1]!;
  }
}

export default WeeklyTimeRange;
