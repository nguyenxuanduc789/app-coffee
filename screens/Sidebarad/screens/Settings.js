import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';

export default function Settings() {
  const [usernameshop, setUsernameshop] = useState('');
  const [productName, setProductName] = useState('');
  const [productSize, setProductSize] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productIncluded, setProductIncluded] = useState('');

  const clearInputFields = () => {
    setUsernameshop('');
    setProductName('');
    setProductSize('');
    setProductPrice('');
    setProductDescription('');
    setProductIncluded('');
  };

  const addProduct = async () => {
    const apiUrl = 'http://172.16.0.230:3000/coffeeshop/addproduct';

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          usernameshop,
          product: {
            name: productName,
            prices: [{ size: productSize, price: parseFloat(productPrice) }],
            image: 'product_image_url', // Add the image URL
            description: productDescription,
            included: productIncluded,
          },
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Product added successfully:', data);
        // Show an alert for successful API call
        Alert.alert('Success', 'Product added successfully', [
          { text: 'OK', onPress: () => clearInputFields() },
        ]);
      } else {
        console.error('Failed to add product:', data);
        // Show an alert for unsuccessful API call
        Alert.alert('Error', 'Failed to add product');
      }
    } catch (error) {
      console.error('Error during fetch:', error);
      // Show an alert for fetch error
      Alert.alert('Error', 'Failed to connect to the server');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Product Price"
        value={productPrice}
        onChangeText={setProductPrice}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Username Shop"
        value={usernameshop}
        onChangeText={setUsernameshop}
      />
      <TextInput
        style={styles.input}
        placeholder="Product Name"
        value={productName}
        onChangeText={setProductName}
      />
      <TextInput
        style={styles.input}
        placeholder="Product Size"
        value={productSize}
        onChangeText={setProductSize}
      />
      <TextInput
        style={styles.input}
        placeholder="Product Description"
        value={productDescription}
        onChangeText={setProductDescription}
      />
      <TextInput
        style={styles.input}
        placeholder="Product Included"
        value={productIncluded}
        onChangeText={setProductIncluded}
      />
      <Button title="Add Product" onPress={addProduct} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginVertical: 8,
    padding: 10,
  },
});
