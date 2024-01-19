import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Login, Signup, Welcome } from "./screens";
import HomeScreen from "./screens/Home/HomeScreen";
import Sidebar from "./screens/Sidebar/sidebar";
import Sidebarad from "./screens/Sidebarad/sidebarad";
import Categories from "./screens/Sidebar/screens/Categories";
import GetPremium from "./screens/Sidebar/screens/GetPremium"
import Timer from "./screens/Sidebar/screens/Timer"
import MapScreen from "./screens/Googlemap/MapScreen"
const Stack = createNativeStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator >
        <Stack.Screen
          name="Welcome"
          component={Welcome}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Signup"
          component={Signup}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Sidebar"
          component={Sidebar}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Sidebarad"
          component={Sidebarad}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Categories"
          component={Categories}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="GetPremium"
          component={GetPremium}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Timer"
          component={Timer}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="MapScreen"
          component={MapScreen}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
