import React, { useState, useEffect, forwardRef } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Modalize } from 'react-native-modalize';

const FoodDetailsModal = forwardRef(({ item, onAddToCart }, ref) => {
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setQuantity(1);
  }, [item]);

  if (!item) return null;

  const increment = () => setQuantity(q => q + 1);
  const decrement = () => setQuantity(q => (q > 1 ? q - 1 : 1));

  return (
    <Modalize ref={ref} adjustToContentHeight>
      <View className="pb-8">
        {/* Food Image */}
        {item.foodImage && (
          <Image
            source={{ uri: item.foodImage }}
            className="w-full h-64"
            resizeMode="cover"
          />
        )}

        {/* Food Details */}
        <View className="px-5 py-4">
          <Text className="text-2xl font-bold mb-1">{item.foodName}</Text>
          <Text className="text-gray-500 text-sm mb-2 capitalize">{item.category}</Text>

          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-semibold text-gray-700">₹{item.price}</Text>
            <Text className="text-sm text-gray-500">Rating: {item.rating}⭐</Text>
          </View>

          <Text className="text-sm text-gray-600 mb-2">Availability: {item.availability}</Text>

          {/* Quantity Selector */}
          <View className="flex-row items-center justify-center space-x-6 my-4">
            <TouchableOpacity
              onPress={decrement}
              className="bg-gray-200 rounded-full px-4 py-2"
            >
              <Text className="text-xl font-bold">-</Text>
            </TouchableOpacity>
            <Text className="text-lg font-semibold">{quantity}</Text>
            <TouchableOpacity
              onPress={increment}
              className="bg-gray-200 rounded-full px-4 py-2"
            >
              <Text className="text-xl font-bold">+</Text>
            </TouchableOpacity>
          </View>

          {/* Add to Cart Button */}
          <TouchableOpacity
            className="bg-yellow-500 py-3 rounded-lg mb-12 items-center w-full"
            onPress={() => onAddToCart(item, quantity)}
          >
            <Text className="text-white text-base font-bold">
              Add to Cart (₹{(Math.ceil(item.price * quantity * 0.05).toFixed(2))})
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modalize>
  );
});

export default FoodDetailsModal;
