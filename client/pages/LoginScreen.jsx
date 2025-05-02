import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { AuthContext } from '../context/AuthContext';

const LoginScreen = ({ navigation }) => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await login(email, password);
    } catch (error) {
      Alert.alert('Login Failed bro', error.message);
    }
  };

  return (
    <View className="flex-1 justify-center px-6 bg-white">
      <Text className="text-3xl font-bold mb-6 text-center text-amber-500">Welcome Back</Text>

      <TextInput placeholder="Email" value={email} onChangeText={setEmail} className="border border-gray-300 rounded-xl px-4 py-3 mb-4" keyboardType="email-address" />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry className="border border-gray-300 rounded-xl px-4 py-3 mb-6" />

      <TouchableOpacity onPress={handleLogin} className="bg-amber-500 py-3 rounded-xl mb-4">
        <Text className="text-white text-center font-bold">Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
        <Text className="text-center text-gray-500">Don't have an account? <Text className="text-amber-500 font-bold">Sign Up</Text></Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;
