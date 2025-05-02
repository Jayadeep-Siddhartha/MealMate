import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/slices/cartSlice';

const FoodDetailsSheet = ({ food, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(addToCart({ ...food, quantity }));
    onClose();
  };

  return (
    <View className="bg-white p-4 rounded-t-2xl">
      <Image source={{ uri: food.image }} className="w-full h-48 rounded-xl" />
      <Text className="text-xl font-semibold mt-2">{food.name}</Text>
      <Text className="text-gray-500 my-1">{food.description}</Text>
      <Text className="text-lg font-bold my-2">${food.price.toFixed(2)}</Text>

      <View className="flex-row items-center justify-between mt-4">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => setQuantity(prev => Math.max(1, prev - 1))} className="px-3 py-1 bg-gray-200 rounded">
            <Text>-</Text>
          </TouchableOpacity>
          <Text className="px-4">{quantity}</Text>
          <TouchableOpacity onPress={() => setQuantity(prev => prev + 1)} className="px-3 py-1 bg-gray-200 rounded">
            <Text>+</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={handleAddToCart} className="bg-yellow-400 px-6 py-3 rounded">
          <Text className="font-bold text-white">ADD TO ORDER (${(food.price * quantity).toFixed(2)})</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default FoodDetailsSheet;
