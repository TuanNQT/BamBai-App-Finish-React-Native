import React from 'react'
import Background from '../components/Background'
import Logo from '../components/Logo'
import Header from '../components/Header'
import Button from '../components/Button'
import Paragraph from '../components/Paragraph'
import UserContext from '../helpers/UserData'
import { useContext } from 'react'
import { View } from 'react-native'
export default function HomeScreen({ route, navigation }) {
  const { userId, username } = route.params ?? {};
  const { userIDcontext, userNamecontext } = useContext(UserContext);
  const [UserID, setUserID] = userIDcontext;
  const [UserName, setUserName] = userNamecontext;
  console.log(UserID)
  console.log(UserName)
  return (
    <Background>
      <Logo />
      <Header>Welcome</Header>
      <Paragraph>
        {(UserID == 0) ? "Bạn chưa đăng nhập" : "Chào mừng " + UserName + " đến với BamBai"}
      </Paragraph>
      {(UserID == 0) ?
        <View style={{width:'100%'}}>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('LoginScreen')}
          >
            Login
          </Button>
          <Button
            mode="outlined"
            onPress={() => navigation.navigate('RegisterScreen')}
          >
            Sign Up
          </Button>
        </View>
        : <View style={{width:'100%'}}>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('OrderHistory')}
          >
            OrderHistory
          </Button>
          <Button
            mode="outlined"
            onPress={() =>{ navigation.navigate('LoginScreen'),setUserID(0)}}
          >
            Logout
          </Button>
        </View>}
    </Background>
  )
}
