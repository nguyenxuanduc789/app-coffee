import React, { useState, useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

export default function GetPremium() {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [username, setUsername] = useState(''); // Initialize the username state

  const fetchData = async () => {
    try {
      const storedProducts = await AsyncStorage.getItem('Cart');
      if (storedProducts) {
        const parsedProducts = JSON.parse(storedProducts);
        setProducts(parsedProducts);
      }
    } catch (error) {
      console.error('Error fetching products from AsyncStorage:', error);
    }
  };
  const fetchTotal = async () => {
    try {
      const savedTotal = await AsyncStorage.getItem('total');
      if (savedTotal) {
        setTotal(parseFloat(savedTotal));
      }
    } catch (error) {
      console.error('Error fetching total from AsyncStorage:', error);
    }
  };

  // Fetch the username from AsyncStorage
  const fetchUsername = async () => {
    try {
      const storedUsername = await AsyncStorage.getItem('Username');
      if (storedUsername) {
        setUsername(storedUsername);
      }
    } catch (error) {
      console.error('Error fetching username from AsyncStorage:', error);
    }
  };

  const handleCheckPayment = async () => {
    // Retrieve the 'scannedData' value from AsyncStorage
    try {
      const scannedData = await AsyncStorage.getItem('scannedData');
      if (scannedData) {
        // Prepare the data to send to the API
        const orderData = {
          username, // Use the fetched username
          products,
          total,
          tablenumber: scannedData, // Assign the value from AsyncStorage
        };
  
        try {
          const response = await fetch('http://192.168.1.12:3000/order/checkpayment', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData),
          });
  
          if (response.ok) {
            const data = await response.json();
            console.log('Order created:', data);
          } else {
            console.error('Failed to create order');
          }
        } catch (error) {
          console.error('Error making API call:', error);
        }
      } else {
        console.error('No scannedData found in AsyncStorage');
      }
    } catch (error) {
      console.error('Error fetching scannedData from AsyncStorage:', error);
    }
  };
  

  // Fetch the username when the component loads
  useEffect(() => {
    fetchUsername();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
      fetchTotal();
    }, [])
  );

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>GetPremium</Text>
      {products.map((product, index) => (
        <Text key={index}>{product.name}</Text>
      ))}
       <Text>name: {username}</Text>
      <Text>Total: ${total}</Text>

      <Button title="Check Payment" onPress={handleCheckPayment} />
    </View>
  );
}
