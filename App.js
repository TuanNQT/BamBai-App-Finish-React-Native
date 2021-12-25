import React, { useState } from 'react'
import { Ionicons } from '@expo/vector-icons';
import { Provider } from 'react-native-paper'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import {
  HomeScreen,
  LoginScreen,
  RegisterScreen,
  ResetPasswordScreen,
  Dashboard, DetailsItem, CartScreen, OrderHistory, DetailsOrder
} from './src/screens'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { UserProvider } from './src/helpers/UserData';
const Stack = createStackNavigator()
const Tab = createMaterialTopTabNavigator();
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
              tabBarPosition="bottom"
              screenOptions={({ route }) => ({
                
                tabBarIcon: ({ focused, color, size }) => {
                  let iconName;
                  if (route.name === 'Home') {
                    iconName = focused ? 'home-outline' : 'home-outline';
                  } else if (route.name === 'Dashboard') {
                    iconName = focused ? 'list-circle-outline' : 'list-outline';
                  } else if (route.name === 'Cart') {
                    iconName = focused ? 'cart-outline' : 'cart';
                  }
                  // You can return any component that you like here!
                  return <Ionicons name={iconName} size={20} color={color} />;
                }
              })}
              tabBarOptions={{
                activeTintColor: 'tomato',
                inactiveTintColor: 'gray',
                showIcon:true,
                labelStyle:{fontSize:10}
              }}
            >
              <Tab.Screen name="Home" options={{title:'Trang chủ'}} component={HomeScreen} />
              <Tab.Screen name="Dashboard" component={Dashboard} options={{title:'Shopping'}}/>
              <Tab.Screen name="Cart" component={CartScreen} options={{title:'Giỏ hàng'}}/>
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
