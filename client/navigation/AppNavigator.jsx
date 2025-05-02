import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import Home from '../pages/Home';
import AllRestaurantsScreen from '../components/AllRestuarants';
import CafeDetailsScreen from '../components/CafeDetails';
import CartScreen from '../pages/CartScreen';
import LoginScreen from '../pages/LoginScreen';
import SignupScreen from '../pages/SignupScreen';
import { AuthContext } from '../context/AuthContext'; // 👈 import context

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const AuthStack = createNativeStackNavigator();

const HomeTabs = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: '#F59E0B',
    }}
  >
    <Tab.Screen
      name="Home"
      component={Home}
      options={{
        tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} />,
      }}
    />
    <Tab.Screen
      name="Restaurants"
      component={AllRestaurantsScreen}
      options={{
        tabBarIcon: ({ color, size }) => <Ionicons name="restaurant-outline" size={size} color={color} />,
      }}
    />
    <Tab.Screen
      name="Cart"
      component={CartScreen}
      options={{
        tabBarIcon: ({ color, size }) => <Ionicons name="cart-outline" size={size} color={color} />,
      }}
    />
  </Tab.Navigator>
);

// 👇 Auth Stack for login/signup screens
const AuthNavigator = () => (
  <AuthStack.Navigator screenOptions={{ headerShown: false }}>
    <AuthStack.Screen name="Login" component={LoginScreen} />
    <AuthStack.Screen name="Signup" component={SignupScreen} />
  </AuthStack.Navigator>
);

// 👇 App Stack for main app screens
const AppNavigator = () => {
  const { user, authLoading } = useContext(AuthContext);

  if (authLoading) return null; // Or splash screen

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <>
            <Stack.Screen name="Tabs" component={HomeTabs} />
            <Stack.Screen name="CafeDetails" component={CafeDetailsScreen} />
          </>
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
