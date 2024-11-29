import 'react-native-gesture-handler';
import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack';
import NewsDetails from './src/screens/NewsDetails';
import HomeScreen from './src/screens/bottomTabs/home/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import SplashScreen from './src/screens/SplashScreen';
import TestLive from './src/screens/TestLive';
import ForgetPassword from './src/screens/ForgetPassword';
import Message from './src/screens/bottomTabs/chat/Message';
import Message1 from './src/screens/bottomTabs/chat/Message1';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName='SplashScreen'
        screenOptions={{
          headerShown: false
        }}
      >
        <Stack.Screen name="SplashScreen" component={SplashScreen} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="ForgetPassword" component={ForgetPassword} />
        <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="NewsDetails" component={NewsDetails} />
        <Stack.Screen name="TestLive" component={TestLive} />
        <Stack.Screen name="Message" component={Message} />
        <Stack.Screen name="Message1" component={Message1} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App

const styles = StyleSheet.create({})