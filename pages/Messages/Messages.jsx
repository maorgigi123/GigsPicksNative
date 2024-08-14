import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentMessages, selectCurrentUser } from '../../store/user/user.selector';
import Color from '../Colors/Color';
import { useContext, useEffect, useState } from 'react';
import MessageComponent from './MessageComponent';
import { SET_ROUTE, setCurrentMessages } from '../../store/user/user.action';
import { Ionicons } from 'react-native-vector-icons';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { UserContext } from '../../store/userContext';

export default function Messages() {
    const user = useSelector(selectCurrentUser);
    const messages = useSelector(selectCurrentMessages);
    const [load, setLoad] = useState(false);
    const dispatch = useDispatch();
    const navigation = useNavigation();  // Use useNavigation hook
    const { PathUserMessage, setPathUserMessage } = useContext(UserContext);
    const isFocused = useIsFocused(); // Hook to detect if screen is focused

    useEffect(() => {
        if(!isFocused) return
        dispatch(SET_ROUTE('Messages'))
    }, [isFocused])
    useEffect(() => {
        const fetchMessages = async () => {
            if (load) return;
            if (!user) return;
            try {
                const fetchMessages = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/getAllMessages`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId: user._id })
                });

                const data = await fetchMessages.json();
                if (data.error) return setLoad(false);
                dispatch(setCurrentMessages(data));
                setLoad(false);
            } catch (e) {
                console.error(e);
                setLoad(false);
            }
        };

        if (user && !load) {
            setLoad(true);
            fetchMessages();
        }
    }, []);

    useEffect(() => {
        if (!user || !PathUserMessage) return;
        const recipient = messages
            .flatMap(data => data.participants)
            .find(_user => _user.username !== user.username);
        if (recipient && PathUserMessage.username === recipient.username) {
            setPathUserMessage({ username: '' });
            navigation.navigate('ChatScreen', {
                username: recipient.username,
                recipient,
                profile_img: recipient.profile_img,
                _id: recipient._id,
                messages: messages.find(m => m.participants.includes(recipient)).messages,
                CommentNavigate: 'Profile',
            });
        } else if (PathUserMessage.profile_img) {
            // console.log('get here' , PathUserMessage)
            navigation.navigate('ChatScreen', {
                username: PathUserMessage.username,
                recipient: PathUserMessage.recipient,
                profile_img: PathUserMessage.profile_img,
                _id: PathUserMessage._id,
                CommentNavigate: 'Profile'
            });
            setPathUserMessage({ username: '' });
        }
    }, [messages, PathUserMessage, user, navigation, setPathUserMessage]);

    const sortedMessages = messages.slice().sort((a, b) => {
        const lastMsgA = a.messages[a.messages.length - 1]?.timestamp;
        const lastMsgB = b.messages[b.messages.length - 1]?.timestamp;
        return new Date(lastMsgB) - new Date(lastMsgA);
    });

    if (!user) return null;

    return (
        <View style={styles.container}>
            {sortedMessages.length <= 0 ?
                <View style={styles.emptyContainer}>
                    <Ionicons name={'chatbubbles-outline'} size={120} color={Color.WHITE} />
                    <Text style={styles.emptyText}>Your messages</Text>
                    <Text style={styles.emptySubText}>Send a message to start a chat</Text>
                    <TouchableOpacity activeOpacity={0.6} style={styles.sendMessageButton}>
                        <Text style={styles.sendMessageText}>Send message</Text>
                    </TouchableOpacity>
                </View>
                :
                <FlatList
                    data={sortedMessages}
                    renderItem={({ item, index }) => (
                        <MessageComponent key={index} index={index} data={item} userPath={PathUserMessage} />
                    )}
                    keyExtractor={(item, index) => index.toString()}
                    contentContainerStyle={styles.containerMessages}
                />
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Color.BLACK
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10
    },
    emptyText: {
        color: Color.WHITE,
        fontSize: 28,
        fontWeight: 'bold'
    },
    emptySubText: {
        color: Color.WHITE,
        fontSize: 16,
        fontWeight: '500'
    },
    sendMessageButton: {
        backgroundColor: Color.PRIMARY_BUTTON,
        padding: 12,
        borderRadius: 18
    },
    sendMessageText: {
        color: Color.WHITE,
        fontSize: 16,
        fontWeight: 'bold'
    },
    containerMessages: {
        flex: 1,
        flexDirection: 'column',
        gap: 10
    }
});
