import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import Videos from './Videos';
import EditPots from './EditPots';
import Color from './Colors/Color';
import {AntDesign,MaterialIcons} from 'react-native-vector-icons'; // Import your preferred icon library

import { TouchableOpacity } from 'react-native';
import EditImage from './components/EditImage';
import AddPots from './AddPots';

export const AddPostStack = () => {
    const AddPostStack = createStackNavigator();
    const CustomTransition = {
      cardStyleInterpolator: ({ current, layouts }) => {
        const { progress } = current;
        const translateY = progress.interpolate({
          inputRange: [0, 1],
          outputRange: [layouts.screen.height, 0],
        });
    
        return {
          cardStyle: {
            transform: [{ translateY }],
          },
        };
      },
    };
  return (
    <AddPostStack.Navigator 
    initialRouteName='AddPost'>
        <AddPostStack.Screen 
            name="AddPost" 
            component={Videos} 
            options={{ headerShown: false}} // Customize as needed
        />

    <AddPostStack.Screen 
      name="EditPost" 
      component={EditPots} 
      
      options={({ navigation }) => ({ headerShown: true,
        headerLeft: () => (
          <TouchableOpacity onPress={() => navigation.popToTop()} style={{ marginLeft: 15 }}>
             <AntDesign name={'close'} size={28} color={Color.WHITE} />
          </TouchableOpacity>
      ),
        headerStyle:{backgroundColor:Color.BLACK},
        headerTintColor:Color.WHITE,
      gestureEnabled: false, // Disable swipe gestures
      headerShadowVisible: false,
      })
    } // Customize as needed
    />

<AddPostStack.Screen
                name="EditImage"
                component={EditImage}
                options={({ navigation }) => ({
                    headerShown: true,
                    title: '',
                    headerStyle: { backgroundColor: Color.BLACK_BACKGROUND },
                    headerTintColor: Color.WHITE,
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 15 }}>
                            <AntDesign name={'close'} size={28} color={Color.WHITE} />
                        </TouchableOpacity>
                    ),
                    gestureEnabled: false,
                    headerShadowVisible: false,
                    ...CustomTransition,
                })}
            />

        <AddPostStack.Screen
                name="Post"
                component={AddPots}
                options={({ navigation }) => ({
                    headerShown: true,
                    title: '',
                    headerStyle: { backgroundColor: Color.BLACK_BACKGROUND },
                    headerTintColor: Color.WHITE,
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 15 }}>
                            <AntDesign name={'close'} size={28} color={Color.WHITE} />
                        </TouchableOpacity>
                    ),
                    gestureEnabled: false,
                    headerShadowVisible: false,
                })}
            />


    </AddPostStack.Navigator>
  )
}
