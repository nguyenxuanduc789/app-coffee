import { View, Text } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';

export default function Contact() {
  const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      Alert.alert('Rate this App', 'Please rate our app!', [
        {
          text: 'Cancel',
          onPress: () => {
            navigation.navigate('Home'); // Navigate back to the home screen
          },
        },
        {
          text: 'OK',
          onPress: async () => {
            try {
              await AsyncStorage.clear(); // Clear all data in AsyncStorage
              // Handle the successful logout here
              // Navigate to the "Welcome" screen
              navigation.navigate('Welcome');
            } catch (error) {
              console.error('Error clearing data:', error);
            }
          },
        },
      ]);
    }, [navigation])
  );
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    </View>
  )
}