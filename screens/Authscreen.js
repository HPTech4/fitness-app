// screens/AuthScreen.js
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Alert,
  KeyboardAvoidingView, Platform, ScrollView, Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';

import AnimatedButton from '../components/AnimatedButton';
import AnimatedInput from '../components/AnimatedInput';
import SocialButton from '../components/SocialButton';
import { registerUser, loginUser } from '../api/authService';
import { COLORS, SIZES } from '../constants/theme';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const HERO_HEIGHT = SCREEN_HEIGHT * 0.42;

function FadeInUp({ delay = 0, children, style }) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  React.useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 400, easing: Easing.out(Easing.cubic) }));
    translateY.value = withDelay(delay, withTiming(0, { duration: 400, easing: Easing.out(Easing.cubic) }));
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>;
}

export default function AuthScreen({ onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password || (!isLogin && !name)) {
      return Alert.alert('Missing fields', 'Please fill everything in.');
    }
    setLoading(true);
    try {
      const data = isLogin
        ? await loginUser(email, password)
        : await registerUser(name, email, password);
      onAuthSuccess(data);
    } catch (err) {
      Alert.alert('Error', err.response?.data?.message || err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* HERO SECTION */}
      <View style={styles.hero}>
        <View style={styles.heroBlob1} />
        <View style={styles.heroBlob2} />

        <FadeInUp delay={0}>
          <View style={styles.heroContent}>
            <View style={styles.logoCircle}>
              <Ionicons name="barbell" size={40} color="#fff" />
            </View>
            <Text style={styles.brandName}>FitFlow</Text>
            <Text style={styles.brandTagline}>Train. Track. Triumph.</Text>
          </View>
        </FadeInUp>
      </View>

      {/* FORM CARD */}
      <View style={styles.card}>
        <ScrollView
          contentContainerStyle={styles.cardContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <FadeInUp delay={200}>
            <Text style={styles.cardTitle}>
              {isLogin ? 'Welcome back' : 'Create account'}
            </Text>
            <Text style={styles.cardSubtitle}>
              {isLogin
                ? 'Log in to continue your journey.'
                : 'Start building your fitness habit today.'}
            </Text>
          </FadeInUp>

          {!isLogin && (
            <FadeInUp delay={300}>
              <AnimatedInput
                icon="person-outline"
                label="Full name"
                placeholder="Enter your name"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            </FadeInUp>
          )}

          <FadeInUp delay={!isLogin ? 400 : 300}>
            <AnimatedInput
              icon="mail-outline"
              label="Email"
              placeholder="you@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </FadeInUp>

          <FadeInUp delay={!isLogin ? 500 : 400}>
            <AnimatedInput
              icon="lock-closed-outline"
              label="Password"
              placeholder="Enter password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </FadeInUp>

          {!isLogin && (
            <FadeInUp delay={600}>
              <Text style={styles.passwordHint}>
                Must be 8+ characters with uppercase, lowercase, and a number.
              </Text>
            </FadeInUp>
          )}

          <FadeInUp delay={!isLogin ? 700 : 500}>
            <AnimatedButton
              label={isLogin ? 'Login' : 'Create account'}
              onPress={handleSubmit}
              loading={loading}
              disabled={loading}
              iconRight="arrow-forward"
              style={{ marginTop: 10 }}
            />
          </FadeInUp>

          {/* DIVIDER */}
          <FadeInUp delay={!isLogin ? 800 : 600}>
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or continue with</Text>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.socialRow}>
              <SocialButton
                provider="google"
                onPress={() => Alert.alert('Coming soon', 'Google sign-in is on the roadmap.')}
              />
              <SocialButton
                provider="apple"
                onPress={() => Alert.alert('Coming soon', 'Apple sign-in is on the roadmap.')}
              />
            </View>
          </FadeInUp>

          {/* SWITCH */}
          <FadeInUp delay={!isLogin ? 900 : 700}>
            <TouchableOpacity
              style={styles.switchBtn}
              onPress={() => setIsLogin(!isLogin)}
            >
              <Text style={styles.switchText}>
                {isLogin ? "Don't have an account? " : 'Already have an account? '}
              </Text>
              <Text style={styles.switchLink}>
                {isLogin ? 'Sign up' : 'Log in'}
              </Text>
            </TouchableOpacity>
          </FadeInUp>

          {/* TERMS */}
          <FadeInUp delay={!isLogin ? 1000 : 800}>
            <Text style={styles.terms}>
              By continuing, you agree to our{' '}
              <Text style={styles.termsLink}>Terms</Text> and{' '}
              <Text style={styles.termsLink}>Privacy Policy</Text>.
            </Text>
          </FadeInUp>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },

  // HERO
  hero: {
    height: HERO_HEIGHT,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  heroBlob1: {
    position: 'absolute',
    top: -80,
    right: -80,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  heroBlob2: {
    position: 'absolute',
    bottom: -60,
    left: -60,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  heroContent: {
    alignItems: 'center',
  },
  logoCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  brandName: {
    fontSize: 34,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 0.5,
  },
  brandTagline: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.85)',
    marginTop: 6,
    fontWeight: '500',
  },

  // CARD
  card: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: -28,
    overflow: 'hidden',
  },
  cardContent: {
    padding: SIZES.padding,
    paddingTop: 32,
    paddingBottom: 40,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 24,
  },
  passwordHint: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: -8,
    marginBottom: 12,
    marginLeft: 4,
  },

  // DIVIDER
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E5E5',
  },
  dividerText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  socialRow: {
    flexDirection: 'row',
    gap: 12,
  },

  // SWITCH
  switchBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  switchText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  switchLink: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '700',
  },

  // TERMS
  terms: {
    fontSize: 11,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 20,
    lineHeight: 16,
  },
  termsLink: {
    color: COLORS.text,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});