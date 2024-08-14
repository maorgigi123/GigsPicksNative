import { View, Text, ActivityIndicator, TouchableOpacity, StyleSheet, Image, SafeAreaView, AppState } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack';


import LoginScreen from './pages/Login'
import RegisterScreen from './pages/Register'
import HomeScreen from './pages/Home';
import { NavigationContainer, useRoute } from '@react-navigation/native';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentUser } from './store/user/user.selector';
import { SET_NEW_LOCATIONS, SET_PLAYERS_LOCATION, setAddMessage, setCurrentMessages, setCurrentUser, setUpdateMessage } from './store/user/user.action';
import { setCurrentWs } from "./store/webSocket/ws.action";
import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons'; // Import your preferred icon library
import Color from './pages/Colors/Color';
import CameraScreen from './pages/camera/camera';

export default function AppStack({ navigation }) {

    const Stack = createStackNavigator();

    const user = useSelector(selectCurrentUser)

  return (
          <NavigationContainer>
    <Stack.Navigator initialRouteName={user ? "Home" : "Login"}>
        <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{
                title: 'Login',
                headerShown: false, // Hide the header for this screen
            }}
        />
        <Stack.Screen
                name="camera"
                component={CameraScreen}
                options={({ navigation }) => ({
                    headerShown: false,
                })}
            />
            
        <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={({ navigation }) => ({
                headerShown: false, // Hide the header for this screen
            //     title: 'Create Account',
            //     headerStyle: { backgroundColor: Color.BLACK},
            //     headerTintColor: Color.WHITE,
            //     headerShown: true, // Show the header for this screen
            //     headerLeft: () => (
            //       <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 15 }}>
            //             <Icon name={'chevron-back-sharp'} size={28} color={Color.WHITE} />
            //       </TouchableOpacity>
            //   ),
            //   headerShadowVisible: false,
            })}
        />
           <Stack.Screen
                  name="Home"
                  component={HomeScreen}
                  options={{ headerShown: false }}
          />
              
         
    </Stack.Navigator>
</NavigationContainer> 

      
  )
}