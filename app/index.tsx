import { BubbleCanvas } from "@/features/tasks/components/BubbleCanvas";
import { TaskDetailCard } from "@/features/tasks/components/TaskDetailCard";
import { TaskForm } from "@/features/tasks/components/TaskForm";
import { useTasks } from "@/features/tasks/hooks/useTasks";
import type { Task, TaskInput } from "@/features/tasks/types/task";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const {
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
        id: Date.now().toString(),
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
        <Text style={styles.counterText}>
          {activeTasks.length} active / {completedTasks.length} done
        </Text>
      </View>

      <BubbleCanvas tasks={activeTasks} onBubblePress={handleBubblePress} />

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
  },
  fabText: {
    fontSize: 32,
    color: "#fff",
    fontWeight: "500",
    lineHeight: 34,
  },
});
