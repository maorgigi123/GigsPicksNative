import React, { useContext, useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity,AppState,SafeAreaView, Alert } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons'; // Import your preferred icon library
import {AntDesign,FontAwesome} from 'react-native-vector-icons'; // Import your preferred icon library
import {Image} from 'expo-image'
import FeedScreen from './FeedScreen';
import ExploreScreen from './ExploreScreen';
import ProfileScreen from './ProfileScreen';
import Videos from './Videos';
import FeedStackScreen from './FeedStackNavigator';
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentMessages, selectCurrentUser } from '../store/user/user.selector';
import { useNavigation, useNavigationState, useRoute } from '@react-navigation/native';
import ProfileStack from './ProfileStack';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import Color from './Colors/Color';
import { AddPostStack } from './AddPostStack';
import MessageUser from './Messages/MessageUser';
import Messages from './Messages/Messages';
import MessagesStack from './MessagesStack';
import ExplorePageStack from './ExploreStack';
import { setCurrentWs } from '../store/webSocket/ws.action';
import { SET_CURRENTPLAYERS, SET_PLAYERS_LOCATION, setAddMessage, setCurrentUser, setLoadPost, setUpdateMessage } from '../store/user/user.action';
import { UserContext } from '../store/userContext';
import ExpoImage from 'expo-image/build/ExpoImage';

