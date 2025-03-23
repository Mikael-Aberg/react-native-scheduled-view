class TimeRange {
  public readonly priority;

  private _isNow = false;
  private startTime;
  private endTime;

  constructor(start: string, end: string, priority: number) {
    this.startTime = this.toDailyMinutes(start);
    this.endTime = this.toDailyMinutes(end);

    this.priority = priority;
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

export default TimeRange;
