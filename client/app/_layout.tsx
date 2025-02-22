import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { PaperProvider, MD3LightTheme } from 'react-native-paper';
import { AuthProvider } from './context/auth';

export default function RootLayout() {
  return (
    <PaperProvider theme={MD3LightTheme}>
      <AuthProvider>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="index" />
        </Stack>
      </AuthProvider>
    </PaperProvider>
  );
}
