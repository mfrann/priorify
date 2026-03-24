import type { Priority } from "@/features/tasks/types/task";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const SLIDER_WIDTH = 320;
const POINT_WIDTH = SLIDER_WIDTH / 2;
const THUMB_SIZE = 28;
const POINT_SIZE = 16;
const CONTAINER_HEIGHT = 44;

const LABELS = ["Small", "Medium", "Large"];

interface PrioritySliderProps {
  value?: Priority;
  onChange: (priority: Priority) => void;
}

const DEFAULT_PRIORITY: Priority = 2;

export function PrioritySlider({ value, onChange }: PrioritySliderProps) {
  const effectiveValue = value ?? DEFAULT_PRIORITY;
  const translateX = useSharedValue((effectiveValue - 1) * POINT_WIDTH);
  const context = useSharedValue({ x: 0 });
  const [sliderX, setSliderX] = useState(0);

  useEffect(() => {
    translateX.value = withTiming((effectiveValue - 1) * POINT_WIDTH, {
      duration: 150,
    });
  }, [effectiveValue, translateX]);

  const updateValue = (newValue: Priority) => {
    onChange(newValue);
  };

  const panGesture = Gesture.Pan()
    .onStart(() => {
      context.value = { x: translateX.value };
    })
    .onUpdate((event) => {
      const newX = Math.max(
        0,
        Math.min(POINT_WIDTH * 2, context.value.x + event.translationX),
      );
      translateX.value = newX;
    })
    .onEnd(() => {
      const index = Math.round(translateX.value / POINT_WIDTH);
      const clampedIndex = Math.max(0, Math.min(2, index));
      translateX.value = withTiming(clampedIndex * POINT_WIDTH, {
        duration: 150,
      });
      runOnJS(updateValue)((clampedIndex + 1) as Priority);
    });

  const tapGesture = Gesture.Tap().onEnd((event) => {
    const relativeX = event.x - sliderX;
    const index = Math.round(relativeX / POINT_WIDTH);
    const clampedIndex = Math.max(0, Math.min(2, index));
    translateX.value = withTiming(clampedIndex * POINT_WIDTH, {
      duration: 150,
    });
    runOnJS(updateValue)((clampedIndex + 1) as Priority);
  });

  const composedGesture = Gesture.Race(panGesture, tapGesture);

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View style={styles.container}>
      <GestureDetector gesture={composedGesture}>
        <View 
          style={styles.sliderContainer}
          onLayout={(event) => setSliderX(event.nativeEvent.layout.x)}
        >
          <View style={styles.track} />
          <Animated.View style={[styles.thumb, thumbStyle]} />
          {[0, 1, 2].map((index) => (
            <View
              key={index}
              style={[
                styles.point,
                { left: index * POINT_WIDTH - POINT_SIZE / 2 },
              ]}
            />
          ))}
        </View>
      </GestureDetector>
      <View style={styles.labels}>
        {LABELS.map((label, index) => (
          <Text
            key={label}
            style={[
              styles.label,
              effectiveValue === index + 1 && styles.labelActive,
            ]}
          >
            {label}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    alignItems: "center",
  },
  sliderContainer: {
    width: SLIDER_WIDTH,
    height: CONTAINER_HEIGHT,
    justifyContent: "center",
  },
  track: {
    position: "absolute",
    width: SLIDER_WIDTH,
    height: 2,
    backgroundColor: "#e8e8e8",
    top: (CONTAINER_HEIGHT - 2) / 2,
  },
  thumb: {
    position: "absolute",
    left: -25,
    width: 50,
    height: THUMB_SIZE,
    borderRadius: 20,
    backgroundColor: "#333",
    borderWidth: 3,
    borderColor: "#fff",
    top: (CONTAINER_HEIGHT - THUMB_SIZE) / 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 10,
  },
  point: {
    position: "absolute",
    width: POINT_SIZE,
    height: POINT_SIZE,
    borderRadius: 10,
    backgroundColor: "#ddd",
    borderWidth: 2,
    borderColor: "#fff",
    top: (CONTAINER_HEIGHT - POINT_SIZE) / 2,
  },
  labels: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: SLIDER_WIDTH,
    marginTop: 8,
  },
  label: {
    fontSize: 12,
    color: "#999",
  },
  labelActive: {
    color: "#333",
    fontWeight: "600",
  },
});
