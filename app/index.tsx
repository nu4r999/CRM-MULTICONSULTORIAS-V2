import { Redirect } from 'expo-router';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuth } from '../src/context/AuthContext';
import { Theme } from '../src/constants/Theme';

export default function Index() {
  const { isAuthenticated, isLoading } = useAuth();

  // Don't redirect while auth session is being restored
  if (isLoading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={Theme.colors.primary} />
      </View>
    );
  }

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  return <Redirect href="/(tabs)/dashboard" />;
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    backgroundColor: Theme.colors.bg_deep,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
