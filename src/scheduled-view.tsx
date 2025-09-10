import { memo, useCallback, useEffect, useState } from 'react';
import TimeRangeManager from './time-range-manager';
import type { TimeConfig } from './types';

const ScheduledView = memo(
  ({
    ranges,
    children,
  }: {
    ranges: TimeConfig[];
    children?: React.ReactElement;
  }) => {
    const [isVisible, setIsVisible] = useState(false);

    const setVisible = useCallback(() => {
      setIsVisible(true);
    }, []);

    const setHidden = useCallback(() => {
      setIsVisible(false);
    }, []);

    useEffect(() => {
      const { remove } = TimeRangeManager.registerTime(
        ranges,
        setVisible,
        setHidden
      );

      return remove;
    }, [ranges, setHidden, setVisible]);

    return isVisible ? children : null;
  },
  (prev, next) => {
    if (prev.children !== next.children) {
      return true;
    }
    return arraysEqual(prev.ranges, next.ranges);
  }
);

function arraysEqual(a: TimeConfig[], b: TimeConfig[]) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;

  for (let i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

export default ScheduledView;
