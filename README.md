# react-native-scheduled-view

[![npm version](https://img.shields.io/npm/v/react-native-scheduled-view.svg)](https://www.npmjs.com/package/react-native-scheduled-view)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](https://www.typescriptlang.org/)

> 🚧 **Work in Progress** - This library is currently under active development

A React Native library for scheduling and managing view visibility based on time, conditions, or user interactions. Perfect for creating time-based UI components, scheduled content display, and conditional view rendering.

## Features

- ⏰ **Time-based scheduling** - Show/hide views at specific times or intervals
- 🎯 **Conditional rendering** - Display content based on custom conditions
- 📱 **Cross-platform** - Works on both iOS and Android
- 🔧 **TypeScript support** - Fully typed for better development experience
- ⚡ **Lightweight** - Minimal dependencies and optimized performance
- 🎨 **Customizable** - Flexible configuration options

## Installation

```sh
npm install react-native-scheduled-view
```

or with yarn:

```sh
yarn add react-native-scheduled-view
```

## Usage

### Basic Example

```tsx
import React from 'react';
import { Text } from 'react-native';
import { ScheduledView } from 'react-native-scheduled-view';

export default function App() {
  return (
    <ScheduledView
      schedule={{
        startTime: '09:00',
        endTime: '17:00',
      }}
      fallback={<Text>Content not available right now</Text>}
    >
      <Text>This content is only visible during business hours!</Text>
    </ScheduledView>
  );
}
```

### Advanced Configuration

```tsx
import React from 'react';
import { View, Text } from 'react-native';
import { ScheduledView } from 'react-native-scheduled-view';

export default function AdvancedExample() {
  return (
    <ScheduledView
      schedule={{
        days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
        startTime: '08:00',
        endTime: '18:00',
        timezone: 'America/New_York',
      }}
      condition={() => new Date().getHours() >= 8}
      onVisibilityChange={(isVisible) => {
        console.log('View visibility changed:', isVisible);
      }}
    >
      <View>
        <Text>Weekday business hours content</Text>
      </View>
    </ScheduledView>
  );
}
```

## API Reference

### ScheduledView Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `schedule` | `ScheduleConfig` | - | Configuration for when the view should be visible |
| `condition` | `() => boolean` | - | Custom condition function for visibility |
| `fallback` | `ReactNode` | `null` | Component to render when content is not scheduled to be visible |
| `onVisibilityChange` | `(visible: boolean) => void` | - | Callback fired when visibility changes |
| `children` | `ReactNode` | - | Content to render when scheduled/condition is met |

### ScheduleConfig

```typescript
interface ScheduleConfig {
  startTime?: string;     // Format: 'HH:MM'
  endTime?: string;       // Format: 'HH:MM'
  days?: WeekDay[];       // Array of weekdays
  timezone?: string;      // Timezone identifier
  dates?: string[];       // Specific dates (ISO format)
}

type WeekDay = 'sunday' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday';
```

## Requirements

- React Native >= 0.60.0
- React >= 16.8.0

## Roadmap

- [ ] Basic time-based scheduling
- [ ] Date-specific scheduling
- [ ] Timezone support
- [ ] Custom condition functions
- [ ] Animation support for transitions
- [ ] Recurring schedules
- [ ] Performance optimizations

## Contributing

We welcome contributions! Please see our [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT © [Mikael Åberg](https://github.com/Mikael-Aberg)

---

Made with ❤️ using [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
