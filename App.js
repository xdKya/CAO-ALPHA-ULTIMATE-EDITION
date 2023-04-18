import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import DrawerNavigator from "./navigato/drawer";
import firebase from "firebase";
import { firebaseConfig } from "./config";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./screens/login";
import RegisterScreen from "./screens/register";
const Stack = createStackNavigator();

const StackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="Tela de Login"
    >
      <Stack.Screen name="Painel" component={DrawerNavigator} />
      <Stack.Screen name="Tela de Login" component={LoginScreen} />
      <Stack.Screen name="Tela de registro" component={RegisterScreen} />
    </Stack.Navigator>
  );
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app();
}

export default function App() {
  return (
    <NavigationContainer>
      <StackNavigator />
    </NavigationContainer>
  );
}
