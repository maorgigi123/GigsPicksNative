import React, { useEffect, useRef, useState, useCallback } from 'react';
import { TouchableOpacity, Text, StyleSheet, View, SafeAreaView, Alert,FlatList,ActivityIndicator,RefreshControl, Dimensions, Image} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { PanGestureHandler, State } from 'react-native-gesture-handler';

import Icon from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Color from './Colors/Color';
import { useSelector } from 'react-redux';
import {selectCurrentMessages, selectCurrentUser, selectLoadPost } from '../store/user/user.selector';
import PostComponents from './components/PostComponents';
import LoadNewPost from './components/LoadNewPost';


const FeedHeaderRight = ({route,navigation}) => {
    const user = useSelector(selectCurrentUser)
    const [posts, setPosts] = useState([]);
    const [viewedPosts, setViewedPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [openSeeAllPosts , setOpenSeeAllPosts] = useState(false)
    const [viewableItems, setViewableItems] = useState([]);
    const LoadForPostSelector = useSelector(selectLoadPost)
    const [LoadForPost , setLoadForPost] = useState(LoadForPostSelector)


    useEffect(() => {
        setLoadForPost(LoadForPostSelector)
    },[LoadForPostSelector])

      const fetchPosts = async () => {
        try {
          const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/findPosts`, {
            method: "post",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: user._id,
              seenPosts: viewedPosts
            })
          });
          
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
    
          const data = await response.json();
          // Filter out duplicate posts
          const uniquePosts = data.filter(post => !viewedPosts.includes(post._id));
          setPosts(prevPosts => [...prevPosts, ...uniquePosts]);
          if (viewedPosts.length > 0 && data.length <= 0) setOpenSeeAllPosts(true);
        } catch (error) {
          console.error('Error fetching posts:', error);
        } finally {
          setIsLoading(false);
        }
      }

  useEffect(() => {
    if (!posts) return;
  
    // Extract new post IDs from the fetched data
    const newPostsIDs = posts.map(post => post._id);
    // Filter out duplicates from new post IDs
    const uniqueNewPostsIDs = newPostsIDs.filter(id => !viewedPosts.includes(id));
    if (uniqueNewPostsIDs.length === 0) return;
    setViewedPosts(prevIDs => [...prevIDs, ...uniqueNewPostsIDs]);
  }, [posts]);

  useEffect(() => {
    if (posts.length === 0 && !isLoading) {
      setIsLoading(true)
      fetchPosts();
    }
  }, [posts]);


  const renderItem = ({ item }) => (
    <>
     <PostComponents
        setPosts={setPosts} 
        post={item} 
        posts={posts}
        isLike={item.likes.some(like => like._id === user._id)}
        isViewable={viewableItems.some(viewableItem => viewableItem.key === item._id)}
      />

    </>
     
   
  );

  const renderFooter = () => {
    return isLoading ? <ActivityIndicator size="large" color="#0000ff" /> : null;
  };
  const loadMorePosts = () => {
    if(openSeeAllPosts) return
    if (!isLoading) {
      setIsLoading(true)
      fetchPosts();
    }
  };
  const handleRefresh = useCallback(async () => {
    console.log('load')
    setIsLoading(true);
    setPosts([])
    setOpenSeeAllPosts(false)
    try {
      await fetchPosts(); // Execute the passed-in refresh function
    } catch (error) {
      console.error("Refresh error:", error);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  const handleViewableItemsChanged = ({ viewableItems }) => {
    setViewableItems(viewableItems);
};
  const handleGestureStateChange = (event) => {
    if (event.nativeEvent.state === State.END) {
      if (event.nativeEvent.translationX < -70) { // Swipe left threshold
        navigation.navigate('Messages');
      }
    }
  };
  
if(!user) return
    return(

      // <PanGestureHandler
      // onHandlerStateChange={handleGestureStateChange} >
        <View style={styles.container}>
        <SafeAreaView style={styles.safeAreaView}>
            <Text style={styles.title}>GigsPicks</Text>
            <View style={styles.IconsContainer}>
            <TouchableOpacity
                        style={styles.iconContainerLeft}
                        onPress={() => Alert.alert('message')}
                    >
                        <Icon name="notifications-outline" size={28} color={Color.WHITE}/>
                    </TouchableOpacity>
                    
                    {/* <TouchableOpacity
                        style={styles.iconContainerRight}
                        onPress={() => navigation.navigate('Messages')}
                    >
                        <AntDesign name="message1" size={25} color={Color.WHITE} />
                    </TouchableOpacity> */}
            </View>
           
            </SafeAreaView>
            


            <View style={{flex:1}}>
            {isLoading && posts.length <=0? (
                <ActivityIndicator size='large' color={'#0000ff'} />
            ) :
            <View style={{flex:1}}>
            {LoadForPost && LoadForPost.status && 
              <LoadNewPost cover={LoadForPost.cover}/>
            }
              
                <FlatList
                data={posts}
                renderItem={renderItem}
                keyExtractor={(item) => item._id.toString()}
                // contentContainerStyle={{ columnGap: 150}}
                // showsVerticalScrollIndicator='false' in andorid do problems
                onEndReached={loadMorePosts}
                onEndReachedThreshold={1.5}
                ListFooterComponent={renderFooter}
                removeClippedSubviews={true}
                viewabilityConfig={{itemVisiblePercentThreshold:50}}
                onViewableItemsChanged={handleViewableItemsChanged}
                refreshControl={
                  <RefreshControl
                    refreshing={isLoading}
                    onRefresh={handleRefresh}
                    tintColor="#0000ff" // Spinner color (iOS)
                    colors={['#ff0000', '#00ff00', '#0000ff']} // Spinner colors (Android)
                    progressBackgroundColor="#ffff00" // Background color of spinner (Android)
                  />
                }
                // debug={true}
                initialNumToRender={5}
                windowSize={3}
                />
            </View>
            }
            </View>
            </View>
            
         )
 
};

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:Color.BLACK,
        position:'relative'
    },
    safeAreaView: {
        backgroundColor:Color.BLACK,
        flexDirection: 'row', // Arrange items horizontally
        justifyContent: 'space-between', // Distribute items evenly along the main axis
        alignItems: 'center', // Center items vertically
        paddingHorizontal: 20,
        marginTop: 40,
    },
    IconsContainer:{
        marginRight:10,
        display:'flex',
        flexDirection:'row',
        gap:10
    },
    title: {
        marginLeft:10,
        fontSize: 24,
        fontWeight: 'bold',
        color: Color.WHITE,
    },
    iconContainerLeft: {
        padding: 10,
        borderRadius: 20,
    },
    iconContainerRight: {
        padding: 10,
        borderRadius: 20,
    },
    hr:{
        width:'100%',
        height:1,
        backgroundColor:Color.LINE_BREAK
    },
   
      loader: {
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
      },
      postContainer: {
        marginBottom: 16,
        padding: 16,
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
      },
      ImageSlide:{
        position:'relative',
        height:10,
        width:10,
        zIndex:1,
        backgroundColor:'lightgray',
        borderRadius:50,
      }

})



export default FeedHeaderRight;
