// app/_layout.tsx
import { Tabs } from 'expo-router';
import { Text, View } from 'react-native';
import { useFonts } from 'expo-font';
import { ActivityIndicator } from 'react-native';

export default function Dashboard() {
  const [fontsLoaded] = useFonts({
    Montserrat: require('../assets/fonts/Montserrat.ttf'),
  });

  if (!fontsLoaded) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <Tabs>
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
        }}
      />
      <Tabs.Screen
        name="log"
        options={{
          title: 'Log',
        }}
      />
    </Tabs>
  );
}
