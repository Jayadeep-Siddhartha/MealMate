import React, { useEffect, useRef, useState, useContext } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import API from '../utils/api';
import FoodDetailsModal from './FoodDetailsModal';

const CafeDetailsScreen = ({ route }) => {
  const { user } = useContext(AuthContext);
  const { menuIds, name, cafeteriaId, cafeteriaImage, rating, openStatus } = route.params;
  console.log(route.params);

  const [foodItems, setFoodItems] = useState([]);
  const [selectedFood, setSelectedFood] = useState(null);
  const [activeReservation, setActiveReservation] = useState(null);
  const modalRef = useRef(null);

  useEffect(() => {
    const fetchFoodItems = async () => {
      try {
        const responses = await Promise.all(menuIds.map(id => API.get(`/foods/${id}`)));
        setFoodItems(responses.map(res => res.data));
      } catch (err) {
        console.error('Error fetching food items:', err);
      }
    };

    const fetchActiveReservation = async () => {
      try {
        const res = await API.get(`/reservations/active/${user._id}`);
        if (res.data) {
          setActiveReservation(res.data);
        } else {
          setActiveReservation(null);
        }
      } catch (err) {
        console.error('Error fetching active reservation:', err);
      }
    };

    if (user) {
      fetchActiveReservation();
    }

    fetchFoodItems();
  }, [menuIds]);

  const openModal = (item) => {
    setSelectedFood(item);
    modalRef.current?.open();
  };

  const handleAddToCart = async (food, quantity) => {
    if (!user) {
      Alert.alert('Login Required', 'Please login to add items to cart.');
      return;
    }
  
    const proceedWithAdd = async () => {
      try {
        console.log("In proceed t add");
        const res = await API.post('/reservations/add-to-cart', {
          userId: user._id,
          cafeteriaId,
          foodId: food._id,
          quantity,
        });
        console.log(res);
        // After adding to cart, update availability
        await API.put(`/foods/${food._id}/availability`, { quantity });
        console.log("Put food item");
        Alert.alert("Added to cart", `${food.foodName} x${quantity} added`);
        setActiveReservation(res.data);
      } catch (err) {
        console.error('Add to cart failed:', err);
  
        const errorMsg = err.response?.data?.error;
  
        if (errorMsg === 'Cart already contains items from a different cafeteria') {
          Alert.alert(
            "Different Cafeteria",
            "Your cart has items from another cafeteria. Clear the cart to continue?",
            [
              { text: "Cancel", style: "cancel" },
              {
                text: "Clear Cart",
                style: "destructive",
                onPress: async () => {
                  try {
                    await API.put(`/reservations/${activeReservation._id}/cancel`);
                    setActiveReservation(null);
                    await proceedWithAdd();
                  } catch (cancelErr) {
                    console.error('Failed to cancel reservation:', cancelErr);
                    Alert.alert("Error", "Could not clear the previous cart.");
                  }
                }
              }
            ]
          );
        } else {
          Alert.alert("Error", "Could not add item to cart.");
        }
      }
  
      modalRef.current?.close();
    };
  
    if (activeReservation && activeReservation.cafeteriaId !== cafeteriaId) {
      Alert.alert(
        "Different Cafeteria",
        "Your cart has items from a different cafeteria. Clear the cart to add items from this one?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Clear Cart",
            style: "destructive",
            onPress: async () => {
              try {
                await API.put(`/reservations/${activeReservation._id}/cancel`);
                setActiveReservation(null);
                await proceedWithAdd();
              } catch (err) {
                console.error('Failed to cancel reservation:', err);
                Alert.alert("Error", "Could not clear the previous cart.");
              }
            }
          }
        ]
      );
    } else {
      await proceedWithAdd();
    }
  };
  
  return (
    <>
      <ScrollView className="flex-1 bg-white mb-20">
        <Image source={{ uri: cafeteriaImage }} className="w-full h-56" />
        <View className="px-4 py-3">
          <Text className="text-2xl font-bold mb-1">{name}</Text>
          <Text className="text-gray-600 mb-2">$$ • Chinese • American • Deshi food</Text>
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-yellow-600 font-semibold">⭐ {rating}</Text>
            <Text className="text-sm text-gray-600">25 Min</Text>
            <Text className="text-sm text-green-600">Free</Text>
          </View>
          <Text className={`font-semibold ${openStatus ? 'text-green-500' : 'text-red-500'}`}>
            {openStatus ? 'Open Now' : 'Closed'}
          </Text>
        </View>

        <View className="px-4">
          <Text className="text-xl font-bold mb-4">Most Populars</Text>
          {foodItems.map(item => (
            <TouchableOpacity
              key={item._id}
              onPress={() => openModal(item)}
              className="flex-row bg-white rounded-xl shadow-sm mb-4 p-3"
            >
              <Image source={{ uri: item.foodImage }} className="w-24 h-24 rounded-lg mr-3" />
              <View className="flex-1 justify-between">
                <Text className="text-lg font-bold">{item.foodName}</Text>
                <Text className="text-sm text-gray-500">₹{item.price}</Text>
                <Text className="text-sm text-gray-500">Rating: {item.rating}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {selectedFood && (
        <FoodDetailsModal
          ref={modalRef}
          item={selectedFood}
          onAddToCart={handleAddToCart}
        />
      )}
    </>
  );
};

export default CafeDetailsScreen;
