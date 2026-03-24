import { useEffect } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const SNAP_POINTS = {
  CLOSED: SCREEN_HEIGHT,
  OPEN: 0,
};

interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function BottomSheet({ visible, onClose, children }: BottomSheetProps) {
  const translateY = useSharedValue(SNAP_POINTS.CLOSED);
  const context = useSharedValue({ y: 0 });

  useEffect(() => {
    if (visible) {
      translateY.value = withTiming(SNAP_POINTS.OPEN, {
        duration: 300,
      });
    } else {
      translateY.value = withTiming(SNAP_POINTS.CLOSED, {
        duration: 300,
      });
    }
  }, [visible, translateY]);

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const overlayStyle = useAnimatedStyle(() => {
    // progress = 0 cuando cerrado, = 1 cuando abierto
    const progress = 1 - translateY.value / SNAP_POINTS.CLOSED;
    return {
      opacity: Math.max(0, Math.min(1, progress)),
      pointerEvents: progress > 0.1 ? ("auto" as const) : ("none" as const),
    };
  });

  const panGesture = Gesture.Pan()
    .onStart(() => {
      context.value = { y: translateY.value };
    })
    .onUpdate((event) => {
      const newY = Math.max(0, context.value.y + event.translationY);
      translateY.value = newY;
    })
    .onEnd((event) => {
      if (event.translationY > 100 || event.velocityY > 500) {
        translateY.value = withTiming(SNAP_POINTS.CLOSED, { duration: 200 });
        runOnJS(onClose)();
      } else {
        translateY.value = withTiming(SNAP_POINTS.OPEN, { duration: 200 });
      }
    });

  return (
    <>
      <Animated.View
        style={[styles.overlay, overlayStyle, { zIndex: 100 }]}
        onTouchEnd={onClose}
      />
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.container, sheetStyle, { zIndex: 101 }]}>
          <View style={styles.handleContainer}>
            <View style={styles.handle} />
          </View>
          <View style={styles.contentWrapper}>{children}</View>
        </Animated.View>
      </GestureDetector>
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
    overflow: "hidden",
  },
  handleContainer: {
    alignItems: "center",
    paddingVertical: 12,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: "#ddd",
    borderRadius: 2,
  },

  contentWrapper: {
    flex: 1,
    overflow: "hidden",
  },
});
