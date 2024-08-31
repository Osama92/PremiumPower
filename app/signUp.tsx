import {
    Text,
    View,
    StyleSheet,
    Image,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
    TouchableOpacity,
    ScrollView,
  } from "react-native";
  import { useFonts } from 'expo-font';
  
  export default function SignUp() {
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
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView contentContainerStyle={styles.scrollViewContent}>
            <View style={styles.container}>
              <View style={styles.LogoSection}>
                <Image source={require('../assets/images/PPS.png')} style={styles.logosize} resizeMode="contain" />
              </View>
              <View style={styles.editArea}>
                <Text style={styles.regularText}>Hello there!</Text>
                <Text style={styles.bigText}>CUSTOMER DETAILS</Text>
                <View style={styles.inputSection}>
                  <TextInput style={styles.inputArea}
                    placeholder="First Name"
                    placeholderTextColor={'#00443F'} />
                  <TextInput style={styles.inputArea1}
                    placeholder="Last Name"
                    placeholderTextColor={'#00443F'} />
                  <TextInput style={styles.inputArea1}
                    placeholder="Location"
                    placeholderTextColor={'#00443F'} />
                  <TextInput style={styles.inputArea1}
                    placeholder="Mobile Number"
                    placeholderTextColor={'#00443F'} />
                </View>
                <TouchableOpacity style={styles.loginBtn}>
                  <Text style={styles.loginText}>Submit</Text>
                </TouchableOpacity>
                <View style={styles.coa}>
                  <Text style={{ fontSize: 12 }}>By clicking submit you are agreeing to the</Text>
                  <TouchableOpacity>
                    <Text style={{ fontSize: 12, color: '#F1B20A', fontWeight: '700' }}> Terms and Conditions.</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: '#fff',
    },
    scrollViewContent: {
      flexGrow: 1,
    },
    regularText: {
      fontFamily: 'Montserrat',
      fontSize: 16,
      paddingLeft: 15,
      marginTop: 40,
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
      marginTop: 10,
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
      width: '100%',
      height: 250,
      marginTop: 20,
      marginLeft: 20,
    },
    inputArea: {
      backgroundColor: '#f2f2f2',
      height: 50,
      borderRadius: 10,
      paddingLeft: 10,
      color: '#00443F'
    },
    inputArea1: {
      backgroundColor: '#f2f2f2',
      height: 50,
      borderRadius: 10,
      paddingLeft: 10,
      marginTop: 10,
      color: '#00443F'
    },
    loginBtn: {
      width: '100%',
      height: 50,
      backgroundColor: '#00443F',
      marginLeft: 20,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 10,
    },
    loginText: {
      color: 'white',
    },
    coa: {
      width: '100%',
      height: 40,
      marginLeft: 20,
      justifyContent: 'center',
      marginTop: 15,
      flexDirection: 'row',
      flexWrap: 'wrap'
    }
  });
  