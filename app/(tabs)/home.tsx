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

type StatusFilter = "all" | "completed" | "active";

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
});
