import WeeklyTimeRange from '../weekly-time-range';

describe('WeeklyTimeRange', () => {
  test('should correctly determine if current time is within the range', () => {
    const range = new WeeklyTimeRange(1, '08:00', 1, '12:00', 1);
    range.update(1, '09:00');
    expect(range.isNow).toBe(true);
  });

  test('should correctly determine if current time is outside the range', () => {
    const range = new WeeklyTimeRange(2, '10:00', 2, '15:00', 1);
    range.update(2, '09:00');
    expect(range.isNow).toBe(false);
  });

  test('should handle a time range that crosses into the next day', () => {
    const range = new WeeklyTimeRange(5, '22:00', 6, '04:00', 1);
    range.update(6, '02:00');
    expect(range.isNow).toBe(true);
  });

  test('should handle a time range that crosses into the next week', () => {
    const range = new WeeklyTimeRange(6, '23:00', 0, '02:00', 1);
    range.update(0, '01:00');
    expect(range.isNow).toBe(true);
  });

  test('should correctly calculate minutes until start and end', () => {
    const range = new WeeklyTimeRange(3, '14:00', 3, '16:00', 1);
    range.update(3, '13:00');
    expect(range.minutesUntilStart).toBe(60);
    expect(range.minutesUntilEnd).toBe(180);
  });

  test('should correctly calculate minutes since start and end', () => {
    const range = new WeeklyTimeRange(4, '10:00', 4, '12:00', 1);
    range.update(4, '13:00');
    expect(range.minutesSinceStart).toBe(180);
    expect(range.minutesSinceEnd).toBe(60);
  });

  test('should handle week-crossing time ranges for minutes calculations', () => {
    const range = new WeeklyTimeRange(6, '23:00', 0, '02:00', 1);
    range.update(0, '03:00');
    expect(range.minutesSinceEnd).toBe(60);
  });
});
