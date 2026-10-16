// screens/SettingsScreen.js
import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, SafeAreaView,
  TouchableOpacity, TextInput, Alert, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { fetchMe, updateMe } from '../api/authService';
import { COLORS, SIZES } from '../constants/theme';

export default function SettingsScreen({ route, navigation }) {
  const { type } = route.params;

  const config = {
    edit: { title: 'Edit profile', icon: 'person-outline' },
    notifications: { title: 'Notifications', icon: 'notifications-outline' },
    privacy: { title: 'Privacy & Security', icon: 'lock-closed-outline' },
    help: { title: 'Help & Support', icon: 'help-circle-outline' },
    about: { title: 'About FitFlow', icon: 'information-circle-outline' },
  }[type];

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
     <View style={styles.header}>
  <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
    <Ionicons name="arrow-back" size={20} color={COLORS.text} />
  </TouchableOpacity>
  <View style={styles.headerTitleWrap}>
    <Text style={styles.headerEyebrow}>Settings</Text>
    <Text style={styles.headerTitle}>{config?.title || 'Settings'}</Text>
  </View>
  <View style={styles.backBtn} />
</View>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {type === 'edit' && <EditProfile onBack={() => navigation.goBack()} />}
        {type === 'notifications' && <Notifications />}
        {type === 'privacy' && <Privacy />}
        {type === 'help' && <Help />}
        {type === 'about' && <About />}
      </ScrollView>
    </SafeAreaView>
  );
}

