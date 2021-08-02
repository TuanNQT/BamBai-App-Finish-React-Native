import React, { useState } from 'react'
import { Ionicons } from '@expo/vector-icons';
import { Provider } from 'react-native-paper'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { theme } from './src/core/theme'
import {
  HomeScreen,
  LoginScreen,
  RegisterScreen,
  ResetPasswordScreen,
  Dashboard,DetailsItem,CartScreen,OrderHistory,DetailsOrder
} from './src/screens'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import DetailsItem from './src/screens/DetailItem';
import { UserProvider } from './src/helpers/UserData';
// import CartScreen from './src/screens/CartScreen';
// import OrderHistory from './src/screens/OrderHistory';
const Stack = createStackNavigator()
const Tab = createBottomTabNavigator();
export default function App() {
  return (
    <UserProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen options={{ headerShown: false }} name="Home">
            {() => (<Tab.Navigator
              screenOptions={({ route }) => ({

                tabBarIcon: ({ focused, color, size }) => {
                  let iconName;

                  if (route.name === 'Home') {
                    iconName = focused ? 'home-outline' : 'home-outline';
                  } else if (route.name === 'Dashboard') {
                    iconName = focused ? 'list-circle-outline' : 'list-outline';
                  } else if(route.name==='Cart'){
                    iconName = focused ? 'cart-outline':'cart' ;
                  }

                  // You can return any component that you like here!
                  return <Ionicons name={iconName} size={size} color={color} />;
                }
              })}
              tabBarOptions={{
                activeTintColor: 'tomato',
                inactiveTintColor: 'gray',
              }}
            >
              <Tab.Screen name="Home" component={HomeScreen} />
              <Tab.Screen name="Dashboard" component={Dashboard} />
              <Tab.Screen name="Cart" component={CartScreen} />
            </Tab.Navigator>)}
          </Stack.Screen>
          <Stack.Screen name="LoginScreen" component={LoginScreen} />
          <Stack.Screen name="DetailsItem" component={DetailsItem} />
          <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
          <Stack.Screen name="OrderHistory" component={OrderHistory} />
          <Stack.Screen name="DetailsOrder" component={DetailsOrder} />
          <Stack.Screen
            name="ResetPasswordScreen"
            component={ResetPasswordScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  )
}
