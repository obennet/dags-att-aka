import React, {Component} from 'react';
import {StyleSheet, Text, View, TextInput, TouchableHighlight, Keyboard} from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import _ from 'lodash';
import PolyLine from '@mapbox/polyline';


export default class Main extends Component {

  constructor(props) {
    super(props);
    this.state = {
      error: "",
      latitude: 0,
      longitude: 0,
      destination: "",
      predictions: [],
      pointCoords: []
    };
    this.onChangeDestinationDebounced = _.debounce(
      this.onChangeDestination,
      1000
    );
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

  async getRouteDirections(destinationPlaceId, destinationName) {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${
          this.state.latitude
        },${
          this.state.longitude
        }&destination=place_id:${destinationPlaceId}&key=AIzaSyDnKUjuiM5vwA9Fsg5syGWlmCuqzo9kU4o`
      );
      const json = await response.json();
      console.log(json);
      const points = PolyLine.decode(json.routes[0].overview_polyline.points);
      const pointCoords = points.map(point => {
        return { latitude: point[0], longitude: point[1] };
      });
      this.setState({
        pointCoords,
        predictions: [],
        destination: destinationName
      });
      Keyboard.dismiss();
      this.map.fitToCoordinates(pointCoords);
    } catch (error) {
      console.error(error);
    }
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

    let marker = null;

    if (this.state.pointCoords.length > 1) {
      marker = (
        <Marker
          coordinate={this.state.pointCoords[this.state.pointCoords.length - 1]}
        />
      );
    }
    
    const predictions = this.state.predictions.map(prediction => (
      <TouchableHighlight 
      onPress={() => this.getRouteDirections(prediction.place_id, prediction.structured_formatting.main_text)} 
      key={prediction.id}>
        <View>
          <Text style={styles.suggestions}>{prediction.description}</Text>
        </View>
      </TouchableHighlight>
      ));
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
          coordinates={this.state.pointCoords}
          strokeWidth={4}
          strokeColor="red" />
          {marker}
        </MapView>
        
        <TextInput placeholder="Enter destination..." 
          value = {this.state.destination} 
          style = {styles.destinationInput}
          onChangeText={destination => {
            this.setState({ destination });
            this.onChangeDestinationDebounced(destination);}}/>
        {predictions}
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
  }
});