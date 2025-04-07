import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const RestaurantCard = ({ restaurant }) => {
  const navigation = useNavigation();

  if (!restaurant) return null;

  const handlePress = () => {
    navigation.navigate('CafeDetails', {
      menuIds: restaurant.menu,
      name: restaurant.cafeteriaName,
    });
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      className="bg-white rounded-lg shadow-md p-4 mb-4"
    >
      <Text className="text-lg font-semibold mb-1">{restaurant.cafeteriaName}</Text>
      <Text className="text-gray-600 mb-1">Seats Available: {restaurant.availableSeats}</Text>
      <Text className="text-gray-600 mb-1">Rating: ⭐ {restaurant.rating}</Text>
      <Text className={`mb-1 ${restaurant.openStatus ? 'text-green-600' : 'text-red-600'}`}>
        {restaurant.openStatus ? 'Open Now' : 'Closed'}
      </Text>
      {restaurant.location && (
        <Text className="text-gray-500 text-sm">
          Lat: {restaurant.location.latitude}, Long: {restaurant.location.longitude}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default RestaurantCard;
