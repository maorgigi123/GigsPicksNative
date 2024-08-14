import React, { useContext, useEffect } from 'react';
import { TouchableOpacity, View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useSelector } from 'react-redux'; // Assuming you use Redux for state management
import { useNavigation } from '@react-navigation/native'; // React Navigation hook
import styled from 'styled-components/native'; // styled-components for React Native
import { selectCurrentMessages, selectCurrentUser } from '../../store/user/user.selector'; // Redux selector
import { CalcData } from '../../utils/CalcData';
import Color from '../Colors/Color';
import {Entypo,Ionicons,AntDesign} from 'react-native-vector-icons'
import { UserContext } from '../../store/userContext';
import {Image} from 'expo-image'
import ExpoImage from 'expo-image/build/ExpoImage';
import { Swipeable } from 'react-native-gesture-handler';
// Styled-components for React Native
const MessageContainer = styled.TouchableOpacity`
  margin-top: 12px;
  flex-direction: row;
  align-items: center;
  padding: 10px;
  cursor: pointer;
  background-color : black;
`;

const ProfileImage = styled.Image`
  width: 50px;
  height: 50px;
  border-radius: 25px;
`;

const ProfileUserInfoContainer = styled.View`
  padding-left: 12px;
`;

const ProfileName = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: #898181;
`;

const ProfileLastMessageContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 5px;
`;

const ProfileLastMessage = styled.Text`
  color: #898181;
  font-size: 14px;
`;

const ProfileLastTimeMessage = styled.Text`
  color: #898181;
  font-size: 14px;
  margin-left: 5px;
`;

const MessageComponent = ({ data,userPath}) => {
  const navigation = useNavigation();
  const user = useSelector(selectCurrentUser); // Example: Fetching current user from Redux state
  const messages = useSelector(selectCurrentMessages)
  const recipient = user && data.participants.find(_user => _user.username !== user.username);
  const sender = user && data.participants.find(_user => _user.username === user.username);
  const { setPathUserMessage } = useContext(UserContext);


  const leftSwipe = () => {
    return (
      <View style={{backgroundColor:'#fff',height:80,marginTop:12}}>
        <TouchableOpacity style={{width:80,height:80,backgroundColor:'red',display:'flex',justifyContent:'center',alignItems:'center'}}>
            <Ionicons name={'trash'} color={'white'} size={30}/>
        </TouchableOpacity>
      </View>
    )
  }
  const rightSwipe = () => {
    return (
      <View style={{backgroundColor:'#fff',height:80,marginTop:12}}>
      <TouchableOpacity style={{width:80,height:80,backgroundColor:Color.PRIMARY_BUTTON,display:'flex',justifyContent:'center',alignItems:'center'}}>
          <AntDesign style={{marginBottom:10}} name={'pushpin'} color={'white'} size={30}/>
      </TouchableOpacity>
    </View>
    )
  }
  const handleNavigateToChat = () => {
    navigation.navigate('ChatScreen', {
        username: recipient.username,
        recipient : recipient,
        profile_img: recipient.profile_img,
        _id: recipient._id,
        messages: data.messages,
        CommentNavigate:'Profile',
    });
  };
  const isSender = user && data.messages[data.messages.length - 1].sender.username === user.username;
  const read = data.messages[data.messages.length - 1].read;
  useEffect(() => {
    if(!user) return
    if (userPath && userPath.username === recipient?.username) {
      handleNavigateToChat();
      setPathUserMessage({ username: '' });
    }
  }, [userPath, recipient, setPathUserMessage,user]);

  if (!user) return null;


  return (
    <Swipeable renderLeftActions={leftSwipe} renderRightActions={rightSwipe}>
      <MessageContainer onPress={handleNavigateToChat} activeOpacity={1}>
        <ExpoImage source={{uri:`${process.env.EXPO_PUBLIC_API_URL}/uploads/${recipient.profile_img}`}} style={{width:50,height:50,borderRadius:50}}/>
        {/* <ProfileImage source={{ uri:recipient && `${process.env.EXPO_PUBLIC_API_URL}/uploads/${recipient.profile_img}` }} /> */}
        <ProfileUserInfoContainer>
          <ProfileName>{recipient && recipient.username}</ProfileName>
          <ProfileLastMessageContainer>
            <ProfileLastMessage>{data.messages && data.messages.length > 0 && data.messages[data.messages.length - 1].sender.username === user.username && 'You: '}{(data.messages[data.messages.length - 1].image.data.length > 0) ? 'Send A File' : data.messages[data.messages.length - 1].content}</ProfileLastMessage>
            <ProfileLastTimeMessage>{data.messages && data.messages.length > 0 && `.${CalcData(data.messages[data.messages.length - 1].timestamp)}`}</ProfileLastTimeMessage>
            {!isSender && !read && <View style={{marginHorizontal:10}}><Entypo name={'new'} size={20} color={Color.PRIMARY_BUTTON}/></View> }
          </ProfileLastMessageContainer>
        </ProfileUserInfoContainer>
      </MessageContainer>
    </Swipeable>
  );
};

export default MessageComponent;
