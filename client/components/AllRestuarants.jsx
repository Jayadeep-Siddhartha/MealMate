import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Modal } from 'react-native';
import * as Location from 'expo-location';
import API from '../utils/api';
import RestaurantCard from '../components/RestaurantCard';
import FoodDetailsSheet from './FoodDetailsSheet';
import axios from 'axios';
function getDistance(lat1, lon1, lat2, lon2) {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371e3;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c); // meters
}

const AllRestaurantsScreen = () => {
  const [cafeterias, setCafeterias] = useState([]);
  const [selectedFood, setSelectedFood] = useState(null); // open bottom sheet

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.warn('Location permission not granted');
          return;
        }
        const userLoc = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = userLoc.coords;
        
        console.log("Fetching started")
        const response = await axios.get("http://192.168.56.1:5000/api/cafeterias/")
        console.log("Fetching ended")
        const cafesWithDistance = response.data.map((cafe) => {
          const distance = getDistance(
            latitude,
            longitude,
            cafe.location.latitude,
            cafe.location.longitude
          );
          return { ...cafe, distance };
        });

        cafesWithDistance.sort((a, b) => a.distance - b.distance);
        setCafeterias(cafesWithDistance);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <ScrollView className="px-4 pt-6">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-xl font-bold">All Restaurants</Text>
      </View>

      {cafeterias.map((cafe) => (
        <RestaurantCard
          key={cafe._id}
          restaurant={cafe}
          onFoodSelect={(foodItem) => setSelectedFood(foodItem)}
        />
      ))}

      {/* Bottom Sheet modal to show food details */}
      <Modal
        visible={!!selectedFood}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedFood(null)}
      >
        <FoodDetailsSheet food={selectedFood} onClose={() => setSelectedFood(null)} />
      </Modal>
    </ScrollView>
  );
};

export default AllRestaurantsScreen;