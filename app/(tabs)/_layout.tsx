import { Tabs, useNavigationContainerRef, usePathname } from "expo-router";
import { StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { Home, CalendarDays, Settings } from "lucide-react-native";
import { useSwipeNavigation } from "@/shared/hooks/useSwipeNavigation";

const TAB_ROUTES = ["/home", "/calendar", "/settings"] as const;

function getCurrentIndex(pathname: string): number {
  if (pathname.includes("calendar")) return 1;
  if (pathname.includes("settings")) return 2;
  if (pathname.includes("home")) return 0;
  return 0;
}

export default function TabsLayout() {
  const pathname = usePathname();
  const currentIndex = getCurrentIndex(pathname);
  const navigationRef = useNavigationContainerRef();

  const { swipeGesture, GestureDetector } = useSwipeNavigation({
    onSwipeLeft: () => {
      if (currentIndex < TAB_ROUTES.length - 1) {
        const targetRoute = currentIndex === 0 ? "calendar" : "settings";
        // @ts-expect-error - expo-router navigation typing issue
        navigationRef.navigate(targetRoute);
      }
    },
    onSwipeRight: () => {
      if (currentIndex > 0) {
        const targetRoute = currentIndex === 2 ? "calendar" : "home";
        // @ts-expect-error - expo-router navigation typing issue
        navigationRef.navigate(targetRoute);
      }
    },
  });

  return (
    <GestureHandlerRootView style={styles.container}>
      <GestureDetector gesture={swipeGesture}>
        <View style={[styles.container, styles.background]}>
          <BottomSheetModalProvider>
            <Tabs
              screenOptions={{
                headerShown: false,
                animation: "fade",
                tabBarActiveTintColor: "#333",
                tabBarInactiveTintColor: "#999",
                tabBarStyle: {
                  height: 60,
                  paddingBottom: 8,
                  paddingTop: 8,
                },
                tabBarLabelStyle: {
                  fontSize: 12,
                  fontWeight: "600",
                },
              }}
            >
              <Tabs.Screen
                name="home"
                options={{
                  title: "Home",
                  tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
                }}
              />
              <Tabs.Screen
                name="calendar"
                options={{
                  title: "Calendar",
                  tabBarIcon: ({ color, size }) => (
                    <CalendarDays size={size} color={color} />
                  ),
                }}
              />
              <Tabs.Screen
                name="settings"
                options={{
                  title: "Settings",
                  tabBarIcon: ({ color, size }) => (
                    <Settings size={size} color={color} />
                  ),
                }}
              />
            </Tabs>
          </BottomSheetModalProvider>
        </View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    backgroundColor: "#FFFFFF",
  },
});
