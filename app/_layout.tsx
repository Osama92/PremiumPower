import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{headerShown: false}}/>
      <Stack.Screen name="signUp" options={{headerShown: false}}/>
      <Stack.Screen name="dashboard" options={{headerShown: false}}/>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="recoveryScreen" options={{ headerShown: false }} />
      <Stack.Screen name="masterAdmin" options={{ headerShown: false }} />
      <Stack.Screen name="createJob" options={{ headerShown: false }} />
      <Stack.Screen name="jobManagementScreen" options={{ headerShown: false }} />
    </Stack>
  );
}
