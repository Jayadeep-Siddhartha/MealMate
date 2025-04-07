import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import API from '../utils/api';
const CafeDetailsScreen = ({ route }) => {
  const { menuIds, name } = route.params;
  const [foodItems, setFoodItems] = useState([]);

  useEffect(() => {
    const fetchFoodItems = async () => {
      try {
        const promises = menuIds.map(id => API.get(`/foods/${id}`));
        const responses = await Promise.all(promises);
        const items = responses.map(res => res.data);
        setFoodItems(items);
      } catch (err) {
        console.error('Error fetching food items:', err);
      }
    };

    fetchFoodItems();
  }, [menuIds]);

  return (
    <ScrollView className="px-4 pt-6">
      <Text className="text-2xl font-bold mb-4">{name} - Menu</Text>
      {foodItems.map(item => (
        <View key={item._id} className="mb-4 p-4 bg-white rounded shadow">
          <Text className="text-lg font-bold">{item.foodName}</Text>
          <Text>₹{item.price}</Text>
          <Text>Availability: {item.availability}</Text>
          <Text>Rating: {item.rating}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

export default CafeDetailsScreen;
