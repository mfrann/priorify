import type {
  Category,
  Priority,
  Task,
  TaskInput,
} from "@/features/tasks/types/task";
import { X } from "lucide-react-native";
import { useCallback, useEffect, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { BottomSheet } from "@/shared/components/BottomSheet";
import { CategorySelector } from "./CategorySelector";
import { DatePickerField } from "./DatePickerField";
import { PrioritySlider } from "./PrioritySlider";

interface TaskFormProps {
  visible: boolean;
  onClose: () => void;
  onSave: (task: TaskInput) => void;
  initialTask?: Task;
}

export function TaskForm({
  visible,
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
  }, [initialTask, visible, resetForm]);

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

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <BottomSheet visible={visible} onClose={handleClose}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Pressable
              onPress={handleClose}
              style={styles.closeButton}
              hitSlop={15}
            >
              <X size={24} color="#333" />
            </Pressable>
          </View>
          <Text style={styles.headerTitle}>
            {initialTask ? "EDIT TASK" : "ADD TASK"}
          </Text>
          <View style={styles.headerRight}>
            <Pressable
              onPress={handleSave}
              disabled={!title.trim()}
              style={[
                styles.saveButton,
                !title.trim() && styles.saveButtonDisabled,
              ]}
            >
              <Text
                style={[
                  styles.saveText,
                  !title.trim() && styles.saveTextDisabled,
                ]}
              >
                SAVE
              </Text>
            </Pressable>
          </View>
        </View>

        <ScrollView
          style={[styles.scrollView, { flex: 1 }]}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={true}
          indicatorStyle="white"
        >
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
        </ScrollView>
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerLeft: {
    width: 50,
    alignItems: "flex-start",
  },
  headerRight: {
    width: 50,
    alignItems: "flex-end",
  },
  closeButton: {
    padding: 4,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "900",
    color: "#333",
  },
  saveButton: {
    padding: 7,
    width: 70,
    borderRadius: 20,
    backgroundColor: "rgba(50, 50, 50, 0.8)",
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.4)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  saveButtonDisabled: {
    backgroundColor: "rgba(200, 200, 200, 0.3)",
    borderWidth: 1,
    borderColor: "rgba(200, 200, 200, 0.3)",
    shadowOpacity: 0,
    elevation: 0,
  },
  saveText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },
  saveTextDisabled: {
    color: "#999",
  },
  scrollView: {
    maxHeight: "100%",
  },
  scrollContent: {
    paddingBottom: 15,
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
});
