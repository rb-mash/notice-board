import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import UserDashboard from './UserDashboard';
import AdminDashboard from './AdminDashboard';

const AuthenticatedScreen = ({ user, role, handleAuthentication }) => {
  return (
    <View style={styles.authContainer}>
      <Text style={styles.title}>Welcome {role === 'admin' ? 'Admin' : 'User'}</Text>
      <Text style={styles.emailText}>{user.email}</Text>
      <Button title="Logout" onPress={handleAuthentication} color="#e74c3c" />
      {role === 'admin' ? <AdminDashboard /> : <UserDashboard />}
    </View>
  );
};

const styles = StyleSheet.create({
  authContainer: {
    width: '80%',
    maxWidth: 400,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  emailText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default AuthenticatedScreen;
