import { View, Text, StyleSheet,TouchableOpacity, ActivityIndicator, ScrollView, FlatList, RefreshControl } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { selectCurrentMessages, selectCurrentUser } from '../../store/user/user.selector'
import Color from '../Colors/Color'
import { useContext, useEffect, useState } from 'react'
import MessageComponent from './MessageComponent'
import { setCurrentMessages } from '../../store/user/user.action'
import {Ionicons} from 'react-native-vector-icons'
import { useRoute } from '@react-navigation/native'
import { UserContext } from '../../store/userContext'
export default function Messages({navigation}) {

    const user = useSelector(selectCurrentUser)
    const messages = useSelector(selectCurrentMessages)
    const [load,setLoad] = useState(false)
    const dispatch = useDispatch();

    const {PathUserMessage,setPathUserMessage} = useContext(UserContext);

    // Now you can access the passed parameter

    const sortedMessages = messages.slice().sort((a, b) => {
        return new Date(b.messages[b.messages.length-1].timestamp) - new Date(a.messages[a.messages.length-1].timestamp);
    });
    const fetchMessages = async() => {
        if(load) return
        try{
            const fetchMessages = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/getAllMessages`,{
                method:'POST',
                headers:{'Content-Type' :'application/json'},
                body:JSON.stringify({
                    userId:user._id
                })
            })
            
            const data = await fetchMessages.json();
            if(data.error) return setLoad(false);
            dispatch(setCurrentMessages(data))
           
            setLoad(false)
        }catch(e) {
            setLoad(false)
        }
    }
    useEffect(() => {
        // if(!user) navigate('/')
        if(load === false)
        {
            setTimeout(() => {
                fetchMessages()
                setLoad(true)
            },300)
        }
            
    },[messages])

    let havePlayer = false;
    sortedMessages.map((data) => {
        const recipient = user && data.participants.find(_user => _user.username !== user.username);
        if(PathUserMessage && PathUserMessage.username === recipient.username ){
            havePlayer = true
            setPathUserMessage({username: ''})
            navigation.navigate('ChatScreen', {
                username: recipient.username,
                profile_img: recipient.profile_img,
                _id: recipient._id,
                messages: data.messages,
                CommentNavigate:'Profile'
            });
            }
    })

    if(havePlayer === false && PathUserMessage.profile_img){
        navigation.navigate('ChatScreen', {
            username: PathUserMessage.username,
            profile_img: PathUserMessage.profile_img,
            _id: PathUserMessage._id,
            CommentNavigate:'Profile'
        });
        setPathUserMessage({username: ''})
    }
    
  return (
    <View style={styles.container}>
        {
            sortedMessages.length <=0 ? 
            <View style={{flex:1,justifyContent:'center',alignItems:'center',gap:10}}>
                <Ionicons name={'chatbubbles-outline'} size={120} color={Color.WHITE}/>
                <Text style={{color:Color.WHITE,fontSize:28,fontWeight:'bold'}}>Your messages</Text>
                <Text style={{color:Color.WHITE,fontSize:16,fontWeight:'500'}} >Send a message to start a chat</Text>
                <TouchableOpacity activeOpacity={.6} style={{backgroundColor:Color.PRIMARY_BUTTON,padding:12,borderRadius:18}}>
                    <Text style={{color:Color.WHITE,fontSize:16,fontWeight:'bold'}}>Send message</Text>
                </TouchableOpacity>
            </View>
            : 
            <View style={styles.containerMessages}>
            <FlatList
              data={sortedMessages}
              renderItem={({ item, index }) => (
                <MessageComponent key={index} index={index} data={item} userPath = {PathUserMessage}/>
                )}
                keyExtractor={(item, index) => index.toString()}

            />
            </View>
         }
    </View>
  )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:Color.BLACK
    },
    containerMessages:{
        flex:1,
        display:'flex',
        flexDirection:'column',
        gap:10,
    }
})