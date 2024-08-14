// screens/FeedStackScreen.js
import { createStackNavigator } from '@react-navigation/stack';
import FeedHeaderRight from './FeedScreen';
import Messages from './Messages/Messages';
import Icon from 'react-native-vector-icons/Ionicons'; // Import your preferred icon library
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { TouchableOpacity, View } from 'react-native';
import Color from './Colors/Color';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../store/user/user.selector';
import MessageUser from './Messages/MessageUser';
import ProfileLayout from './ProfileScreen';
import FeedProfilePreview from './components/FeedProfilePreview';
import PreivewFile from './components/PreivewFile';
import Friends from './Friends/Friends';
const FeedStack = createStackNavigator();

export default function MessagesStack() {
    const user = useSelector(selectCurrentUser)
  return (
    <FeedStack.Navigator>
        <FeedStack.Screen 
        name="Messages" 
        component={Messages} 
        options={({ navigation }) => ({
        headerTitle:user ?  user.username : '', // Custom title
        headerRight: () => (
            <View style={{ marginRight: 15 }}>
            <FontAwesome name={'edit'} size={28} color={Color.WHITE} />
            </View>
        ),
        headerStyle: {
            backgroundColor: '#fff', // Header background color
        },
        headerTitleStyle: {
            fontWeight: 'bold', // Title text styling
        },
        headerShadowVisible: false,
        headerStyle: { backgroundColor: Color.BLACK},
        headerTitleStyle: {
            color: Color.WHITE, // Change this to your desired title color
            fontWeight: 'bold', // Optional: Title text styling
        },

        })}
        />
        <FeedStack.Screen 
        name="ChatScreen" 
        component={MessageUser} 
        options={{ headerShown: false }} // Customize as needed
        />
         <FeedStack.Screen 
        name="Profile" 
        component={ProfileLayout} 
        options={{ headerShown: false }} // Customize as needed
        />
          <FeedStack.Screen 
        name="ProfileMain" 
        component={ProfileLayout} 
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


    </FeedStack.Navigator>
  );
}
