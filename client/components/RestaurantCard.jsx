import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Linking,
  Platform,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const RestaurantCard = ({ restaurant }) => {
  const navigation = useNavigation();

  if (!restaurant) return null;

  const handleCardPress = () => {
    navigation.navigate('CafeDetails', {
      menuIds: restaurant.menu,
      name: restaurant.cafeteriaName,
      cafeteriaImage: restaurant.cafeteriaImage,
      cafeteriaId: restaurant._id,
      rating: restaurant.rating,
      openStatus: restaurant.openStatus,
      distance: restaurant.distance, // if you're using it
    });
  };
  

  const handleNavigate = () => {
    const { latitude, longitude } = restaurant.location;
    const label = encodeURIComponent(restaurant.cafeteriaName);
    const url = Platform.select({
      ios: `http://maps.apple.com/?ll=${latitude},${longitude}&q=${label}`,
      android: `geo:${latitude},${longitude}?q=${latitude},${longitude}(${label})`,
    });
    Linking.openURL(url);
  };

  return (
    <TouchableOpacity
      onPress={handleCardPress}
      className="bg-white rounded-xl overflow-hidden shadow-md mb-4"
    >
      {restaurant.cafeteriaImage && (
        <Image
          source={{ uri: restaurant.cafeteriaImage }}
          className="w-full h-48"
          resizeMode="cover"
        />
      )}

      <View className="p-4">
        <Text className="text-xl font-semibold mb-1">{restaurant.cafeteriaName}</Text>

        <Text className="text-gray-600 mb-1">Seats Available: {restaurant.availableSeats}</Text>

        <Text className={`mb-1 ${restaurant.openStatus ? 'text-green-600' : 'text-red-600'}`}>
          {restaurant.openStatus ? 'Open Now' : 'Closed'}
        </Text>

        {restaurant.distance !== undefined && (
          <Text className="text-gray-500 text-sm mb-2">{restaurant.distance} m away</Text>
        )}

        <TouchableOpacity
          onPress={handleNavigate}
          className="bg-yellow-500 py-1 px-3 rounded-lg self-start"
        >
          <Text className="text-sm text-white font-semibold">Navigate</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default RestaurantCard;
