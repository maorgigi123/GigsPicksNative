import 'react-native-gesture-handler'
import React, { useEffect, useRef, useState } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import {LogBox, Platform, StatusBar} from 'react-native';
import { store, persistor } from './store/store'; // Adjust the path according to your project structure
import AppStack from './appStack';
import { Audio } from 'expo-av';
import Splash from './pages/components/Splash';
import Animated, { FadeIn } from 'react-native-reanimated';
import { UserProvider } from './store/userContext';
  // persistor.purge();

const App = () => {
  const [splahAniamtionFinish, setSplashAnimationFinish] = useState(false)
  LogBox.ignoreLogs(['Warning: ...']); // Replace 'Warning: ...' with the actual warning text
  LogBox.ignoreAllLogs();
  if (Platform.OS === "ios")
    Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
    return (
      <>
      {splahAniamtionFinish ? 
      <Animated.View entering={FadeIn} style={{flex:1}}>
            <Provider store={store}>
              <PersistGate loading={null} persistor={persistor}>
                <UserProvider>
                    <StatusBar barStyle="light-content" />
                    <AppStack/>
                </UserProvider>
              </PersistGate>
          </Provider> 
      </Animated.View>
          :
        <Splash setSplashAnimationFinish={setSplashAnimationFinish}/>
      }
      </>
      
      
    );
};
export default App;
