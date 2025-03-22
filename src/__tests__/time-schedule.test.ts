import TimeRange from '../time-range';

describe('TimeRange', () => {
  test('should initialize with isNow as false', () => {
    const schedule = new TimeRange('09:00', '10:00', 1);
    expect(schedule.isNow).toBe(false);
  });

  test('should update isNow to true when time is within range', () => {
    const schedule = new TimeRange('09:00', '10:00', 1);
    schedule.update('09:30');
    expect(schedule.isNow).toBe(true);
  });

  test('should update isNow to false when time is before range', () => {
    const schedule = new TimeRange('09:00', '10:00', 1);
    schedule.update('09:30'); // Ensure isNow is true first
    expect(schedule.isNow).toBe(true);

    schedule.update('08:59');
    expect(schedule.isNow).toBe(false);
  });

  test('should update isNow to false when time is at the end boundary', () => {
    const schedule = new TimeRange('09:00', '10:00', 1);
    schedule.update('09:30'); // Ensure isNow is true first
    expect(schedule.isNow).toBe(true);

    schedule.update('10:00');
    expect(schedule.isNow).toBe(false);
  });

  test('should update isNow to false when time is after range', () => {
    const schedule = new TimeRange('09:00', '10:00', 1);
    schedule.update('09:30'); // Ensure isNow is true first
    expect(schedule.isNow).toBe(true);

    schedule.update('10:01');
    expect(schedule.isNow).toBe(false);
  });
});
