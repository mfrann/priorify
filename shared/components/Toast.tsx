import { COLORS } from "@/shared/constants/theme";
import { CheckCircle } from "lucide-react-native";
import { useEffect, useState } from "react";
import { StyleSheet, Text, Animated, View } from "react-native";

interface ToastProps {
  message: string;
  visible: boolean;
  onHide: () => void;
  duration?: number;
  type?: "success" | "error" | "info";
}

export function Toast({
  message,
  visible,
  onHide,
  duration = 2500,
  type = "success",
}: ToastProps) {
  const [opacity] = useState(new Animated.Value(0));
  const [translateY] = useState(new Animated.Value(50));

  useEffect(() => {
    if (visible) {
      // Show animation
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          damping: 15,
          stiffness: 150,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto hide
      const timer = setTimeout(() => {
        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: 50,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start(() => onHide());
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible, duration, onHide, opacity, translateY]);

  if (!visible) return null;

  const backgroundColor =
    type === "success"
      ? COLORS.tabActive
      : type === "error"
        ? COLORS.destructive
        : COLORS.tabActive;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor,
          opacity,
          transform: [{ translateY }],
        },
      ]}
    >
      <CheckCircle size={20} color={COLORS.textInverse} />
      <Text style={styles.message}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 100,
    left: 30,
    right: 30,
    flexDirection: "row",
    alignItems: "center",
    textAlign: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 100,
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1000,
  },
  message: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.textInverse,
    flex: 1,
  },
});
