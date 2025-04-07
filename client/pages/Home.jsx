import React from 'react';
import { ScrollView, View } from 'react-native';
import Header from '../components/Header';
import ImageCarousel from '../components/ImageCarousel';
import AllRestaurantsScreen from '../components/AllRestuarants';

export default function Home() {
  return (
    <ScrollView className="bg-white">
      <Header />
      <ImageCarousel />
      <AllRestaurantsScreen />
    </ScrollView>
  );
}
