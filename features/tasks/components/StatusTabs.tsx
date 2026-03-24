import { Pressable, StyleSheet, Text, View } from 'react-native';

type StatusFilter = 'all' | 'completed' | 'active';

interface StatusTabsProps {
  value: StatusFilter;
  onChange: (filter: StatusFilter) => void;
  counts: { all: number; completed: number; active: number };
}

const TABS: { key: StatusFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active' },
  { key: 'completed', label: 'Done' },
];

export function StatusTabs({ value, onChange, counts }: StatusTabsProps) {
  return (
    <View style={styles.container}>
      {TABS.map(tab => (
        <Pressable
          key={tab.key}
          onPress={() => onChange(tab.key)}
          style={[
            styles.tab,
            value === tab.key && styles.tabActive,
          ]}
        >
          <Text style={[
            styles.tabText,
            value === tab.key && styles.tabTextActive,
          ]}>
            {tab.label} ({counts[tab.key]})
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 8,
  },
  tab: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    minWidth: 75,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: '#333',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  tabTextActive: {
    color: '#fff',
  },
});
