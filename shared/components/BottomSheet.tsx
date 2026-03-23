import { useEffect } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const SNAP_POINTS = {
  CLOSED: SCREEN_HEIGHT,
  OPEN: SCREEN_HEIGHT * 0.002,
};

interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function BottomSheet({ visible, onClose, children }: BottomSheetProps) {
  const translateY = useSharedValue(SNAP_POINTS.CLOSED);

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
    const progress = translateY.value / SNAP_POINTS.OPEN;
    return {
      opacity: Math.max(0, 1 - progress),
      pointerEvents: "none" as const,
    };
  });

  return (
    <>
      <Animated.View style={[styles.overlay, overlayStyle]} />
      <Animated.View style={[styles.container, sheetStyle]}>
        <View style={styles.handleContainer}>
          <View style={styles.handle} />
        </View>
        {children}
      </Animated.View>
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
    height: SCREEN_HEIGHT * 0.7,
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
});
