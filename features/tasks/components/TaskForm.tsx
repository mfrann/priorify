import type {
  Category,
  Priority,
  Task,
  TaskInput,
} from "@/features/tasks/types/task";
import { Check } from "lucide-react-native";
import { useCallback, useEffect, useState } from "react";
import {
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { CategorySelector } from "./CategorySelector";
import { DatePickerField } from "./DatePickerField";
import { PrioritySlider } from "./PrioritySlider";
import { COLORS } from "@/shared/constants/theme";

interface TaskFormProps {
  onClose: () => void;
  onSave: (task: TaskInput) => void;
  initialTask?: Task;
}

export function TaskForm({
  onClose,
  onSave,
  initialTask,
}: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>(2);
  const [category, setCategory] = useState<Category | undefined>(undefined);
  const [deadline, setDeadline] = useState<Date | undefined>(undefined);

  const resetForm = useCallback(() => {
    setTitle("");
    setDescription("");
    setPriority(2);
    setCategory(undefined);
    setDeadline(undefined);
  }, []);

  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title);
      setDescription(initialTask.description || "");
      setPriority(initialTask.priority);
      setCategory(initialTask.category);
      setDeadline(
        initialTask.deadline ? new Date(initialTask.deadline) : undefined,
      );
    } else {
      resetForm();
    }
  }, [initialTask]);

  const handleSave = () => {
    if (!title.trim()) return;

    onSave({
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
      category,
      completed: initialTask?.completed || false,
      deadline: deadline?.toISOString(),
    });

    resetForm();
    onClose();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {initialTask ? "EDIT TASK" : "ADD TASK"}
        </Text>
      </View>

      <BottomSheetScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.body}>
          <View style={styles.form}>
            <Text style={styles.sectionTitle}>TITLE</Text>
            <TextInput
              style={styles.input}
              placeholder="Task title..."
              placeholderTextColor="#999"
              value={title}
              onChangeText={setTitle}
            />

            <Text style={styles.sectionTitle}>CHOOSE PRIORITY</Text>
            <PrioritySlider value={priority} onChange={setPriority} />

            <Text style={styles.sectionTitle}>DESCRIPTION</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Description (optional)"
              placeholderTextColor="#999"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
            />

            <Text style={styles.sectionTitle}>CATEGORIES</Text>
            <CategorySelector value={category} onChange={setCategory} />

            <Text style={styles.sectionTitle}>DUE DATE</Text>
            <DatePickerField value={deadline} onChange={setDeadline} />
          </View>
        </View>
      </BottomSheetScrollView>

      <View style={styles.footer}>
        <Pressable style={styles.cancelButton} onPress={onClose}>
          <Text style={styles.cancelText}>CANCEL</Text>
        </Pressable>

        <Pressable
          style={[
            styles.actionButton,
            { backgroundColor: COLORS.tabActive },
            !title.trim() && styles.actionButtonDisabled,
          ]}
          onPress={handleSave}
          disabled={!title.trim()}
        >
          <Text style={styles.actionText}>
            {initialTask ? "SAVE" : "CREATE"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flexShrink: 1,
  },
  scrollContent: {
    paddingBottom: 16,
  },
  body: {
    paddingBottom: 20,
  },
  header: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: "#333",
  },
  form: {
    paddingHorizontal: 20,
    paddingTop: 16,
    gap: 16,
  },
  input: {
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 16,
    color: "#333",
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#999",
    letterSpacing: 1,
    marginTop: 8,
  },
  footer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 30,
    borderWidth: 1.5,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },
  cancelText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  actionButtonDisabled: {
    backgroundColor: "#ccc",
    shadowOpacity: 0,
    elevation: 0,
  },
  actionText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
});
