import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import StoryScreen from "../screens/storyScreen";
import BottomTabNavigator from "./bottomTab";
const Stack = createStackNavigator();

const StackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Tela Inicial" component={BottomTabNavigator} />
      <Stack.Screen name="Tela de Resumos" component={StoryScreen} />
    </Stack.Navigator>
  );
};

export default StackNavigator;
