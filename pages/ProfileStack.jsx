import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import ProfileLayout from './ProfileScreen';
import { useRoute } from '@react-navigation/native';
import FeedHeaderRight from './FeedScreen';
import FeedProfilePreview from './components/FeedProfilePreview';
import Color from './Colors/Color';
import Icon from 'react-native-vector-icons/Ionicons'; // Import your preferred icon library
import Messages from './Messages/Messages';
import MessageUser from './Messages/MessageUser';
import PreivewFile from './components/PreivewFile';
import ProfileSetting from './components/ProfileSetting';
import LoginScreen from './Login';
import EditProfile from './components/EditProfile';
import Friends from './Friends/Friends';

const FeedStack = createStackNavigator();

export default function ProfileStack() {
    const route = useRoute();
    const user = route.params;

    const CustomTransition = {
      cardStyleInterpolator: ({ current, layouts }) => {
        const { progress } = current;
        const translateX = progress.interpolate({
          inputRange: [0, 1],
          outputRange: [layouts.screen.height, 0],
        });
    
        return {
          cardStyle: {
            transform: [{ translateX }],
          },
        };
      },
    };


  return (
    <FeedStack.Navigator initialRouteName='ProfileMain'>
    <FeedStack.Screen 
      name="ProfileMain" 
      component={ProfileLayout} 
      options={{ headerShown: false}} // Customize as needed
      initialParams={{username: user.username }}
    />
     <FeedStack.Screen 
      name="FeedProfile" 
      component={FeedProfilePreview} 
      
      options={({ navigation }) => ({ headerShown: true,
        headerStyle:{backgroundColor:Color.BLACK},
        headerTintColor:Color.WHITE,
        headerTitle:user.username,
        headerLeft: () => (
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 15 }}>
               <Icon name={'chevron-back-sharp'} size={28} color={Color.WHITE} />
          </TouchableOpacity>

      ),
        
      })
    } // Customize as needed
    />
  <FeedStack.Screen 
        name="ChatScreenProfile" 
        component={MessageUser} 
        options={{ headerShown: false }} // Customize as needed
        />

  <FeedStack.Screen 
        name="ShowFriends" 
        component={Friends} 
        options={({ navigation }) => ({ headerShown: true,
          headerStyle:{backgroundColor:Color.BLACK},
          headerTintColor:Color.WHITE,
          headerTitle:user.username,
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 15 }}>
                 <Icon name={'chevron-back-sharp'} size={28} color={Color.WHITE} />
            </TouchableOpacity>
  
        ),
          
        })
      } // Customize as needed
        
        />


<FeedStack.Screen 
      name="PreviewFile" 
      component={PreivewFile} 
      
      options={({ navigation }) => ({ headerShown: true,
        headerStyle:{backgroundColor:Color.BLACK},
        headerTintColor:Color.WHITE,
        headerTitle:'',
        headerLeft: () => (
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 15 }}>
               <Icon name={'chevron-back-sharp'} size={28} color={Color.WHITE} />
          </TouchableOpacity>

      ),
        
      })
    } // Customize as needed
    />
      <FeedStack.Screen
                name="Setting"
                component={ProfileSetting}
                options={({ navigation }) => ({
                    headerShown: true,
                    title: 'Setting',
                    headerStyle: { backgroundColor: Color.BLACK_BACKGROUND },
                    headerTintColor: Color.WHITE,
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 15 }}>
                              <Icon name={'close'} size={35} color={Color.WHITE} />
                        </TouchableOpacity>
                    ),
                    gestureEnabled: false,
                    headerShadowVisible: false,
                    ...CustomTransition,
                })}
            />

        <FeedStack.Screen
                name="EditProfile"
                component={EditProfile}
                options={({ navigation }) => ({
                    headerShown: true,
                    title: 'Edit Profile',
                    headerStyle: { backgroundColor: Color.BLACK_BACKGROUND },
                    headerTintColor: Color.WHITE,
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 15 }}>
                              <Icon name={'close'} size={35} color={Color.WHITE} />
                        </TouchableOpacity>
                    ),
                    gestureEnabled: false,
                    headerShadowVisible: false,
                    ...CustomTransition,
                })}
            />

  </FeedStack.Navigator>
  )
}