import { useState, useRef } from 'react';
import { Pressable, StyleSheet, Text, View, Animated } from 'react-native';
import type { Category } from '@/features/tasks/types/task';
import { CATEGORY_COLORS } from '@/shared/constants/theme';

type CategoryOption = 'all' | Category;

interface CategoryWheelProps {
  value: CategoryOption | null;
  onChange: (category: CategoryOption | null) => void;
}

interface CategoryItem {
  key: CategoryOption;
  label: string;
  color: string;
}

const CATEGORIES: CategoryItem[] = [
  { key: 'all', label: 'All', color: '#888' },
  { key: 'WORK', label: 'Work', color: CATEGORY_COLORS.WORK },
  { key: 'PERSONAL', label: 'Personal', color: CATEGORY_COLORS.PERSONAL },
  { key: 'STUDY', label: 'Study', color: CATEGORY_COLORS.STUDY },
  { key: 'HEALTH', label: 'Health', color: CATEGORY_COLORS.HEALTH },
  { key: 'FUN', label: 'Fun', color: CATEGORY_COLORS.FUN },
];

export function CategoryWheel({ value, onChange }: CategoryWheelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const currentCategory = CATEGORIES.find(c => c.key === value) || CATEGORIES[0];

  const handlePressIn = () => {
    longPressTimer.current = setTimeout(() => {
      // Animación de entrada
      Animated.spring(scaleAnim, {
        toValue: 0.8,
        useNativeDriver: true,
      }).start();
      setIsOpen(true);
    }, 400);
  };

  const handlePressOut = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
  };

  const handleSelect = (key: CategoryOption | null) => {
    onChange(key);
    setIsOpen(false);
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const handleClose = () => {
    setIsOpen(false);
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  // Calcular posiciones en círculo
  const getPosition = (index: number, total: number) => {
    // Empezar desde arriba (-90°) e ir en sentido horario
    const angle = (index / total) * 2 * Math.PI - Math.PI / 2;
    const radius = 55;
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
    };
  };

  return (
    <View style={styles.container}>
      {/* Indicador actual */}
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <Pressable
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={[styles.indicator, { backgroundColor: currentCategory.color }]}
        >
          <Text style={styles.indicatorText}>
            {currentCategory.key === 'all' ? '•' : currentCategory.label.charAt(0)}
          </Text>
        </Pressable>
      </Animated.View>

      {/* Selector circular */}
      {isOpen && (
        <View style={styles.overlay}>
          <Pressable style={styles.backdrop} onPress={handleClose} />
          
          <View style={styles.wheel}>
            {CATEGORIES.map((cat, index) => {
              const pos = getPosition(index, CATEGORIES.length);
              
              return (
                <Animated.View
                  key={cat.key}
                  style={[
                    styles.wheelItem,
                    { backgroundColor: cat.color },
                    {
                      transform: [
                        { translateX: pos.x },
                        { translateY: pos.y },
                      ],
                    },
                    value === cat.key && styles.wheelItemSelected,
                  ]}
                >
                  <Pressable
                    onPress={() => handleSelect(cat.key)}
                    style={styles.wheelItemTouchable}
                  >
                    <Text style={styles.wheelItemText}>
                      {cat.key === 'all' ? '•' : cat.label.charAt(0)}
                    </Text>
                  </Pressable>
                </Animated.View>
              );
            })}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 24,
    bottom: 110,
    alignItems: 'center',
    zIndex: 10,
  },
  indicator: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  indicatorText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  wheel: {
    width: 140,
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 70,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  wheelItem: {
    position: 'absolute',
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  wheelItemSelected: {
    borderWidth: 3,
    borderColor: '#fff',
  },
  wheelItemTouchable: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  wheelItemText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
});
