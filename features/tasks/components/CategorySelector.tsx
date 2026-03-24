import type { Category } from "@/features/tasks/types/task";
import { CATEGORY_COLORS } from "@/shared/constants/theme";
import { BookOpen, Briefcase, Heart, Star, User } from "lucide-react-native";
import { Pressable, StyleSheet, View } from "react-native";

const CATEGORY_ICONS = {
  WORK: Briefcase,
  PERSONAL: User,
  STUDY: BookOpen,
  HEALTH: Heart,
  FUN: Star,
};

interface CategorySelectorProps {
  value?: Category;
  onChange: (category: Category) => void;
}

export function CategorySelector({ value, onChange }: CategorySelectorProps) {
  const categories = Object.keys(CATEGORY_ICONS) as Category[];

  return (
    <View style={styles.container}>
      {categories.map((cat) => {
        const Icon = CATEGORY_ICONS[cat];
        const isSelected = value === cat;
        const borderColor = CATEGORY_COLORS[cat];

        return (
          <Pressable
            key={cat}
            style={[
              styles.button,
              { borderColor },
              isSelected && { backgroundColor: borderColor + "20" },
            ]}
            onPress={() => onChange(cat)}
          >
            <Icon size={20} color={isSelected ? borderColor : "#999"} />
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 100,
    borderWidth: 2,
    backgroundColor: "#fff",
  },
  label: {
    fontSize: 13,
    fontWeight: "500",
  },
});
