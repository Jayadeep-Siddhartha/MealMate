import { View, Text, SafeAreaView } from "react-native";

function Header() {
  return (
    <SafeAreaView>
      <View className="items-center mt-6 ">
        <Text className = "text-sm text-yellow-400 font-light">
          Welcome
        </Text>
        <Text className = "text-lg font-light">
          Jayadeep
        </Text>
      </View>
    </SafeAreaView>
  );
}

export default Header;
