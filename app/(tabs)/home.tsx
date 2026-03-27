import { BubbleCanvas } from "@/features/tasks/components/BubbleCanvas";
import { StatusTabs } from "@/features/tasks/components/StatusTabs";
import { TaskDetailCard } from "@/features/tasks/components/TaskDetailCard";
import { TaskForm } from "@/features/tasks/components/TaskForm";
import { useTasks } from "@/features/tasks/hooks/useTasks";
import type { Task, TaskInput } from "@/features/tasks/types/task";
import { COLORS } from "@/shared/constants/theme";
import { TaskSheet } from "@/shared/components/TaskSheet";
import { useToast } from "@/shared/hooks/useToast";
import { useMemo, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { BottomSheetModal } from "@gorhom/bottom-sheet";
import Animated, {
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useEffect } from "react";
import { X } from "lucide-react-native";

type StatusFilter = "all" | "completed" | "active";

// Reusable mascot component
function Mascot({ size = 50 }: { size?: number }) {
  const bounce = useSharedValue(0);
  const eyePulse = useSharedValue(1);

  useEffect(() => {
    bounce.value = withRepeat(
      withSequence(
        withTiming(-4, { duration: 600, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 600, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    eyePulse.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, [bounce, eyePulse]);

  const bodyStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: bounce.value }],
  }));

  const eyeStyle = useAnimatedStyle(() => ({
    transform: [{ scale: eyePulse.value }],
  }));

  const bodySize = size;
  const eyeSize = size * 0.5;
  const pupilSize = size * 0.24;
  const antennaHeight = size * 0.25;
  const ballSize = size * 0.24;

  return (
    <View style={[styles.mascotBodyContainer, { width: bodySize, height: bodySize }]}>
      <Animated.View style={bodyStyle}>
        <View style={styles.mascotAntennaWrapper}>
          <View style={[styles.mascotAntenna, {
            height: antennaHeight,
          }]}>
            <View style={[styles.mascotAntennaBall, {
              width: ballSize,
              height: ballSize,
              borderRadius: ballSize / 2,
            }]} />
          </View>
        </View>
        <View style={[
          styles.mascotBody,
          {
            width: bodySize,
            height: bodySize,
            borderRadius: bodySize / 2
          }
        ]}>
          <Animated.View style={[
            styles.mascotEye,
            eyeStyle,
            { width: eyeSize, height: eyeSize, borderRadius: eyeSize / 2 }
          ]}>
            <View style={[styles.mascotPupil, {
              width: pupilSize,
              height: pupilSize,
              borderRadius: pupilSize / 2
            }]} />
          </Animated.View>
          <View style={[styles.mascotMouth, { width: bodySize * 0.36 }]} />
        </View>
      </Animated.View>
    </View>
  );
}

// Simple mascot for home screen - clickable
function HomeMascot({ onPress }: { onPress: () => void }) {
  return (
    <Pressable style={styles.mascotContainer} onPress={onPress}>
      <Mascot size={60} />
    </Pressable>
  );
}

// AI Assistant Card Modal
function AssistantCard({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const scale = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(visible ? 1 : 0, {
      damping: 15,
      stiffness: 150,
    });
  }, [visible, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: scale.value,
  }));

  if (!visible) return null;

  const features = [
    "Create tasks with voice",
    "Smart priority suggestions",
    "Daily insights & stats",
    "Motivational messages",
    "Smart deadline recommendations",
  ];

  return (
    <View style={styles.assistantOverlay}>
      <Pressable style={styles.assistantBackdrop} onPress={onClose} />
      <Animated.View style={[styles.assistantCard, animatedStyle]}>
        {/* Header */}
        <View style={styles.assistantHeader}>
          <Mascot size={55} />
          <View style={styles.assistantIntro}>
            <Text style={styles.assistantTitle}>Hi! I am Bouncy</Text>
            <Text style={styles.assistantSubtitle}>Your AI Assistant</Text>
          </View>
        </View>

        {/* Features */}
        <View style={styles.assistantFeatures}>
          {features.map((feature, index) => (
            <View key={index} style={styles.assistantFeature}>
              <Text style={styles.assistantFeatureBullet}>•</Text>
              <Text style={styles.assistantFeatureText}>{feature}</Text>
            </View>
          ))}
        </View>

        {/* Footer */}
        <View style={styles.assistantFooter}>
          <Text style={styles.assistantComingSoon}>Coming soon</Text>
          <Pressable style={styles.assistantCloseBtn} onPress={onClose}>
            <X size={20} color="#FFFFFF" />
          </Pressable>
        </View>
      </Animated.View>
    </View>
  );
}

