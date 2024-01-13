import { View, StyleSheet } from 'react-native'
import React from 'react'
import Chat from '../../Chat/Chatfile';

export default function Categories() {
  return (
     <View style={styles.container}>
      <Chat userType="duc2"></Chat>
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20, 
    backgroundColor: '#F4F6F8', 
  },
});
