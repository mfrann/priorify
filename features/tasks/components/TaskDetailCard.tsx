import type { Task } from "@/features/tasks/types/task";
import { BottomSheet } from "@/shared/components/BottomSheet";
import {
  CATEGORY_COLORS,
  CATEGORY_LABELS,
  PRIORITY_LABELS,
} from "@/shared/constants/theme";
import {
  BookOpen,
  Briefcase,
  Calendar,
  Check,
  Heart,
  Star,
  Trash2,
  User,
  X,
} from "lucide-react-native";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

const CATEGORY_ICONS = {
  WORK: Briefcase,
  PERSONAL: User,
  STUDY: BookOpen,
  HEALTH: Heart,
  FUN: Star,
};

interface TaskDetailCardProps {
  task: Task | null;
  visible: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onToggleComplete: () => void;
}

export function TaskDetailCard({
  task,
  visible,
  onClose,
  onEdit,
  onDelete,
  onToggleComplete,
}: TaskDetailCardProps) {
  if (!task) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const capitalize = (str: string): string => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const priorityLabel = PRIORITY_LABELS[task.priority];
  const priorityWidth =
    task.priority === 1 ? "33%" : task.priority === 2 ? "66%" : "100%";

  const categoryColor = task.category
    ? CATEGORY_COLORS[task.category]
    : undefined;
  const categoryLabel = task.category
    ? CATEGORY_LABELS[task.category]
    : undefined;
  const CategoryIcon = task.category
    ? CATEGORY_ICONS[task.category]
    : undefined;

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Pressable
              onPress={onClose}
              style={styles.closeButton}
              hitSlop={15}
            >
              <X size={24} color="#333" />
            </Pressable>
          </View>
          <Text style={styles.headerTitle}>TASK DETAIL</Text>
          <View style={styles.headerRight}>
            <Pressable onPress={onEdit} style={styles.editButton}>
              <Text style={styles.editText}>EDIT</Text>
            </Pressable>
          </View>
        </View>

        <ScrollView
          style={[styles.body, { flex: 1 }]}
          showsVerticalScrollIndicator={true}
          indicatorStyle="white"
          contentContainerStyle={styles.bodyContent}
        >
          <View style={styles.section}>
            <Text style={styles.title}>{capitalize(task.title)}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.section}>
            <Text style={styles.label}>PRIORITY</Text>
            <View style={styles.priorityRow}>
              <View style={styles.priorityBarContainer}>
                <View
                  style={[
                    styles.priorityBarFill,
                    { width: priorityWidth, backgroundColor: categoryColor },
                  ]}
                />
              </View>
              <Text style={[styles.priorityLabel, { color: categoryColor }]}>
                {priorityLabel}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.section}>
            <Text style={styles.label}>DESCRIPTION</Text>
            {task.description ? (
              <Text style={styles.value}>{capitalize(task.description)}</Text>
            ) : (
              <Text style={styles.noValue}>No description</Text>
            )}
          </View>

          <View style={styles.divider} />

          <View style={styles.section}>
            <Text style={styles.label}>CATEGORY</Text>
            {task.category ? (
              <View
                style={[
                  styles.categoryBadge,
                  {
                    borderColor: categoryColor,
                    backgroundColor: `${categoryColor}1A`,
                  },
                ]}
              >
                {CategoryIcon && (
                  <CategoryIcon size={18} color={categoryColor} />
                )}
                <Text style={[styles.categoryText, { color: categoryColor }]}>
                  {categoryLabel}
                </Text>
              </View>
            ) : (
              <Text style={styles.noValue}>No category</Text>
            )}
          </View>

          <View style={styles.divider} />

          <View style={styles.sectionDate}>
            <Text style={styles.label}>DUE DATE</Text>
            {task.deadline ? (
              <View style={styles.dateRow}>
                <Calendar size={16} color="#666" />
                <Text style={styles.dateText}>{formatDate(task.deadline)}</Text>
              </View>
            ) : (
              <Text style={styles.noValue}>No deadline</Text>
            )}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Pressable style={styles.deleteButton} onPress={onDelete}>
            <Trash2 size={18} color="#e74c3c" />
            <Text style={styles.deleteText}>DELETE</Text>
          </Pressable>

          <Pressable
            style={[
              styles.completeButton,
              task.completed && styles.completeButtonDone,
            ]}
            onPress={onToggleComplete}
          >
            <Check size={18} color={task.completed ? "#333" : "#fff"} />
            <Text
              style={[
                styles.completeText,
                task.completed && styles.completeTextDone,
              ]}
            >
              {task.completed ? "DONE" : "COMPLETE"}
            </Text>
          </Pressable>
        </View>
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
    fontWeight: "800",
    color: "#333",
  },
  editButton: {
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
  editText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },
  body: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  bodyContent: {
    paddingBottom: 20,
  },
  section: {
    marginBottom: 4,
  },
  sectionDate: {
    marginBottom: 40,
  },
  divider: {
    height: 1,
    backgroundColor: "#f0f0f0",
    marginVertical: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333",
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: "#999",
    letterSpacing: 1,
    marginBottom: 8,
  },
  value: {
    fontSize: 15,
    color: "#666",
    lineHeight: 22,
  },
  noValue: {
    fontSize: 15,
    color: "#ccc",
    fontStyle: "italic",
  },
  priorityRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  priorityBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: "#eee",
    borderRadius: 4,
    overflow: "hidden",
  },
  priorityBarFill: {
    height: "100%",
    borderRadius: 4,
  },
  priorityLabel: {
    fontSize: 14,
    fontWeight: "600",
    minWidth: 60,
  },
  categoryBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
    gap: 6,
  },
  categoryText: {
    fontSize: 15,
    fontWeight: "500",
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dateText: {
    fontSize: 15,
    color: "#666",
  },
  footer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    gap: 12,
  },
  deleteButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 30,
    borderWidth: 1.5,
    borderColor: "rgba(231, 76, 60, 0.6)",
    backgroundColor: "#ffbaba",
    elevation: 2,
  },
  deleteText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#e74c3c",
  },
  completeButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 30,
    backgroundColor: "rgba(50, 50, 50, 0.8)",
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.4)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  completeButtonDone: {
    backgroundColor: "rgba(39, 174, 96, 0.8)",
    borderColor: "rgba(255, 255, 255, 0.4)",
  },
  completeText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  completeTextDone: {
    color: "#fff",
  },
});
