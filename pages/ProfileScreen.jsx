import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../store/user/user.selector";
import { useNavigation, useNavigationState, useRoute } from "@react-navigation/native";
import { View, Text, ActivityIndicator, TouchableOpacity, FlatList, SafeAreaView, RefreshControl, StyleSheet } from "react-native";
import styled from "styled-components/native";
import ProfilePosts from "./ProfilePosts";
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Color from "./Colors/Color";
import { UserContext } from "../store/userContext";

const ProfileContainer = styled.View`
  width: 100%;
  background-color: black;
`;

const TopLayoutContainer = styled.View`
  width: 100%;
  height: 100px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0 15px; /* Adjusted padding for proper alignment */
`;

const TopLayoutLeft = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
   /* margin-left: 15px; */
`;

const TopLayoutProfileImg = styled.Image`
  width: 80px;
  height: 80px;
  border-radius: 40px; /* Using half of the width/height for a circular image */
`;

const TopLayoutRight = styled.View`
  display: flex;
  flex-direction: row;
  gap: 40px;
  margin-right: 30px;
`;

const LineBreakContainer = styled.View`
  position: relative;
`;

const Line = styled.View`
  height: 1px;
  background-color: #737373;
`;

const BioContainer = styled.View`
  margin-left: 15px;
`;

const BioInfo = styled.Text`
  color: white;
  font-weight: bold;
  font-size: 16px;
`;

const LoaderContainer = styled.View`
  width: 100%;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
`;

const NoPostsYetContainer = styled.View`
  width: 100%;
  align-items: center;
  margin-top: 30px;
`;

const NoPostsYetText = styled.Text`
  font-size: 30px;
  font-weight: bold;
  color: white;
