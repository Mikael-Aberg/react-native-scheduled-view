class TimeRange {
  private _isNow = false;
  private startTime;
  private endTime;

  constructor(start: string, end: string) {
    this.startTime = start;
    this.endTime = end;
  }

  public update(time: string) {
    this._isNow = this.startTime <= time && time < this.endTime;
  }

  get isNow() {
    return this._isNow;
  }
}

export default TimeRange;
