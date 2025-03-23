import type { TimeConfig } from './types';

class TimeRangeManager {
  private static instance: TimeRangeManager | null = null;

  constructor() {
    if (TimeRangeManager.instance) {
      return TimeRangeManager.instance;
    }

    TimeRangeManager.instance = this;
  }

  public registerTime(
    _times: TimeConfig[],
    _onShow: () => void,
    _onHide: () => void
  ) {}
}

export default TimeRangeManager;
