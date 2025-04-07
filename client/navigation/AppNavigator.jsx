import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AllRestaurantsScreen from '../components/AllRestuarants';
import CafeDetailsScreen from '../components/CafeDetails';
import Home from '../pages/Home';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Restaurants" component={Home} />
        <Stack.Screen name="CafeDetails" component={CafeDetailsScreen} options={{ title: 'Cafe Menu' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
