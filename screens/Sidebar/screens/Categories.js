import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  ToastAndroid,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import COLOURS from '../../../config/colors.js';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Categories = ({ navigation }) => {
  const [product, setProduct] = useState([]);
  const [total, setTotal] = useState(null);
  const [discountCode, setDiscountCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getDataFromDB();
    });

    return unsubscribe;
  }, [navigation]);
  const applyDiscountCode = async () => {
    try {
      const  username = await AsyncStorage.getItem('Username');
      const cartData = await AsyncStorage.getItem('Cart');
      const cart = JSON.parse(cartData);
      const nameProductArray = cart.reduce((acc, item) => {
        const existingProduct = acc.find(product => product.name === item.name);
      
        if (existingProduct) {
          // If the product already exists, update the size and calculate the total price
          item.cart.forEach(cartItem => {
            const index = existingProduct.size.indexOf(cartItem.selectedSize);
      
            if (index !== -1) {
              // If the size already exists, add the price to the existing price
              existingProduct.price += cartItem.selectedPrice;
            } else {
              // If the size doesn't exist, add a new entry to both size and add the price
              existingProduct.size.push(cartItem.selectedSize);
              existingProduct.price += cartItem.selectedPrice;
            }
          });
        } else {
          // If the product doesn't exist, add a new entry to the array with the total price
          acc.push(item.name);
        }
        return acc;
      }, []);
      console.log(username)
      console.log(nameProductArray);
      // Replace 'your-api-endpoint' with the actual endpoint of your discount search API
      const apiUrl = 'http://192.168.1.12:3000/discount/search-discount';
  
      // Make a POST request to the discount search API
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          discountCode :discountCode,
          username: username,
          name:nameProductArray
        }),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        var a=result.discount.pricecound/100
        console.log(a);
        var b=totalsum*a
        setDiscountAmount(b);
        setDiscountApplied(true);
        ToastAndroid.show('Discount applied!', ToastAndroid.SHORT);
      } else {
        // Discount not found or other error, handle accordingly
        console.error('Error searching for discount:', result.error);
        ToastAndroid.show('Discount not found or error', ToastAndroid.SHORT);
      }
    } catch (error) {
      console.error('Error applying discount:', error);
      ToastAndroid.show('Error applying discount', ToastAndroid.SHORT);
    }
  };
  const getDataFromDB = async () => {
    let items = await AsyncStorage.getItem('ShoppingCart');
    items = JSON.parse(items);
    let productData = items || [];
    if (items) {
      items.forEach(data => {
        if (items.includes(data._id)) {
          productData.push(data);
          return;
        }
      });
      await AsyncStorage.setItem('Cart', JSON.stringify(productData));
      setProduct(productData);
      getTotal(productData);
    } else {
      setProduct([]);
      getTotal([]);
    }
  };

  const getTotal = async (productData) => {
    let total = 0;
    for (let index = 0; index < productData.length; index++) {
      let price = parseFloat(productData[index].price);
      total = total + price;
    }
    setTotal(total);
    try {
      await AsyncStorage.setItem('total', total.toString());
    } catch (error) {
      console.error('Error saving total to AsyncStorage:', error);
    }
  };
  const VAT_RATE = 0.08; // 8% VAT rate

  const totalSelectedPriceWithVAT = product.reduce((acc, product) => {
    if (product && product.cart && Array.isArray(product.cart)) {
      const subtotal = product.cart.reduce((itemAcc, cartItem) => {
        if (cartItem && typeof cartItem.selectedPrice === 'number') {
          return itemAcc + cartItem.selectedPrice;
        } else {
          return itemAcc;
        }
      }, 0);
  
      const totalWithVAT =  subtotal * VAT_RATE;
  
      return acc + totalWithVAT;
    } else {
      return acc;
    }
  }, 0);
  
  const roundedTotalWithVAT = totalSelectedPriceWithVAT.toFixed(1);

  const saveTotalSumToAsyncStorage = async (value) => {
    try {
      await AsyncStorage.setItem('totalsum', value.toString());
    } catch (error) {
      console.error('Error saving totalsum to AsyncStorage:', error);
    }
  };

  const totalSelectedPrice = product.reduce((acc, product) => {
    if (product && product.cart && Array.isArray(product.cart)) {
      return (
        acc +
        product.cart.reduce((itemAcc, cartItem) => {
          if (cartItem && typeof cartItem.selectedPrice === 'number') {
            return itemAcc + cartItem.selectedPrice;
          } else {
            return itemAcc;
          }
        }, 0)
      );
    } else {
      return acc;
    }
  }, 0);

  var totalsum=totalSelectedPrice-roundedTotalWithVAT;

  const removeItemFromCart = async (_id) => {
    let itemArray = await AsyncStorage.getItem('ShoppingCart');
    itemArray = JSON.parse(itemArray);
    if (itemArray) {
      let array = itemArray;
      for (let index = 0; index < array.length; index++) {
        if (array[index]._id === _id) {
          array.splice(index, 1);
        }
      }
      await AsyncStorage.setItem('ShoppingCart', JSON.stringify(array));
      getDataFromDB();
    }
  };
  //checkout
  const checkOut = async () => {
    try {
      await AsyncStorage.removeItem('cartItems');
    } catch (error) {
      return error;
    }

    ToastAndroid.show('Items will be Deliverd SOON!', ToastAndroid.SHORT);

    navigation.navigate('Home');
  };
  const renderProducts = (data, index) => {
    return (
      <TouchableOpacity
      key={data._id}
        //onPress={() => navigation.navigate('ProductInfo', {productID: data.id})}
        style={{
          width: '100%',
          height: 100,
          marginVertical: 6,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <View
          style={{
            width: '30%',
            height: 100,
            padding: 14,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: COLOURS.backgroundLight,
            borderRadius: 10,
            marginRight: 22,
          }}>
          <Image
            source={{ uri: data.image }}
            style={{
              width: '150%',
              height: '150%',
              resizeMode: 'contain',
            }}
          />
        </View>
        <View
          style={{
            flex: 1,
            height: '100%',
            justifyContent: 'space-around',
          }}>
          <View style={{}}>
          {/* <View style={{ marginBottom:5 }}>
              <Text
                style={{
                  fontSize: 14,
                  maxWidth: '100%',
                  color: COLOURS.black,
                  fontWeight: '600',
                  letterSpacing: 1,
                }}>
                {data.name}
              </Text>
            </View> */}
            <View
              style={{
                marginTop: 4,
                flexDirection: 'row',
                alignItems: 'center',
                opacity: 0.6,
              }}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '400',
                  maxWidth: '85%',
                  marginRight: 4,
                }}>
              </Text>
            </View>
          </View>
          <View style={{ flexDirection: 'column' }}>
              <Text
                style={{
                  fontSize: 17,
                  maxWidth: '100%',
                  color: COLOURS.black,
                  fontWeight: '600',
                  letterSpacing: 1,
                  marginBottom: -15, // Add margin here to separate from the cart items
                }}>
                {data.name}
              </Text>
              {data.cart.map((sizePrice, index) => (
                <View key={index} style={styles.CardTableRow}>
                  <View style={{ flex: 1, alignItems: 'flex-start' }}>
                    {/* Left-aligned content, e.g., Size */}
                    <Text>
                      Size {sizePrice.selectedSize}:
                    </Text>
                  </View>
                  <Text style={styles.CardQuantityPriceText}>
                    X <Text style={styles.Price}>1</Text>
                  </Text>
                  <View style={{ flex: 1, alignItems: 'flex-end' }}>
                    {/* Right-aligned content, e.g., Price */}
                    <Text style={styles.PriceCurrency}>
                      $ {sizePrice.selectedPrice}
                    </Text>
                  </View>
                </View>
              ))}
              <View style={{ ...styles.CardTableRow, borderBottomWidth: 0 }}>
                <Text style={{ ...styles.CardQuantityPriceText1, textAlign: 'right', textDecorationLine: 'none' }}>
                  Total: ${data.cart.reduce((acc, sizePrice) => acc + sizePrice.selectedPrice, 0)}
                </Text>
              </View>
            </View>
               <TouchableOpacity  key={data._id} onPress={() => removeItemFromCart(data._id)}>
                    <MaterialCommunityIcons
                      name="delete-outline"
                      style={{
                        fontSize: 16,
                        color: COLOURS.backgroundDark,
                        backgroundColor: COLOURS.backgroundLight,
                        padding: 8,
                        borderRadius: 100,
                        alignSelf: 'flex-end', // Align the button to the right
                      }}
                    />
                  </TouchableOpacity>
            </View>
      </TouchableOpacity>
    );
  };
  return (
    <View
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: COLOURS.white,
        position: 'relative',
      }}>
      <ScrollView>
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            paddingTop: 16,
            paddingHorizontal: 16,
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <View></View>
        </View>
        <View style={{paddingHorizontal: 16}}>
        {product ? product.map(data => renderProducts(data, data._id)) : null}
        </View>
        <View>
          <View
            style={{
              paddingHorizontal: 16,
              marginVertical: 10,
            }}>
            <Text
              style={{
                fontSize: 16,
                color: COLOURS.black,
                fontWeight: '500',
                letterSpacing: 1,
                marginBottom: 20,
              }}>
              Delivery Location
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  width: '80%',
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    color: COLOURS.blue,
                    backgroundColor: COLOURS.backgroundLight,
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 12,
                    borderRadius: 10,
                    marginRight: 18,
                  }}>
                  <MaterialCommunityIcons
                    name="truck-delivery-outline"
                    style={{
                      fontSize: 18,
                      color: COLOURS.blue,
                    }}
                  />
                </View>
                <View>
                  <Text
                    style={{
                      fontSize: 14,
                      color: COLOURS.black,
                      fontWeight: '500',
                    }}>
                    2 Petre Melikishvili St.
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: COLOURS.black,
                      fontWeight: '400',
                      lineHeight: 20,
                      opacity: 0.5,
                    }}>
                    0162, Tbilisi
                  </Text>
                </View>
              </View>
              <MaterialCommunityIcons
                name="chevron-right"
                style={{fontSize: 22, color: COLOURS.black}}
              />
            </View>
          </View>
          <View
            style={{
              paddingHorizontal: 16,
              marginVertical: 10,
            }}>
            <Text
              style={{
                fontSize: 16,
                color: COLOURS.black,
                fontWeight: '500',
                letterSpacing: 1,
                marginBottom: 20,
              }}>
              Payment Method
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  width: '80%',
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    color: COLOURS.blue,
                    backgroundColor: COLOURS.backgroundLight,
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 12,
                    borderRadius: 10,
                    marginRight: 18,
                  }}>
                  <Text
                    style={{
                      fontSize: 10,
                      fontWeight: '900',
                      color: COLOURS.blue,
                      letterSpacing: 1,
                    }}>
                    VISA
                  </Text>
                </View>
                <View>
                  <Text
                    style={{
                      fontSize: 14,
                      color: COLOURS.black,
                      fontWeight: '500',
                    }}>
                    Visa Classic
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: COLOURS.black,
                      fontWeight: '400',
                      lineHeight: 20,
                      opacity: 0.5,
                    }}>
                    ****-9092
                  </Text>
                </View>
              </View>
              <MaterialCommunityIcons
                name="chevron-right"
                style={{fontSize: 22, color: COLOURS.black}}
              />
            </View>
              <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <TextInput
              placeholder="Enter discount code"
              style={{
                flex: 1,
                borderWidth: 1,
                borderColor: COLOURS.black,
                borderRadius: 10,
                padding: 10,
              }}
              value={discountCode}
              onChangeText={(text) => setDiscountCode(text)}
            />
            <TouchableOpacity
              onPress={applyDiscountCode}
              style={{
                backgroundColor: COLOURS.black,
                padding: 10,
                borderRadius: 10,
                marginLeft: 10,
              }}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '500',
                  letterSpacing: 1,
                  color: COLOURS.white,
                }}>
                Apply
              </Text>
            </TouchableOpacity>
          </View>
          </View>
          <View
            style={{
              paddingHorizontal: 16,
              marginTop: 40,
              marginBottom: 80,
            }}>
            <Text
              style={{
                fontSize: 16,
                color: COLOURS.black,
                fontWeight: '500',
                letterSpacing: 1,
                marginBottom: 20,
              }}>
              Order Info
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 8,
              }}>
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: '400',
                  maxWidth: '80%',
                  color: COLOURS.black,
                  opacity: 0.5,
                }}>
                VAT 8%
              </Text>
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: '400',
                  color: COLOURS.black,
                  opacity: 0.8,
                }}>
                ${roundedTotalWithVAT}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: '400',
                  maxWidth: '80%',
                  color: COLOURS.black,
                  opacity: 0.5,
                }}>
                Total
              </Text>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: '500',
                  color: COLOURS.black,
                }}>
                ${totalsum}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
      <View
        style={{
          position: 'absolute',
          bottom: 10,
          height: '8%',
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <TouchableOpacity
          onPress={() => {
            if (discountAmount === 0) {
              // Save totalsum to AsyncStorage if discountAmount is 0
              saveTotalSumToAsyncStorage(totalsum);
            } else {
              // Save discountAmount to AsyncStorage if it's not 0
              saveTotalSumToAsyncStorage(discountAmount);
            }
  
            navigation.navigate('Timer');
          }}
          style={{
            width: '86%',
            height: '90%',
            backgroundColor: COLOURS.black,
            borderRadius: 20,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text
            style={{
              fontSize: 12,
              fontWeight: '500',
              letterSpacing: 1,
              color: COLOURS.white,
              textTransform: 'uppercase',
            }}>
              {discountAmount === 0 ? (
                // Render totalsum if discountAmount is 0
                ` CHECKOUT ${totalsum}`
              ) : (
                // Render discountAmount if it's not 0
                `CHECKOUT ${discountAmount}`
              )}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  cardContainer: {
    margin: 10,
    padding: 10,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    elevation: 3,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sizeBox: {
    flex: 1,
  },
  priceBox: {
    flex: 1,
    alignItems: 'flex-end',
  },
  sizeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  smallFontSize: {
    fontSize: 12,
  },
  mediumFontSize: {
    fontSize: 16,
  },
  priceCurrency: {
    fontSize: 14,
    color: '#777777',
  },
  priceValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  quantityText: {
    fontSize: 14,
    color: '#555555',
  },
  totalPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  CardTableRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start', // Change this line
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: 'black',
    paddingVertical: 8,
  },
  CardQuantityPriceText: {
    fontSize: 14,
    marginRight: 8, // Adjust spacing as needed
  },
  CardQuantityPriceText1: {
    fontSize: 14,
    marginLeft: 50, // Adjust spacing as needed
  },
});
export default Categories;