import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { firestore } from './firebase';

const UserDashboard = () => {
  const [notices, setNotices] = useState([]);
  const navigation = useNavigation();

  const fetchNotices = async () => {
    const querySnapshot = await getDocs(collection(firestore, 'notices'));
    const noticesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setNotices(noticesData);
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('NoticeDetail', { notice: item })}>
      <View style={styles.noticeContainer}>
        <Text style={styles.noticeTitle}>{item.title}</Text>
        <Text style={styles.noticeContent}>{item.content}</Text>
        {item.imageURL && <Image source={{ uri: item.imageURL }} style={styles.noticeImage} />}
      </View>
    </TouchableOpacity>
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
    backgroundColor: '#1c1c1c',
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
});

export default UserDashboard;
