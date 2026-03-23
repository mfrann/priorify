import { useState } from 'react';
import { StyleSheet, View, Text, Pressable, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Calendar, X } from 'lucide-react-native';

interface DatePickerFieldProps {
  value?: Date;
  onChange: (date?: Date) => void;
}

export function DatePickerField({ value, onChange }: DatePickerFieldProps) {
  const [showPicker, setShowPicker] = useState(false);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const handleClear = () => {
    onChange(undefined);
    setShowPicker(false);
  };

  const handleChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }
    if (event.type === 'set' && selectedDate) {
      onChange(selectedDate);
    }
    if (Platform.OS === 'ios' && event.type === 'dismissed') {
      setShowPicker(false);
    }
  };

  return (
    <View style={styles.container}>
      <Pressable style={styles.field} onPress={() => setShowPicker(true)}>
        <Calendar size={20} color="#666" />
        <Text style={value ? styles.text : styles.placeholder}>
          {value ? formatDate(value) : 'No deadline'}
        </Text>
      </Pressable>

      {showPicker && (
        <DateTimePicker
          value={value || new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleChange}
        />
      )}

      {value && (
        <Pressable style={styles.clearButton} onPress={handleClear}>
          <X size={16} color="#999" />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  field: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
  },
  text: {
    fontSize: 15,
    color: '#333',
  },
  placeholder: {
    fontSize: 15,
    color: '#999',
  },
  clearButton: {
    padding: 8,
  },
});
