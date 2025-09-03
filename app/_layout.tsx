import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from '../src/providers/authProvider';
import { QueryProvider } from '../src/providers/queryProvider';

export default function RootLayout() {
  return (
    <QueryProvider>
      <AuthProvider>
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: '#007AFF',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen 
            name="event/[id]" 
            options={{ 
              title: 'Event Details',
              presentation: 'modal'
            }} 
          />
        </Stack>
        <StatusBar style="light" />
      </AuthProvider>
    </QueryProvider>
  );
}
