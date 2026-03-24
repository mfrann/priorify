import type { Task } from "@/features/tasks/types/task";
import { BUBBLE_SIZE } from "@/shared/constants/theme";
import { Check } from "lucide-react-native";
import { useEffect } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

interface BubbleItemProps {
  task: Task;
  onPress: () => void;
  onDoubleTap?: () => void;
  color: string;
  scale?: number;
  index?: number;
  offsetX?: number;
  offsetY?: number;
  bubbleId?: string;
  zIndex?: number;
  colliding?: boolean;
}

export function BubbleItem({
  task,
  index = 0,
  onPress,
  onDoubleTap,
  color,
  scale: scaleProp = 1,
  offsetX = 0,
  offsetY = 0,
  bubbleId,
  zIndex = 1,
  colliding,
}: BubbleItemProps) {
  const size = BUBBLE_SIZE[task.priority] * scaleProp;
  const backgroundColor = color;

  // Texto adaptativo según tamaño de burbuja y largo del título
  const baseSize = size * 0.12;
  const lengthFactor = Math.max(0.5, 1 - (task.title.length - 5) * 0.025);
  const dynamicFontSize = Math.round(Math.max(8, Math.min(baseSize * lengthFactor, 16)));
  const maxLines = size < 80 ? 1 : 2;

  const scaleAnim = useSharedValue(0);
  const opacityAnim = useSharedValue(0);
  const floatAnim = useSharedValue(0);
  const pressAnim = useSharedValue(1);
  const positionX = useSharedValue(offsetX);
  const positionY = useSharedValue(offsetY);

  useEffect(() => {
    const delay = index * 50;
    const floatDuration = 2000 + index * 200;

    // Set initial position
    positionX.value = offsetX;
    positionY.value = offsetY;

    // Entry animations
    scaleAnim.value = withDelay(
      delay,
      withSpring(1, { damping: 12, stiffness: 100 }),
    );
    opacityAnim.value = withDelay(delay, withTiming(1, { duration: 300 }));

    // Floating animation
    floatAnim.value = withDelay(
      delay,
      withRepeat(
        withTiming(1, {
          duration: floatDuration / 2,
          easing: Easing.inOut(Easing.sin),
        }),
        -1,
        true,
      ),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  //Shake animation
  useEffect(() => {
    if (colliding) {
      const shake = () => {
        positionX.value = withSequence(
          withTiming(offsetX + 5, { duration: 50 }),
          withTiming(offsetX - 5, { duration: 50 }),
          withTiming(offsetX + 3, { duration: 50 }),
          withTiming(offsetX - 3, { duration: 50 }),
          withTiming(offsetX, { duration: 50 }),
        );
      };
      shake();
    }
  }, [colliding]);

  // Update position when offset changes
  useEffect(() => {
    positionX.value = offsetX;
    positionY.value = offsetY;
  }, [offsetX, offsetY, positionX, positionY]);

  // Handlers
  const handleDoubleTap = onDoubleTap ?? (() => {});

  // SINGLE-TAP gesture (reemplaza el onPress del Pressable)
  const singleTapGesture = Gesture.Tap()
    .maxDuration(250)
    .onEnd(() => {
      "worklet";
      runOnJS(onPress)();
    });

  // DOUBLE-TAP gesture
  const doubleTapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      "worklet";
      runOnJS(handleDoubleTap)();
    });

  // Exclusive: si es doble tap, NO ejecuta el single tap
  const combinedGesture = Gesture.Exclusive(doubleTapGesture, singleTapGesture);

  // Press feedback animations
  const handlePressIn = () => {
    pressAnim.value = withSpring(0.9, { damping: 15, stiffness: 200 });
  };

  const handlePressOut = () => {
    pressAnim.value = withSpring(1, { damping: 15, stiffness: 200 });
  };

  const animatedStyle = useAnimatedStyle(() => {
    const floatOffset = Math.sin(floatAnim.value * Math.PI) * 5;

    return {
      // Use actual position for touch area
      left: positionX.value,
      top: positionY.value + floatOffset,
      transform: [{ scale: scaleAnim.value * pressAnim.value }],
      opacity: opacityAnim.value,
    };
  });

  return (
    <Animated.View
      key={bubbleId}
      style={[styles.container, animatedStyle, { zIndex }]}
    >
      <GestureDetector gesture={combinedGesture}>
        <Pressable
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
          {task.completed ? (
            <Check size={dynamicFontSize + 10} color="#333" />
          ) : (
            <Text style={[styles.text, { fontSize: dynamicFontSize }]} numberOfLines={maxLines}>
              {task.title}
            </Text>
          )}
        </Pressable>
      </GestureDetector>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
  },
  bubble: {
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
    shadowColor: "#888",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  text: {
    fontWeight: "600",
    textAlign: "center",
    color: "#141414",
  },
});
