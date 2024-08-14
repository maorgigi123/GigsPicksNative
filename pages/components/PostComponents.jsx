import { View, Text, Alert,StyleSheet,FlatList,Dimensions, TouchableOpacity, TextInput, ScrollView, Vibration, Pressable} from 'react-native'
import React, { memo, useCallback, useEffect, useRef, useState } from 'react'
// import { Video } from 'expo-av';
import Icon from 'react-native-vector-icons/Ionicons'; // Import your preferred icon library
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Feather from 'react-native-vector-icons/Feather';
import ProfileImage from './ProfileImage';
import { CalcData } from '../../utils/CalcData';
import Color from '../Colors/Color';
import ZoomableImage from './ZoomableImage';
import { Video } from 'expo-av';
import { useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import ReadMore from './ReadMore';
import styled from 'styled-components/native';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../store/user/user.selector';
import {BottomSheetFooter, BottomSheetModal, BottomSheetScrollView, BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { ImageZoom } from '@likashefqet/react-native-image-zoom';
import DropShadow from "react-native-drop-shadow";
import AnimatedDotsCarousel from 'react-native-animated-dots-carousel';
import { TapGestureHandler, State } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withSpring, withTiming } from 'react-native-reanimated';
import {Image} from 'expo-image'
import ExpoImage from 'expo-image/build/ExpoImage';

const AllCommentsContainer = styled.View`
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 100%;
    height:'100%';
`;
const CommentsAllContainer = styled.View`
  display: flex;
  flex-direction: column;
  width: 95%;
`

const CommentsHeaderAuthor = styled.View`
    display: flex;
    align-items: start;
    flex-direction: row;
    gap: 10px;
`;

const CommentsHeader = styled.View`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: start;

    margin: 12px 12px 0px 12px;
`;
const DataComment = styled.Text`
  font-weight: bold;
  font-size: 12px;
    margin: 12px 12px 0px 12px;
    color: white;
`;
const BottomContainerComment = styled.View`
  display: flex;
  align-items: center;
  margin-left: 40px;
  flex-direction: row;
`;

const TranslateSpan = styled.Text`
    margin: 12px 12px 0px 0px;
    font-size: 12px;
    font-weight: bold;
    color:white;

`;


const AuthorIcon = styled.Image`
    width:35px;
    height: 35px;
    /* border-radius: 17.5px; // Instead of 50% */
    object-fit: fill;
    border-radius: 50px;
`;
const AuthorName = styled.Text`
    font-weight: bold;
    color:white;
`;


const ContainerCommentsPrevire = styled(View)`
  display: flex;
  justify-content: space-between;
  font-weight: bold;
  flex-direction:row;
  align-items: center;
  background-color: #323436;
  padding: 12px;
  border-radius: 8px;
`;

const CommentsPreviewLeft = styled(View)`
  font-size:.8em;
  display: flex;
  gap: 10px;
  flex-direction: row;
  width: 90%;
  align-items: center;
`;
const CommentsPreviewName = styled(Text)`
  color: white;
  font-weight: bold;
`;
const CommentPreviewImage = styled(Image)`
height: 30px;
width: 30px;
border-radius: 50px;
    /* border-radius: 10px; // Instead of 50% */
`;
const AuthorContent = styled.View`
 font-weight: bold;
    /* overflow: hidden;
  word-break: break-all; */
  min-height: 20px;
  margin-right: 5px;
`;
const NoCommentsContainer = styled.View`
  width: 100%;
  height: 75%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 12px;
  margin-bottom: 30px;
`;
const NoCommentsText = styled.Text`
font-size: 1.5em;
`;

// Function to render comment header
function CommentHeaderComponent({ post,user,handleAddLike,navigation,CommentNavigate ,handleCloseModal,ChatNavigate}) {
  const likeHearthRef = useRef()
  const [commentLikesCount,setCommentLikeCount] = useState(post.likesCount)
  return (
    <CommentsAllContainer>
    <CommentsHeader>
   <CommentsHeaderAuthor>
    <TouchableOpacity activeOpacity={.9} onPress={() => {
                  handleCloseModal()
                  navigation.push(CommentNavigate, {
                    username: post.user_id.username,
                    back:true,
                    ChatNavigate:ChatNavigate,
                    CommentNavigate:CommentNavigate
                }); 
        }}>
        <AuthorIcon src={`${process.env.EXPO_PUBLIC_API_URL}/uploads/${post.user_id.profile_img}`} alt="Author Icon"/> 
    </TouchableOpacity>
     
     <View style={{display:'flex',width:'85%'}}>
     <TouchableOpacity activeOpacity={.9} onPress={() => {
                handleCloseModal()
                navigation.push(CommentNavigate, {
                  username: post.user_id.username,
                  back:true,
                  ChatNavigate:ChatNavigate,
                  CommentNavigate:CommentNavigate
              }); 
        }}>
      <AuthorName>{post.user_id.username}</AuthorName>
     </TouchableOpacity>
     <AuthorContent>
           <ReadMore text={post.content}> </ReadMore>
         </AuthorContent>
     </View>
     
   </CommentsHeaderAuthor>
   <TouchableOpacity onPress={() => {handleAddLike(post,setCommentLikeCount)}} style={{marginTop:17}}>
          {commentLikesCount ? <AntDesign name="heart" size={20} color="red" /> :  <Feather name="heart" size={20} color="#fff"/> }
    </TouchableOpacity>
 </CommentsHeader>

     <BottomContainerComment>
             <DataComment>{CalcData(post.createdAt)}</DataComment>
             {commentLikesCount > 0 &&  <TranslateSpan >{commentLikesCount} {commentLikesCount > 1 ? 'likes' : 'like'}</TranslateSpan>}
             <TranslateSpan>Reply</TranslateSpan>
             <TranslateSpan>See translation</TranslateSpan>
       </BottomContainerComment>
 </CommentsAllContainer>
  );

}


const ContainerPreviewAdd = ({post,like,handleAddLikeComment}) => {
  const LikeRef = useRef()

  const [commentLikesCount,setCommentLikeCount] = useState(post.likesCount)
    return <ContainerCommentsPrevire>
        <CommentsPreviewLeft>
        <CommentPreviewImage source={{uri:`${process.env.EXPO_PUBLIC_API_URL}/uploads/${post.user_id.profile_img}`}}/>
        
        <CommentsPreviewName>{post.user_id.username}</CommentsPreviewName>
        <View style={{flex:1,pointerEvents:'none'}}>
        <ReadMore text={post.content} maxRows = {1} maxCharacters ={27} showReadMore={false}></ReadMore>
        </View>
       
        
        </CommentsPreviewLeft>
        <TouchableOpacity onPress={() => {handleAddLikeComment(post,setCommentLikeCount)}}>
        {commentLikesCount ? <AntDesign name="heart" size={20} color="red" /> :  <Feather name="heart" size={20} color="#fff" ref={LikeRef} /> }
        </TouchableOpacity>
        
        {/* <IconHeart onClick={() => handleAddLikeComment(post,LikeRef)} $like={like}  ref={LikeRef} className="mif-heart"/> */}
    </ContainerCommentsPrevire>
}

const AnimiatedImage = Animated.createAnimatedComponent(Image)

const PostComponents = memo(({post,like,setViewedPosts,setPosts,CommentNavigate = 'Profile',ChatNavigate='ChatScreen',isViewable=true}) => {

  const route = useRoute()
  const user = useSelector(selectCurrentUser);
  const navigation = useNavigation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);
  const [islike, setIsLike] = useState(like);
  const bottomSheetModelRef = useRef()
  const snapPoints = ['60%' ,'95%']
  const AllCommentsRef = useRef();
  const [commentHeaders, setCommentHeaders] = useState([]);
  const PostComment = useRef()
  const PostCommentInput = useRef()
  const [pause,setPause] = useState(false)
  const [mute,setMute] = useState(false)
  const videoRefs = useRef([]); // Array to store refs for multiple videos
  const [commentInput,setCommentInput] = useState('')
  const isFocused = useIsFocused(); // Hook to detect if screen is focused
  const loadingCommentRef = useRef(false); // UseRef for tracking loading state

  const totalVisibleTimeRef = useRef(0); // Ref to track total visible time
  const visibilityStartTimeRef = useRef(null); // Ref to track start time when element becomes visible
  const intervalRef = useRef(null); // Ref to hold interval ID
  const isLongViewed = useRef(false); // Ref to indicate if visible time exceeds 3 seconds
 
  const [isModalOpen, setIsModalOpen] = useState(false);


  function handlePresentModal(){
    bottomSheetModelRef.current?.present()
    setIsModalOpen(true);
  }
  function handleCloseModal(){
    bottomSheetModelRef.current?.close()
    setIsModalOpen(false);
  }
  const handleOverlayPress = () => {
    if (isModalOpen) {
      handleCloseModal();
    }
  };

    useEffect(() => {
    if (videoRefs.current[currentIndex]) {
      if (pause) {
        videoRefs.current[currentIndex].setStatusAsync({ shouldPlay: false })
      } else {
        videoRefs.current[currentIndex].setStatusAsync({ shouldPlay: true })
      }
    }
  }, [pause, currentIndex]);

  useEffect(() => {
    if(isFocused === false){
      setPause(true)
    }
  },[isFocused])
  useEffect(() => {
    if (isViewable) {
      setPause(false);

      if (visibilityStartTimeRef.current === null) {
        visibilityStartTimeRef.current = Date.now();
      }

      if (intervalRef.current === null) {
        intervalRef.current = setInterval(() => {
          totalVisibleTimeRef.current += 1; // Increment ref value

          if (totalVisibleTimeRef.current > 3 && !isLongViewed.current) {
            isLongViewed.current = true;
            console.log('Element has been visible for more than 3 seconds');
            setViewedPosts && setViewedPosts(prev => ({
              ...prev,
              [post._id]: true,
            }));
            clearInterval(intervalRef.current); // Clear the interval
            intervalRef.current = null;
          }
        }, 1000);
      }
    } else {
      setPause(true);

      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;

        if (visibilityStartTimeRef.current !== null) {
          const visibilityDuration = (Date.now() - visibilityStartTimeRef.current) / 1000; // Convert ms to seconds
          totalVisibleTimeRef.current += visibilityDuration;

          if (totalVisibleTimeRef.current > 3 && !isLongViewed.current) {
            isLongViewed.current = true;
            setViewedPosts && setViewedPosts(prev => ({
              ...prev,
              [post._id]: true,
            }));
          }
          visibilityStartTimeRef.current = null; // Reset the start time
        }
      }
    }

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isViewable]);

const addNewComment = (commentPost) => {
  const newCommentHeader = <CommentHeaderComponent key={`commentHeaders.length${commentPost.createdAt}_${user.username}`} post={commentPost} user={user} handleAddLike={handleAddLikeComment} navigation={navigation} CommentNavigate={CommentNavigate} handleCloseModal={handleCloseModal} ChatNavigate={ChatNavigate}/>;
  setCommentHeaders(prevCommentHeaders => [newCommentHeader,...prevCommentHeaders]);

};

const addMoreComment = (commentPost) => {
  const newCommentHeader = <CommentHeaderComponent key={`commentHeaders.length${commentPost.createdAt}_${user.username}`} post={commentPost} user={user} handleAddLike={handleAddLikeComment} navigation={navigation} CommentNavigate={CommentNavigate} handleCloseModal={handleCloseModal} ChatNavigate={ChatNavigate}/>;
  setCommentHeaders(prevCommentHeaders => [...prevCommentHeaders,newCommentHeader]);

};

  const FetchAddComment = async() => {
    if(PostCommentInput.current.value.length <= 0){
      return Alert.alert('cant post Empty comment')
    }
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/addComment`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user._id,
          postId: post._id,
          content: PostCommentInput.current.value
        })
      });

      const data = await response.json();
      if (data !== 'error') {

        // Assuming the server returns the updated post object with the new comment
        
        setPosts(prev => prev.map((_post) => {
          if(_post._id === data._id) return data
          return _post
        }))
        addNewComment(data.comments[0]);

      PostCommentInput.current.value =''
    }
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  }

  async function handleAddLikeComment(comment,setCommentLikeCount) {
    const fetchAddLike = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/addLikeToComment`,{
      method:"POST",
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({
        commentId: comment._id,
        userId: user._id,
        postId:post._id
      })
    })

    const data = await fetchAddLike.json()
    if(data.remove){
      setCommentLikeCount((prev) => prev-=1)
      setPosts && setPosts(prev => prev.map((_post) => {
        if(_post._id === data.remove._id) return data.remove
        return _post
      }
      ))
    }

    if(data.add){
      setCommentLikeCount((prev) => prev+=1)
       setPosts && setPosts(prev => prev.map((_post) => {
        if(_post._id === data.add._id) return data.add
        return _post
      }
      ))
    }
  }

  const addLike = (post) => {
    fetch(`${process.env.EXPO_PUBLIC_API_URL}/addLike`, {
      method: "post",
      headers: { "content-Type": "application/json" },
      body: JSON.stringify({
        userId: user._id,
        postId: post._id,
      }),
    })
      .then((data) => data.json())
      .then((data) => {
        if (data === "error") {
          console.log("error when liked a post");
        } else {
          //setLike([...like, post]) set all likes
          // post.likesCount += 1;
          // setLike(true);
          // console.log('add like')
          if(data.removeLike)
            {
              post.likesCount = data.removeLike.likesCount;
              setIsLike(false);
              setPosts && setPosts(prev => prev.map((_post) => {
                if(_post._id === data.removeLike._id) return data.removeLike
                return _post
              }))
            }
            else if(data.addLike)
              {
                post.likesCount = data.addLike.likesCount;
                setIsLike(true);
                setPosts && setPosts(prev => prev.map((_post) => {
                  if(_post._id === data.addLike._id) return data.addLike
                  return _post
                }))
              }
         
        }
      });
  };

  useEffect(() => {
    // Initialize with existing comments when the post or display changes
    if (post.comments.length > 0) {
      const initialComments = post.comments.map((comment) => (
        <CommentHeaderComponent key={comment._id} post={comment} user={user} handleAddLike={handleAddLikeComment} navigation={navigation} CommentNavigate={CommentNavigate} handleCloseModal={handleCloseModal} ChatNavigate={ChatNavigate}/>
      ));
      setCommentHeaders(initialComments);
    }
  }, [post.comments]);

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  // Prepare data for FlatList
  const data = post.post_imgs.map((img, _idx) => {
    if (img.type.split('/')[0] === 'video') {
      // Flatten into two items: icon and image, with unique keys
      return { key: `icon-${_idx}`, type: 'icon', uri: img.data, cover:post.thumbnail };
    } else {
      return { key: `image-${_idx}`, type: 'image', uri: img.data };
    }
  });
  const doubleTapRef = useRef();

  const handleSingleTap = () => {
    // Alert.alert(`Single tap on item ${index}`);
    // Handle single tap action (e.g., pause video)
      if (videoRefs.current[currentIndex]) {
        setPause(prev => !prev)
      }
  };
  // const handleDoubleTap = () => {
  //   addLike(post)
  //   // Handle double tap action (e.g., like video)
  // };
  const isAnimating = useRef(false);

  const handleDoubleTap = () => {
    if (isAnimating.current) {
      return; // Do nothing if the animation is already running
    }
    isAnimating.current = true;

    scale.value = withSpring(1,undefined, (isFinished) =>{ 
      if(isFinished) {
        scale.value = withDelay(800, withTiming(0, { duration: 0 }));
      }
    })
    translateY.value = withDelay(
      600, // Delay of 600ms
      withTiming(-Dimensions.get('window').height / 2, { duration: 1000 }, (isFinished) => {
        if (isFinished) {
          translateY.value = withTiming(0, { duration: 0 });
        }
      })
    );
    if(!islike)
      addLike(post)
    Vibration.vibrate(100);

    setTimeout(() =>{
      isAnimating.current = false; // Animation completed, reset the flag
    },1800)
  }

 // Render each item based on its type
 const renderItem = ({ item ,index}) => {
  // console.log(`${process.env.EXPO_PUBLIC_API_URL}/uploads/${item.uri}`)
    if (item.type === 'icon') {
      // const videoData = item.uri.split(',')[1];
      // const uri = `data:video/mp4;base64,${videoData}`;
      return <View style={styles.iconContainer}>
              {pause &&<DropShadow style={[{shadowColor: "#000", shadowOffset: {width: 0,height: 0,},shadowOpacity: 1,shadowRadius: 5, },styles.iconPause]}>
              <Icon name={'play-outline'} size={100} color={'#fff'}/></DropShadow>} 
              <Video
                    // shouldPlay={false} // Should play when not paused
                    isLooping
                    onError={(error) => console.error('Failed to load video', error)}
                    isMuted={mute}
                      resizeMode='cover'
                      source={{uri: `${process.env.EXPO_PUBLIC_API_URL}/uploads/${item.uri}` }}
                      style={styles.image}
                      ref={ref => (videoRefs.current[index] = ref)} // Store ref in array
                      onPlaybackStatusUpdate={status => {
                      if (status.isPlaying) {
                          // Ensure other videos are paused
                          videoRefs.current.forEach((ref, i) => {
                            if (i !== currentIndex) {
                              ref?.setStatusAsync({ shouldPlay: false })
                            }
                          });
                        }
                      }}
                />
                      {/* <Image style={styles.image} source={{ uri: `http://your-server-address/uploads/${item.uri}` }}/>  */}
                   
            </View>
    }
    return( 
            <View activeOpacity={1} style={[{position:'relative'},styled.image]}>
              <ImageZoom
                style={styles.image}
                source={{ uri: `${process.env.EXPO_PUBLIC_API_URL}/uploads/${item.uri}` }}
                onError={(error) => console.error('Failed to load image', error)}
              />
          </View>
      
    )
  };
  const ITEM_WIDTH = Dimensions.get('window').width; // 80% of screen width
  const handleChangeText = (text) => {
    PostCommentInput.current.value = text;
    if(text.length <=0)
      {
        PostComment.current.setNativeProps({
          style:{display:'none'}
        })
      }else{
        PostComment.current.setNativeProps({
          style:{display:'block'}
        })
      }
      
  }

  // Animated Hearth //

  const scale = useSharedValue(0);
  const translateY = useSharedValue(0);

  const rStyle = useAnimatedStyle(() => ({
    transform:[
      {scale:Math.max(scale.value,0)},
      { translateY: translateY.value },
    ]
  }))

  const FetchMoreComments = async() => {
    if(loadingCommentRef.current) return
    loadingCommentRef.current = true;
    try{
      console.log('load more comments now ',commentHeaders.length)
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/LoadMoreComments`, {
        method: "post",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postID: post._id,
          commentsSkip: commentHeaders.length
        })
      })
      const data = await response.json()
      data.comments.map((comment) => {
        addMoreComment(comment);
      })
      setTimeout(() => {
        if(data.comments.length < 15){
          console.log('load all')
          loadingCommentRef.current = true;
        }
        else{
          loadingCommentRef.current = false;
        }
      },500)
     
    }
    catch(e){
      console.log('error while loading more comments ',e)
      setTimeout(() => {
        loadingCommentRef.current = false;
      },500)
    }
  }
  const handleScroll = ({ nativeEvent }) => {
    if (isCloseToBottom(nativeEvent) && !loadingCommentRef.current) {
      FetchMoreComments()
    }
  };

  const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
    const paddingToBottom = 200;
    return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
  };

  return (
        <View style={{marginBottom:30}}>
            {post.post_imgs && post.post_imgs.length > 0 && (
        <View style={{ width: '100%'}}>
            <TouchableOpacity style={styles.PostTopLayoutContainer} activeOpacity={.9} onPress={() => {
               navigation.push(CommentNavigate, {
                username: post.username,
                back:true,
                ChatNavigate:ChatNavigate,
                CommentNavigate:CommentNavigate
            }); 
            }}>
                <View style={styles.PostTopLayoutImage}>
                    <ProfileImage user={post.author} size={30} outlineSize={35} />
                </View>
                  <Text style={styles.PostTopLayoutName}>{post.username}</Text>
               <View style={styles.PostTopLayoutDotDay}></View>
               <Text style={styles.PostTopLayoutDay}>{CalcData(post.createdAt)}</Text>
            </TouchableOpacity>
           
            <View style={styles.PostImgContainer}>
            <TapGestureHandler waitFor={doubleTapRef} onActivated={() => handleSingleTap()}>
            <TapGestureHandler ref={doubleTapRef} numberOfTaps={2} onActivated={() => handleDoubleTap()}> 
            <FlatList
                   ref={flatListRef}
                    data={data}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.key}
                    horizontal={true} // Enable horizontal scrolling
                    showsHorizontalScrollIndicator={false} // Hide the horizontal scroll indicator
                    snapToInterval={ITEM_WIDTH} // Width of each item + margin
                    decelerationRate="fast" // Faster deceleration
                    snapToAlignment="center" // Align snap to the center of the view
                    contentContainerStyle={styles.flatListContent} // Adjust content container style
                    onViewableItemsChanged={onViewableItemsChanged}
                    viewabilityConfig={viewConfig}
                />
                </TapGestureHandler>
                </TapGestureHandler>
                {(post.post_imgs.length > 1) && 
                            <View style={styles.dotContainer}>
                <AnimatedDotsCarousel
                length={post.post_imgs.length}
                currentIndex={currentIndex}
                maxIndicators={4}
                interpolateOpacityAndColor={true}
                activeIndicatorConfig={{
                  color: Color.PRIMARY_BUTTON,
                  margin: 3,
                  opacity: 1,
                  size: 8,
                }}
                inactiveIndicatorConfig={{
                  color: 'white',
                  margin: 3,
                  opacity: 0.5,
                  size: 8,
                }}
                decreasingDots={[
                  {
                    config: { color: 'white', margin: 3, opacity: 0.5, size: 6 },
                    quantity: 1,
                  },
                  {
                    config: { color: 'white', margin: 3, opacity: 0.5, size: 4 },
                    quantity: 1,
                  },
                ]}
              />                
                </View>
                }
                 <View style={{position:'absolute',right:0,bottom:210,width:50,height:50,display:'flex',justifyContent:'center',alignItems:'center'}}>
                <TouchableOpacity onPress={() => addLike(post)}>
                <DropShadow
                  style={{
                    shadowColor: "#000",
                    shadowOffset: {
                      width: 0,
                      height: 0,
                    },
                    shadowOpacity: 1,
                    shadowRadius: 5,
                  }}
                >
                  <View style={{display:'flex',alignItems:'center',gap:3}}>
                  {islike ? <AntDesign name="heart" size={30} color="red" /> :  <AntDesign name="heart" size={30} color="#fff" />}

                  <Text style={styles.likesText}>
                    {post.likesCount === 0
                      ? '0'
                      : post.likesCount}
                  </Text>
                  </View>

                </DropShadow>
                </TouchableOpacity>
                
                  </View>
                  <View style={{position:'absolute',right:0,bottom:150,width:50,height:50,display:'flex',justifyContent:'center',alignItems:'center'}}>
                            <TouchableOpacity onPress={() => {handlePresentModal()}}>
                            <DropShadow style={{shadowColor: "#000", shadowOffset: {width: 0,height: 0,},shadowOpacity: 1,shadowRadius: 5, }}>
                            <View style={{display:'flex',alignItems:'center',gap:3}}>
                                <Image style={{width:30,height:30,transform: [{ scaleX: -1 }]}} source={require('../../assets/chat-balloon.png')}/>
                                  {/* <FontAwesome style={{transform:[{scaleX:-1}]}} name="comment-o" size={30} color="#fff" /> */}
                                  <Text style={styles.likesText}>
                                    {post.commentsCount}
                                  </Text>
                              </View>
                                  </DropShadow>
                            </TouchableOpacity>
                  </View>
                  <View style={{position:'absolute',right:0,bottom:100,width:50,height:50,display:'flex',justifyContent:'center',alignItems:'center'}}>
                  <DropShadow style={{shadowColor: "#000", shadowOffset: {width: 0,height: 0,},shadowOpacity: 1,shadowRadius: 5, }}>

                            <Feather name="send" size={30} color="#fff" />
                            </DropShadow>
                  </View>
                  <View style={{position:'absolute',right:0,bottom:50,width:50,height:50,display:'flex',justifyContent:'center',alignItems:'center'}}>
                  <DropShadow style={{shadowColor: "#000", shadowOffset: {width: 0,height: 0,},shadowOpacity: 1,shadowRadius: 5, }}>

                          <FontAwesome name="bookmark-o" size={30} color="#fff" />
                          </DropShadow>
                  </View>
                  <DropShadow style={{shadowColor: "#000", shadowOffset: {width: 0,height: 0,},shadowOpacity: 1,shadowRadius: 5, }}>
                  <View style={{position:'absolute',left:0,bottom:15,width:'auto',maxWidth:Dimensions.get('window').width -80,height:'auto',maxHeight:200,display:'flex',justifyContent:'center',padding:10}}>
                      <TouchableOpacity
                        onPress={() => {
                          navigation.push(CommentNavigate, {
                            username: post.username,
                            back:true,
                            ChatNavigate:ChatNavigate,
                            CommentNavigate:CommentNavigate
                        });
                        }}
                        style={styles.usernameContainer}
                      >
                        <Text style={styles.username}>{post.username}</Text>
                      </TouchableOpacity>
                      <ScrollView style={styles.contentWrapper}>
                        <ReadMore text={post.content}/>
                      </ScrollView>
                    </View>
                    </DropShadow>
                      <Animated.View style={{pointerEvents:'none', position:'absolute',width:Dimensions.get('window').width,height:500,display:'flex',justifyContent:'center',alignItems:'center'}}>
                              <DropShadow style={{shadowColor: "#000", shadowOffset: {width: 0,height: 0,},shadowOpacity: 1,shadowRadius: 5, }}>
                              <AnimiatedImage style={[{tintColor:'red', width:150,height:150,transform: [{ scaleX: -1 }]},rStyle]} source={require('../../assets/like.png')}/>
                              </DropShadow>
                      </Animated.View>
                      {videoRefs.current[currentIndex] && 
                       <TouchableOpacity onPress={() => {setMute(prev => !prev)}}  style={{position:'absolute',right:10,bottom:10,width:50,height:50,display:'flex',justifyContent:'center',alignItems:'center', backgroundColor:Color.BLACK_BACKGROUND,width:30,height:30,borderRadius:50}}>
                            <Entypo
                                name={mute ? 'sound-mute' : 'sound'}
                                size={15}
                                color={Color.WHITE}
                            />
                        </TouchableOpacity>
                      }
                     
                 
            </View>

            <View style={styles.postContainer}>
      {/* <TouchableOpacity onPress={() => {handlePresentModal()}}>
      <Text style={{color:'lightgray',marginTop:8,fontSize:12,fontWeight:'bold'}}>view all {post.commentsCount} comments</Text>
       </TouchableOpacity> */}
      <View style={{display:'flex',gap:5,marginTop:10}}>
         {post && (post.comments.length >= 1  && post.comments.length <= 2)&& 
              post.comments.slice(0, post.comments.length).map((comment, index) => (
                <TouchableOpacity onPress={() => {handlePresentModal()}} key={index}>
                   <ContainerPreviewAdd post={comment} handleAddLikeComment={handleAddLikeComment} like={comment.likes.some(like => like._id === user._id)}/>
                  </TouchableOpacity>
              ))
            }
              {post && post.comments.length > 2 && 
              post.comments.slice(0, 2).map((comment, index) => (
                <TouchableOpacity onPress={() => {handlePresentModal()}} key={index}>
                <ContainerPreviewAdd post={comment} handleAddLikeComment={handleAddLikeComment}like={comment.likes.some(like => like._id === user._id)}/>
                  </TouchableOpacity>
              ))
            }
        </View>
        
       {/* <Text style={{color:'lightgray',marginTop:5,fontSize:12,fontWeight:'bold'}}>{CalcData(post.createdAt,true)}</Text> */}

    </View>
            
        </View>
        )}
      {isModalOpen && (
        <Pressable style={styles.overlay} onPress={handleOverlayPress} />
      )}

         <BottomSheetModal
                  ref={bottomSheetModelRef}
                  index={0}
                  snapPoints={snapPoints}
                  onDismiss={handleCloseModal}
                  backgroundStyle={{borderRadius:24,backgroundColor:Color.GrayBackground}}
                  handleIndicatorStyle={{color:Color.LINE_BREAK}}
                  footerComponent={memo((props) => (
                    <BottomSheetFooter {...props}>
                    <View style={{display:'flex',flexDirection:'row',padding:24,backgroundColor:Color.GrayBackground}}>
                      <ExpoImage source={{uri:`${process.env.EXPO_PUBLIC_API_URL}/uploads/${user.profile_img}`}} style={{width:60,height:45, borderRadius:50,backgroundColor:'transparent',objectFit:'fill'}} />
                      <View style={{flex:1,height:45,color:'white',backgroundColor:Color.GrayBackground,padding:8,borderRadius:8,borderColor:'white',borderWidth:1,borderRadius:24,marginLeft:12,display:'flex',flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                          <BottomSheetTextInput
                          keyboardType='default'
                          style={{fontWeight:'bold',flex:1,color:'white'}} keyboardAppearance='dark'  placeholderTextColor={'white'} 
                          placeholder={`Add a comment for ${post.username}...`}
                          ref={PostCommentInput}
                          onChangeText={handleChangeText}
                          />
                          <TouchableOpacity activeOpacity={.6} onPress={FetchAddComment} ref={PostComment} style={{display:'none'}}>
                            <View style={{borderRadius:50,backgroundColor:Color.PRIMARY_BUTTON,width:45,height:35,display:'flex',justifyContent:'center',alignItems:'center'}}>
                                <Icon name={'arrow-up'} size={30} color={'#fff'} />
                            </View>
                          </TouchableOpacity>
                      </View>
                      
                      </View>
                    </BottomSheetFooter>
                   
                  ))}
                  keyboardBehavior='extend'
                  keyboardBlurBehavior='restore'
                  
                  >
                  <View>
                    <Text style={{fontWeight:'bold',fontSize:20,color:'white',textAlign:'center'}}>Comments</Text>
                  </View>
                 <BottomSheetScrollView style={{marginBottom:100}}
                     onScroll={handleScroll}
                     scrollEventThrottle={16}
                 >
                 <AllCommentsContainer ref={AllCommentsRef} $user={user}>
                    {commentHeaders.length === 0 ? (
                      <NoCommentsContainer>
                        <NoCommentsText style={{color:'white',fontSize:30,fontWeight:'bold'}}>No comments yet...</NoCommentsText>
                      </NoCommentsContainer>
                    ) : (
                      commentHeaders
                    )}
                  </AllCommentsContainer>
                
                 </BottomSheetScrollView>
           
          </BottomSheetModal>
            </View>
           
  )
})

const styles = StyleSheet.create({
    image:{
        width: Dimensions.get('window').width, // Adjust width according to screen size
        height:510,
        borderRadius:8,
        objectFit:'fill',  
    },
    video: {
        width: Dimensions.get('window').width, // Adjust width according to screen size
        height:510,
        borderRadius:8,
        objectFit:'fill'
      }, 
      iconContainer:{
        width: Dimensions.get('window').width, // Adjust width according to screen size
        height:510,
        borderRadius:8,
        position:'relative'
      },
      iconPause:{
        pointerEvents:'none',
        zIndex: 1,
        position:'absolute',
        top: '50%',
        left: '50%',
        marginLeft: -50, // Half of the icon's width
        marginTop: -50, // Half of the icon's height
        
    },
    PostTopLayoutContainer:{
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'centers',
        gap:10,
        marginBottom:8,
    },
    PostTopLayoutImage:{
        padding:6
    },
    PostTopLayoutName:{
        fontWeight:'bold',
         color:`${Color.WHITE}`,
    },
    PostTopLayoutDotDay:{
        height:4,
        width:4,
        backgroundColor:`${Color.WHITE}`,
        borderRadius:50
    },
    PostTopLayoutDay:{
        color:`${Color.WHITE}`
    },
    PostImgContainer:{
      display:'flex',
      alignContent:'center',
      justifyContent:'center',
    },
    flatListContent: {
        alignItems: 'center',
    },
    dotContainer: {
      position: 'absolute',
      bottom: 10,
      alignItems: 'center',
      justifyContent: 'center',
      width:'100%'
    },
    dot: {
      height: 10,
      width: 10,
      borderRadius: 5,
      marginHorizontal: 5,
    },
    activeDot: {
      backgroundColor: 'blue', // Active dot color
    },
    inactiveDot: {
      backgroundColor: 'gray', // Inactive dot color
    },
    postContainer: {
      marginVertical: 8,
      // marginLeft:15
    },
    likesContainer: {
      marginTop: 8,
    },
    likesText: {
      color: '#fff',
      fontWeight:'400',
      fontSize:12
    },
    contentContainer: {
      flexDirection: 'row',
      gap: 10,
      marginTop: 5,
    },
    usernameContainer: {
      color: 'white',
      fontWeight: 'bold',
      
    },
    username: {
      color: 'white',
      fontWeight: 'bold',
      fontSize:20,
    },
    contentWrapper: {
      fontWeight: '400',
      overflow: 'hidden',
      flex: 1, // Allow this view to take remaining space
    },
    overlay:{
      backgroundColor: 'rgba(0, 0, 0, 0.1)', // Semi-transparent background
      zIndex: 1000, // Ensure overlay is above other components
      // Ensure the overlay is not scrollable
     position:'absolute',
     top:0,
     left:0,
     bottom:0,
      height: Dimensions.get('window').height,
      width: Dimensions.get('window').width

    },
});
export default PostComponents