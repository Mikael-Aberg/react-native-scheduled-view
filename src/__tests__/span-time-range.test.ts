import SpanTimeRange from '../span-time-range';

describe('SpanTimeRange', () => {
  test('should correctly determine if current time is within the range', () => {
    const range = new SpanTimeRange({
      startDay: 1,
      startTime: '08:00',
      endDay: 1,
      endTime: '10:00',
      priority: 1,
      type: 'span',
    });
    range.update(1, '09:00');
    expect(range.isNow).toBe(true);
  });

  test('should correctly determine if current time is outside the range', () => {
    const range = new SpanTimeRange({
      startDay: 2,
      startTime: '10:00',
      endDay: 2,
      endTime: '15:00',
      priority: 1,
      type: 'span',
    });
    range.update(2, '09:00');
    expect(range.isNow).toBe(false);
  });

  test('should handle a time range that crosses into the next day', () => {
    const range = new SpanTimeRange({
      startDay: 5,
      startTime: '22:00',
      endDay: 6,
      endTime: '04:00',
      priority: 1,
      type: 'span',
    });
    range.update(6, '02:00');
    expect(range.isNow).toBe(true);
  });

  test('should handle a time range that crosses into the next week', () => {
    const range = new SpanTimeRange({
      startDay: 6,
      startTime: '23:00',
      endDay: 1,
      endTime: '02:00',
      priority: 1,
      type: 'span',
    });
    range.update(0, '01:00');
    expect(range.isNow).toBe(true);
  });
});
