import { BubbleCanvas } from "@/features/tasks/components/BubbleCanvas";
import { StatusTabs } from "@/features/tasks/components/StatusTabs";
import { TaskDetailCard } from "@/features/tasks/components/TaskDetailCard";
import { TaskForm } from "@/features/tasks/components/TaskForm";
import { useTasks } from "@/features/tasks/hooks/useTasks";
import type { Task, TaskInput } from "@/features/tasks/types/task";
import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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

  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isDetailVisible, setIsDetailVisible] = useState(false);
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

  const handleBubblePress = (task: Task) => {
    setSelectedTask(task);
    setIsDetailVisible(true);
  };

  const handleAddTask = () => {
    setEditingTask(undefined);
    setIsFormVisible(true);
  };

  const handleToggleComplete = () => {
    if (selectedTask) {
      toggleComplete(selectedTask.id);
      setIsDetailVisible(false);
    }
  };

  const handleEditTask = () => {
    setIsDetailVisible(false);
    setEditingTask(selectedTask || undefined);
    setTimeout(() => {
      setIsFormVisible(true);
    }, 300);
  };

  const handleDeleteTask = () => {
    if (selectedTask) {
      removeTask(selectedTask.id);
      setIsDetailVisible(false);
      setSelectedTask(null);
    }
  };

  const handleSaveTask = (input: TaskInput) => {
    if (editingTask) {
      updateTask(editingTask.id, input);
    } else {
      const newTask: Task = {
        ...input,
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
      };
      addTask(newTask);
    }
    setIsFormVisible(false);
    setEditingTask(undefined);
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
          onBubblePress={handleBubblePress}
          onToggleComplete={toggleComplete}
        />
      </View>

      <Pressable style={styles.fab} onPress={handleAddTask}>
        <Text style={styles.fabText}>+</Text>
      </Pressable>

      <TaskForm
        visible={isFormVisible}
        onClose={() => setIsFormVisible(false)}
        onSave={handleSaveTask}
        initialTask={editingTask}
      />

      <TaskDetailCard
        task={selectedTask}
        visible={isDetailVisible}
        onClose={() => setIsDetailVisible(false)}
        onToggleComplete={handleToggleComplete}
        onEdit={handleEditTask}
        onDelete={handleDeleteTask}
      />
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
    color: "#333",
  },
  counterText: {
    fontSize: 14,
    color: "#66666690",
    marginTop: 4,
  },
  fab: {
    position: "absolute",
    bottom: 30,
    right: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#333333",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
    zIndex: 10,
  },
  fabText: {
    fontSize: 32,
    color: "#fff",
    fontWeight: "500",
    lineHeight: 34,
  },
});
