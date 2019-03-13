import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, Keyboard, TouchableOpacity } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import _ from 'lodash';
import PolyLine from '@mapbox/polyline';


export default class Main extends Component {

  constructor(props) {
    super(props);
    this.state = {
      error: "",
      latitude: 58.3648338,
      longitude: 12.2461717,
      destination: "",
      predictions: [],
      pointCoords: []
    };
  }

  componentDidMount() {
    //Get current location and set initial region to this
    navigator.geolocation.getCurrentPosition(
      position => {
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      error => console.error(error),
      { enableHighAccuracy: true, maximumAge: 2000, timeout: 20000 }
      
    );
  }


  async onChangeDestination(destination) {
    this.setState({ destination });
    const apiUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=AIzaSyDnKUjuiM5vwA9Fsg5syGWlmCuqzo9kU4o&input=${destination}&location=${this.state.latitude}, ${this.state.longitude}&radius=2000`;
    try {
      const result = await fetch(apiUrl);
      const json = await result.json();
      this.setState({
        predictions: json.predictions
      });
    } catch (err) {
      console.error(err);
    }
  }


  render() {
    const { navigation } = this.props;
    pointCoords = navigation.getParam('pointCoords', 'NO-ID');
    let marker = null;
    let zoom = null;

    if (pointCoords.length > 1) {
      marker = (
        <Marker
          coordinate={pointCoords[pointCoords.length - 1]}
        />
      );
      zoom = (<TouchableOpacity style={styles.zoom} onPress={() => { this.map.fitToCoordinates(pointCoords, {
        edgePadding: {top: 80, bottom: 40, left: 40, right: 40,}
      } ); }}>
        <Text style={{ fontSize: 15, color: 'black' }}>Visa hela sträckan</Text>
      </TouchableOpacity>);
    }

    return (
      <View style={styles.container}>
        
        <MapView
          ref={map => {
            this.map = map;
          }}
          style={styles.mapStyle}
          initialRegion={{
            latitude: this.state.latitude,
            longitude: this.state.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          showsUserLocation={true}
        >
        
          <Polyline
            coordinates={pointCoords}
            strokeWidth={4}
            strokeColor="red" />
          {marker}
        </MapView>
        <View style={styles.circle}></View>
        {zoom}

      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject
  },
  mapStyle: {
    ...StyleSheet.absoluteFillObject
  },
  circle: {
    width: 40,
    height: 40,
    margin: 8,
    borderRadius: 100/2,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
},
  destinationInput: {
    height: 40,
    marginTop: 60,
    marginLeft: 10,
    marginRight: 10,
    backgroundColor: 'white',
    borderWidth: 0.5,
  },
  suggestions: {
    backgroundColor: 'white',
    padding: 5,
    fontSize: 14,
    borderWidth: 0.5,
    marginRight: 10,
    marginLeft: 10,
  },
  zoom: {
    padding: 5,
    backgroundColor: 'white',
    position: 'absolute',
    margin: 10,
    marginTop: 60,
  }
});