import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView, ScrollView,Dimensions } from 'react-native'; // Add missing imports
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BlurView } from "expo-blur";
import Ionicons from 'react-native-vector-icons/Ionicons';
import SPACING from "../../../config/SPACING";
import colors from "../../../config/colors";
import { useNavigation } from "@react-navigation/native";
const { width } = Dimensions.get("window");
export default function Customize() {
  const [data, setData] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const navigation = useNavigation();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const age = await AsyncStorage.getItem('Age');
        const gender = await AsyncStorage.getItem('Gender');

        const mostPopularUrl = 'http://192.168.1.12:3001/most_popular_coffee_preference';
        const mostPopularResponse = await fetch(mostPopularUrl);

        if (!mostPopularResponse.ok) {
          throw new Error(`HTTP error! Status: ${mostPopularResponse.status}`);
        }

        const mostPopularData = await mostPopularResponse.json();
        console.log('Most Popular Preferences:', mostPopularData.top_preferences);
        // Ensure age and gender are not null or undefined
        if (age !== null && gender !== null) {
          const predictUrl = 'http://192.168.1.12:3001/predict_coffee_preference';
          const userData = { age: parseInt(age, 10), gender }; // Convert age to number if needed

          const predictionResponse = await fetch(predictUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
          });

          if (!predictionResponse.ok) {
            throw new Error(`HTTP error! Status: ${predictionResponse.status}`);
          }

          const predictionData = await predictionResponse.json();
          console.log('Predicted Preferences:', predictionData);

          // Update state with predicted preferences
          setData({ predicted_preferences: predictionData.predicted_product_names });

          // Use the predicted preferences for product search
          const searchResults = await Promise.all(
            predictionData.predicted_product_names.map(async (predictedProduct) => {
              const searchQuery = predictedProduct.replace(' ', '+');
              const searchUrl = `http://192.168.1.12:3000/products/search?q=${searchQuery}`;

              const searchResponse = await fetch(searchUrl);
              const searchData = await searchResponse.json();

              return searchData.results;
            })
          );

          // Concatenate the search results
          setSearchResults(searchResults.flat());
        } else {
          console.error('Age or gender is null or undefined.');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);
  console.log(searchResults)
  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require("../../../assets/beansBackground2.png")}
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
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "space-between",
        }}
      >
        {searchResults
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
}

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
