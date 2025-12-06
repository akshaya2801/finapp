import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSelector, useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, View } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { RootState, AppDispatch } from './store/store';
import { loginSuccess, setError } from './store/authSlice';
import { getTokens, isTokenExpired } from './utils/token';
import { authAPI } from './api/index';

// Screens
import SplashScreen from './screens/SplashScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import RoleSelectionScreen from './screens/RoleSelectionScreen';
import TicketListScreen from './screens/TicketListScreen';
import NewTicketScreen from './screens/NewTicketScreen';
import TicketDetailScreen from './screens/TicketDetailScreen';
import ProfileScreen from './screens/ProfileScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="RoleSelection"
    >
      <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
};

const TicketStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#007AFF',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    >
      <Stack.Screen
        name="TicketListScreen"
        component={TicketListScreen}
        options={{ title: 'My Tickets' }}
      />
      <Stack.Screen
        name="TicketDetail"
        component={TicketDetailScreen}
        options={{ title: 'Ticket Details' }}
      />
    </Stack.Navigator>
  );
};

const HomeStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#007AFF',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    >
      <Stack.Screen name="Home" component={TicketListScreen} options={{ title: 'Support Tickets' }} />
      <Stack.Screen name="NewTicket" component={NewTicketScreen} options={{ title: 'New Ticket' }} />
      <Stack.Screen name="TicketDetail" component={TicketDetailScreen} options={{ title: 'Ticket Details' }} />
    </Stack.Navigator>
  );
};

const AppTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = '';

          if (route.name === 'HomeTab') {
            iconName = focused ? 'home' : 'home';
          } else if (route.name === 'NewTicketTab') {
            iconName = focused ? 'add-circle' : 'add-circle-outline';
          } else if (route.name === 'ProfileTab') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#999',
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStack}
        options={{ title: 'Tickets' }}
      />
      <Tab.Screen
        name="NewTicketTab"
        component={NewTicketScreen}
        options={{ title: 'New Ticket' }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            navigation.navigate('HomeTab', { screen: 'NewTicket' });
          },
        })}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{ title: 'Profile', headerShown: true, headerStyle: { backgroundColor: '#007AFF' }, headerTintColor: '#fff' }}
      />
    </Tab.Navigator>
  );
};

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [isLoading, setIsLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    checkAutoLogin();
  }, []);

  const checkAutoLogin = async () => {
    try {
      const { accessToken, refreshToken } = await getTokens();

      if (!accessToken || !refreshToken) {
        setIsLoading(false);
        return;
      }

      if (isTokenExpired(accessToken)) {
        if (isTokenExpired(refreshToken)) {
          setIsLoading(false);
          return;
        }

        try {
          const response = await authAPI.refresh(refreshToken);
          const { accessToken: newAccessToken } = response.data;
          await AsyncStorage.setItem('accessToken', newAccessToken);
        } catch (err) {
          setIsLoading(false);
          return;
        }
      }

      dispatch(
        loginSuccess({
          user: {
            id: '',
            email: '',
            name: '',
            role: 'customer',
          },
          accessToken: accessToken!,
          refreshToken: refreshToken!,
        })
      );
    } catch (err) {
      console.error('Auto-login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <AppTabs /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default App;
