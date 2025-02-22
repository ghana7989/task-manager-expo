import { Stack } from 'expo-router';
import { Appbar } from 'react-native-paper';
import { router } from 'expo-router';
import { useAuth } from '../context/auth';

export default function AppLayout() {
  const { signOut } = useAuth();

  return (
    <Stack
      screenOptions={{
        header: ({ route, options }) => {
          const title = options?.headerTitle?.toString() || route.name;
          return (
            <Appbar.Header>
              {router.canGoBack() && (
                <Appbar.BackAction onPress={() => router.back()} />
              )}
              <Appbar.Content title={title} />
              <Appbar.Action icon="logout" onPress={signOut} />
            </Appbar.Header>
          );
        },
      }}
    >
      <Stack.Screen name="index"
        options={{
          headerTitle: 'Task List',
        }}
      />
      <Stack.Screen name="task/[id]"
        options={{
          headerTitle: 'Task Details',
        }}
      />
    </Stack>
  );
} 
