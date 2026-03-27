import { useState, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Pressable,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { OnboardingSlide } from "@/shared/components/OnboardingSlide";
import { COLORS } from "@/shared/constants/theme";

const { width } = Dimensions.get("window");
const PRIMARY_COLOR = COLORS.tabActive; // #1F2937 (gris oscuro)

interface Slide {
  id: string;
  title: string;
  subtitle: string;
  variant: "intro" | "priority" | "complete";
}

const SLIDES: Slide[] = [
  {
    id: "1",
    title: "Priorify",
    subtitle: "Organize your tasks visually",
    variant: "intro",
  },
  {
    id: "2",
    title: "Size = Priority",
    subtitle: "Larger bubbles are more important",
    variant: "priority",
  },
  {
    id: "3",
    title: "Double tap to complete",
    subtitle: "Tap a bubble twice to mark it as done",
    variant: "complete",
  },
];

const ONBOARDING_KEY = "hasSeenOnboarding";

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList<Slide>>(null);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / width);
    setCurrentIndex(index);
  };

  const handleFinish = async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_KEY, "true");
    } catch (error) {
      console.error("Failed to save onboarding state:", error);
    }
    router.replace("/home");
  };

  const renderSlide = ({ item, index }: { item: Slide; index: number }) => (
    <OnboardingSlide
      title={item.title}
      subtitle={item.subtitle}
      variant={item.variant}
      isActive={index === currentIndex}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <FlatList
          ref={flatListRef}
          data={SLIDES}
          renderItem={renderSlide}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          bounces={false}
        />
      </View>

      <View style={styles.footer}>
        <View style={styles.dotsContainer}>
          {SLIDES.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                currentIndex === index && [styles.dotActive, { backgroundColor: PRIMARY_COLOR }],
              ]}
            />
          ))}
        </View>

        {currentIndex === SLIDES.length - 1 && (
          <Pressable style={[styles.button, { backgroundColor: PRIMARY_COLOR }]} onPress={handleFinish}>
            <Text style={styles.buttonText}>Get Started</Text>
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    flex: 1,
  },
  footer: {
    paddingHorizontal: 40,
    paddingBottom: 40,
    alignItems: "center",
  },
  dotsContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 24,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#E5E7EB",
  },
  dotActive: {
    width: 24,
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 100,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
});