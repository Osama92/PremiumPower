import { Text, View, StyleSheet, Image } from "react-native";
import { useFonts } from 'expo-font';


export default function Index() {
  const [loaded] = useFonts({
    Montserrat: require('../assets/fonts/Montserrat.ttf'),
    MontserratBold: require('../assets/fonts/Montserrat-ExtraBold.ttf')
  });

  

  return (
    <View style={styles.container}>
      <View style={styles.LogoSection}>
      <Image source={require('../assets/images/PPS.png')} style={styles.logosize} resizeMode="contain"/>
      </View>
      <View style={styles.editArea}>
        <Text style={styles.regularText}>Welcome Back</Text>
        <Text style={styles.bigText}>LOGIN</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  regularText: {
    fontFamily: 'Montserrat',
    fontSize: 16,
    paddingLeft: 15,
    paddingTop: 20
  },
  bigText: {
    fontFamily: 'MontserratBold',
    fontSize: 40,
    paddingLeft: 15,
  },
  LogoSection: {
    width: '100%',
    height: '10%',
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginTop:50
  },
  logosize: {
    height: '100%',
    width: '30%',
  },
  editArea: {
    width: '100%',
    height: '80%',
    backgroundColor: 'orange'
  }

});
