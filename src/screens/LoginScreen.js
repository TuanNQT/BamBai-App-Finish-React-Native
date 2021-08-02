import React, { useState } from 'react'
import { TouchableOpacity, Alert, StyleSheet, ActivityIndicator, View } from 'react-native'
import { Text } from 'react-native-paper'
import Background from '../components/Background'
import Logo from '../components/Logo'
import Header from '../components/Header'
import Button from '../components/Button'
import TextInput from '../components/TextInput'
import BackButton from '../components/BackButton'
import { theme } from '../core/theme'
import { emailValidator } from '../helpers/emailValidator'
import { passwordValidator } from '../helpers/passwordValidator'
import  UserContext  from '../helpers/UserData'
import { useContext } from 'react'
export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState({ value: '', error: '' })
  const [password, setPassword] = useState({ value: '', error: '' })
  const [isLoading, setisLoading] = useState({ value: false })
  const {userIDcontext,userNamecontext}=useContext(UserContext);
  const [ UserID,setUserID ] = userIDcontext;
  const [UserName,setUserName]=userNamecontext;
  const onLoginPressed = () => {
    const emailError = emailValidator(email.value)
    const passwordError = passwordValidator(password.value)
    if (emailError || passwordError) {
      setEmail({ ...email, error: emailError })
      setPassword({ ...password, error: passwordError })
      return
    }
    setisLoading(true)
    fetch("https://bambai.online/Admin/APIBamBai/Login", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: email.value,
        password: password.value
      })
    }).then(response => response.json())
      .then((responseJson) => {
        setisLoading(false)
        console.log(responseJson);
        if (responseJson.code == 404) {
          console.log("sai thông tin");
          Alert.alert(
            "Error",
            "User name or password is valid",
            [
              {
                text: "Cancel",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel"
              },
              { text: "OK", onPress: () => console.log("OK Pressed") }
            ]
          );
        }
        const userId = responseJson.user.CustomerID;
        const username = responseJson.user.FullName;
        console.log('User updated:' + userId);
        console.log('User updated:' + username);
        const code = responseJson.code;
        console.log(code);
        if (code == 200) {
          setUserID(userId)
          setUserName(username)
          navigation.navigate('Dashboard', {
            userId: userId,
            username: username,
          });

        }
      }).catch(error => console.log(error));


  }

  return (
    <Background>
      <BackButton goBack={navigation.goBack} />
      <Logo />
      <Header>Welcome back.</Header>
      <TextInput
        label="Email"
        returnKeyType="next"
        value={email.value}
        onChangeText={(text) => setEmail({ value: text, error: '' })}
        error={!!email.error}
        errorText={email.error}
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"
      />
      <TextInput
        label="Password"
        returnKeyType="done"
        value={password.value}
        onChangeText={(text) => setPassword({ value: text, error: '' })}
        error={!!password.error}
        errorText={password.error}
        secureTextEntry
      />
      <View style={styles.forgotPassword}>
        <TouchableOpacity
          onPress={() => navigation.navigate('ResetPasswordScreen')}
        >
          <Text style={styles.forgot}>Forgot your password?</Text>
        </TouchableOpacity>
      </View>
      {isLoading == true ? <ActivityIndicator size="large" color="#0000ff" /> :
        <Button mode="contained" onPress={onLoginPressed}>
          Login
        </Button>
      }
      <View style={styles.row}>
        <Text>Don’t have an account? </Text>
        <TouchableOpacity onPress={() => navigation.replace('RegisterScreen')}>
          <Text style={styles.link}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </Background>
  )
}

const styles = StyleSheet.create({
  forgotPassword: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  forgot: {
    fontSize: 13,
    color: theme.colors.secondary,
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
})
