import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';

export default function Backups() {
  const [reviews, setReviews] = useState([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch('http://192.168.1.12:3003/comments'); // Replace with your API endpoint
        const data = await response.json();
        setReviews(data);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchReviews();
  }, [newComment]);

  const positiveReviews = reviews.filter((review) => review.sentiment === 'positive');

  const submitNewReview = async () => {
    try {
      const response = await fetch('http://192.168.1.12:3003/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ comment: newComment, sentiment: 'positive' }),
      });

      const data = await response.json();
      setReviews([...reviews, data]);
      setNewComment('');
      if (data.sentiment === 'negative') {
        Alert.alert('Violation', 'Comment violates community guidelines');
      } else {
        Alert.alert('Success', 'Positive review added successfully');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.sectionTitle}>Positive Reviews</Text>
      {positiveReviews.map((review, index) => (
        <View key={index} style={styles.reviewItem}>
          <Text style={styles.commentText}>{review.comment}</Text>
        </View>
      ))}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Write your positive review..."
          multiline
          value={newComment}
          onChangeText={(text) => setNewComment(text)}
        />
        <TouchableOpacity style={styles.submitButton} onPress={submitNewReview}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  reviewItem: {
    marginBottom: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    width: '100%',
  },
  commentText: {
    fontSize: 16,
    color: '#333',
  },
  inputContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  input: {
    flex: 1,
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  submitButton: {
    backgroundColor: '#4caf50',
    padding: 10,
    borderRadius: 8,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
