import { useState } from 'react';
import { View, StyleSheet, Text, Button } from 'react-native';
import ScheduledView, {
  FULL_WEEK,
  type TimeConfig,
} from 'react-native-scheduled-view';

export default function App() {
  const [random, setRandom] = useState(0);

  const ranges: TimeConfig[] = [
    {
      type: 'daily',
      start: '10:00',
      end: '20:00',
      priority: 1,
      days: FULL_WEEK,
    },
  ];

  return (
    <View style={styles.container}>
      <Button
        title="Set random number"
        onPress={() => {
          setRandom(Math.random());
        }}
      />
      <Text>{random}</Text>
      <ScheduledView ranges={ranges}>
        <Text>Hello!</Text>
      </ScheduledView>
      <ScheduledView ranges={ranges}>
        <Text>Hello!</Text>
      </ScheduledView>
      <ScheduledView ranges={ranges}>
        <Text>Hello!</Text>
      </ScheduledView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
