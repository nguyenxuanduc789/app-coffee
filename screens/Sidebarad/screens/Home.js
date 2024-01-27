

import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import ImagePicker from 'react-native-image-picker';

const Home = () => {
  const [banCafe, setBanCafe] = useState([]);
  const [apiData, setApiData] = useState([]);

  useEffect(() => {
    // Define the URL of your API
    const apiUrl = 'http://172.16.0.230:3000/order/';
    fetchData(apiUrl); // Create a function to fetch data and call it
  }, []);

  const fetchData = async (apiUrl) => {
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      setApiData(data);
    } catch (error) {
      console.error('Error fetching data from API:', error);
    }
  };

  const chooseImage = (item) => {
    const products = item.products;
    let productText = '';

    let closestProduct = null;
    let minTimeDifference = Infinity;

    // Find the product with the minimum time difference
    products.forEach((product) => {
        const timeDifference = Math.abs(new Date(product.createdAt) - new Date());
        if (timeDifference < minTimeDifference) {
            minTimeDifference = timeDifference;
            closestProduct = product;
        }
    });
    if (closestProduct) {
        closestProduct.nameproduct.forEach((nameProduct) => {
            productText += `   Name: ${nameProduct.name}\n`;
            productText += `   Size: ${nameProduct.size.join(', ')}\n`;
            productText += `   Price: ${nameProduct.price}\n`;
            productText += '\n';
        });

        Alert.alert('Menu for Table ' + item.tablenumber, productText);
    } else {
        Alert.alert('No products found.');
    }
};
    const changeBroughtout = async (item) => {
    const updatedValue = !item.broughtout;

    try {
      const response = await fetch(`http://172.16.0.230:3000/order/checkpayment1/${item._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          broughtout: updatedValue,
        }),
      });
      if (response.ok) {
        // Cập nhật danh sách sau khi thay đổi thành công
        const updatedApiData = apiData.map((order) => {
          if (order._id === item._id) {
            return {
              ...order,
              broughtout: updatedValue,
            };
          }
          return order;
        });
        setApiData(updatedApiData);
      } else {
        console.error('Error changing broughtout:', response.status);
      }
    } catch (error) {
      console.error('Error changing broughtout:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Coffee Table Manager</Text>
      <FlatList
        data={apiData}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.item,
              { backgroundColor: item.broughtout ? 'white' : 'green' },
            ]}
            onPress={() => chooseImage(item)}
          >
            <Image source={{ uri: item.img }} style={styles.itemImage} />
            <Text style={styles.itemText}>{item.tablenumber}</Text>
            <TouchableOpacity
              onPress={() => changeBroughtout(item)}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Brought drinks</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f0f0f0',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: 'white',
    marginBottom: 8,
    borderRadius: 8,
  },
  itemText: {
    fontSize: 16,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  button: {
    backgroundColor: 'black',
    padding: 8,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Home;

