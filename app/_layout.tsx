import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import 'react-native-reanimated';
import { AppProvider } from '../src/context/AppContext';
import { AuthProvider, useAuth } from '../src/context/AuthContext';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Theme } from '../src/constants/Theme';

export {
  ErrorBoundary,
} from 'expo-router';

// Removed unstable_settings to avoid pre-rendering (tabs) before providers are ready
// This was causing "useApp must be inside AppProvider" on native builds

function RootNavigator() {
  const { isLoading } = useAuth();

  // While the auth session is being restored, show a loading screen
  // This prevents any screen from mounting before providers are ready
  if (isLoading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={Theme.colors.primary} />
      </View>
    );
  }

  return (
    <ThemeProvider value={DarkTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="login" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="index" />
      </Stack>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <AppProvider>
        <RootNavigator />
      </AppProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    backgroundColor: Theme.colors.bg_deep,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
