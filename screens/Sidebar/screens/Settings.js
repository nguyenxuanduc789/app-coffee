import React from 'react';
import { View, StyleSheet } from 'react-native';
import Chat from '../../Chat/Chatfile';

export default function Settings() {
  return (
    <View style={styles.container}>
      <Chat userType="duc"  />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20, 
    backgroundColor: '#F4F6F8', 
  },
});
