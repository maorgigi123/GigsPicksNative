import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentUser } from '../../store/user/user.selector';
import { formatTimestamp } from '../../utils/CalcData';
import {AntDesign} from 'react-native-vector-icons'
import Color from '../Colors/Color';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';
import { setAddMessage, setCurrentMessages, UPDATE_READ_BY_MESSAGE } from '../../store/user/user.action';
import { selectCurrentWs } from '../../store/webSocket/ws.selector';
import {Image} from 'expo-image'
import ExpoImage from 'expo-image/build/ExpoImage';
const Message = ({ message, profile_img, allList,index}) => {
  const user = useSelector(selectCurrentUser);
  const ws = useSelector(selectCurrentWs);

  const navigation = useNavigation()
  const currentTimestamp = new Date(message.timestamp);
  const previousMessage = index > 0 ? allList[index - 1] : null;
  const NextMessage = index > 0 ? allList[index + 1] : null;

  const previousTimestamp = previousMessage ? new Date(previousMessage.timestamp) : null;
  const showTimestamp = !previousTimestamp || (currentTimestamp - previousTimestamp) >= 3600000; // 1 hour in milliseconds
  const showSpace = NextMessage && (NextMessage.sender.username !== message.sender.username); // 1 hour in milliseconds
  const isUser = (message.sender.username === user.username)
  const isRead = message.read

  const [read,setRead] = useState(isRead)
  const handleRead = async() => {
    try {
      const fetchMessages = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/readMessage`,{
        method:'POST',
        headers:{'Content-Type' :'application/json'},
        body:JSON.stringify({
          MessageId:message._id,
          userId: user._id
        })
       })
    
    const data = await fetchMessages.json();

    ws.currentWs.send(JSON.stringify({type:'updateRead', payload:{data} , username:message.sender.username,recipient:user.username}));
    setRead(true)
      
   } catch (e) {
    console.log('error while read message');
    }
  }
  // console.log(message.readBy)
  useEffect(() => {
    setRead(message.read)
    if(!read && !message.read && message._id && message.sender.username !== user.username ){
      // console.log(message.content , ' ',user.username)
        handleRead()
      // console.log('read This Message id,',message._id)
    }
  },[message])
  return (
    <View style={styles.messageContainer}>
      {showTimestamp && <Text style={styles.timeSend}>{formatTimestamp(message.timestamp)}</Text> }
      
      <View style={[
        styles.messageContainerItem,
        {
          flexDirection: user && user.username === (message.sender.username ? message.sender.username : message.sender)
            ? 'row-reverse'
            : 'row',
        },
      ]}>
        <ExpoImage
          style={styles.profileImg}
          source={{
            uri: message.sender.profile_img ? `${process.env.EXPO_PUBLIC_API_URL}/uploads/${message.sender.profile_img}` : `${process.env.EXPO_PUBLIC_API_URL}/uploads/${profile_img}`,
          }}
        />
        {message.image.typeFile ?
        <TouchableOpacity onPress={() => {navigation.navigate('PreviewFile',{item:message.image})}}>
          {message.image.data.startsWith('Messages') 
          ? 
          <ExpoImage 
            source={{ uri:`${process.env.EXPO_PUBLIC_API_URL}/uploads/${message.image.data}`}} 
            style={{width:200,height:200,borderRadius:12}}
          /> 
          :
          <ExpoImage source={{uri:message.image.data}} style={{width:200,height:200,borderRadius:12}} />}
          </TouchableOpacity> : 
        <View style={[styles.messageContent,{    backgroundColor: isUser ? '#830EF7' : '#1F1F1F'}]}><Text style={{color:Color.WHITE}}>{message.content}</Text></View>}
        {read  && isUser && <View style={{backgroundColor:Color.PRIMARY_BUTTON,width:30,height:30,borderRadius:50,display:'flex',justifyContent:'center',alignItems:'center',marginHorizontal:10}}>
         <AntDesign name={'eye'} color={Color.WHITE} size={18}/>
          </View>}

      </View>
      {showSpace && 
       <View style={{marginTop:20}}></View>
      }
    </View>
  );
};

const styles = StyleSheet.create({
  messageContainer: {
    width: '100%',
    flexDirection: 'column',
    marginBottom: 2,
  },
  profileImg: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginLeft: 20,
    marginRight: 20,
  },
  timeSend: {
    marginTop: 10,
    width: '100%',
    textAlign:'center',
    color:'white',
    marginBottom:10
  },
  messageContainerItem: {
    alignItems: 'center',
  },
  messageContent: {
    color:'white',
    fontWeight:'bold',
    padding: 12,
    borderRadius: 12,
    fontSize: 14,
    maxWidth:'70%'
  },
});

export default Message;