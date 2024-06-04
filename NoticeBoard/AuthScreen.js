import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';

const AuthScreen = ({ email, setEmail, password, setPassword, role, setRole, isLogin, setIsLogin, handleAuthentication }) => {
  return (
    <View style={styles.container}>
      <View style={styles.authContainer}>
        <Image source={require('./assets/logo.jpg')} style={styles.logo} />
        <Text style={styles.title}>{isLogin ? 'Sign In' : 'Sign Up'}</Text>

        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          placeholderTextColor="#bbb"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          placeholderTextColor="#bbb"
          secureTextEntry
        />
        {!isLogin && (
          <View style={styles.roleContainer}>
            <Text style={styles.roleText}>Select Role:</Text>
            <View style={styles.roleButtons}>
              <TouchableOpacity style={[styles.roleButton, role === 'user' && styles.activeRoleButton]} onPress={() => setRole('user')}>
                <Text style={[styles.roleButtonText, role === 'user' && styles.activeRoleButtonText]}>User</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.roleButton, role === 'admin' && styles.activeRoleButton]} onPress={() => setRole('admin')}>
                <Text style={[styles.roleButtonText, role === 'admin' && styles.activeRoleButtonText]}>Admin</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.authButton} onPress={handleAuthentication}>
            <Text style={styles.authButtonText}>{isLogin ? 'Sign In' : 'Sign Up'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomContainer}>
          <Text style={styles.toggleText} onPress={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Need an account? Sign Up' : 'Already have an account? Sign In'}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1c1c1c',
  },
  authContainer: {
    width: '85%',
    maxWidth: 400,
    backgroundColor: '#2c2c2c',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#f1c40f',
  },
  input: {
    height: 45,
    borderColor: '#444',
    borderWidth: 1,
    marginBottom: 20,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#333',
    color: '#eee',
  },
  buttonContainer: {
    marginTop: 20,
  },
  authButton: {
    backgroundColor: '#f1c40f',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  authButtonText: {
    color: '#2c2c2c',
    fontSize: 16,
    fontWeight: 'bold',
  },
  toggleText: {
    color: '#f1c40f',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  bottomContainer: {
    marginTop: 20,
  },
  roleContainer: {
    marginBottom: 20,
  },
  roleText: {
    marginBottom: 10,
    fontSize: 16,
    color: '#eee',
  },
  roleButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  roleButton: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#444',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  activeRoleButton: {
    backgroundColor: '#f1c40f',
  },
  roleButtonText: {
    fontSize: 16,
    color: '#eee',
  },
  activeRoleButtonText: {
    color: '#2c2c2c',
  },
});

export default AuthScreen;
