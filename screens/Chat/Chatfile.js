import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import { collection, addDoc, onSnapshot } from 'firebase/firestore';
import { firestore } from './Firebase';
import { AntDesign } from '@expo/vector-icons'; 
const Chat = ({ userType }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const messagesCollection = collection(firestore, 'messages');

  useEffect(() => {
    const unsubscribe = onSnapshot(messagesCollection, (snapshot) => {
      const newMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Sort messages based on timestamp in ascending order
      const sortedMessages = newMessages.sort((a, b) => a.timestamp - b.timestamp);
      
      // Reverse the order to ensure new messages are at the bottom
      setMessages(sortedMessages.reverse());
    });

    return () => unsubscribe();
  }, []);

  const sendMessage = async () => {
    if (newMessage.trim() === '') return;

    try {
      await addDoc(messagesCollection, {
        text: newMessage,
        sender: userType,
        timestamp: new Date().getTime(), // Use the current timestamp
      });
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const renderMessage = ({ item }) => (
    <View style={[styles.messageContainer, item.sender === userType ? styles.userMessage : styles.otherMessage]}>
      <Text style={styles.messageText}>{item.text}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        inverted
        contentContainerStyle={styles.flatListContentContainer}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={(text) => setNewMessage(text)}
          placeholder="Type your message..."
          placeholderTextColor="#8E8E93"
        />
        <AntDesign name="upcircle" size={24} color="black"  onPress={sendMessage} />
        {/* <Button title="Send" onPress={sendMessage} color="#007BFF" /> */}
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#ECE5DD', // Light background color
  },
  flatListContentContainer: {
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  messageContainer: {
    maxWidth: '80%',
    marginBottom: 8,
    padding: 12,
    borderRadius: 12,
    alignSelf: 'flex-start', // Default alignment for other users' messages
  },
  userMessage: {
    alignSelf: 'flex-end', // Align sender's messages to the right
    backgroundColor: '#0084FF', // Facebook Messenger blue
  },
  otherMessage: {
    backgroundColor: '#F3F3F3', // Light gray for received messages
  },
  messageText: {
    color: 'black',
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: '#8E8E93',
    borderWidth: 1,
    borderRadius: 20,
    marginRight: 8,
    paddingLeft: 12,
    backgroundColor: '#FFFFFF',
  },
});

export default Chat;
