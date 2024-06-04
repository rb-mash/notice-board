import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, Image, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, orderBy } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { firestore } from './firebase';

const AdminDashboard = () => {
  const [notices, setNotices] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageURL, setImageURL] = useState('');
  const [isEdit, setIsEdit] = useState(false);
  const [editNoticeId, setEditNoticeId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [comments, setComments] = useState([]);
  const [selectedNoticeId, setSelectedNoticeId] = useState(null);
  const [newComment, setNewComment] = useState('');

  const navigation = useNavigation();

  const fetchNotices = async () => {
    const querySnapshot = await getDocs(collection(firestore, 'notices'));
    const noticesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setNotices(noticesData);
  };

  const fetchComments = async (noticeId) => {
    const commentsQuery = query(collection(firestore, 'notices', noticeId, 'comments'), orderBy('timestamp', 'desc'));
    const querySnapshot = await getDocs(commentsQuery);
    const commentsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setComments(commentsData);
    setSelectedNoticeId(noticeId);
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleAddOrEditNotice = async () => {
    if (isEdit && editNoticeId) {
      const noticeDocRef = doc(firestore, 'notices', editNoticeId);
      await updateDoc(noticeDocRef, { title, content, imageURL });
    } else {
      await addDoc(collection(firestore, 'notices'), { title, content, imageURL });
    }
    setTitle('');
    setContent('');
    setImageURL('');
    setIsEdit(false);
    setEditNoticeId(null);
    setModalVisible(false);
    fetchNotices();
  };

  const handleEditNotice = (notice) => {
    setTitle(notice.title);
    setContent(notice.content);
    setImageURL(notice.imageURL);
    setIsEdit(true);
    setEditNoticeId(notice.id);
    setModalVisible(true);
  };

  const handleDeleteNotice = async (id) => {
    await deleteDoc(doc(firestore, 'notices', id));
    fetchNotices();
  };

  const handleAddComment = async () => {
    if (newComment.trim() && selectedNoticeId) {
      await addDoc(collection(firestore, 'notices', selectedNoticeId, 'comments'), {
        text: newComment,
        user: 'Admin',
        timestamp: new Date(),
      });
      setNewComment('');
      fetchComments(selectedNoticeId);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.noticeContainer}>
      <TouchableOpacity onPress={() => navigation.navigate('NoticeDetail', { notice: item })}>
        <Text style={styles.noticeTitle}>{item.title}</Text>
        <Text style={styles.noticeContent}>{item.content}</Text>
        {item.imageURL && <Image source={{ uri: item.imageURL }} style={styles.noticeImage} />}
      </TouchableOpacity>
      <View style={styles.buttonGroup}>
        <Button title="Edit" onPress={() => handleEditNotice(item)} color="#f1c40f" />
        <Button title="Delete" onPress={() => handleDeleteNotice(item.id)} color="#e74c3c" />
      </View>
    </View>
  );

  const renderComment = ({ item }) => (
    <View style={styles.comment}>
      <Text style={styles.commentUser}>{item.user}</Text>
      <Text style={styles.commentText}>{item.text}</Text>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Button title="Add New Notice" onPress={() => setModalVisible(true)} color="#f1c40f" />
      <FlatList
        data={notices}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />
      {selectedNoticeId && (
        <View style={styles.commentsContainer}>
          <Text style={styles.commentsTitle}>Comments</Text>
          <TextInput
            style={styles.commentInput}
            placeholder="Add a comment..."
            placeholderTextColor="#ddd"
            value={newComment}
            onChangeText={setNewComment}
          />
          <Button title="Post Comment" onPress={handleAddComment} color="#f1c40f" />
          <FlatList
            data={comments}
            renderItem={renderComment}
            keyExtractor={item => item.id}
            style={styles.commentsList}
          />
        </View>
      )}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalView}>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Title"
            placeholderTextColor="#ddd"
          />
          <TextInput
            style={styles.input}
            value={content}
            onChangeText={setContent}
            placeholder="Content"
            placeholderTextColor="#ddd"
            multiline
          />
          <TextInput
            style={styles.input}
            value={imageURL}
            onChangeText={setImageURL}
            placeholder="Image URL"
            placeholderTextColor="#ddd"
          />
          <Button title={isEdit ? "Update Notice" : "Add Notice"} onPress={handleAddOrEditNotice} color="#f1c40f" />
          <Button title="Cancel" onPress={() => setModalVisible(false)} color="#e74c3c" />
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#1c1c1c',
  },
  listContainer: {
    width: '100%',
  },
  noticeContainer: {
    backgroundColor: '#2c2c2c',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
  },
  noticeTitle: {
    fontSize: 20,
    marginBottom: 8,
    fontWeight: 'bold',
    color: '#f1c40f',
  },
  noticeContent: {
    color: '#eee',
  },
  noticeImage: {
    width: '100%',
    height: 200,
    marginTop: 8,
    borderRadius: 8,
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 16,
    padding: 8,
    borderRadius: 4,
    width: '100%',
    color: '#eee',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  modalView: {
    margin: 20,
    backgroundColor: '#2c2c2c',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '90%',
    alignSelf: 'center',
  },
  commentsContainer: {
    width: '100%',
    backgroundColor: '#2c2c2c',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
  },
  commentsTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#f1c40f',
  },
  commentInput: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    padding: 8,
    borderRadius: 4,
    marginBottom: 10,
    color: '#eee',
  },
  commentsList: {
    marginTop: 10,
  },
  comment: {
    backgroundColor: '#3c3c3c',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
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

export default AdminDashboard;
