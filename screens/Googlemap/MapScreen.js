// MapScreen.js
import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { GOOGLE_MAPS_API_KEY } from './secrets';

class MapScreen extends Component {
  render() {
    const origin = { latitude: 10.7769, longitude: 106.7009 }; // Saigon
    const destination = { latitude: 10.1234, longitude: 106.5678 }; // Replace with the actual destination coordinates


    return (
      <View style={styles.container}>
        <MapView
          style={styles.map}
          provider={MapView.PROVIDER_GOOGLE}
          customMapStyle={[]}
          mapType="standard"
          showsUserLocation={true}
          initialRegion={{
            latitude: 10.7769,
            longitude: 106.7009,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          {/* Add markers for origin and destination */}
          <Marker coordinate={origin} title="Origin" description="Starting Point" />
          <Marker coordinate={destination} title="Destination" description="Ending Point" />

          {/* Add directions */}
          <MapViewDirections
          origin={origin}
          destination={destination}
          apikey={GOOGLE_MAPS_API_KEY}
          strokeWidth={3}
          strokeColor="hotpink"
        />
        </MapView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});

export default MapScreen;
