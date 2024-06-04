import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TextInput, Button, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { collection, addDoc, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { firestore } from './firebase';
import { getAuth } from '@firebase/auth';
import Icon from 'react-native-vector-icons/FontAwesome';

const NoticeDetailScreen = ({ route }) => {
  const { notice } = route.params;
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);

  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    fetchComments();
    fetchLikes();
  }, []);

  const fetchComments = async () => {
    const querySnapshot = await getDocs(collection(firestore, 'notices', notice.id, 'comments'));
    const commentsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setComments(commentsData);
  };

  const fetchLikes = async () => {
    const querySnapshot = await getDocs(collection(firestore, 'notices', notice.id, 'likes'));
    const likesCount = querySnapshot.docs.length;
    const userLiked = querySnapshot.docs.some(doc => doc.id === user.uid);
    setLikes(likesCount);
    setLiked(userLiked);
  };

  const handleAddComment = async () => {
    if (newComment.trim()) {
      await addDoc(collection(firestore, 'notices', notice.id, 'comments'), {
        text: newComment,
        user: user.email,
        timestamp: new Date(),
      });
      setNewComment('');
      fetchComments();
    }
  };

  const handleLike = async () => {
    if (liked) {
      await deleteDoc(doc(firestore, 'notices', notice.id, 'likes', user.uid));
    } else {
      await setDoc(doc(firestore, 'notices', notice.id, 'likes', user.uid), { user: user.email });
    }
    setLiked(!liked);
    fetchLikes();
  };

  const renderComment = ({ item }) => (
    <View style={styles.comment}>
      <Text style={styles.commentUser}>{item.user}</Text>
      <Text style={styles.commentText}>{item.text}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>{notice.title}</Text>
        <Text style={styles.content}>{notice.content}</Text>
        {notice.imageURL && <Image source={{ uri: notice.imageURL }} style={styles.image} />}
        <View style={styles.likeContainer}>
          <TouchableOpacity onPress={handleLike}>
            {liked ? <Icon name="heart" size={30} color="#e74c3c" /> : <Icon name="heart-o" size={30} color="#f1c40f" />}
          </TouchableOpacity>
          <Text style={styles.likesCount}>{likes} Likes</Text>
        </View>
        <View style={styles.commentSection}>
          <TextInput
            style={styles.commentInput}
            placeholder="Add a comment..."
            placeholderTextColor="#ddd"
            value={newComment}
            onChangeText={setNewComment}
          />
          <Button title="Post" onPress={handleAddComment} color="#f1c40f" />
        </View>
        <FlatList
          data={comments}
          renderItem={renderComment}
          keyExtractor={item => item.id}
          style={styles.commentsList}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1c1c1c',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#f1c40f',
    marginBottom: 10,
    marginTop: 20,
    marginLeft: 20,
    marginRight: 20,
  },
  content: {
    fontSize: 18,
    lineHeight: 24,
    color: '#eee',
    marginBottom: 20,
    marginLeft: 20,
    marginRight: 20,
  },
  image: {
    width: '100%',
    height: 250,
    borderRadius: 10,
    marginBottom: 20,
  },
  likeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginLeft: 20,
  },
  likesCount: {
    color: '#eee',
    fontSize: 18,
    marginLeft: 10,
  },
  commentSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginLeft: 20,
    marginRight: 20,
  },
  commentInput: {
    flex: 1,
    borderColor: '#ddd',
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
    color: '#eee',
  },
  commentsList: {
    flex: 1,
    marginLeft: 20,
    marginRight: 20,
  },
  comment: {
    backgroundColor: '#2c2c2c',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    elevation: 2,
  },
  commentUser: {
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#f1c40f',
  },
  commentText: {
    color: '#eee',
  },
});

export default NoticeDetailScreen;
