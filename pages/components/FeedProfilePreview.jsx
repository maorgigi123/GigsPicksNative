import React, { useRef, useEffect, useState } from 'react';
import { View, FlatList, Text } from 'react-native';
import PostComponents from './PostComponents';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../store/user/user.selector';
import { useNavigationState, useRoute } from '@react-navigation/native';
import Color from '../Colors/Color';

export default function FeedProfilePreview() {
  const route = useRoute();
  const { posts, index,setPosts } = route.params; // Extract posts and index from route parameters

  const user = useSelector(selectCurrentUser);
  const firstRouteName = useNavigationState(state => state.routes[0]?.name);


  const renderItem = ({ item }) => (
    <PostComponents
      post={item}
      like={item.likes.some(like => like._id === user._id)}
      setPosts={setPosts}
      CommentNavigate={(firstRouteName === 'FeedMain' ? 'Profile' :'ProfileMain')}
      ChatNavigate={(firstRouteName === 'FeedMain' ? 'ChatScreen' :'ChatScreenProfile')}
    />
  );

  return (
    <View style={{ flex: 1, backgroundColor: Color.BLACK }}>
      <FlatList
        data={posts}
        renderItem={renderItem}
        keyExtractor={(item) => item._id.toString()}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
      />
    </View>
  );
}
