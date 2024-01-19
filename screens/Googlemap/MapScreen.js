import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  Text,
  TextInput,
  Button,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import MapView, { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { GOOGLE_MAPS_API_KEY } from './secrets';
import * as Location from 'expo-location';
const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const MapScreen = () => {
  Location.setGoogleApiKey("AIzaSyB7Emz4-wL0gZTaXeqTb1tSSCBaMcwW6L8");
  const [region, setRegion] = useState({
    latitude: 10.7769,
    longitude: 106.7009,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  });

  const [distance, setDistance] = useState(null);
  const [coffeeShops, setCoffeeShops] = useState([
    { latitude: 10.7800, longitude: 106.7000 },
    { latitude: 10.7750, longitude: 106.7050 },
  ]);

  const [originAddress, setOriginAddress] = useState('');
  const [iconSize, setIconSize] = useState(Math.round(width * 0.06));

  const mapRef = useRef(null);
  const [location, setLocation] = useState();
  const [address, setAddress] = useState();
  useEffect(() => {
    const getPermissions = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log("Please grant location permissions");
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
      console.log("Location:");
      console.log(currentLocation);
    };
    getPermissions();
  }, []);

  const geocode = async () => {
    const geocodedLocation = await Location.geocodeAsync(address);
    console.log("Geocoded Address:");
    console.log(geocodedLocation);
  };

  const reverseGeocode = async () => {
    const reverseGeocodedAddress = await Location.reverseGeocodeAsync({
      longitude: location.coords.longitude,
      latitude: location.coords.latitude
    });

    console.log("Reverse Geocoded:");
    console.log(reverseGeocodedAddress);
  };


  useEffect(() => {
    calculateDistance();
  }, [coffeeShops, region]);

  const calculateDistance = () => {
    // Calculate distance logic
    // Update the state with the calculated distance
  };

  const onMapPress = (event) => {
    const newCoffeeShop = {
      latitude: event.nativeEvent.coordinate.latitude,
      longitude: event.nativeEvent.coordinate.longitude,
    };

    setCoffeeShops((prevShops) => [...prevShops, newCoffeeShop]);
  };

  const zoomIn = () => {
    const newRegion = {
      ...region,
      latitudeDelta: region.latitudeDelta / 2,
      longitudeDelta: region.longitudeDelta / 2,
    };
    mapRef.current.animateToRegion(newRegion, 200);
  };

  const zoomOut = () => {
    const newRegion = {
      ...region,
      latitudeDelta: region.latitudeDelta * 2,
      longitudeDelta: region.longitudeDelta * 2,
    };
    mapRef.current.animateToRegion(newRegion, 200);
  };

  const handleOriginChange = (newAddress) => {
    console.log('Received data:', newAddress);
    setOriginAddress(newAddress);
  };

  const handleGeocodeButtonPress = () => {
    if (originAddress) {
      geocodeAddressAndUpdateOrigin(originAddress);
    } else {
      console.error('Please enter an origin address');
      // Handle the case where no address is entered
    }
  };

  const geocodeAddressAndUpdateOrigin = async (address) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          address
        )}&key=${GOOGLE_MAPS_API_KEY}`
      );
      const data = await response.json();

      console.log('Geocoding API Response:', data);

      if (data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry.location;
        console.log('Geocoded Coordinates:', { latitude: lat, longitude: lng });
        setRegion({ latitude: lat, longitude: lng, latitudeDelta: LATITUDE_DELTA, longitudeDelta: LONGITUDE_DELTA });
        calculateDistance();
      } else {
        console.error('Geocoding API returned no results');
        // Handle geocoding failure
      }
    } catch (error) {
      console.error('Error during geocoding API request:', error);
      // Handle fetch error
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter origin address"
        value={originAddress}
        onChangeText={handleOriginChange}
      />
      <TouchableOpacity onPress={handleGeocodeButtonPress} style={styles.button}>
        <Text style={styles.buttonText}>Geocode Address</Text>
      </TouchableOpacity>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={MapView.PROVIDER_GOOGLE}
        customMapStyle={[]}
        mapType="standard"
        showsUserLocation={true}
        region={region}
        onPress={onMapPress}
      >
        <MapViewDirections
          origin={region}
          destination={coffeeShops.length > 0 ? coffeeShops[coffeeShops.length - 1] : null}
          apikey={GOOGLE_MAPS_API_KEY}
          strokeWidth={3}
          strokeColor="hotpink"
        />

        {coffeeShops.map((coffeeShop, index) => (
          <Marker
            key={index}
            coordinate={coffeeShop}
            title={`Coffee Shop ${index + 1}`}
            image={require('../../img/table1.png')}
            style={{ width: 5, height: 5 }}
          />
        ))}
      </MapView>

      <View style={styles.distanceContainer}>
        <Text style={styles.distanceText}>
          Distance: {distance ? `${distance.toFixed(2)} km` : ''}
        </Text>
      </View>

      {/* <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={zoomIn} style={styles.button}>
          <Text style={styles.buttonText}>Zoom In</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={zoomOut} style={styles.button}>
          <Text style={styles.buttonText}>Zoom Out</Text>
        </TouchableOpacity>
      </View> */}
    <TextInput placeholder='Address' value={address} onChangeText={setAddress} />
      <Button title="Geocode Address" onPress={geocode} />
      <Button title="Reverse Geocode Current Location" onPress={reverseGeocode} />
      <StatusBar style="auto" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  button: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  distanceContainer: {
    position: 'absolute',
    top: 95,
    left: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: 10,
    borderRadius: 5,
  },
  distanceText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    margin: 10,
    borderRadius: 5,
    padding: 10,
  },
});

export default MapScreen;
