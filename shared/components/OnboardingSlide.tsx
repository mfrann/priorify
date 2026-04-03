import { StyleSheet, View, Text, Dimensions } from "react-native";
import Animated, {
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
  useSharedValue,
  withDelay,
} from "react-native-reanimated";
import { Hand } from "lucide-react-native";
import { useEffect } from "react";

interface OnboardingSlideProps {
  title: string;
  subtitle: string;
  variant: "intro" | "priority" | "complete";
  isActive?: boolean;
}

// Golden Angle Spiral (137.5°) - same pattern as sunflowers and galaxies
const GOLDEN_ANGLE = 137.5; // degrees
const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface SpiralBubble {
  size: number;
  color: string;
  x: number;
  y: number;
}

function calculateSpiralPositions(count: number): SpiralBubble[] {
  const bubbles: SpiralBubble[] = [];
  const colors = ["#B5D8EB", "#D4C4E8", "#F0C4B8", "#93C5FD", "#6EE7B7", "#FDE68A"];
  const sizes = [35, 45, 55, 40, 48, 60, 32, 50]; // Larger sizes

  for (let n = 0; n < count; n++) {
    // Golden angle spiral formula
    const angle = n * GOLDEN_ANGLE;
    const radius = 25 * Math.sqrt(n + 1); // Slightly larger radius
    const radians = (angle * Math.PI) / 180;

    const x = Math.cos(radians) * radius;
    const y = Math.sin(radians) * radius;

    bubbles.push({
      size: sizes[n % sizes.length],
      color: colors[n % colors.length],
      x,
      y,
    });
  }

  return bubbles;
}

// Floating decorative bubble with golden spiral position
function FloatingBubble({
  bubble,
  delay,
  duration,
}: {
  bubble: SpiralBubble;
  delay: number;
  duration: number;
}) {
  const floatOffset = useSharedValue(0);

  useEffect(() => {
    floatOffset.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(-6, {
            duration: duration,
            easing: Easing.inOut(Easing.ease),
          }),
          withTiming(6, {
            duration: duration,
            easing: Easing.inOut(Easing.ease),
          })
        ),
        -1,
        true
      ),
    );
  }, [delay, duration, floatOffset]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: bubble.x },
        { translateY: bubble.y + floatOffset.value },
      ],
    };
  });

  return (
    <Animated.View
      style={[
        styles.bubble,
        {
          width: bubble.size,
          height: bubble.size,
          borderRadius: bubble.size / 2,
          backgroundColor: bubble.color,
        },
        animatedStyle,
      ]}
    />
  );
}

// Intro visual using golden angle spiral
function IntroVisual() {
  const bubbles = calculateSpiralPositions(8);

  return (
    <View style={styles.spiralContainer}>
      {bubbles.map((bubble, index) => (
        <FloatingBubble
          key={index}
          bubble={bubble}
          delay={index * 100}
          duration={1800 + index * 150}
        />
      ))}
    </View>
  );
}

// Three bubbles for priority visualization
function PriorityBubbles() {
  const bubbles = [
    { size: 50, color: "#B5D8EB", delay: 0 }, // Low - small
    { size: 90, color: "#D4C4E8", delay: 200 }, // Medium - medium
    { size: 130, color: "#F0C4B8", delay: 400 }, // High - large
  ];

  return (
    <View style={styles.priorityContainer}>
      {bubbles.map((bubble, index) => (
        <View key={index} style={styles.priorityBubbleWrapper}>
          <AnimatedBubble
            size={bubble.size}
            color={bubble.color}
            delay={bubble.delay}
          />
        </View>
      ))}
    </View>
  );
}

// Animated bubble for priority visualization
function AnimatedBubble({
  size,
  color,
  delay,
}: {
  size: number;
  color: string;
  delay: number;
}) {
  const scale = useSharedValue(0);

  useEffect(() => {
    scale.value = withDelay(delay, withTiming(1, { duration: 500 }));
  }, [delay, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      style={[
        styles.priorityBubble,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
        },
        animatedStyle,
      ]}
    />
  );
}

// Double tap gesture visualization
function DoubleTapVisual() {
  const tap1Scale = useSharedValue(1);
  const tap2Scale = useSharedValue(1);

  useEffect(() => {
    const interval = setInterval(() => {
      tap1Scale.value = withSequence(
        withTiming(0.9, { duration: 100 }),
        withTiming(1, { duration: 100 })
      );
      tap2Scale.value = withDelay(
        150,
        withSequence(
          withTiming(0.9, { duration: 100 }),
          withTiming(1, { duration: 100 })
        )
      );
    }, 2000);

    return () => clearInterval(interval);
  }, [tap1Scale, tap2Scale]);

  const tap1Style = useAnimatedStyle(() => ({
    transform: [{ scale: tap1Scale.value }],
  }));

  const tap2Style = useAnimatedStyle(() => ({
    transform: [{ scale: tap2Scale.value }],
  }));

  return (
    <View style={styles.doubleTapContainer}>
      <Animated.View
        style={[
          styles.tapBubble,
          {
            width: 120,
            height: 120,
            borderRadius: 60,
            backgroundColor: "#F0C4B8",
          },
          tap1Style,
        ]}
      >
        <Text style={styles.checkmark}>✓</Text>
      </Animated.View>
      <View style={styles.fingersContainer}>
        <Animated.View style={[styles.fingerIcon, tap1Style]}>
          <Hand size={32} color="#333" />
        </Animated.View>
        <Animated.View style={[styles.fingerIcon, tap2Style]}>
          <Hand size={32} color="#333" />
        </Animated.View>
      </View>
    </View>
  );
}

export function OnboardingSlide({
  title,
  subtitle,
  variant,
  isActive = true,
}: OnboardingSlideProps) {
  return (
    <View style={styles.container}>
      <View style={styles.visualContainer}>
        {variant === "intro" && <IntroVisual />}
        {variant === "priority" && <PriorityBubbles />}
        {variant === "complete" && <DoubleTapVisual />}
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  visualContainer: {
    height: 220,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 48,
  },
  spiralContainer: {
    width: 220,
    height: 220,
    justifyContent: "center",
    alignItems: "center",
  },
  bubble: {
    position: "absolute",
    opacity: 0.85,
  },
  priorityContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    gap: 16,
  },
  priorityBubbleWrapper: {
    justifyContent: "flex-end",
    alignItems: "center",
  },
  priorityBubble: {
    opacity: 0.9,
  },
  doubleTapContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  tapBubble: {
    justifyContent: "center",
    alignItems: "center",
    opacity: 0.9,
  },
  checkmark: {
    fontSize: 48,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  fingersContainer: {
    flexDirection: "row",
    gap: 30,
    marginTop: 20,
  },
  fingerIcon: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    alignItems: "center",
  },
  title: {
    fontSize: 38,
    fontWeight: "800",
    color: "#1F2937",
    textAlign: "center",
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 26,
    paddingHorizontal: 10,
  },
});
