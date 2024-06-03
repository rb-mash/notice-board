import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, Image } from 'react-native';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { firestore } from './firebase';

const AdminDashboard = () => {
  const [notices, setNotices] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageURL, setImageURL] = useState('');

  useEffect(() => {
    const fetchNotices = async () => {
      const querySnapshot = await getDocs(collection(firestore, 'notices'));
      const noticesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setNotices(noticesData);
    };

    fetchNotices();
  }, []);

  const handleAddNotice = async () => {
    await addDoc(collection(firestore, 'notices'), { title, content, imageURL });
    setTitle('');
    setContent('');
    setImageURL('');
    fetchNotices();
  };

  const handleDeleteNotice = async (id) => {
    await deleteDoc(doc(firestore, 'notices', id));
    fetchNotices();
  };

  const renderItem = ({ item }) => (
    <View style={styles.noticeContainer}>
      <Text style={styles.noticeTitle}>{item.title}</Text>
      <Text>{item.content}</Text>
      {item.imageURL && <Image source={{ uri: item.imageURL }} style={styles.noticeImage} />}
      <Button title="Delete" onPress={() => handleDeleteNotice(item.id)} color="#e74c3c" />
    </View>
  );

  return (
    <View>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Title"
      />
      <TextInput
        style={styles.input}
        value={content}
        onChangeText={setContent}
        placeholder="Content"
        multiline
      />
      <TextInput
        style={styles.input}
        value={imageURL}
        onChangeText={setImageURL}
        placeholder="Image URL"
      />
      <Button title="Add Notice" onPress={handleAddNotice} color="#3498db" />
      <FlatList
        data={notices}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: 16,
  },
  noticeContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
  },
  noticeTitle: {
    fontSize: 20,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  noticeImage: {
    width: '100%',
    height: 200,
    marginTop: 8,
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 16,
    padding: 8,
    borderRadius: 4,
  },
});

export default AdminDashboard;
