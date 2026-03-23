import { StyleSheet, Text, Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSpring,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import type { Task } from '@/features/tasks/types/task';
import { PRIORITY_COLORS, BUBBLE_SIZE } from '@/shared/constants/theme';
import { useEffect } from 'react';

interface BubbleItemProps {
  task: Task;
  onPress: () => void;
  scale?: number;
  index?: number;
  offsetX?: number;
  offsetY?: number;
  bubbleId?: string;
}

export function BubbleItem({
  task,
  index = 0,
  onPress,
  scale: scaleProp = 1,
  offsetX = 0,
  offsetY = 0,
  bubbleId,
}: BubbleItemProps) {
  const size = BUBBLE_SIZE[task.priority] * scaleProp;
  const backgroundColor = PRIORITY_COLORS[task.priority];
  const fontSize = task.priority >= 3 ? 14 : 12;

  const scaleAnim = useSharedValue(0);
  const opacityAnim = useSharedValue(0);
  const floatAnim = useSharedValue(0);
  const pressAnim = useSharedValue(1);

  useEffect(() => {
    const delay = index * 50;
    const floatDuration = 2000 + index * 200;

    scaleAnim.value = withDelay(
      delay,
      withSpring(1, { damping: 12, stiffness: 100 })
    );
    opacityAnim.value = withDelay(delay, withTiming(1, { duration: 300 }));

    floatAnim.value = withDelay(
      delay,
      withRepeat(
        withTiming(1, { duration: floatDuration / 2, easing: Easing.inOut(Easing.sin) }),
        -1,
        true
      )
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  const handlePressIn = () => {
    pressAnim.value = withSpring(0.9, { damping: 15, stiffness: 200 });
  };

  const handlePressOut = () => {
    pressAnim.value = withSpring(1, { damping: 15, stiffness: 200 });
  };

  const animatedStyle = useAnimatedStyle(() => {
    const floatOffset = Math.sin(floatAnim.value * Math.PI) * 5;

    return {
      transform: [
        { translateX: offsetX },
        { translateY: offsetY + floatOffset },
        { scale: scaleAnim.value * pressAnim.value },
      ],
      opacity: opacityAnim.value * (task.completed ? 0.5 : 1),
    };
  });

  return (
    <Animated.View
      key={bubbleId}
      style={[styles.container, animatedStyle]}
    >
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          styles.bubble,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor,
          },
        ]}
      >
        <Text
          style={[styles.text, { fontSize }]}
          numberOfLines={2}
        >
          {task.title}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
  bubble: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    shadowColor: '#888',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
    color: '#333',
  },
});
