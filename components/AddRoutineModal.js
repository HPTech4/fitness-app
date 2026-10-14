// components/AddRoutineModal.js
import React, { useState } from 'react';
import {
  Modal, View, Text, TextInput, TouchableOpacity, StyleSheet,
  ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { addRoutine } from '../api/routineService';
import { COLORS } from '../constants/theme';

const ICON_OPTIONS = ['body', 'walk', 'barbell', 'bicycle', 'fitness', 'heart'];
const TIME_OPTIONS = ['6:00 AM', '8:00 AM', '12:30 PM', '3:00 PM', '6:00 PM', '8:00 PM'];
const DURATION_OPTIONS = ['10 min', '15 min', '20 min', '30 min', '45 min', '60 min'];

export default function AddRoutineModal({ visible, onClose, onAdded }) {
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('8:00 AM');
  const [duration, setDuration] = useState('10 min');
  const [iconName, setIconName] = useState('fitness');
  const [saving, setSaving] = useState(false);

  const reset = () => {
    setTitle('');
    setTime('8:00 AM');
    setDuration('10 min');
    setIconName('fitness');
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSave = async () => {
    if (!title.trim()) {
      return Alert.alert('Missing title', 'Give your routine a name.');
    }
    setSaving(true);
    try {
      const created = await addRoutine({
        title: title.trim(),
        time,
        duration,
        iconName,
      });
      onAdded(created);
      handleClose();
    } catch (err) {
      Alert.alert('Error', err.response?.data?.message || err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <KeyboardAvoidingView
        style={styles.backdrop}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.sheet}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.handle} />

            <Text style={styles.title}>New routine</Text>

            {/* TITLE */}
            <Text style={styles.label}>Title</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Evening run"
              placeholderTextColor="#999"
              value={title}
              onChangeText={setTitle}
            />

            {/* TIME */}
            <Text style={styles.label}>Time</Text>
            <View style={styles.chipsRow}>
              {TIME_OPTIONS.map((t) => (
                <TouchableOpacity
                  key={t}
                  style={[styles.chip, time === t && styles.chipActive]}
                  onPress={() => setTime(t)}
                >
                  <Text style={[styles.chipText, time === t && styles.chipTextActive]}>
                    {t}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* DURATION */}
            <Text style={styles.label}>Duration</Text>
            <View style={styles.chipsRow}>
              {DURATION_OPTIONS.map((d) => (
                <TouchableOpacity
                  key={d}
                  style={[styles.chip, duration === d && styles.chipActive]}
                  onPress={() => setDuration(d)}
                >
                  <Text style={[styles.chipText, duration === d && styles.chipTextActive]}>
                    {d}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* ICON */}
            <Text style={styles.label}>Icon</Text>
            <View style={styles.chipsRow}>
              {ICON_OPTIONS.map((ic) => (
                <TouchableOpacity
                  key={ic}
                  style={[styles.iconChip, iconName === ic && styles.iconChipActive]}
                  onPress={() => setIconName(ic)}
                >
                  <Ionicons
                    name={ic}
                    size={20}
                    color={iconName === ic ? '#fff' : COLORS.text}
                  />
                </TouchableOpacity>
              ))}
            </View>

            {/* ACTIONS */}
            <View style={styles.actions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={handleClose}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveBtn}
                onPress={handleSave}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.saveText}>Add routine</Text>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 30,
    maxHeight: '88%',
  },
  handle: {
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: '#DDD',
    alignSelf: 'center',
    marginBottom: 16,
  },
  title: { fontSize: 20, fontWeight: 'bold', color: COLORS.text, marginBottom: 8 },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 14,
    fontSize: 14,
    color: COLORS.text,
  },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: COLORS.card,
    borderRadius: 20,
  },
  chipActive: { backgroundColor: COLORS.primary },
  chipText: { fontSize: 12, color: COLORS.text },
  chipTextActive: { color: '#fff', fontWeight: '600' },
  iconChip: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: COLORS.card,
    justifyContent: 'center', alignItems: 'center',
  },
  iconChipActive: { backgroundColor: COLORS.primary },
  actions: { flexDirection: 'row', gap: 10, marginTop: 24 },
  cancelBtn: {
    flex: 1, padding: 16, borderRadius: 14,
    backgroundColor: COLORS.card, alignItems: 'center',
  },
  cancelText: { color: COLORS.text, fontWeight: '600' },
  saveBtn: {
    flex: 2, padding: 16, borderRadius: 14,
    backgroundColor: COLORS.primary, alignItems: 'center',
  },
  saveText: { color: '#fff', fontWeight: 'bold' },
});