import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button,Modal } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { WebView } from "react-native-webview";

export default function Timer() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [text, setText] = useState('Not yet scanned');
  const [showModal, setShowModal] = useState(false);
  const [status, setStatus] = useState("Pending");


  const askForCameraPermission = () => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })()
  }
    // Request Camera Permission
    useEffect(() => {
      askForCameraPermission();
    }, []);
  
    const handleResponse = data => {
      if (data.title === "success") {
        setStatus("Complete");
      } else if (data.title === "cancel") {
        setStatus("Cancelled");
      } else {
        return;
      }
    };

  // What happens when we scan the bar code
  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    setText(data)
    console.log('Type: ' + type + '\nData: ' + data)
  };
  const makePaymentApiCall = async (tableNumber) => {
    try {
      // Get data from AsyncStorage
      const cartData = await AsyncStorage.getItem('Cart');
      const totalSumData = await AsyncStorage.getItem('totalsum');
      const  age = await AsyncStorage.getItem('Age');
      const  gender = await AsyncStorage.getItem('Gender');
      const  username = await AsyncStorage.getItem('Username');
      // Parse data if needed
      const cart = JSON.parse(cartData);
      console.log(cart)
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
          acc.push({
            name: item.name,
            size: item.cart.map(cartItem => cartItem.selectedSize),
            price: item.cart.reduce((total, cartItem) => total + cartItem.selectedPrice, 0)
          });
        }
      
        return acc;
      }, []);
      console.log(nameProductArray); 
      const totalSum = JSON.parse(totalSumData);
      // console.log(totalSum)
      // // Make your API call here using fetch or any other library
      // console.log(tableNumber)
      const response = await fetch(`http://192.168.1.12:3000/order/add-product/${tableNumber}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          totalproduct: totalSum,
          categoryId: 1,
          username: username,
          age: age,
          img:[],
          gender: gender,
          nameproduct: nameProductArray,
        }),
      });
    } catch (error) {
      console.error('API Error:', error);
    }
  };
  // Check permissions and return the screens
  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text>Requesting for camera permission</Text>
      </View>)
  }
  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={{ margin: 10 }}>No access to camera</Text>
        <Button title={'Allow Camera'} onPress={() => askForCameraPermission()} />
      </View>)
  }

  // Return the View
  return (
<View style={styles.container}>
      <View style={styles.barcodebox}>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={{ height: 400, width: 400 }}
        />
      </View>
      <Text style={styles.maintext}>{text}</Text>
      {scanned && (
        <View>
          <Button
            title={'Cash Payment'}
            onPress={() => {
              setScanned(false);
              makePaymentApiCall(text); // Pass the scanned data as the tableNumber
            }}
            color='tomato'
          />
          <Button
            title={'E-payment'}
            onPress={() => setShowModal(true)}
            color='green'
          />
          <Modal
            visible={showModal}
            onRequestClose={() => setShowModal(false)}
          >
            <WebView
              source={{ uri: "http://192.168.1.12:3000/" }}
              onNavigationStateChange={data => handleResponse(data)}
              injectedJavaScript={`document.f1.submit()`} // You may need to adjust this line based on your use case
            />
          </Modal>
          <Text>Payment Status: {status}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  maintext: {
    fontSize: 16,
    margin: 20,
  },
  barcodebox: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 300,
    width: 300,
    overflow: 'hidden',
    borderRadius: 30,
    backgroundColor: 'tomato'
  }
});