import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider } from "react-redux";
import store from "./redux/store";
import AppNavigator from "./navigation/AppNavigator"; // or your navigator file
import { AuthProvider } from "./context/AuthContext";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <Provider store={store}>
          <AppNavigator />
        </Provider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
