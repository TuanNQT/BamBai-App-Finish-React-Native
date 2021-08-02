import React, { useState } from 'react'
import Background from '../components/Background'
import BackButton from '../components/BackButton'
import Logo from '../components/Logo'
import Header from '../components/Header'
import TextInput from '../components/TextInput'
import Button from '../components/Button'
import { emailValidator } from '../helpers/emailValidator'
import { ActivityIndicator,Alert } from 'react-native'

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
    fetch("https://bambai.online/Admin/APIBamBai/Reset", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: email.value
      })
    }).then(response => response.json())
      .then((responseJson) => {
        setisLoading(false)
        console.log(responseJson);
        if (responseJson.code == 200) {
          Alert.alert(
            "Completed",
            "Check your email to reset password",
            [
              {
                text: "OK",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel"
              },
              {
                text: "Login Now", onPress: () => navigation.navigate('LoginScreen')
              }
            ]
          );
        } else if (responseJson.code == 404) {
          Alert.alert(
            "Error",
            "Email is not already",
            [
              {
                text: "Cancel",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel"
              },
              {
                text: "Ok", onPress: () => console.log("OK")
              }
            ]
          );
        } else if (responseJson.code == 500) {
          Alert.alert(
            "Error",
            "Try again",
            [
              {
                text: "Cancel",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel"
              },
              {
                text: "Ok", onPress: () => console.log("OK")
              }
            ]
          );
        }
      }).catch(error => { console.log(error), alert("Error! Please try again") });
  }

  return (
    <Background>
      <BackButton goBack={navigation.goBack} />
      <Logo />
      <Header>Restore Password</Header>
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
        description="You will receive email with password reset link."
      />
      {isLoading ? <ActivityIndicator size="large" color="#0000ff" /> :
        <Button
          mode="contained"
          onPress={sendResetPasswordEmail}
          style={{ marginTop: 16 }}
        >
          Send Instructions
        </Button>
      }
    </Background>
  )
}
