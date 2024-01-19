
import { StyleSheet, Text, View } from "react-native";
import React from "react";
import colors from "../../../config/colors";
import HomeScreen from "../../Home/HomeScreen";
import coffees from "../../../config/coffees";
import CoffeeDetailsScreen from "../../Home/CoffeeDetailsScreen"


const Home = () => {
  return (
    <View style={{ flex: 1, backgroundColor: colors.dark }}>
      <HomeScreen />
      {/* <MapScreen></MapScreen> */}
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({});

