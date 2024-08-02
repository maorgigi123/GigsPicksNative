import { View, Text, TouchableOpacity } from 'react-native'
import React, { useEffect } from 'react'
import Color from '../Colors/Color'
import { SET_CURRENT_LOCATION, SET_CURRENTPLAYERS, SET_PLAYERS_LOCATION, setCurrentUser } from '../../store/user/user.action';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from 'expo-router';
import { selectCurrentWs } from '../../store/webSocket/ws.selector';
import { selectCurrentUser } from '../../store/user/user.selector';
import { CommonActions } from '@react-navigation/native';
export default function ProfileSetting({navigation}) {
    const dispatch = useDispatch()
    const ws = useSelector(selectCurrentWs);
    const user = useSelector(selectCurrentUser)

    const handleLogOut = () => {
        ws.currentWs.send(JSON.stringify({ type: 'disconnect', username: `${user.username}` }))
        dispatch(setCurrentUser(null))
        dispatch(SET_CURRENT_LOCATION(null))
        dispatch(SET_CURRENTPLAYERS([]))
        navigation.dispatch(
            CommonActions.reset({
              index: 0, // Index of the active route
              routes: [{ name: 'Login' }], // The route to navigate to
            })
          );
        

      
    }
  return (
    <View style={{flex:1,backgroundColor:Color.BLACK_BACKGROUND}}>
        <View style={{display:'flex',justifyContent:'center',alignItems:'center',flex:1}}>
            <TouchableOpacity onPress={() => {handleLogOut()}}>
                <View style={{backgroundColor:Color.PRIMARY_BUTTON_HOVER,padding:25,borderRadius:24,paddingHorizontal:50}}>
                    <Text style={{fontSize:28,color:Color.WHITE}}>Log out</Text>
                </View>
            </TouchableOpacity>
           
        </View>
      
    </View>
  )
}