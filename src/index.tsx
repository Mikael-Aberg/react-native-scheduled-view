import DailyTimeRange from './daily-time-range';
import ScheduledView from './scheduled-view';
import SpanTimeRange from './span-time-range';

const FULL_WEEK = [0, 1, 2, 3, 4, 5, 6];
const WEEK_DAYS = [1, 2, 3, 4, 5];
const WEEKENDS = [0, 6];

export * from './types';
export { FULL_WEEK, WEEK_DAYS, WEEKENDS };
export { DailyTimeRange, SpanTimeRange };
export default ScheduledView;
