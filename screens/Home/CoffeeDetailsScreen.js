import React, { useState,useEffect } from "react";
import {
  Dimensions,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ToastAndroid
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../config/colors";
import SPACING from "../../config/SPACING";
import { BlurView } from "expo-blur";
import AsyncStorage from '@react-native-async-storage/async-storage';

const { height, width } = Dimensions.get("window");
const sizes = ["S", "M", "L"];

const CoffeeDetailsScreen = ({ route }) => {
  const { coffee } = route.params;
  const [activeSize, setActiveSize] = useState(null);
  const [shoppingCart, setShoppingCart] = useState([]);
  const [coffeePrice, setCoffeePrice] = useState(null);

  useEffect(() => {
    // Set the initial active size and price
    setActiveSize(coffee.prices[0]?.size);
    setCoffeePrice(coffee.prices[0]?.price);
  }, [coffee]);

  // Function to handle size selection
  const handleSizeSelection = (selectedSize) => {
    // Find the selected size object from the coffee.prices array
    const selectedSizeObj = coffee.prices.find((sizeObj) => sizeObj.size === selectedSize);
  
    if (selectedSizeObj) {
      // Set the active size and price
      setActiveSize(selectedSize);
      setCoffeePrice(selectedSizeObj.price);
    }
  };
  const addToCart = async () => {
    try {
      // Retrieve the current cart items from AsyncStorage
      const cartItemsJSON = await AsyncStorage.getItem('ShoppingCart');
      // Parse the JSON string to an array
      const currentCart = JSON.parse(cartItemsJSON) || [];
  
      // Check if the selected size and price are not null
      if (activeSize && coffeePrice !== null) {
        // Check if the item with the same name already exists in the cart
        const existingItemIndex = currentCart.findIndex(item => item.name === coffee.name);
  
        if (existingItemIndex !== -1) {
          // If the item exists, add a new size and price to its cart array
          currentCart[existingItemIndex].cart.push({
            selectedSize: activeSize,
            selectedPrice: coffeePrice,
          });
        } else {
          // If the item does not exist, add a new entry to the cart with a cart array
          const selectedItem = {
          ...coffee,
            cart: [{
              selectedSize: activeSize,
              selectedPrice: coffeePrice,
            }],
          };
  
          // Push the selected item to the cart
          currentCart.push(selectedItem);
        }
        // Save the updated cart to AsyncStorage
        await AsyncStorage.setItem('ShoppingCart', JSON.stringify(currentCart));
  
        // Update the cart state using the callback form of setShoppingCart
        setShoppingCart((prevCart) => [...prevCart, ...currentCart]);
  
        // Log the items in the cart after the state is updated
  
        ToastAndroid.show(
          'Item(s) Added Successfully to cart',
          ToastAndroid.SHORT
        );
      } else {
        // Handle the case where the size or price is not selected
        ToastAndroid.show(
          'Please select a size before adding to cart',
          ToastAndroid.SHORT
        );
      }
    } catch (error) {
      // Handle any errors that occur during AsyncStorage operations
      console.error('Error adding to cart:', error);
    }
  };
  
  
  
  return (
    <>
      <ScrollView>
        <SafeAreaView>
          <ImageBackground
            source={{ uri: coffee.image }}
            style={{
              height: height / 2 + SPACING * 2,
              justifyContent: "space-between",
            }}
            imageStyle={{
              borderRadius: SPACING * 3,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                padding: SPACING * 2,
              }}
            >
            </View>

            <View
              style={{
                borderRadius: SPACING * 3,
                overflow: "hidden",
              }}
            >
              <BlurView
                intensity={80}
                tint="dark"
                style={{
                  padding: SPACING * 2,
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View>
                  <Text
                    style={{
                      fontSize: SPACING * 2,
                      color: colors.white,
                      fontWeight: "600",
                      marginBottom: SPACING,
                    }}
                  >
                    {coffee.name}
                  </Text>
                  <Text
                    style={{
                      fontSize: SPACING * 1.8,
                      color: colors["white-smoke"],
                      fontWeight: "500",
                      marginBottom: SPACING,
                    }}
                  >
                    {coffee.included}
                  </Text>
                  <View style={{ flexDirection: "row", marginTop: SPACING }}>
                    <Ionicons
                      name="star"
                      size={SPACING * 1.5}
                      color={colors.primary}
                    />
                    <Text
                      style={{
                        color: colors.white,
                        marginLeft: SPACING,
                      }}
                    >
                      {coffee.rating}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    width: "35%",
                    justifyContent: "space-between",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <View
                      style={{
                        padding: SPACING / 2,
                        width: SPACING * 5,
                        height: SPACING * 5,
                        backgroundColor: colors.dark,
                        borderRadius: SPACING,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Ionicons
                        name="cafe"
                        size={SPACING * 2}
                        color={colors.primary}
                      />
                      <Text
                        style={{
                          color: colors["white-smoke"],
                          fontSize: SPACING,
                        }}
                      >
                        Coffee
                      </Text>
                    </View>
                    <View
                      style={{
                        padding: SPACING / 2,
                        width: SPACING * 5,
                        height: SPACING * 5,
                        backgroundColor: colors.dark,
                        borderRadius: SPACING,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Ionicons
                        name="water"
                        size={SPACING * 2}
                        color={colors.primary}
                      />
                      <Text
                        style={{
                          color: colors["white-smoke"],
                          fontSize: SPACING,
                        }}
                      >
                        Milk
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      backgroundColor: colors.dark,
                      padding: SPACING / 2,
                      borderRadius: SPACING / 2,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text
                      style={{
                        color: colors["white-smoke"],
                        fontSize: SPACING * 1.3,
                      }}
                    >
                      Medium roasted
                    </Text>
                  </View>
                </View>
              </BlurView>
            </View>
          </ImageBackground>

          <View
            style={{
              padding: SPACING,
            }}
          >
            <Text
              style={{
                color: colors["black-smoke"],
                fontSize: SPACING * 1.7,
                marginBottom: SPACING,
              }}
            >
              Description
            </Text>
            <Text numberOfLines={3} style={{ color: colors.black }}>
              {coffee.description}
            </Text>
            <View
              style={{
                marginVertical: SPACING * 2,
              }}
            >
              <Text
                style={{
                  color: colors["black-smoke"],
                  fontSize: SPACING * 1.7,
                  marginBottom: SPACING,
                }}
              >
                Size
              </Text>
              <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
            {sizes.map((size, index) => (
              <TouchableOpacity
                onPress={() => handleSizeSelection(size)}
                key={index}
                style={[
                  {
                    borderWidth: 2,
                    paddingVertical: SPACING / 2,
                    borderRadius: SPACING,
                    backgroundColor: colors["dark-light"],
                    width: width / 3 - SPACING * 2,
                    alignItems: "center",
                  },
                  activeSize === size && {
                    borderColor: colors.primary,
                    backgroundColor: colors.dark,
                  },
                ]}
              >
                <Text
                  style={[
                    {
                      color: colors["white-smoke"],
                      fontSize: SPACING * 1.9,
                    },
                    activeSize === size && {
                      color: colors.primary,
                    },
                  ]}
                >
                  {size}
                </Text>
              </TouchableOpacity>
            ))}
            </View>
            </View>
          </View>
        </SafeAreaView>
      </ScrollView>
      <SafeAreaView
        style={{ flexDirection: "row", justifyContent: "space-between" }}
      >
        <View
          style={{
            padding: SPACING,
            alignItems: "center",
            justifyContent: "center",
            paddingLeft: SPACING * 3,
          }}
        >
          <Text style={{ color: colors.black, fontSize: SPACING * 1.5 }}>
            Price
          </Text>
          <View style={{ flexDirection: "row" }}>
            <Text style={{ color: colors.primary, fontSize: SPACING * 2 }}>
              $
            </Text>
            <Text
              style={{
                color: colors.black,
                fontSize: SPACING * 2,
                marginLeft: SPACING / 2,
              }}
            >
              {coffeePrice}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={{
            marginRight: SPACING,
            backgroundColor: colors.primary,
            width: width / 2 + SPACING * 3,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: SPACING * 2,
          }}
           onPress={() => addToCart(coffee._id)}
        >
          <Text
            style={{
              color: colors.white,
              fontSize: SPACING * 2,
              fontWeight: "700",
            }}
          >
            Buy Now
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    </>
  );
};
export default CoffeeDetailsScreen;

