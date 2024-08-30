import { Text, View, StyleSheet } from "react-native";
import { useFonts } from 'expo-font';


export default function Index() {
  const [loaded] = useFonts({
    Montserrat: require('../assets/fonts/Montserrat.ttf'),
  });

  

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Edit app/index.tsx to edit this screen.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  text: {
    fontFamily: 'Montserrat',
    fontSize: 16,
  }
});