// ---------- EDIT PROFILE ----------
function EditProfile({ onBack }) {
  const [user, setUser] = useState(null);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const me = await fetchMe();
        setUser(me);
        setName(me.name);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSave = async () => {
    if (!name.trim() || name.trim() === user.name) {
      return Alert.alert('No changes', 'Nothing to save.');
    }
    setSaving(true);
    try {
      const updated = await updateMe({ name: name.trim() });
      // Update AsyncStorage so the Home greeting reflects the new name
      const stored = await AsyncStorage.getItem('user');
      if (stored) {
        const parsed = JSON.parse(stored);
        parsed.user = { ...parsed.user, name: updated.name };
        await AsyncStorage.setItem('user', JSON.stringify(parsed));
      }
      Alert.alert('Saved', 'Your profile has been updated.');
      onBack();
    } catch (err) {
      Alert.alert('Error', err.response?.data?.message || err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  const initials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || '?';

  return (
    <View>
      <View style={styles.avatarWrap}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <TouchableOpacity style={styles.changeAvatarBtn}>
          <Text style={styles.changeAvatarText}>Change photo</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Full name</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Your name"
        placeholderTextColor="#999"
      />

      <Text style={styles.label}>Email</Text>
      <View style={[styles.input, styles.inputDisabled]}>
        <Text style={{ color: COLORS.textSecondary }}>{user?.email}</Text>
      </View>
      <Text style={styles.hint}>Email can't be changed yet.</Text>

      <TouchableOpacity
        style={[styles.primaryBtn, saving && { opacity: 0.6 }]}
        onPress={handleSave}
        disabled={saving}
      >
        {saving ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.primaryBtnText}>Save changes</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

// ---------- NOTIFICATIONS ----------
function Notifications() {
  const [settings, setSettings] = useState({
    routineReminders: true,
    streakAlerts: true,
    weeklySummary: true,
    tips: false,
  });

  const toggle = (key) => setSettings((s) => ({ ...s, [key]: !s[key] }));

  const items = [
    { key: 'routineReminders', label: 'Routine reminders', sub: 'Get notified when it\'s time for a routine' },
    { key: 'streakAlerts', label: 'Streak alerts', sub: 'Warn me before I break my streak' },
    { key: 'weeklySummary', label: 'Weekly summary', sub: 'A recap every Sunday' },
    { key: 'tips', label: 'Tips & tricks', sub: 'Occasional fitness tips' },
  ];

  return (
    <View>
      {items.map((item) => (
        <TouchableOpacity
          key={item.key}
          style={styles.toggleRow}
          onPress={() => toggle(item.key)}
        >
          <View style={{ flex: 1 }}>
            <Text style={styles.toggleLabel}>{item.label}</Text>
            <Text style={styles.toggleSub}>{item.sub}</Text>
          </View>
          <View style={[styles.switch, settings[item.key] && styles.switchOn]}>
            <View style={[styles.switchThumb, settings[item.key] && styles.switchThumbOn]} />
          </View>
        </TouchableOpacity>
      ))}
      <Text style={styles.hint}>
        Push notifications will be wired up in a future update.
      </Text>
    </View>
  );
}

// ---------- PRIVACY ----------
function Privacy() {
  return (
    <View>
      <Text style={styles.sectionTitle}>Data & Privacy</Text>
      <InfoCard
        icon="shield-checkmark-outline"
        title="Your data is safe"
        sub="We use industry-standard encryption and never sell your data."
      />
      <InfoCard
        icon="download-outline"
        title="Export your data"
        sub="Request a copy of everything we store about you."
      />
      <InfoCard
        icon="trash-outline"
        title="Delete account"
        sub="Permanently remove your account and all data."
      />
      <Text style={styles.sectionTitle}>Sessions</Text>
      <TouchableOpacity style={styles.dangerBtn}>
        <Text style={styles.dangerText}>Log out of all devices</Text>
      </TouchableOpacity>
    </View>
  );
}

// ---------- HELP ----------
function Help() {
  return (
    <View>
      <Text style={styles.sectionTitle}>Frequently asked</Text>
      <FaqItem q="How do I add a routine?" a="From the Home tab, tap the orange + Add button next to Daily routine." />
      <FaqItem q="Why aren't my steps updating?" a="Step tracking requires a phone sensor. It's coming in a future update." />
      <FaqItem q="How do streaks work?" a="A streak grows every day you complete at least one workout." />
      <FaqItem q="Can I edit a workout?" a="Custom workout editing is on the roadmap." />

      <Text style={styles.sectionTitle}>Contact us</Text>
      <InfoCard icon="mail-outline" title="Email support" sub="support@fitflow.app" />
      <InfoCard icon="chatbubble-outline" title="Send feedback" sub="Tell us what you think" />
    </View>
  );
}

// ---------- ABOUT ----------
function About() {
  return (
    <View>
      <View style={styles.aboutHero}>
        <View style={styles.aboutLogo}>
          <Ionicons name="barbell" size={48} color={COLORS.primary} />
        </View>
        <Text style={styles.aboutName}>FitFlow</Text>
        <Text style={styles.aboutVersion}>Version 1.0.0</Text>
      </View>

      <Text style={styles.aboutBlurb}>
        FitFlow is a fitness tracking app built with React Native and Node.js.
        Track workouts, build streaks, and see your progress over time.
      </Text>

      <Text style={styles.sectionTitle}>Credits</Text>
      <InfoCard icon="code-outline" title="Built by" sub="Your Name" />
      <InfoCard icon="heart-outline" title="Made with" sub="React Native + Node.js + MongoDB" />

      <Text style={styles.sectionTitle}>Legal</Text>
      <InfoCard icon="document-text-outline" title="Terms of Service" sub="" />
      <InfoCard icon="shield-outline" title="Privacy Policy" sub="" />
    </View>
  );
}

// ---------- Shared small components ----------
function InfoCard({ icon, title, sub }) {
  return (
    <TouchableOpacity style={styles.infoCard}>
      <View style={styles.infoIcon}>
        <Ionicons name={icon} size={20} color={COLORS.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.infoTitle}>{title}</Text>
        {sub ? <Text style={styles.infoSub}>{sub}</Text> : null}
      </View>
      <Ionicons name="chevron-forward" size={18} color={COLORS.textSecondary} />
    </TouchableOpacity>
  );
}

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <TouchableOpacity style={styles.faqItem} onPress={() => setOpen(!open)}>
      <View style={styles.faqHeader}>
        <Text style={styles.faqQ}>{q}</Text>
        <Ionicons
          name={open ? 'chevron-up' : 'chevron-down'}
          size={18}
          color={COLORS.textSecondary}
        />
      </View>
      {open && <Text style={styles.faqA}>{a}</Text>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingHorizontal: SIZES.padding,
  paddingVertical: 12,
},
backBtn: {
  width: 40,
  height: 40,
  borderRadius: 20,
  backgroundColor: COLORS.card,
  justifyContent: 'center',
  alignItems: 'center',
  borderWidth: 1,
  borderColor: COLORS.border,
},
headerTitleWrap: { alignItems: 'center', flex: 1 },
headerEyebrow: {
  fontSize: 10,
  fontWeight: '700',
  color: COLORS.primary,
  letterSpacing: 0.6,
  textTransform: 'uppercase',
  marginBottom: 1,
},
headerTitle: { fontSize: 17, fontWeight: '800', color: COLORS.text },
  scroll: { padding: SIZES.padding, paddingTop: 8, paddingBottom: 40 },
  center: { padding: 40, alignItems: 'center' },

  // Edit profile
  avatarWrap: { alignItems: 'center', marginBottom: 30 },
  avatar: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: COLORS.primary,
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 10,
  },
  avatarText: { fontSize: 36, fontWeight: 'bold', color: '#fff' },
  changeAvatarBtn: { paddingVertical: 4 },
  changeAvatarText: { color: COLORS.primary, fontWeight: '600', fontSize: 13 },

  label: {
    fontSize: 13, fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: 8, marginTop: 16,
  },
  input: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 14,
    fontSize: 14,
    color: COLORS.text,
  },
  inputDisabled: {
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
  },
  hint: {
    fontSize: 12, color: COLORS.textSecondary,
    marginTop: 6, marginBottom: 8,
  },
  primaryBtn: {
    backgroundColor: COLORS.primary,
    padding: 16, borderRadius: 14,
    alignItems: 'center', marginTop: 24,
  },
  primaryBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },

  // Toggles
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
  },
  toggleLabel: { fontSize: 14, fontWeight: '600', color: COLORS.text },
  toggleSub: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  switch: {
    width: 46, height: 26, borderRadius: 13,
    backgroundColor: '#DDD',
    padding: 3,
    justifyContent: 'center',
  },
  switchOn: { backgroundColor: COLORS.primary },
  switchThumb: {
    width: 20, height: 20, borderRadius: 10,
    backgroundColor: '#fff',
  },
  switchThumbOn: { alignSelf: 'flex-end' },

  // Info cards
  sectionTitle: {
    fontSize: 14, fontWeight: '700',
    color: COLORS.text,
    marginTop: 24, marginBottom: 10,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },
  infoIcon: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#FFF0EB',
    justifyContent: 'center', alignItems: 'center',
    marginRight: 12,
  },
  infoTitle: { fontSize: 14, fontWeight: '600', color: COLORS.text },
  infoSub: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },

  // FAQ
  faqItem: {
    backgroundColor: COLORS.card,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },
  faqHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQ: { fontSize: 14, fontWeight: '600', color: COLORS.text, flex: 1 },
  faqA: {
    fontSize: 13, color: COLORS.textSecondary,
    marginTop: 10, lineHeight: 18,
  },

  // Danger
  dangerBtn: {
    backgroundColor: '#FFEBEE',
    padding: 16, borderRadius: 14,
    alignItems: 'center',
  },
  dangerText: { color: '#E53935', fontWeight: 'bold', fontSize: 14 },

  // About
  aboutHero: { alignItems: 'center', marginVertical: 24 },
  aboutLogo: {
    width: 90, height: 90, borderRadius: 24,
    backgroundColor: '#FFF0EB',
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 14,
  },
  aboutName: { fontSize: 22, fontWeight: 'bold', color: COLORS.text },
  aboutVersion: { fontSize: 13, color: COLORS.textSecondary, marginTop: 4 },
  aboutBlurb: {
    fontSize: 13, color: COLORS.textSecondary,
    textAlign: 'center', lineHeight: 20, marginBottom: 8,
  },
});