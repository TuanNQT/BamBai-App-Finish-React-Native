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
import { theme } from '../core/theme'
import BackButton from '../components/BackButton'
import Logo from '../components/Logo'
import Header from '../components/Header'
import TextInput from '../components/TextInput'
import Button from '../components/Button'
import { emailValidator } from '../helpers/emailValidator'

export default function ResetPasswordScreen({ navigation }) {
  const [email, setEmail] = useState({ value: '', error: '' })
  const [isLoading, setisLoading] = useState(false)
  const sendResetPasswordEmail = () => {
    const emailError = emailValidator(email.value)
    if (emailError) {
      setEmail({ ...email, error: emailError })
      return
    }
    setisLoading(true)
    fetch('https://bambai.online/Admin/APIBamBai/Reset', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email.value,
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        setisLoading(false)
        console.log(responseJson)
        if (responseJson.code === 200) {
          Alert.alert(
            'Thành công',
            'Kiểm tra email và làm theo hướng dẫn để đặt lại mật khẩu',
            [
              {
                text: 'OK',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
              },
              {
                text: 'Đăng nhập',
                onPress: () => navigation.navigate('LoginScreen'),
              },
            ]
          )
        } else if (responseJson.code === 404) {
          Alert.alert('Lỗi..', 'Email không tồn tại', [
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
        } else if (responseJson.code === 500) {
          Alert.alert('Lỗi!!', 'Thử lại sau', [
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
        alert('Lỗi gì đó! Vui lòng thử lại sau')
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
          <Header>Đặt lại mật khẩu</Header>
          <TextInput
            label="E-mail address"
            returnKeyType="done"
            value={email.value}
            onChangeText={(text) => setEmail({ value: text, error: '' })}
            error={!!email.error}
            errorText={email.error}
            autoCapitalize="none"
            autoCompleteType="email"
            textContentType="emailAddress"
            keyboardType="email-address"
            description="Bạn sẽ nhận được email chứa mã bảo mật để đặt lại mật khẩu."
            style={styles.TextInput}
          />
          {isLoading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <Button
              mode="contained"
              onPress={sendResetPasswordEmail}
              style={styles.TextInput}
            >
              Lấy mã
            </Button>
          )}
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
})
