import { Text, View, StyleSheet, Image, TextInput,KeyboardAvoidingView, Platform } from "react-native";
import { useFonts } from 'expo-font';


export default function Index() {
  const [loaded] = useFonts({
    Montserrat: require('../assets/fonts/Montserrat.ttf'),
    MontserratBold: require('../assets/fonts/Montserrat-ExtraBold.ttf')
  });

  

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      enabled
    >
    <View style={styles.container}>
      <View style={styles.LogoSection}>
      <Image source={require('../assets/images/PPS.png')} style={styles.logosize} resizeMode="contain"/>
      </View>
      <View style={styles.editArea}>
        <Text style={styles.regularText}>Welcome Back</Text>
        <Text style={styles.bigText}>LOGIN</Text>
        <View style={styles.inputSection}>
          <TextInput style={styles.inputArea}
                     placeholder="Enter Username"/>
          <TextInput style={styles.inputArea1}
                     placeholder="Enter Password"/>
        </View>
      </View>
    </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  regularText: {
    fontFamily: 'Montserrat',
    fontSize: 16,
    paddingLeft: 15,
    paddingTop: 80,
    fontWeight: '200'
  },
  bigText: {
    fontFamily: 'Montserrat',
    fontSize: 40,
    paddingLeft: 15,
  },
  LogoSection: {
    width: '100%',
    height: '10%',
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginTop:30
  },
  logosize: {
    height: '100%',
    width: '30%',
  },
  editArea: {
    width: '100%',
    height: '80%',
  },
  inputSection: {
    width:'100%',
    height: 150,
    // justifyContent:'space-between',
    marginTop: 20,
    marginLeft: 20
  },
  inputArea: {
    backgroundColor: '#f2f2f2',
    height: '40%',
    borderRadius: 10,
    paddingLeft: 10,
  },
  inputArea1: {
    backgroundColor: '#f2f2f2',
    height: '40%',
    borderRadius: 10,
    paddingLeft: 10,
    marginTop:20
  }

});
