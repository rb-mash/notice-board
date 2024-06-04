import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { getAuth, onAuthStateChanged, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword } from '@firebase/auth';
import { getDoc, doc, setDoc } from 'firebase/firestore';
import AuthScreen from './AuthScreen';
import AuthenticatedScreen from './AuthenticatedScreen';
import NoticeDetail from './NoticeDetailScreen';
import { app, firestore } from './firebase';

const Stack = createStackNavigator();

const App = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [role, setRole] = useState('user');
  const [isLogin, setIsLogin] = useState(true);

  const auth = getAuth(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (user) {
        (async () => {
          const userDoc = await getDoc(doc(firestore, 'users', user.uid));
          if (userDoc.exists()) {
            setRole(userDoc.data().role);
          }
        })();
      }
    });

    return () => unsubscribe();
  }, [auth]);

  const handleAuthentication = async () => {
    try {
      if (user) {
        console.log('User logged out successfully!');
        await signOut(auth);
      } else {
        if (isLogin) {
          await signInWithEmailAndPassword(auth, email, password);
          console.log('User signed in successfully!');

          const userDoc = await getDoc(doc(firestore, 'users', auth.currentUser.uid));
          if (userDoc.exists()) {
            setRole(userDoc.data().role);
          }
        } else {
          await createUserWithEmailAndPassword(auth, email, password);
          console.log('User created successfully!');
          await setDoc(doc(firestore, 'users', auth.currentUser.uid), { role });
        }
      }
    } catch (error) {
      console.error('Authentication error:', error.message);
    }
  };

  const getTopBarColor = () => {
    return role === 'admin' ? '#e74c3c' : '#1c1c1c'; // Red for admin, blue for user
  };

  const getTopBarTextColor = () => {
    return role === 'admin' ? '#fff' : '#fff'; // White text for better contrast
  };

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {user ? (
          <Stack.Screen
            name="Home Page"
            options={{
              headerTitleAlign: 'center',
              headerStyle: {
                backgroundColor: getTopBarColor(),
              },
              headerTintColor: getTopBarTextColor(),
            }}
          >
            {() => <AuthenticatedScreen user={user} role={role} handleAuthentication={handleAuthentication} />}
          </Stack.Screen>
        ) : (
          <Stack.Screen
            name="Welcome"
            options={{
              headerTitleAlign: 'center',
              headerStyle: {
                backgroundColor: '#2c3e50', // Dark theme for login screen
              },
              headerTintColor: '#fff', // White text for better contrast
            }}
          >
            {() => (
              <AuthScreen
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                role={role}
                setRole={setRole}
                isLogin={isLogin}
                setIsLogin={setIsLogin}
                handleAuthentication={handleAuthentication}
              />
            )}
          </Stack.Screen>
        )}
        <Stack.Screen
          name="NoticeDetail"
          component={NoticeDetail}
          options={{
            headerTitleAlign: 'center',
            headerStyle: {
              backgroundColor: getTopBarColor(),
            },
            headerTintColor: getTopBarTextColor(),
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
