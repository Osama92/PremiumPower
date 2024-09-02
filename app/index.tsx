import { Text, View, StyleSheet, Image, TextInput,KeyboardAvoidingView, Platform, TouchableWithoutFeedback, TouchableOpacity} from "react-native";
import { useFonts } from 'expo-font';
import {Link} from 'expo-router'


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
                     placeholder="Enter Username"
                     placeholderTextColor={'#00443F'}/>
          <TextInput style={styles.inputArea1}
                     placeholder="Enter Password"
                     placeholderTextColor={'#00443F'}/>
        </View>
        <TouchableOpacity style={styles.loginBtn}>
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>
        <View style={styles.coa}>
          <Text style={{fontSize:12}}>Don’t have a Login access?</Text>
          <TouchableOpacity>
            <Link href={'/signUp'} asChild>
            <Text style={{fontSize:12, color:'#F1B20A', fontWeight:'700'}}> Request a Login here</Text>
            </Link>
          </TouchableOpacity>
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
    width: 120,
    marginLeft: 15,
  },
  editArea: {
    width: '100%',
    height: '80%',
  },
  inputSection: {
    width:'100%',
    height: 150,
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
    marginTop:20,
    color: '#00443F'
  },
  loginBtn: {
    width:'100%',
    height:50,
    backgroundColor: '#00443F',
    marginLeft: 20,
    justifyContent:'center',
    alignItems:'center',
    borderRadius: 10,
  },
  loginText: {
    color:'white',
  },
  coa: {
    width: '100%',
    height:40,
    marginLeft: 20,
    alignItems: 'center',
    marginTop: 15,
    flexDirection: 'row',
    // flexWrap:'wrap',
    // backgroundColor:'orange'
  }

});
