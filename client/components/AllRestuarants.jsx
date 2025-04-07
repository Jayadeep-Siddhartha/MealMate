import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import API from '../utils/api';
import RestaurantCard from './RestaurantCard';
import { useNavigation } from '@react-navigation/native';

const AllRestaurantsScreen = () => {
  const [cafeterias, setCafeterias] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchCafeterias = async () => {
      try {
        const response = await API.get('/cafeterias/');
        setCafeterias(response.data);
      } catch (error) {
        console.error('Error fetching cafeterias:', error);
      }
    };

    fetchCafeterias();
  }, []);

  return (
    <ScrollView className="px-4 pt-6">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-xl font-bold">All Restaurants</Text>
      </View>

      {cafeterias.map((cafe) => (
        <TouchableOpacity key={cafe._id} onPress={() => navigation.navigate('CafeDetail', { cafe })}>
          <RestaurantCard restaurant={cafe} />
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default AllRestaurantsScreen;
