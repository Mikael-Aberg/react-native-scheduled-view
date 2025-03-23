import TimeRangeManager from '../time-range-manager';

describe('TimeRangeManager', () => {
  it('should always use the same instance', () => {
    const a = new TimeRangeManager();
    const b = new TimeRangeManager();

    expect(a).toBe(b);
  });
});