const Tab = createBottomTabNavigator();
const HomeScreen = () => {
    const user = useSelector(selectCurrentUser)
    const navigation = useNavigation()
    const dispatch = useDispatch();
    const [load,setLoad] = useState(false);
    const [error,setError] = useState('')
    const ws = useRef(null);
    let timeOut = useRef(null);
    const [newMessage,setNewMessage] = useState()
    const { setPathUserMessage } = useContext(UserContext);

    useEffect(() => {
        if(!user) return
    
        setLoad(true)
        // Initialize WebSocket connection
        ws.current = new WebSocket(encodeURI(`ws://${process.env.EXPO_PUBLIC_API_URL_WS}?username=${user.username}`));
    
        // WebSocket connection opened
        ws.current.onopen = () => {
          dispatch(setCurrentWs(ws.current))
          setLoad(false)
        };
        // WebSocket message received
        ws.current.onmessage = (event) => {
           const mesage = JSON.parse(event.data);
           if(mesage.newMessage){
            
            dispatch(setAddMessage(mesage.newMessage))
            if(mesage.newMessage.sender.username !== user.username)
              setNewMessage(mesage.newMessage)
           }
           if(mesage.updateRead){
            dispatch(setUpdateMessage(mesage.updateRead.data))
           }
           if(mesage.newLocationUpdate){
            // console.log('new locations ',mesage.newLocationUpdate)
            dispatch(SET_PLAYERS_LOCATION({location:mesage.newLocationUpdate,username:mesage.username}))
          }
          if(mesage.uploadPost){
            if(mesage.uploadPost === 'error'){
              dispatch(setLoadPost({ cover: '', status: false }));
              return Alert.alert('Error While Upload Post')
            }
            dispatch(setLoadPost({ cover: '', status: false }));
          }
          if(mesage.allPlayersLocation){
            // console.log('new locations ',mesage.newLocationUpdate)
            // dispatch(SET_CURRENTPLAYERS(mesage.allPlayersLocation))
            dispatch(SET_CURRENTPLAYERS([]))
            mesage.allPlayersLocation.map((message) => {
              if(message.username && message.username !== user.username){
                console.log('add : ',message.username)
                dispatch(SET_PLAYERS_LOCATION({location:message.location,username:message.user}))
              }
            })
            
          }
        };
    
        // WebSocket connection closed
        ws.current.onclose = () => {
          console.log('WebSocket connection closed');
        };
    
        // WebSocket error occurred
        ws.current.onerror = (error) => {
          console.error('WebSocket error:', error);
          setLoad(false)
          setError('something went wrong with the connection, please try again')
           dispatch(setCurrentUser(null))
        };
         // Clean up function
         return () => {
          // Close the WebSocket connection when the component unmounts
          ws.current.close();
        };
    
      }, [user]);

      useEffect(() => {
        const handleAppStateChange = (nextAppState) => {
          if (nextAppState === 'background') {
            if(ws.current && user && user.username)
              ws.current.send(JSON.stringify({ type: 'disconnect', username: `${user.username}` }));
            }
          else if (nextAppState === 'active') {
            if(ws.current && user && user.username){
              ws.current = new WebSocket(encodeURI(`ws://${process.env.EXPO_PUBLIC_API_URL_WS}?username=${user.username}`));
                 // WebSocket connection opened
                ws.current.onopen = () => {
                  dispatch(setCurrentWs(ws.current))
                };
                 // WebSocket message received
                ws.current.onmessage = (event) => {
                  const mesage = JSON.parse(event.data);

                  if(mesage.newMessage){
                    // console.log('new message ')
                    dispatch(setAddMessage(mesage.newMessage))
                    if(mesage.newMessage.sender.username !== user.username)
                      setNewMessage(mesage.newMessage)
                  }
                  if(mesage.updateRead){
                    console.log('update message for:',user.username)
                    dispatch(setUpdateMessage(mesage.updateRead.data))
                   }
                  if(mesage.newLocationUpdate){
                    // console.log('new locations ',mesage.newLocationUpdate)
                    dispatch(SET_PLAYERS_LOCATION({location:mesage.newLocationUpdate,username:mesage.username}))
                  }
                  if(mesage.uploadPost){
                    if(mesage.uploadPost === 'error'){
                      dispatch(setLoadPost({ cover: '', status: false }));
                      return Alert.alert('Error While Upload Post')
                    }
                    dispatch(setLoadPost({ cover: '', status: false }));
                  }
                  if(mesage.allPlayersLocation){
                    // console.log('new locations ',mesage.newLocationUpdate)
                    // dispatch(SET_CURRENTPLAYERS(mesage.allPlayersLocation))
                    dispatch(SET_CURRENTPLAYERS([]))
                    mesage.allPlayersLocation.map((message) => {
                      if(message.username && message.username !== user.username){
                        console.log('add : ',message.username)
                        dispatch(SET_PLAYERS_LOCATION({location:message.location,username:message.user}))
                      }
                    })
                    
                  }
              };
               // WebSocket error occurred
                ws.current.onerror = (error) => {
                  console.error('WebSocket error:', error);
                  setError('something went wrong with the connection, please try again')
                  dispatch(setCurrentUser(null))
                };
    
            }
          } 
        }
        const subscription = AppState.addEventListener('change', handleAppStateChange);
    
        return () => {
          subscription.remove();
        };
      }, []);
    useEffect(() => {
        if(!newMessage) return
        if (timeOut.current) {
          clearTimeout(timeOut.current);
        }
        timeOut.current = setTimeout(()=>{
         
          setNewMessage()
        },4000) //4000
        
      },[newMessage])

    return (
        <View style={{flex:1}}>
            {load ? <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          </View> : 
        <BottomSheetModalProvider>

        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Feed') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'Messages') {
                        return <AntDesign name="message1" size={25} color={focused ? Color.PrimaryColor : Color.WHITE} />
                        // iconName = focused ? 'compass' : 'compass-outline';
                    } else if (route.name === 'Videos') {
                        iconName = focused ? 'location-sharp' : 'location-outline';
                    } else if (route.name === 'Profile') {
                        return <View style={{width:34,height:34,borderRadius:999,backgroundColor:focused ? Color.PrimaryColor : Color.WHITE,justifyContent:'center',alignItems:'center'}}>
                            <ExpoImage source={{uri:user ? `${process.env.EXPO_PUBLIC_API_URL}/uploads/${user.profile_img}` : ''}} style={{width:30,height:30,borderRadius:50}}/>
                        </View>
                        // return <Image source={{uri:user.profile_img}} style={{width:40,height:40,borderRadius:50}}/>
                        // iconName = focused ? 'person' : 'person-outline';
                    } else if (route.name === 'Add') {
                        iconName = focused ? 'add-circle' : 'add-circle-outline';
                    }

                    // Adjust icon size as needed
                    size = 28;

                    // Return the icon component
                    return <Icon name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: Color.PrimaryColor, // Color of tab when pressed
                tabBarInactiveTintColor: '#fff', // Color of tab when not pressed
                tabBarShowLabel: false, // Hide label of tabs
                tabBarStyle: {
                    backgroundColor: '#000', // Background color of tab bar
                    borderTopWidth: 1,
                    borderTopColor: '#171616', // Top border color of tab bar
                },
                
            })}
        >
            <Tab.Screen name="Feed" component={FeedStackScreen} options={{ headerShown: false}}/>
            <Tab.Screen name="Messages" component={MessagesStack} options={{headerShown: false }} 
            />
            <Tab.Screen name="Add" component={AddPostStack} options={{ headerShown: false }} />
            <Tab.Screen name="Videos" component={ExplorePageStack} options={{ headerShown: false }} />
            <Tab.Screen name="Profile" component={ProfileStack} options={{ headerShown: false  }}  initialParams={{username: user ? user.username : '' }}  />
        </Tab.Navigator>
        </BottomSheetModalProvider>
    } 
    {newMessage && 
         <SafeAreaView style={styles.newMessageContainer}>
          <TouchableOpacity style={styles.newMessage} onPress={() => {
            setNewMessage();
            setPathUserMessage({ username: newMessage.sender.username})
            navigation.navigate('Messages')}
          }>
          <ExpoImage
              source={{ uri: `${process.env.EXPO_PUBLIC_API_URL}/uploads/${newMessage.profileImg}` }} // Replace with actual image source
              style={styles.profileImg}
          />
          <View style={styles.newMessageProfileInfoContainer}>
              <Text style={styles.profileName}>{newMessage.sender.username}</Text>
              <Text style={styles.profileMessage}>{newMessage.content}</Text>
          </View>
          </TouchableOpacity>
     </SafeAreaView>
    }
    </View>
    );
};

export default HomeScreen;


const styles = StyleSheet.create({
    newMessageContainer: {
      height: 100,
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'absolute',
      zIndex: 100,
    },
    newMessage: {
      height: 70,
      width: '80%',
      borderRadius: 12,
      marginTop: 20,
      backgroundColor: Color.PRIMARY_BUTTON_HOVER, // Replace with your desired background color
      flexDirection: 'row', // Align items in a row
      alignItems: 'center',
      padding: 12,
      overflow: 'hidden',
    },
    profileImg: {
      width: 50,
      height: 50,
      borderRadius: 25,
    },
    newMessageProfileInfoContainer: {
      marginLeft: 10, // Adjust margin as needed
    },
    profileName: {
      fontWeight: 'bold', // Adjust font weight
      fontSize: 18, // Adjust font size
      color:'white'
    },
    profileMessage: {
      color: Color.GrayBackground,
      width: '100%',
      fontWeight:'bold',
      fontSize:12
    },
  });