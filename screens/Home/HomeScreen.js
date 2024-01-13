import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import React, { useState, useEffect, } from "react";
import SPACING from "../../config/SPACING";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../config/colors"; // Assuming you have 'colors' configured correctly
import SearchField from "../../components/SearchField";
import Categories from "../../components/Categories";
// import coffees from "../../config/coffees";
import { useNavigation } from "@react-navigation/native";

const avatar = require("../../assets/avatar.jpg");

const { width } = Dimensions.get("window");

const HomeScreen = ({}) => {
  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const navigation = useNavigation();
  const [coffees, setCoffees] = useState([]);
  useEffect(() => {
    // Make an API request to fetch coffee data
    const apiUrl = "http://192.168.1.12:3000/products/"; // Replace with your API endpoint
    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          console.error(`API call error: ${response.status} - ${response.statusText}`);
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        // Set the retrieved coffee data in the state
        setCoffees(data);
      })
      .catch((error) => {
        console.error("API call error:", error);
      });
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require("../../assets/beansBackground2.png")}
        style={styles.backgroundImage}
      />
      <ScrollView
        style={{
          padding: SPACING,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        ></View>
        <View style={{ width: "80%", marginVertical: SPACING * 3 }}>
          <Text
            style={{
              color: colors.black, // Set the text color to white
              fontSize: SPACING * 3.5,
              fontWeight: "600",
            }}
          >
            Find the best coffee for you
          </Text>
        </View>
        <SearchField />
        <Categories onChange={(id) => setActiveCategoryId(id)} />
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-between",
          }}
        >
          {coffees
            .filter((coffee) => {
              if (activeCategoryId === null) {
                return true;
              }
              return coffee.categoryId === activeCategoryId;
            })
            .map((coffee) => (
              <TouchableOpacity
              key={coffee._id}
              onPress={()=> navigation.navigate('CoffeeDetails', {coffee})}
              style={{
                width: width / 2 - SPACING * 2,
                marginBottom: SPACING,
                borderRadius: SPACING * 2,
                overflow: "hidden",
              }}
            >
              <BlurView
                tint="dark"
                intensity={95}
                style={{
                  padding: SPACING,
                }}
              >
                <TouchableOpacity
                  style={{
                    height: 150,
                    width: "100%",
                  }}
                >
              <Image
                source={{ uri: coffee.image }} // Use the uri property for network images
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: SPACING * 2,
                }}
              />
                  <View
                    style={{
                      position: "absolute",
                      right: 0,
                      borderBottomStartRadius: SPACING * 3,
                      borderTopEndRadius: SPACING * 2,
                      overflow: "hidden",
                    }}
                  >
                    <BlurView
                      tint="dark"
                      intensity={70}
                      style={{
                        flexDirection: "row",
                        padding: SPACING - 2,
                      }}
                    >
                      <Ionicons
                        style={{
                          marginLeft: SPACING / 2,
                        }}
                        name="star"
                        color={colors.primary}
                        size={SPACING * 1.7}
                      />
                      <Text
                        style={{
                          color: colors.white, // Set the text color to white
                          marginLeft: SPACING / 2,
                        }}
                      >
                        {coffee.rating}
                      </Text>
                    </BlurView>
                  </View>
                </TouchableOpacity>
                <Text
                  numberOfLines={2}
                  style={{
                    color: colors.white, // Set the text color to white
                    fontWeight: "600",
                    fontSize: SPACING * 1.7,
                    marginTop: SPACING,
                    marginBottom: SPACING / 2,
                  }}
                >
                  {coffee.name}
                </Text>
                <Text
                  numberOfLines={1}
                  style={{
                    color: colors.white, // Set the text color to white
                    fontSize: SPACING * 1.2,
                  }}
                >
                  {coffee.included}
                </Text>
                <View
                  style={{
                    marginVertical: SPACING / 2,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <View style={{ flexDirection: "row" }}>
                    <Text
                      style={{
                        color: colors.primary, // Set the text color to primary color
                        marginRight: SPACING / 2,
                        fontSize: SPACING * 1.6,
                      }}
                    >
                      $
                    </Text>
                    <Text
                      style={{
                        color: colors.white, // Set the text color to white
                        fontSize: SPACING * 1.6,
                      }}
                    >
                      {coffee.price}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={{
                      backgroundColor: colors.primary, // Set the background color to primary color
                      padding: SPACING / 2,
                      borderRadius: SPACING,
                    }}
                  >
                    <Ionicons
                      name="add"
                      size={SPACING * 2}
                      color={colors.white} // Set the icon color to white
                    />
                  </TouchableOpacity>
                </View>
              </BlurView>
              </TouchableOpacity>
            ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
});

export default HomeScreen;
