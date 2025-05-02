import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { AuthContext } from '../context/AuthContext';

const SignupScreen = ({ navigation }) => {
  const { register } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const handleSignup = async () => {
    try {
      await register(email, password, name, phone);
    } catch (error) {
      Alert.alert('Signup Failed', error.message);
    }
  };

  return (
    <View className="flex-1 justify-center px-6 bg-white">
      <Text className="text-3xl font-bold mb-6 text-center text-amber-500">Create Account</Text>

      <TextInput placeholder="Name" value={name} onChangeText={setName} className="border border-gray-300 rounded-xl px-4 py-3 mb-4" />
      <TextInput placeholder="Phone" value={phone} onChangeText={setPhone} className="border border-gray-300 rounded-xl px-4 py-3 mb-4" />
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} className="border border-gray-300 rounded-xl px-4 py-3 mb-4" keyboardType="email-address" />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry className="border border-gray-300 rounded-xl px-4 py-3 mb-6" />

      <TouchableOpacity onPress={handleSignup} className="bg-amber-500 py-3 rounded-xl mb-4">
        <Text className="text-white text-center font-bold">Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text className="text-center text-gray-500">Already have an account? <Text className="text-amber-500 font-bold">Log In</Text></Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignupScreen;
