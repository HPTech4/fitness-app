// screens/ProfileScreen.js
import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, SafeAreaView,
  TouchableOpacity, ActivityIndicator, Modal, Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { fetchMe } from '../api/authService';
import { COLORS, SIZES } from '../constants/theme';
import ProfileScreenSkeleton from "../components/skeletons/ProfileScreenSkeleton";

export default function ProfileScreen({ onLogout, navigation })  {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const load = async () => {
    try {
      const me = await fetchMe();
      setUser(me);
    } catch (err) {
      console.error('Profile load error:', err);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      load();
    }, [])
  );

  const handleConfirmLogout = async () => {
    setLoggingOut(true);
    try {
      await onLogout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setLoggingOut(false);
      setConfirmVisible(false);
    }
  };

  if (loading) {
    return <ProfileScreenSkeleton />;
  }

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : '?';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* HERO */}
       <View style={styles.hero}>
  <View style={styles.avatarRing}>
    <View style={styles.avatar}>
      <Text style={styles.avatarText}>{initials}</Text>
    </View>
  </View>
  <Text style={styles.name}>{user?.name || 'User'}</Text>
  <Text style={styles.email}>{user?.email || ''}</Text>
  <View style={styles.heroChip}>
    <Ionicons name="flash" size={11} color={COLORS.primary} />
    <Text style={styles.heroChipText}>FitFlow member</Text>
  </View>
</View>

        {/* MENU */}
        <View style={styles.menu}>
          <MenuItem
            icon="person-outline"
            label="Edit profile"
            onPress={() => navigation.navigate("Settings", { type: "edit" })}
          />
          <MenuItem
            icon="notifications-outline"
            label="Notifications"
            onPress={() =>
              navigation.navigate("Settings", { type: "notifications" })
            }
          />
          <MenuItem
            icon="lock-closed-outline"
            label="Privacy & security"
            onPress={() => navigation.navigate("Settings", { type: "privacy" })}
          />
          <MenuItem
            icon="help-circle-outline"
            label="Help & support"
            onPress={() => navigation.navigate("Settings", { type: "help" })}
          />
          <MenuItem
            icon="information-circle-outline"
            label="About FitFlow"
            onPress={() => navigation.navigate("Settings", { type: "about" })}
          />
        </View>

        {/* LOGOUT */}
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={() => setConfirmVisible(true)}
        >
          <Ionicons name="log-out-outline" size={20} color="#E53935" />
          <Text style={styles.logoutText}>Log out</Text>
        </TouchableOpacity>

        <View style={{ height: 30 }} />
      </ScrollView>

      {/* CONFIRM MODAL */}
      <Modal
        visible={confirmVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setConfirmVisible(false)}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setConfirmVisible(false)}
        >
          <Pressable
            style={styles.modalCard}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.modalIconWrap}>
              <Ionicons name="log-out-outline" size={28} color="#E53935" />
            </View>
            <Text style={styles.modalTitle}>Log out?</Text>
            <Text style={styles.modalSub}>
              You will need to log in again to continue using FitFlow.
            </Text>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setConfirmVisible(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalLogoutBtn}
                onPress={handleConfirmLogout}
                disabled={loggingOut}
              >
                {loggingOut ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.modalLogoutText}>Log out</Text>
                )}
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

function MenuItem({ icon, label, onPress }) {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuIcon}>
        <Ionicons name={icon} size={20} color={COLORS.text} />
      </View>
      <Text style={styles.menuLabel}>{label}</Text>
      <Ionicons name="chevron-forward" size={18} color={COLORS.textSecondary} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  hero: { alignItems: 'center', marginBottom: 30 },
avatarRing: {
  width: 112,
  height: 112,
  borderRadius: 56,
  backgroundColor: COLORS.primarySoft,
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: 14,
},
avatar: {
  width: 96,
  height: 96,
  borderRadius: 48,
  backgroundColor: COLORS.primary,
  justifyContent: 'center',
  alignItems: 'center',
},
avatarText: { fontSize: 34, fontWeight: 'bold', color: '#fff' },
name: { fontSize: 22, fontWeight: '800', color: COLORS.text, letterSpacing: -0.3 },
email: { fontSize: 13, color: COLORS.textSecondary, marginTop: 4 },
heroChip: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 4,
  backgroundColor: COLORS.primarySoft,
  paddingHorizontal: 10,
  paddingVertical: 5,
  borderRadius: 12,
  marginTop: 10,
},
heroChipText: {
  fontSize: 11,
  color: COLORS.primary,
  fontWeight: '700',
  letterSpacing: 0.3,
},


  container: { flex: 1, backgroundColor: COLORS.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scroll: { padding: SIZES.padding, paddingTop: 20 },


menu: {
  backgroundColor: COLORS.card,
  borderRadius: 20,
  padding: 8,
  marginBottom: 20,
  borderWidth: 1,
  borderColor: COLORS.border,
},
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
  },
  menuIcon: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center', alignItems: 'center',
    marginRight: 14,
  },
  menuLabel: { flex: 1, fontSize: 15, fontWeight: '600', color: COLORS.text },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FFEBEE',
    padding: 16,
    borderRadius: 16,
  },
  logoutText: { color: '#E53935', fontWeight: 'bold', fontSize: 15 },

  // Modal
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    backgroundColor: COLORS.background,
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 360,
    alignItems: 'center',
  },
  modalIconWrap: {
    width: 60, height: 60, borderRadius: 30,
    backgroundColor: '#FFEBEE',
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.text, marginBottom: 8 },
  modalSub: {
    fontSize: 13, color: COLORS.textSecondary,
    textAlign: 'center', marginBottom: 24, lineHeight: 18,
  },
  modalActions: { flexDirection: 'row', gap: 10, width: '100%' },
  modalCancelBtn: {
    flex: 1, padding: 14, borderRadius: 14,
    backgroundColor: COLORS.card, alignItems: 'center',
  },
  modalCancelText: { color: COLORS.text, fontWeight: '600' },
  modalLogoutBtn: {
    flex: 1, padding: 14, borderRadius: 14,
    backgroundColor: '#E53935', alignItems: 'center',
  },
  modalLogoutText: { color: '#fff', fontWeight: 'bold' },
});