`;

const PostsContainer = styled.View`
  width: 100vw;
  overflow-x: hidden;
  overflow-y: auto; /* Changed to auto */
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 1px;
`;


const ProfileLayout = () => {
  const _user = useSelector(selectCurrentUser);
  const navigation = useNavigation();
  const route = useRoute();
  const { username} = route.params;
  const {back} = route.params
  const {ChatNavigate ='ChatScreen',CommentNavigate ='Profile'} = route.params;
  const [SelectPosts, SetSelectPost] = useState(true);
  const [allPosts, setPosts] = useState([]);
  const [load, setLoad] = useState(true);
  const [loadPosts, setLoadPosts] = useState(false);
  const [user, setUser] = useState();
  const [isAdmin, setIsAdmin] = useState(false);
  const [seeAll,setSeeAll] = useState(false)
  let postsID = useRef([]);
  let post = useRef(null);

  const { setPathUserMessage } = useContext(UserContext);

  const [showPreview, setShowPreview] = useState(false);


  const OnClickSelectHandler = (ClickOnPosts) => {
    SetSelectPost(ClickOnPosts);
  };

  const fetchData = async (username) => {
    try {
      const fetchUser = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/getUserByUsername`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, seen: postsID.current.length })
      });

      const data = await fetchUser.json();
      if (data === 'dont have user') {
        console.log('User not found');
        setLoad(false);
      } else {
        const user = data[0];
        const posts = data[1];
        if(posts.length <=0) setSeeAll(true); 
        if(posts.length < 12) setSeeAll(true)
        const unseenPosts = posts.filter(post => !postsID.current.includes(post._id));
        setPosts((prev) => [...prev, ...unseenPosts]);
        postsID.current.push(...unseenPosts.map(post => post._id));
        setUser(user);
        setPosts(posts);
        setTimeout(()=>{
          setLoad(false);
        },100)
        
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setLoad(false);
    }
  };

  const fetchMorePosts = async () => {
    if(seeAll) return
    if (showPreview) return;
    if(loadPosts) return
    if (postsID.current.length <= 0) return;
    setLoadPosts(true);
    try {
      const fetchUser = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/getUserPosts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user._id,
          seenPosts: postsID.current
        })
      });

      const data = await fetchUser.json();
      if(data.length <=0) setSeeAll(true)
      if(data.length < 8) setSeeAll(true)
      if (data.length > 0) {
        const unseenPosts = data.filter(post => !postsID.current.includes(post._id));
        setPosts((prev) => [...prev, ...unseenPosts]);
        postsID.current.push(...unseenPosts.map(post => post._id));
      }
      setLoadPosts(false);
      
    } catch (error) {
      console.log('Error fetching user posts:', error);
      setLoadPosts(false);
    }
  };

  const navigateToEditProfile = () => {
    navigation.navigate('EditProfile');
  };

  const handleRefresh = async() => {
    setLoadPosts(true);
    setPosts([])
    setLoad(true)
    setSeeAll(false)
    postsID.current = []
    if (_user && username === _user.username) {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
    try {
      await fetchData(username); // Execute the passed-in refresh function
    } catch (error) {
      console.error("Refresh error:", error);
    } finally {
      setLoadPosts(false);
    }
  }; 

  useEffect(() => {
    handleRefresh()
  }, [post.current, showPreview]);

  const renderFooter = () => {
    if (!loadPosts) return null;
    return (
      <LoaderContainer>
        <ActivityIndicator size="large" color="#0000ff" />
      </LoaderContainer>
    );
  };
const chunkData = (data, size) => {
  const result = [];
  for (let i = 0; i < data.length; i += size) {
    result.push(data.slice(i, i + size));
  }
  return result;
};


  const gridData = chunkData(SelectPosts ? allPosts : [], allPosts.length);
  return (
    <View style={{ flex: 1, backgroundColor: 'black' }}>
      {load && (
        <SafeAreaView>
        <LoaderContainer>
          <ActivityIndicator size="large" color="#0000ff" />
        </LoaderContainer>
        </SafeAreaView>
       
      )}
      {!load && !user && (
        <SafeAreaView style={{ flex:1,justifyContent:'center',alignItems:'center'}}>
          <Text>Sorry, this page isn't available.</Text>
          <Text style={{ fontSize: 16, margin: 20 }}>
            The link you followed may be broken, or the page may have been removed.{" "}
            <Text style={{ color: 'blue' }} onPress={() => navigation.navigate('Login')}>Go back to Gigs.</Text>
          </Text>
        </SafeAreaView>
      )}
      {!load && user && (  
        <FlatList
          data={gridData}
          renderItem={({ item }) => (
            <PostsContainer>
              {item.map((post,index) => (
                <ProfilePosts key={post._id} post={allPosts[index]} posts={allPosts} index={index} setPosts={setPosts}/>
              ))}
            </PostsContainer>
          )}
          keyExtractor={(item, index) => `row-${index}`}
          onEndReached={fetchMorePosts}
          onEndReachedThreshold={0.1}
          ListFooterComponent={renderFooter}
          refreshControl={
            <RefreshControl
              refreshing={loadPosts}
              onRefresh={handleRefresh}
              tintColor="#0000ff" // Spinner color (iOS)
              colors={['#ff0000', '#00ff00', '#0000ff']} // Spinner colors (Android)
              progressBackgroundColor="#ffff00" // Background color of spinner (Android)
            />
          }
          ListEmptyComponent={() => (
            <NoPostsYetContainer>
              <Text style={{ color: 'white', fontSize: 60, marginBottom: 20, fontWeight: 'bold' }}>Gigs Picks</Text>
              <NoPostsYetText>No posts yet.</NoPostsYetText>
            </NoPostsYetContainer>
          )}
          ListHeaderComponent={() => (

            <ProfileContainer>
               <SafeAreaView style={styles.safeAreaView}>
            <Text style={styles.title}>{username}</Text>
            <View style={styles.IconsContainer}>
              {isAdmin ? [
                    ,
                    <TouchableOpacity key={'menu-outline'}
                        style={styles.iconContainerRight}
                        onPress={() => {navigation.navigate('Setting')}}
                    >
                         <Icon name="menu-outline" size={35} color={Color.WHITE}/>
                    </TouchableOpacity>]
                    :
                    <TouchableOpacity
                    style={styles.iconContainerRight}
                    onPress={() => {}}
                >
                     <MaterialCommunityIcons name="dots-horizontal" size={28} color={Color.WHITE}/>
                </TouchableOpacity>
                    }
                  
                   
            </View>
           
            </SafeAreaView>


              {/* Profile Information */}
              <TopLayoutContainer>
                <TopLayoutLeft>
                  {back && 
                  <TouchableOpacity onPress={() => {navigation.goBack()}}>
                         <Icon name={'chevron-back-sharp'} size={40} color={Color.WHITE} />
                  </TouchableOpacity>
                  
                  }
                  <TopLayoutProfileImg source={{ uri:user ? `${process.env.EXPO_PUBLIC_API_URL}/uploads/${user.profile_img}` : ''}} />
                </TopLayoutLeft>
                <TopLayoutRight>
                  <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Text style={{ color: 'white' }}>{user.posts}</Text>
                    <Text style={{ color: 'white' }}>posts</Text>
                  </View>
                  <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Text style={{ color: 'white' }}>{user.followers_count}</Text>
                    <Text style={{ color: 'white' }}>followers</Text>
                  </View>
                  <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Text style={{ color: 'white' }}>{user.following_count}</Text>
                    <Text style={{ color: 'white' }}>following</Text>
                  </View>
                </TopLayoutRight>
              </TopLayoutContainer>
              <BioContainer>
                <Text style={{fontSize:16,fontWeight:'bold',color:'white',marginBottom:15}}>{user.username}</Text>
                <BioInfo>{user.biography}</BioInfo>
              </BioContainer>
              {!isAdmin ? (
                <View style={{ display: 'flex', flexDirection: 'row', width: '100%', gap: 15, marginLeft: 15,marginTop:15,marginBottom:15 }}>
                  <TouchableOpacity activeOpacity={.7} style={{ backgroundColor: 'rgb(0,149,246)', padding: 12, borderRadius: 8, width: 120, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ color: 'white' }}>Follow</Text>
                  </TouchableOpacity>
                  <TouchableOpacity activeOpacity={.7} style={{ backgroundColor: '#323436', padding: 12, borderRadius: 8, width: 120, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }} onPress={() => {
                       setPathUserMessage({ username: user.username,profile_img:user.profile_img,_id:user._id });

                       navigation.navigate('Messages');

                  }}>
                    <Text style={{ color: 'white' }}>Message</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={{ display: 'flex', flexDirection: 'row', width: '100%', gap: 15, marginLeft: 15,marginTop:15,marginBottom:15 }}>
                  <TouchableOpacity onPress={() => {navigation.navigate('EditProfile')}} activeOpacity={.7} style={{ backgroundColor: 'rgb(0,149,246)', padding: 12, borderRadius: 8, width: 120, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ color: 'white' }}>Edit Profile</Text>
                  </TouchableOpacity>
                  {/* <TouchableOpacity activeOpacity={.7} style={{ backgroundColor: 'rgb(0,149,246)', padding: 12, borderRadius: 8, width: 120, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ color: 'white' }}> View Archive</Text>
                  </TouchableOpacity> */}
                </View>
              )}
              {/* Posts and Saved Selector */}
              <LineBreakContainer>
                <Line />
              </LineBreakContainer>

            </ProfileContainer>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  safeAreaView: {
    backgroundColor:Color.BLACK,
    flexDirection: "row", // Arrange items horizontally
    justifyContent: "space-between", // Distribute items evenly along the main axis
    alignItems: "center", // Center items vertically
    paddingHorizontal: 20,
    marginTop: 40,
},
IconsContainer:{
    marginRight:10,
    marginLeft:15,
    display:"flex",
    flexDirection:"row",
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
})
export default ProfileLayout;

