import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet, View, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, Animated, Dimensions,
  StatusBar, ActivityIndicator, ScrollView,
} from 'react-native';
import { Theme } from '../src/constants/Theme';
import { useAuth } from '../src/context/AuthContext';
import { Typography } from '../src/components/Typography';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

// Animated floating orb background
function FloatingOrb({ color, size, x, y, delay }: any) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 1, duration: 3000 + delay, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0, duration: 3000 + delay, useNativeDriver: true }),
      ])
    ).start();
  }, [anim, delay]);

  const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [0, -20] });
  const opacity = anim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.15, 0.3, 0.15] });

  return (
    <Animated.View
      style={{
        position: 'absolute', width: size, height: size, borderRadius: size / 2,
        backgroundColor: color, left: x, top: y,
        transform: [{ translateY }], opacity,
      }}
    />
  );
}

export default function LoginScreen() {
  const router = useRouter();
  const { login, register, isLoading, error, clearError } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPass, setShowPass] = useState(false);

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const logoScale = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, tension: 40, friction: 8, useNativeDriver: true }),
      Animated.spring(logoScale, { toValue: 1, tension: 50, friction: 6, useNativeDriver: true }),
    ]).start();
  }, [fadeAnim, slideAnim, logoScale]);

  async function handleSubmit() {
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register(email, password, name);
      }
      // If successful (no error thrown and context updated), we navigate
      router.replace('/(tabs)/dashboard');
    } catch (e) {
      // Error is handled in context
    }
  }

  function handleDemo() {
    login('demo@multiconsultorias.com', 'demo123').then(() => {
      router.replace('/(tabs)/dashboard');
    });
  }

  function toggleMode() {
    setMode(m => m === 'login' ? 'register' : 'login');
    clearError();
  }

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={Theme.colors.bg_deep} />

      {/* Background orbs */}
      <FloatingOrb color={Theme.colors.primary} size={200} x={-60} y={height * 0.1} delay={0} />
      <FloatingOrb color={Theme.colors.secondary} size={160} x={width * 0.6} y={height * 0.05} delay={500} />
      <FloatingOrb color={Theme.colors.purple} size={120} x={width * 0.3} y={height * 0.7} delay={1000} />
      <FloatingOrb color={Theme.colors.accent} size={80} x={width * 0.7} y={height * 0.8} delay={700} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Logo Section */}
          <Animated.View style={[styles.logoSection, { opacity: fadeAnim, transform: [{ scale: logoScale }] }]}>
            <View style={styles.logoContainer}>
              <View style={styles.logoInner}>
                <Typography style={styles.logoText}>MC</Typography>
              </View>
              <View style={styles.logoGlow} />
            </View>
            <Typography variant="h1" style={styles.brandName}>MULTICONSULTORIAS</Typography>
            <Typography variant="body" color="secondary" style={styles.tagline}>
              Tu gestión financiera, simplificada
            </Typography>
          </Animated.View>

          {/* Form Card */}
          <Animated.View style={[styles.formCard, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            {/* Glass effect border */}
            <View style={styles.cardGlow} />

            <Typography variant="h2" style={styles.formTitle}>
              {mode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
            </Typography>
            <Typography variant="body" color="muted" style={styles.formSubtitle}>
              {mode === 'login'
                ? 'Accede a tu panel de control'
                : 'Únete al equipo de asesores'}
            </Typography>

            {/* Error */}
            {error && (
              <View style={styles.errorBox}>
                <Ionicons name="alert-circle" size={16} color={Theme.colors.danger} />
                <Typography variant="small" style={{ color: Theme.colors.danger, marginLeft: 8, flex: 1 }}>
                  {error}
                </Typography>
              </View>
            )}

            {/* Name field (register only) */}
            {mode === 'register' && (
              <View style={styles.inputGroup}>
                <Typography variant="caption" color="muted" style={styles.inputLabel}>NOMBRE COMPLETO</Typography>
                <View style={styles.inputWrap}>
                  <Ionicons name="person-outline" size={18} color={Theme.colors.text_muted} />
                  <TextInput
                    style={styles.input}
                    placeholder="Ej: María López"
                    placeholderTextColor={Theme.colors.text_muted + '88'}
                    value={name}
                    onChangeText={setName}
                    autoCapitalize="words"
                  />
                </View>
              </View>
            )}

            {/* Email */}
            <View style={styles.inputGroup}>
              <Typography variant="caption" color="muted" style={styles.inputLabel}>CORREO ELECTRÓNICO</Typography>
              <View style={styles.inputWrap}>
                <Ionicons name="mail-outline" size={18} color={Theme.colors.text_muted} />
                <TextInput
                  style={styles.input}
                  placeholder="tu@correo.com"
                  placeholderTextColor={Theme.colors.text_muted + '88'}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            {/* Password */}
            <View style={styles.inputGroup}>
              <Typography variant="caption" color="muted" style={styles.inputLabel}>CONTRASEÑA</Typography>
              <View style={styles.inputWrap}>
                <Ionicons name="lock-closed-outline" size={18} color={Theme.colors.text_muted} />
                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  placeholderTextColor={Theme.colors.text_muted + '88'}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPass}
                />
                <TouchableOpacity onPress={() => setShowPass(!showPass)}>
                  <Ionicons
                    name={showPass ? 'eye-off-outline' : 'eye-outline'}
                    size={18}
                    color={Theme.colors.text_muted}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={[styles.submitBtn, isLoading && { opacity: 0.7 }]}
              onPress={handleSubmit}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator color="#000" />
              ) : (
                <>
                  <Typography style={styles.submitText}>
                    {mode === 'login' ? 'ACCEDER' : 'REGISTRARSE'}
                  </Typography>
                  <Ionicons name="arrow-forward" size={18} color="#000" />
                </>
              )}
            </TouchableOpacity>

            {/* Toggle mode */}
            <TouchableOpacity onPress={toggleMode} style={styles.toggleRow}>
              <Typography variant="body" color="muted">
                {mode === 'login' ? '¿No tienes cuenta? ' : '¿Ya tienes cuenta? '}
              </Typography>
              <Typography variant="body" style={{ color: Theme.colors.primary, fontWeight: '700' }}>
                {mode === 'login' ? 'Regístrate' : 'Inicia sesión'}
              </Typography>
            </TouchableOpacity>

            {/* Quick demo access */}
            <TouchableOpacity
              style={styles.demoBtn}
              onPress={() => login('demo@multiconsultorias.com', 'demo123')}
              activeOpacity={0.7}
            >
              <Ionicons name="flash-outline" size={14} color={Theme.colors.accent} />
              <Typography variant="small" style={{ color: Theme.colors.accent, fontWeight: '600', marginLeft: 6 }}>
                Acceso Demo Rápido
              </Typography>
            </TouchableOpacity>
          </Animated.View>

          {/* Footer */}
          <Typography variant="small" color="muted" style={styles.footer}>
            v1.0.0 · © 2026 Multiconsultorias
          </Typography>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Theme.colors.bg_deep },
  scrollContent: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 24, paddingVertical: 40 },

  logoSection: { alignItems: 'center', marginBottom: 36 },
  logoContainer: { width: 80, height: 80, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  logoInner: {
    width: 72, height: 72, borderRadius: 20,
    backgroundColor: Theme.colors.primary + '22',
    borderWidth: 2, borderColor: Theme.colors.primary + '66',
    alignItems: 'center', justifyContent: 'center',
    zIndex: 1,
  },
  logoText: { color: Theme.colors.primary, fontWeight: '900', fontSize: 28, letterSpacing: 2 },
  logoGlow: {
    position: 'absolute', width: 100, height: 100, borderRadius: 50,
    backgroundColor: Theme.colors.primary + '15',
  },
  brandName: { color: Theme.colors.text_primary, fontWeight: '800', letterSpacing: 3, fontSize: 20 },
  tagline: { marginTop: 8, letterSpacing: 0.5, textAlign: 'center' },

  formCard: {
    backgroundColor: Theme.colors.bg_surface + 'dd',
    borderRadius: 28,
    padding: 28,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    overflow: 'hidden',
  },
  cardGlow: {
    position: 'absolute', top: 0, left: 30, right: 30, height: 1,
    backgroundColor: Theme.colors.primary, opacity: 0.4,
  },
  formTitle: { color: Theme.colors.text_primary, fontWeight: '700', marginBottom: 4 },
  formSubtitle: { marginBottom: 24 },

  errorBox: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Theme.colors.danger + '15',
    borderWidth: 1, borderColor: Theme.colors.danger + '44',
    borderRadius: 12, padding: 12, marginBottom: 16,
  },

  inputGroup: { marginBottom: 18 },
  inputLabel: { textTransform: 'uppercase', letterSpacing: 1, fontWeight: '700', marginBottom: 8 },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: Theme.colors.bg_input,
    borderRadius: 14, paddingHorizontal: 16, paddingVertical: 14,
    borderWidth: 1, borderColor: Theme.colors.border,
  },
  input: { flex: 1, color: Theme.colors.text_primary, fontSize: 15 },

  submitBtn: {
    backgroundColor: Theme.colors.primary,
    borderRadius: 14, paddingVertical: 16,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    marginTop: 8,
    shadowColor: Theme.colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5, shadowRadius: 20, elevation: 12,
  },
  submitText: { color: '#000', fontSize: 15, fontWeight: '800', letterSpacing: 1 },

  toggleRow: {
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
    marginTop: 20,
  },

  demoBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    marginTop: 16, paddingVertical: 10,
    borderRadius: 10, borderWidth: 1, borderColor: Theme.colors.accent + '33',
    backgroundColor: Theme.colors.accent + '0a',
  },

  footer: { textAlign: 'center', marginTop: 32 },
});
