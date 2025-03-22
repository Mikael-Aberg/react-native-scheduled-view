class TimeRange {
  public readonly priority;

  private _isNow = false;
  private startTime;
  private endTime;

  constructor(start: string, end: string, priority: number) {
    this.startTime = start;
    this.endTime = end;

    this.priority = priority;
  }

  public update(time: string) {
    this._isNow = this.startTime <= time && time < this.endTime;
  }

  get isNow() {
    return this._isNow;
  }
}

export default TimeRange;
