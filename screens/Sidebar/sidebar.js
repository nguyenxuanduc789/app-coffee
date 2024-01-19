import "react-native-gesture-handler";
import { View, Text, Image ,TouchableOpacity} from "react-native";
import {
  SimpleLineIcons,
  MaterialIcons,
  MaterialCommunityIcons,
  FontAwesome,
  AntDesign 
} from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { DrawerItemList, createDrawerNavigator } from "@react-navigation/drawer";
//import User from "./assets/user.jpg";
import Backups from "../Sidebar/screens/Backups";
import Categories from "../Sidebar/screens/Categories";
import Contact from "../Sidebar/screens/Contact";
import Customize from "../Sidebar/screens/Customize";
import GetPremium from "../Sidebar/screens/GetPremium";
import Home from "../Sidebar/screens/Home";
import RateApp from "../Sidebar/screens/RateApp";
import Settings from "../Sidebar/screens/Settings";
import Timer from "../Sidebar/screens/Timer";
import React,{useState, useEffect} from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import CoffeeDetailsScreen from "../Home/CoffeeDetailsScreen";
import MapScreen from "../Googlemap/MapScreen";
const Drawer = createDrawerNavigator();

export default function Sidebar({navigation}) {
  const openCart = () => {
    // Replace 'Cart' with the name of the screen you want to navigate to
    navigation.navigate("Cart");
  };
  const [username, setUsername] = useState('');
  useEffect(()=>{
      AsyncStorage.getItem("Username").then(result=>{
        setUsername(result)
      })
  },[])
  return (
      <Drawer.Navigator
        drawerContent={
          (props) => {
            return (
              <SafeAreaView>
                <View
                  style={{
                    height: 200,
                    width: '100%',
                    justifyContent: "center",
                    alignItems: "center",
                    borderBottomColor: "#f4f4f4",
                    borderBottomWidth: 1
                  }}
                >
                  <Image
                    //source={User}
                    style={{
                      height: 130,
                      width: 130,
                      borderRadius: 65
                    }}
                  />
                  <Text
                    style={{
                      fontSize: 22,
                      marginVertical: 6,
                      fontWeight: "bold",
                      color: "#111"
                    }}
                  >{username}</Text>
                  <Text
                    style={{
                      fontSize: 16,
                      color: "#111"
                    }}
                  >Customer</Text>
                </View>
                <DrawerItemList {...props} />
              </SafeAreaView>
            )
          }
        }
        screenOptions={{
          drawerStyle: {
            backgroundColor: "#fff",
            width: 250
          },
          headerStyle: {
            backgroundColor: "#000",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold"
          },
          drawerLabelStyle: {
            color: "#111"
          },
          headerRight: () => (
            <TouchableOpacity onPress={openCart}>
              <Image
                source={require("../../assets/logocart.png")}
                style={{
                  width: 50,
                  height: 50,
                }}
              />
            </TouchableOpacity >
          ),
        }}
      >
        <Drawer.Screen
          name="Home"
          options={{
            drawerLabel: "Home",
            title: "Home",
            drawerIcon: () => (
              <SimpleLineIcons name="home" size={20} color="#808080" />
            )
          }}
          component={Home}
        />
        <Drawer.Screen
          name="Timer"
          options={{
            drawerLabel: "QR",
            title: "QR",
            drawerIcon: () => (
              <MaterialIcons name="timer" size={20} color="#808080" />
            )
          }}
          component={Timer}
        />
        <Drawer.Screen
          name="CoffeeDetails"
          options={{
            drawerLabel: "CoffeeDetails",
            title: "CoffeeDetails",
            drawerIcon: () => (
              <MaterialCommunityIcons name="message-alert-outline" size={20} color="#808080" />
            )
          }}
          component={CoffeeDetailsScreen}
        />
        <Drawer.Screen
          name="Cart"
          options={{
            drawerLabel: "Cart",
            title: "Cart",
            drawerIcon: () => (
              <MaterialIcons name="category" size={20} color="#808080" />
            )
          }}
          component={Categories}
        />
        <Drawer.Screen
          name="Product loves"
          options={{
            drawerLabel: "Product loves",
            title: "Product loves",
            drawerIcon: () => (
              <MaterialIcons name="dashboard-customize" size={20} color="#808080" />
            )
          }}
          component={Customize}
        />
        <Drawer.Screen
          name="Settings"
          options={{
            drawerLabel: "Chat",
            title: "Chat",
            drawerIcon: () => (
              <SimpleLineIcons name="settings" size={20} color="#808080" />
            )
          }}
          component={Settings}
        />
        <Drawer.Screen
          name="Reviews"
          options={{
            drawerLabel: "Reviews",
            title: "Reviews",
            drawerIcon: () => (
              <MaterialIcons name="backup" size={20} color="#808080" />
            )
          }}
          component={Backups}
        />

        <Drawer.Screen
          name="Get Premium"
          options={{
            drawerLabel: "Get Premuim",
            title: "Get Premium",
            drawerIcon: () => (
              <MaterialCommunityIcons name="certificate" size={20} color="#808080" />
            )
          }}
          component={GetPremium}
        />
        <Drawer.Screen
          name="Rate this App"
          options={{
            drawerLabel: "Log out",
            title: "Log out",
            drawerIcon: () => (
              <AntDesign  name="logout" size={20} color="#808080" />
            )
          }}
          component={RateApp}
        />
        <Drawer.Screen
          name="Contact"
          options={{
            drawerLabel: "Contact",
            title: "Map",
            drawerIcon: () => (
              <MaterialCommunityIcons name="message-alert-outline" size={20} color="#808080" />
            )
          }}
          component={MapScreen}
        />
      </Drawer.Navigator>
  );
}