import React, {Component} from 'react';
import {StyleSheet, Text, View, TextInput} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import _ from 'lodash';


export default class Main extends Component {

  constructor(props) {
    super(props);
    this.state = {
      latitude: 0,
      longitude: 0,
      error: "",
      destination: "",
      predictions: []
    };
    this.onChangeDestinationDebounced = _.debounce(this.onChangeDestination, 1000);
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(position => {
      this.setState({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        error: null
      });     
    }, 
    error => this.setState({error: error.message}),
    { enableHighAccuracy: true, timeout: 20000, maximumAge: 2000 }
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

    const predictions = this.state.predictions.map(prediction => (
    <Text style={styles.suggestions} key={prediction.id}>{prediction.description}</Text>));

    return (
      <View style={styles.container}>
      <MapView
          style={styles.mapStyle}
          initialRegion={{
            latitude: this.state.latitude,
            longitude: this.state.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          showsUserLocation={true}
        >
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
    flex: 1,
  },
  mapStyle: {
    ...StyleSheet.absoluteFillObject
  },
  destinationInput: {
    height: 40,
    marginTop: 60,
    marginLeft: 5,
    marginRight: 5,
    backgroundColor: 'white',
    borderWidth: 1,
  },
  suggestions: {
    backgroundColor: 'white',
    padding: 5,
    fontSize: 14,
    borderWidth: 0.5,
    marginRight: 5,
    marginLeft: 5,
  }
});