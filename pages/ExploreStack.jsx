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
import ExploreScreen from './ExploreScreen';
const ExploreStack = createStackNavigator();

export default function ExplorePageStack() {
    const user = useSelector(selectCurrentUser)
  return (
    <ExploreStack.Navigator>
          <ExploreStack.Screen 
        name="Explore" 
        component={ExploreScreen} 
        options={{ headerShown: false }} // Customize as needed
        />
        <ExploreStack.Screen 
        name="ChatScreen" 
        component={MessageUser} 
        options={{ headerShown: false }} // Customize as needed
        />
         <ExploreStack.Screen 
        name="Profile" 
        component={ProfileLayout} 
        options={{ headerShown: false }} // Customize as needed
        />



        <ExploreStack.Screen 
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


        <ExploreStack.Screen 
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


    </ExploreStack.Navigator>
  );
}