export default function HomeScreen() {
  const {
    tasks,
    activeTasks,
    completedTasks,
    isLoading,
    isInitialized,
    addTask,
    updateTask,
    removeTask,
    toggleComplete,
  } = useTasks();

  // Toast
  const { showToast, ToastComponent } = useToast();

  // Refs para los BottomSheet modals
  const formSheetRef = useRef<BottomSheetModal>(null);
  const detailSheetRef = useRef<BottomSheetModal>(null);

  // Estado para la tarea seleccionada
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);

  // Filtros
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [showAssistant, setShowAssistant] = useState(false);

  // Tareas filtradas
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (statusFilter === "all") return true;
      if (statusFilter === "completed") return task.completed;
      if (statusFilter === "active") return !task.completed;
      return true;
    });
  }, [tasks, statusFilter]);

  // Counts para los tabs
  const counts = useMemo(
    () => ({
      all: tasks.length,
      completed: completedTasks.length,
      active: activeTasks.length,
    }),
    [tasks.length, completedTasks.length, activeTasks.length],
  );

  // Handlers
  const handleBubblePress = (task: Task) => {
    setSelectedTask(task);
    detailSheetRef.current?.present();
  };

  const handleAddTask = () => {
    setEditingTask(undefined);
    formSheetRef.current?.present();
  };

  const handleToggleComplete = () => {
    if (selectedTask) {
      toggleComplete(selectedTask.id);
      showToast("Task completed");
      detailSheetRef.current?.dismiss();
    }
  };

  const handleEditTask = () => {
    detailSheetRef.current?.dismiss();
    setTimeout(() => {
      setEditingTask(selectedTask || undefined);
      formSheetRef.current?.present();
    }, 300);
  };

  const handleDeleteTask = () => {
    if (selectedTask) {
      removeTask(selectedTask.id);
      showToast("Task deleted");
      detailSheetRef.current?.dismiss();
      setSelectedTask(null);
    }
  };

  const handleSaveTask = (input: TaskInput) => {
    if (editingTask) {
      updateTask(editingTask.id, input);
      showToast("Task updated");
    } else {
      const newTask: Task = {
        ...input,
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
      };
      addTask(newTask);
      showToast("Task created");
    }
    formSheetRef.current?.dismiss();
    setEditingTask(undefined);
  };

  const handleFormClose = () => {
    formSheetRef.current?.dismiss();
    setEditingTask(undefined);
  };

  const handleDetailClose = () => {
    detailSheetRef.current?.dismiss();
  };

  if (!isInitialized || isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Priorify</Text>
      </View>

      <StatusTabs
        value={statusFilter}
        onChange={setStatusFilter}
        counts={counts}
      />

      <View style={styles.canvasContainer}>
        <BubbleCanvas
          tasks={filteredTasks}
          statusFilter={statusFilter}
          onBubblePress={handleBubblePress}
          onToggleComplete={(taskId, willBeCompleted) => {
            toggleComplete(taskId);
            if (willBeCompleted) {
              showToast("Task completed");
            }
          }}
        />
      </View>

      <Pressable style={styles.fab} onPress={handleAddTask}>
        <Text style={styles.fabText}>+</Text>
      </Pressable>

      {/* Mascot */}
      <HomeMascot onPress={() => setShowAssistant(true)} />

      {/* Assistant Card */}
      <AssistantCard
        visible={showAssistant}
        onClose={() => setShowAssistant(false)}
      />

      {/* Task Form Sheet */}
      <TaskSheet ref={formSheetRef} onClose={handleFormClose}>
        <TaskForm
          onClose={handleFormClose}
          onSave={handleSaveTask}
          initialTask={editingTask}
        />
      </TaskSheet>

      {/* Task Detail Sheet */}
      <TaskSheet ref={detailSheetRef} onClose={handleDetailClose}>
        {selectedTask && (
          <TaskDetailCard
            task={selectedTask}
            onClose={handleDetailClose}
            onToggleComplete={handleToggleComplete}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
          />
        )}
      </TaskSheet>

      {/* Toast */}
      <ToastComponent />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  canvasContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginTop: 20,
    backgroundColor: "#fff",
  },
  headerTitle: {
    fontSize: 45,
    fontWeight: "800",
    color: COLORS.textPrimary,
  },
  counterText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.tabActive,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
    zIndex: 1,
  },
  fabText: {
    fontSize: 32,
    color: COLORS.textInverse,
    fontWeight: "500",
    lineHeight: 34,
  },
  mascot: {
    position: "absolute",
    bottom: 24,
    left: 24,
    alignItems: "center",
    zIndex: 1,
  },
  mascotBodyContainer: {
    alignItems: "center",
  },
  mascotAntennaWrapper: {
    alignItems: "center",
  },
  mascotAntenna: {
    width: 3,
    backgroundColor: "#9CA3AF",
    borderRadius: 2,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  mascotAntennaBall: {
    position: "absolute",
    top: -10,
    alignSelf: "center",
    width: 12,
    height: 12,
    backgroundColor: "#3B82F6",
    borderRadius: 6,
  },
  mascotBody: {
    width: 50,
    height: 55,
    backgroundColor: "#DBEAFE",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mascotEye: {
    width: 26,
    height: 26,
    backgroundColor: "#FFFFFF",
    borderRadius: 13,
    justifyContent: "center",
    alignItems: "center",
  },
  mascotPupil: {
    width: 12,
    height: 12,
    backgroundColor: "#3B82F6",
    borderRadius: 6,
  },
  mascotMouth: {
    width: 18,
    height: 8,
    borderBottomWidth: 3,
    borderBottomColor: "#3B82F6",
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    marginTop: 6,
  },
  // Mascot Container
  mascotContainer: {
    position: "absolute",
    bottom: 40,
    left: 24,
    zIndex: 10,
    alignItems: "center",
  },
  // Assistant Card
  assistantOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },
  assistantBackdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  assistantCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    width: 300,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  assistantHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  assistantIntro: {
    marginLeft: 16,
    flex: 1,
  },
  assistantTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
  },
  assistantSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 2,
  },
  assistantFeatures: {
    marginBottom: 20,
  },
  assistantFeature: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  assistantFeatureBullet: {
    fontSize: 14,
    color: "#3B82F6",
    marginRight: 8,
  },
  assistantFeatureText: {
    fontSize: 14,
    color: "#4B5563",
  },
  assistantFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  assistantComingSoon: {
    fontSize: 14,
    fontWeight: "600",
    color: "#9CA3AF",
    fontStyle: "italic",
  },
  assistantCloseBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.tabActive,
    justifyContent: "center",
    alignItems: "center",
  },
});
