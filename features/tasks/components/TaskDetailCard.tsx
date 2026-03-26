import type { Task } from "@/features/tasks/types/task";
import {
  CATEGORY_COLORS,
  CATEGORY_LABELS,
  COLORS,
  PRIORITY_LABELS,
} from "@/shared/constants/theme";
import {
  BookOpen,
  Briefcase,
  Calendar,
  Heart,
  PencilLine,
  Star,
  Trash2,
  User,
} from "lucide-react-native";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { Pressable, StyleSheet, Text, View } from "react-native";

const CATEGORY_ICONS = {
  WORK: Briefcase,
  PERSONAL: User,
  STUDY: BookOpen,
  HEALTH: Heart,
  FUN: Star,
};

interface TaskDetailCardProps {
  task: Task;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onToggleComplete: () => void;
}

export function TaskDetailCard({
  task,
  onEdit,
  onDelete,
}: TaskDetailCardProps) {
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
    : "#999";

  const categoryLabel = task.category
    ? CATEGORY_LABELS[task.category]
    : undefined;

  const CategoryIcon = task.category
    ? CATEGORY_ICONS[task.category]
    : undefined;

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>TASK DETAIL</Text>
      </View>

      {/* BODY (SCROLL REAL) */}
      <BottomSheetScrollView
        style={styles.body}
        contentContainerStyle={styles.scrollContent}
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
            <Text style={styles.value}>
              {capitalize(task.description)}
            </Text>
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
              <Text style={styles.dateText}>
                {formatDate(task.deadline)}
              </Text>
            </View>
          ) : (
            <Text style={styles.noValue}>No deadline</Text>
          )}
        </View>
      </BottomSheetScrollView>

      {/* FOOTER */}
      <View style={styles.footer}>
        <Pressable style={styles.deleteButton} onPress={onDelete}>
          <Trash2 size={18} color="#666" />
          <Text style={styles.deleteText}>DELETE</Text>
        </Pressable>

        <Pressable
          style={[styles.actionButton, { backgroundColor: COLORS.tabActive }]}
          onPress={onEdit}
        >
          <PencilLine size={18} color="#fff" />
          <Text style={styles.actionText}>EDIT</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // 🔥 ocupa todo el espacio del BottomSheet
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
    fontWeight: "800",
    color: "#333",
  },

  body: {
    flex: 1, // 🔥 CLAVE: limita el scroll entre header y footer
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
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

  deleteButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 30,
    borderWidth: 1.5,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },

  deleteText: {
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

  actionText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
});
