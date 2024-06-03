import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from './firebase';

const UserDashboard = () => {
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    const fetchNotices = async () => {
      const querySnapshot = await getDocs(collection(firestore, 'notices'));
      const noticesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setNotices(noticesData);
    };

    fetchNotices();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.noticeContainer}>
      <Text style={styles.noticeTitle}>{item.title}</Text>
      <Text>{item.content}</Text>
      {item.imageURL && <Image source={{ uri: item.imageURL }} style={styles.noticeImage} />}
    </View>
  );

  return (
    <FlatList
      data={notices}
      renderItem={renderItem}
      keyExtractor={item => item.id}
      contentContainerStyle={styles.listContainer}
    />
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
});

export default UserDashboard;
