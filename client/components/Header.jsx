import { View, Text, SafeAreaView, Pressable, Alert } from "react-native";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext"; // Adjust the path if needed

function Header() {
  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Sign Out", style: "destructive", onPress: () => logout() }
      ]
    );
  };

  return (
    <SafeAreaView>
      <View className="items-center mt-6">
        <Text className="text-sm text-yellow-400 font-light">
          Welcome
        </Text>
        <Text className="text-lg font-light">
          {user?.username || "Guest"}
        </Text>
        {user && (
          <Pressable onPress={handleLogout} className="mt-2">
            <Text className="text-red-500 font-medium">Sign Out</Text>
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
}

export default Header;
