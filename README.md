<div align="center">
  
# 🕒 React Native Scheduled View

**Show and hide React Native components based on time schedules using the device's local clock**

[![npm version](https://img.shields.io/npm/v/react-native-scheduled-view.svg)](https://www.npmjs.com/package/react-native-scheduled-view)
[![license](https://img.shields.io/npm/l/react-native-scheduled-view.svg)](https://github.com/Mikael-Aberg/react-native-scheduled-view/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

[Installation](#installation) •
[Quick Start](#quick-start) •
[Examples](#examples) •
[API Reference](#api-reference)

</div>

---

## ✨ Features

<table>
<tr>
<td>

� **Smart Scheduling**  
Schedule components for specific times and days with precision

</td>
<td>

⚡ **Lightweight**  
Minimal overhead with optimized performance

</td>
</tr>
<tr>
<td>

🌍 **Local Time Based**  
Uses device's local clock for accurate timing

</td>
<td>

📱 **Cross Platform**  
Works seamlessly on iOS and Android

</td>
</tr>
<tr>
<td>

🔄 **Flexible Scheduling**  
Daily and span-based scheduling options

</td>
<td>

🎯 **Priority System**  
Handle overlapping time ranges with priorities

</td>
</tr>
</table>

## 📦 Installation

```bash
# Using npm
npm install react-native-scheduled-view

# Using yarn
yarn add react-native-scheduled-view

# Using pnpm
pnpm add react-native-scheduled-view
```

> **Note:** No additional configuration required! Works out of the box with Expo and bare React Native projects.

## 🚀 Quick Start

```tsx
import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import ScheduledView from 'react-native-scheduled-view';

export default function App() {
  return (
    <View style={styles.container}>
      <ScheduledView
        ranges={[
          {
            type: 'daily',
            start: '09:00',
            end: '17:00',
            days: [1, 2, 3, 4, 5], // Monday to Friday
          },
        ]}
      >
        <Text style={styles.text}>💼 Only visible during business hours!</Text>
      </ScheduledView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    textAlign: 'center',
  },
});
```

## 📚 Examples

### Advanced Scheduling with Priority

```tsx
import React from 'react';
import ScheduledView, {
  FULL_WEEK,
  WEEKENDS,
} from 'react-native-scheduled-view';

const ranges = [
  // Default: 10 AM - 10 PM all week (lower priority)
  {
    type: 'daily',
    start: '10:00',
    end: '22:00',
    priority: 10,
    days: FULL_WEEK,
  },
  // Override: Earlier close on weekends (higher priority)
  {
    type: 'daily',
    start: '10:00',
    end: '18:00',
    priority: 1, // Higher priority (lower number)
    days: WEEKENDS,
  },
];

export default function StoreHours() {
  return (
    <ScheduledView ranges={ranges}>
      <StoreOpenBanner />
    </ScheduledView>
  );
}
```

### Weekend Special Promotions

```tsx
<ScheduledView
  ranges={[
    {
      type: 'daily',
      start: '12:00',
      end: '20:00',
      days: WEEKENDS,
    },
  ]}
>
  <WeekendPromotionBanner />
</ScheduledView>
```

### Cross-Day Events (Friday Night to Monday Morning)

```tsx
<ScheduledView
  ranges={[
    {
      type: 'span',
      startTime: '20:00', // Friday 8 PM
      endTime: '08:00', // Monday 8 AM
      startDay: 5, // Friday
      endDay: 1, // Monday
    },
  ]}
>
  <WeekendModeInterface />
</ScheduledView>
```

## 📖 API Reference

### `<ScheduledView>` Props

| Prop       | Type                 | Required | Description                                                          |
| ---------- | -------------------- | -------- | -------------------------------------------------------------------- |
| `ranges`   | `TimeConfig[]`       | ✅       | Array of time configurations defining when content should be visible |
| `children` | `React.ReactElement` | ❌       | Component to conditionally render based on schedule                  |

### Time Configuration Types

#### 📅 Daily Schedule

Perfect for recurring daily schedules like business hours or daily events.

```tsx
interface DailyTimeConfig {
  type: 'daily';
  start: string; // Time in HH:MM format (24-hour)
  end: string; // Time in HH:MM format (24-hour)
  days: number[]; // Day numbers (0=Sunday, 1=Monday, ..., 6=Saturday)
  priority?: number; // Lower numbers = higher priority (default: 10)
}
```

#### 🔄 Span Schedule

For events that cross multiple days, like weekend events or maintenance windows.

```tsx
interface SpanTimeConfig {
  type: 'span';
  startTime: string; // Start time in HH:MM format
  endTime: string; // End time in HH:MM format
  startDay: number; // Starting day of the week
  endDay: number; // Ending day of the week
  priority?: number; // Lower numbers = higher priority (default: 10)
}
```

### 📅 Day Constants

Pre-defined day arrays for common scheduling patterns:

```tsx
import { FULL_WEEK, WEEK_DAYS, WEEKENDS } from 'react-native-scheduled-view';

// Available constants:
FULL_WEEK = [0, 1, 2, 3, 4, 5, 6]; // All days
WEEK_DAYS = [1, 2, 3, 4, 5]; // Monday to Friday
WEEKENDS = [0, 6]; // Sunday and Saturday
```

### Priority System

When multiple time ranges overlap, the range with the **lower priority number** takes precedence:

- Priority `1` beats Priority `10`
- Default priority is `10`
- Use priorities to create exceptions to general rules

## Using TimeRangeManager Directly

If you prefer to handle time tracking logic yourself instead of using the `ScheduledView` component, you can use the `TimeRangeManager` class directly. This gives you more control over when and how to respond to time-based events.

### Basic Usage

```tsx
import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { TimeRangeManager } from 'react-native-scheduled-view';

export default function CustomScheduledComponent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const subscription = TimeRangeManager.registerTime(
      [
        {
          type: 'daily',
          start: '09:00',
          end: '17:00',
          days: [1, 2, 3, 4, 5], // Monday to Friday
        },
      ],
      () => setIsVisible(true), // onShow callback
      () => setIsVisible(false) // onHide callback
    );

    // Cleanup subscription on unmount
    return () => subscription.remove();
  }, []);

  return (
    <View>
      {isVisible && <Text>Content visible during business hours!</Text>}
      {!isVisible && <Text>Currently outside business hours</Text>}
    </View>
  );
}
```

### Advanced Usage with Multiple Handlers

```tsx
import React, { useState, useEffect } from 'react';
import { TimeRangeManager, WEEKENDS } from 'react-native-scheduled-view';

export default function AdvancedScheduledComponent() {
  const [businessHours, setBusinessHours] = useState(false);
  const [weekendMode, setWeekendMode] = useState(false);

  useEffect(() => {
    // Track business hours
    const businessSubscription = TimeRangeManager.registerTime(
      [{ type: 'daily', start: '09:00', end: '17:00', days: [1, 2, 3, 4, 5] }],
      () => setBusinessHours(true),
      () => setBusinessHours(false)
    );

    // Track weekend periods
    const weekendSubscription = TimeRangeManager.registerTime(
      [{ type: 'daily', start: '10:00', end: '20:00', days: WEEKENDS }],
      () => setWeekendMode(true),
      () => setWeekendMode(false)
    );

    return () => {
      businessSubscription.remove();
      weekendSubscription.remove();
    };
  }, []);

  return (
    <View>
      <Text>Business Hours: {businessHours ? 'Open' : 'Closed'}</Text>
      <Text>Weekend Mode: {weekendMode ? 'Active' : 'Inactive'}</Text>
    </View>
  );
}
```

### TimeRangeManager API

#### `registerTime(ranges, onShow, onHide)`

- **`ranges`**: Array of `TimeConfig` objects (same as ScheduledView)
- **`onShow`**: Callback function called when any range becomes active
- **`onHide`**: Callback function called when no ranges are active
- **Returns**: Object with `remove()` method to unsubscribe

**Important**: Always call `remove()` in cleanup to prevent memory leaks and ensure proper resource management.

## �💡 Common Use Cases

<details>
<summary><strong>🏢 Business Hours Display</strong></summary>

```tsx
<ScheduledView
  ranges={[
    {
      type: 'daily',
      start: '09:00',
      end: '17:00',
      days: WEEK_DAYS,
    },
  ]}
>
  <ContactForm />
</ScheduledView>
```

</details>

<details>
<summary><strong>🎉 Weekend Promotions</strong></summary>

```tsx
<ScheduledView
  ranges={[
    {
      type: 'daily',
      start: '12:00',
      end: '20:00',
      days: WEEKENDS,
    },
  ]}
>
  <WeekendPromotion />
</ScheduledView>
```

</details>

<details>
<summary><strong>🌙 Extended Weekend Hours</strong></summary>

```tsx
<ScheduledView
  ranges={[
    {
      type: 'span',
      startTime: '20:00', // Friday evening
      endTime: '08:00', // Monday morning
      startDay: 5, // Friday
      endDay: 1, // Monday
    },
  ]}
>
  <WeekendModeInterface />
</ScheduledView>
```

</details>

<details>
<summary><strong>🎯 Multiple Schedule Priorities</strong></summary>

```tsx
const holidaySchedule = [
  // Regular hours (lower priority)
  {
    type: 'daily',
    start: '09:00',
    end: '17:00',
    days: WEEK_DAYS,
    priority: 10,
  },
  // Holiday exception (higher priority)
  {
    type: 'daily',
    start: '12:00',
    end: '15:00',
    days: [1], // Monday only
    priority: 1,
  },
];

<ScheduledView ranges={holidaySchedule}>
  <StoreHours />
</ScheduledView>;
```

</details>

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**[⬆ Back to top](#-react-native-scheduled-view)**

</div>
