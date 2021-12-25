import React, { useContext, useState } from 'react'
import {
  TouchableOpacity,
  Alert,
  StyleSheet,
  ActivityIndicator,
  View,
  KeyboardAvoidingView,
  Platform,
  ImageBackground,
  Dimensions,
} from 'react-native'
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
import UserContext from '../helpers/UserData'

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState({ value: '', error: '' })
  const [password, setPassword] = useState({ value: '', error: '' })
  const [isLoading, setisLoading] = useState({ value: false })
  const { userIDcontext, userNamecontext } = useContext(UserContext)
  const [UserID, setUserID] = userIDcontext
  const [UserName, setUserName] = userNamecontext
  const onLoginPressed = () => {
    const emailError = emailValidator(email.value)
    const passwordError = passwordValidator(password.value)
    if (emailError || passwordError) {
      setEmail({ ...email, error: emailError })
      setPassword({ ...password, error: passwordError })
      return
    }
    setisLoading(true)
    fetch('https://bambai.online/Admin/APIBamBai/Login', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: email.value,
        password: password.value,
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        setisLoading(false)
        console.log(responseJson)
        if (responseJson.code === 404) {
          console.log('sai thông tin')
          Alert.alert('Lỗi!!', 'Tài khoản hoặc mật khẩu không hợp lệ', [
            {
              text: 'Cancel',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
            { text: 'OK', onPress: () => console.log('OK Pressed') },
          ])
        }
        const userId = responseJson.user.CustomerID
        const username = responseJson.user.FullName
        const code = responseJson.code
        console.log(code)
        if (code === 200) {
          setUserID(userId)
          setUserName(username)
          navigation.navigate('Dashboard', {
            userId: userId,
            username: username,
          })
        }
      })
      .catch((error) => console.log(error))
  }

  return (
    // <Background>
    <ImageBackground
      source={require('../assets/background_dot.png')}
      resizeMode="repeat"
      style={styles.Img}
    >
      <View style={styles.container}>
        <BackButton goBack={navigation.goBack} />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <Logo />
          <Header>Chào mừng trở lại</Header>
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
            style={styles.TextInput}
          />
          <TextInput
            label="Password"
            returnKeyType="done"
            value={password.value}
            onChangeText={(text) => setPassword({ value: text, error: '' })}
            error={!!password.error}
            errorText={password.error}
            secureTextEntry
            style={styles.TextInput}
          />
          <View style={styles.forgotPassword}>
            <TouchableOpacity
              onPress={() => navigation.navigate('ResetPasswordScreen')}
            >
              <Text style={styles.forgot}>Quên mật khẩu?</Text>
            </TouchableOpacity>
          </View>
          {isLoading === true ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <Button
              mode="contained"
              style={styles.TextInput}
              onPress={onLoginPressed}
            >
              Đăng nhập
            </Button>
          )}
          <View style={styles.row}>
            <Text>Bạn chưa có tài khoản? </Text>
            <TouchableOpacity
              onPress={() => navigation.replace('RegisterScreen')}
            >
              <Text style={styles.link}>Đăng ký</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 200,
    padding: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  Img: {
    flex: 1,
    width: '100%',
    backgroundColor: theme.colors.surface,
  },
  TextInput: {
    alignSelf: 'stretch',
    width: 300,
  },
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
