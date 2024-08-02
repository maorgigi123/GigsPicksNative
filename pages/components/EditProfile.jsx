import { View, Text, Image, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentUser } from '../../store/user/user.selector';
import * as ImagePicker from 'expo-image-picker';
import Color from '../Colors/Color';
import axios from 'axios';
import { SET_CURRENT_PROFILE_IMG } from '../../store/user/user.action';
import Icon from 'react-native-vector-icons/Ionicons'; // Import your preferred icon library
export default function EditProfile() {
    const user = useSelector(selectCurrentUser);
    const [profileImage, setProfileImage] = useState(user.profile_img);
    const dispath = useDispatch()
    const pickImage = async () => {
        // Ask for permission to access the gallery
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        
        if (permissionResult.granted === false) {
            alert("You've refused to allow this app to access your photos!");
            return;
        }

        // Open the image picker
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
            base64: true,  // Include base64 in the result
        });

        if (!result.canceled) {
            setProfileImage(result.assets[0].uri);
            console.log(result.assets[0].mimeType)
            const _data = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/uploadProfilePicture`,{
                method:'POST',
                headers:{'Content-Type' :'application/json'},
                body:JSON.stringify({
                profileImage:result.assets[0].base64,
                profileImageType:result.assets[0].mimeType,
                username: user.username
                })
               })
            
            const data = await _data.json()
            if(data !== 'error'){
                console.log(data)
                dispath(SET_CURRENT_PROFILE_IMG(data))

            }
            else{
                console.log('error')
            }
            // Here you would also want to upload the image to your server and update the user profile in the database
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: Color.BLACK }}>
            <View style={{ width: '100%', height: 200, display: 'flex', alignItems: 'center', marginTop: 20 }}>
                <Image source={{ uri: `${process.env.EXPO_PUBLIC_API_URL}/uploads/${user.profile_img}` }} style={{ width: 100, height: 100, borderRadius: 100 }} />
                <TouchableOpacity onPress={pickImage}>
                    <View style={{ width: 200, height: 60, backgroundColor: Color.PRIMARY_BUTTON, marginTop: 20, borderRadius: 24, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ textAlign: 'center', fontSize: 20, color: Color.WHITE, fontWeight: 'bold' }}>Edit Image</Text>
                    </View>
                </TouchableOpacity>
            </View>
            <TouchableOpacity style={{ width: '100%',backgroundColor:Color.BLACK_BACKGROUND,height:100, marginTop: 20 ,position:'relative'}}>
                <Text style={{ color: Color.WHITE, fontSize: 20,fontWeight:'bold' ,padding:10}}>username</Text>
                <Text style={{ color: Color.WHITE, fontSize: 18 ,padding:10}}>{user.username}</Text>
                <View style={{position:'absolute',right:0,top:35}}>
                <Icon name={'chevron-back-sharp'}  size={35} color={Color.WHITE} style={{marginLeft:15, transform:[{scaleX:-1}]}} />
                </View>
            </TouchableOpacity>
            <TouchableOpacity style={{ width: '100%',backgroundColor:Color.BLACK_BACKGROUND,height:100, marginTop: 20 ,position:'relative'}}>
            <Text style={{ color: Color.WHITE, fontSize: 20,fontWeight:'bold' ,padding:10}}>Biography</Text>
            <Text style={{ color: Color.WHITE, fontSize: 20,padding:10 }}>{user.biography}</Text>
                <View style={{position:'absolute',right:0,top:35}}>
                <Icon name={'chevron-back-sharp'}  size={35} color={Color.WHITE} style={{marginLeft:15, transform:[{scaleX:-1}]}} />
                </View>
            </TouchableOpacity>
            
        </View>
    );
}
