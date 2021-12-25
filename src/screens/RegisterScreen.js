import React, { useState } from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ImageBackground,
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
import { nameValidator } from '../helpers/nameValidator'

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState({ value: '', error: '' })
  const [email, setEmail] = useState({ value: '', error: '' })
  const [password, setPassword] = useState({ value: '', error: '' })
  const [isLoading, setisLoading] = useState(false)
  const onSignUpPressed = () => {
    const nameError = nameValidator(name.value)
    const emailError = emailValidator(email.value)
    const passwordError = passwordValidator(password.value)
    if (emailError || passwordError || nameError) {
      setName({ ...name, error: nameError })
      setEmail({ ...email, error: emailError })
      setPassword({ ...password, error: passwordError })
      return
    }
    setisLoading(true)
    fetch('https://bambai.online/Admin/APIBamBai/Register', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: name.value,
        email: email.value,
        password: password.value,
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        setisLoading(false)
        console.log(responseJson)
        if (responseJson.code == 200) {
          Alert.alert('Thành công', 'Tài khoản đã được đăng ký thành công', [
            {
              text: 'OK',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
            {
              text: 'Đăng nhập ngay',
              onPress: () => navigation.navigate('LoginScreen'),
            },
          ])
        } else if (responseJson.code == 250) {
          Alert.alert('Lỗi', 'Tài khoản đã tồn tại', [
            {
              text: 'Cancel',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
            {
              text: 'Ok',
              onPress: () => console.log('OK'),
            },
          ])
        } else if (responseJson.code == 300) {
          Alert.alert('Lỗi', 'Email đã tồn tại', [
            {
              text: 'Cancel',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
            {
              text: 'Ok',
              onPress: () => console.log('OK'),
            },
          ])
        }
      })
      .catch((error) => {
        alert('Lỗi gì đó! Vui lòng thử lại')
      })
  }

  return (
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
          <BackButton goBack={navigation.goBack} />
          <Logo />
          <Header>Tạo tài khoản</Header>
          <TextInput
            label="Name"
            returnKeyType="next"
            value={name.value}
            onChangeText={(text) => setName({ value: text, error: '' })}
            error={!!name.error}
            errorText={name.error}
            style={styles.TextInput}
          />
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
          {isLoading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <Button
              mode="contained"
              onPress={onSignUpPressed}
              style={styles.TextInput}
            >
              Đăng ký
            </Button>
          )}
          <View style={styles.row}>
            <Text>Bạn đã có tài khoản? </Text>
            <TouchableOpacity onPress={() => navigation.replace('LoginScreen')}>
              <Text style={styles.link}>Đăng nhập</Text>
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
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
})
