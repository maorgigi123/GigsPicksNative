import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Keyboard } from 'react-native';
import { setCurrentUser } from '../store/user/user.action';
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentUser } from '../store/user/user.selector';
import Color from './Colors/Color';

const LoginScreen = ({ navigation }) => {
  const user = useSelector(selectCurrentUser)
  const dispatch = useDispatch()
  const [username,setUsername] = useState('')
  const [password,setPassword] = useState('')
  const [haveError,SetError] = useState(false);
    const goToRegister = () => {
        navigation.navigate('Register');
    };

    const handleChangeUsername = (value) => {
      setUsername(value);
    };
  
    const handleChangePassword = (value) => {
      setPassword(value);
    };

    const handleLogin = () => {
      SetError('')
      setPassword('')
      Keyboard.dismiss();
     
      if(username.length < 8) {
        return SetError('username need be at least 8 characters')
    }

    if(password.length < 8 ){
        return SetError('password need be at least 8 characters')
    }
    fetch(`${process.env.EXPO_PUBLIC_API_URL}/signIn`,{
      method:"post",
      headers:{'content-Type':'application/json'},
      body: JSON.stringify({
          username,
          password
      })
    }).then(data => data.json())
    .then(data => {
        if(data === 'wrong credentials'){
            return SetError('wrong credentials, try again')
        }
        setPassword('')
        setUsername('')
        dispatch(setCurrentUser(data))
        navigation.replace('Home')
        
    }).catch(e => console.log(e))
    }
    useEffect(() => {
      if (user) {
        // Navigation actions should be performed in useEffect or other lifecycle methods
        navigation.replace('Home');
      }
    }, [user, navigation]);
    
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Gigs Picks</Text>
            <TextInput
                style={styles.input}
                placeholder="Username or Email"
                placeholderTextColor="#BFBFBF"
                keyboardType="username"
                autoCapitalize='none'
                onChangeText={handleChangeUsername}
                value={username}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#BFBFBF"
                secureTextEntry
                onChangeText={handleChangePassword}
                value={password}
            />
            <TouchableOpacity style={styles.loginButton} onPress={() => {handleLogin()}}>
                <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>
            {(haveError.length > 0) && 
            <View style={styles.ErrorContainer}>
              <Text style={styles.ErrorText}>*</Text>
              <Text style={styles.ErrorText}>{haveError}</Text>
            </View>}
           
            <TouchableOpacity
                style={styles.registerLink}
                onPress={goToRegister}>
                <Text style={styles.registerLinkText}>
                    Don't have an account? Sign up
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Color.BLACK,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 40,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 50,
        color: Color.WHITE,
    },
    input: {
        width: '100%',
        height: 50,
        borderColor: '#E0E0E0',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 15,
        marginBottom: 15,
        fontSize: 16,
        color: Color.WHITE,
    },
    loginButton: {
        width: '100%',
        height: 50,
        backgroundColor: '#0095f6',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        marginTop: 20,
    },
    loginButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    registerLink: {
        marginTop: 20,
    },
    registerLinkText: {
        fontSize: 16,
        color: '#0095f6',
    },
    ErrorContainer:{
      display:'flex',
      flexDirection:'row',
      justifyContent:'center',
      alignContent:'center',
      gap:5
    },
    ErrorText:{
      color:'red',
      marginTop:10,
    
    }
});

export default LoginScreen;