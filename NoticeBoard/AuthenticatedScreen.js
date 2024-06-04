import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { AntDesign } from '@expo/vector-icons'; // Importing AntDesign icon library
import UserDashboard from './UserDashboard';
import AdminDashboard from './AdminDashboard';

const AuthenticatedScreen = ({ user, role, handleAuthentication }) => {
  // Sample profile picture URL, replace it with actual user profile picture URL
  const profilePictureUrl = 'https://via.placeholder.com/150';

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.topBarText}>Notice Board App</Text>
      </View>
      <View style={styles.content}>
        {/* Profile Picture */}
        <View style={styles.profileContainer}>
          <Image source={{ uri: profilePictureUrl }} style={styles.profilePicture} />
          <View style={styles.userInfo}>
            <Text style={styles.title}>Welcome {role === 'admin' ? 'Admin' : 'User'}</Text>
            <Text style={styles.emailText}>{user.email}</Text>
          </View>
        </View>
        {/* Logout Button */}
        <TouchableOpacity onPress={handleAuthentication} style={styles.logoutButton}>
          <AntDesign name="logout" size={24} color="#e74c3c" />
        </TouchableOpacity>
      </View>
      {/* Dashboard Component */}
      <View style={styles.dashboardContainer}>
        {role === 'admin' ? <AdminDashboard /> : <UserDashboard />}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1c1c1c',
  },
  topBar: {
    height: 60,
    backgroundColor: '#f1c40f',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  topBarText: {
    color: '#1c1c1c',
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profilePicture: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  userInfo: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    marginBottom: 8,
    color: '#f1c40f',
  },
  emailText: {
    fontSize: 18,
    color: '#eee',
  },
  logoutButton: {
    marginLeft: 10,
  },
  dashboardContainer: {
    flex: 1,
    padding: 16,
  },
});

export default AuthenticatedScreen;
