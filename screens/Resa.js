import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, AsyncStorage, Image, TouchableNativeFeedback, TouchableHighlight, TouchableOpacity, Keyboard, Alert } from 'react-native';
import DateTimePicker from '../components/DateTimePicker';
import LinearGradient from 'react-native-linear-gradient';
import MapView, { Polyline } from 'react-native-maps';
import PolyLine from '@mapbox/polyline';
import DatePicker from 'react-native-datepicker';


export default class Resa extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: 'Titel',
      från: '',
      till: '',
      error: "",
      latitude: 0,
      longitude: 0,
      destination: "",
      predictions: [],
      pointCoords: [],
      duration: 0,
      date: "",
      mode: 'NO-ID',
    }

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
  //KOLLA HÄR SEN BITCH ASS NÄR DU SKA FIXA FRÅN
  async onChangeDestination(destination) {
    this.setState({ destination });
    const apiUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=AIzaSyDnKUjuiM5vwA9Fsg5syGWlmCuqzo9kU4o&input=${destination}&location=${this.state.latitude}, ${this.state.longitude}&radius=2000`;
    try {
      const result = await fetch(apiUrl);
      const json = await result.json();
      console.log(json);
      this.setState({
        predictions: json.predictions

      });
    } catch (err) {
      console.error(err);
    }
  }
  async getRouteDirections(destinationPlaceId, destinationName) {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${
        this.state.latitude
        },${
        this.state.longitude
        }&destination=place_id:${destinationPlaceId}&key=AIzaSyDnKUjuiM5vwA9Fsg5syGWlmCuqzo9kU4o&mode=${this.state.mode}&language=sv`
      );
      const json = await response.json();
      const duration = json.routes[0].legs[0].duration.text;
      console.log(json.routes[0]);
      const points = PolyLine.decode(json.routes[0].overview_polyline.points);
      const pointCoords = points.map(point => {
        return { latitude: point[0], longitude: point[1] };
      });
      this.setState({
        predictions: [],
        destination: destinationName,
        routePoint: json,
        pointCoords: pointCoords,
        duration: duration,
      });
      Keyboard.dismiss();
    } catch (error) {
      console.error(error);
    }
  }
  addClick = () => {
    //if (this.state.destination == 0 || this.state.date == 0 || this.state.mode == "") {
    if (1 == 2) {
      Alert.alert(
        "Fyll i allt", "Du måste fylla i alla fält innan du kan fortsätta",
      )
    }
    else {
      this.props.navigation.navigate('Main', {
        pointCoords: this.state.pointCoords,
        duration: this.state.duration,
        destination: this.state.destination,
        date: this.state.date,
        mode: this.state.mode,
      })
    }
  }

  render() {
    const predictions = this.state.predictions.map(prediction => (
      <TouchableHighlight
        onPress={() => this.getRouteDirections(prediction.place_id, prediction.structured_formatting.main_text)}
        key={prediction.id}>
        <View>
          <Text style={styles.suggestions}>{prediction.description}</Text>
        </View>
      </TouchableHighlight>
    ));
      let input = null;
      let icon = null;

      if (this.state.mode == 'NO-ID') {
        icon = (
          <View style={{ justifyContent: 'center', flexDirection: 'row', marginTop: 70, }}>
            <TouchableOpacity onPress={() => this.setState({ mode: 'walking' })}>
              <Image source={require('../bilder/walkicon.png')} style={styles.icon} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.setState({ mode: 'bicycling' })}>
              <Image source={require('../bilder/bikeicon.png')} style={styles.icon} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.setState({ mode: 'driving' })}>
              <Image source={require('../bilder/caricon.png')} style={styles.icon} />
            </TouchableOpacity>
          </View>
          );
      }
      if (this.state.mode == 'walking') {
        icon = (
          <View style={{ justifyContent: 'center', flexDirection: 'row', marginTop: 70, }}>
            <TouchableOpacity onPress={() => this.setState({ mode: 'walking' })}>
              <Image source={require('../bilder/walkicon.png')} style={styles.icon} />
            </TouchableOpacity> 
          </View>
          );
      }
      if (this.state.mode == 'bicycling') {
        icon = (
          <View style={{ justifyContent: 'center', flexDirection: 'row', marginTop: 70, }}>
            <TouchableOpacity onPress={() => this.setState({ mode: 'bicycling' })}>
              <Image source={require('../bilder/bikeicon.png')} style={styles.icon} />
            </TouchableOpacity>
          </View>
          );
      }
      if (this.state.mode == 'driving') {
        icon = (
          <View style={{ justifyContent: 'center', flexDirection: 'row', marginTop: 70, }}>
            <TouchableOpacity onPress={() => this.setState({ mode: 'driving' })}>
              <Image source={require('../bilder/caricon.png')} style={styles.icon} />
            </TouchableOpacity>
          </View>
          );
      }
    
      if (this.state.mode != 'NO-ID') {
      
      input = (
        <View>
        <View style={{ flexDirection: 'row', marginBottom: 10, marginTop: 20, }}>
          <Text style={styles.preInput}>Från:</Text>
          <TextInput
            style={styles.textInput}
            placeholder='Nuvarande position'
            onChangeText={(från) => this.setState({ från })}
            value={this.state.från}
            placeholderTextColor='white'
            underlineColorAndroid='transparent'>
          </TextInput>
        </View>
        <View style={{ marginBottom: 10, }}>
          <TextInput placeholder="Enter destination..."
            value={this.state.destination}
            style={styles.destinationInput}
            onChangeText={destination => this.onChangeDestination(destination)}
          />
          {predictions}
        </View>

        <View style={{ flexDirection: 'row', marginBottom: 10, }}>
          <Text style={styles.preInput}>Ankomst:</Text>
          <DatePicker
            style={styles.datePicker}
            date={this.state.date}
            mode="datetime"
            placeholder="Välj ankomstid"
            format="YYYY-MM-DD HH:mm"
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            customStyles={{
              dateIcon: {
                width: 0,
              },
              dateText: {
                color: '#FFFFFF',
              },
              dateInput: {
                borderWidth: 0,
              },
              placeholderText: {
                color: '#FFFFFF',
              }
              // ... You can check the source to find the other keys.
            }}
            onDateChange={(date) => { this.setState({ date: date }) }}
          />



        </View>
        </View>
      );
    }
  

    return (
      <LinearGradient colors={['#0575E6', '#021B79']} start={{ x: 0.0, y: 0.25 }} style={{ flex: 1, }} >
        {icon}
        {input}
        

        <View style={styles.altContainer}>
          <Text style={styles.when}>
            När vill du åka?
            </Text>
          <Text style={styles.preAlt}>
            God tid:
            </Text>
          <Text style={styles.preAlt}>
            Rekommenderat:
            </Text>
          <Text style={styles.preAlt}>
            Kritiskt:
            </Text>
        </View>
        <TouchableOpacity
          onPress={this.addClick}
          background={TouchableNativeFeedback.SelectableBackground()}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>Lägg till</Text>
          </View>
        </TouchableOpacity>

      </LinearGradient>
    );

  }
  //   saveName=()=> {
  //     const {newName} = this.state;

  //     AsyncStorage.setItem('name', newName);

  //     }
  //     showName = async() =>{
  //        this.state.newName = await AsyncStorage.getItem('name');
  //        alert(this.state.newName);

  //     }


}



const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  preInput: {
    color: '#FFFFFF',
    paddingTop: 10,
    textAlign: 'center',
    flex: 0.25,
    marginLeft: 20,
    fontSize: 14,
  },
  textInput: {
    padding: 10,
    color: '#FFFFFF',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    flex: 0.60,
    fontSize: 14,
    height: 40,
  },
  destinationInput: {
    height: 40,
    backgroundColor: 'white',
    marginLeft: 20,
    marginRight: 20,
  },
  suggestions: {
    backgroundColor: 'white',
    padding: 5,
    fontSize: 14,
    borderWidth: 0.5,
    marginRight: 20,
    marginLeft: 20,
  },
  icon: {
    height: 80,
    width: 80,
    marginLeft: 10,
    marginRight: 10,
  },
  altContainer: {
    padding: 20,
    paddingBottom: 30,
    margin: 60,
    marginTop: 20,
    marginBottom: 40,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  when: {
    color: '#FFFFFF',
    fontSize: 18,
    marginBottom: 5,
    textAlign: 'center',
  },
  preAlt: {
    color: '#FFFFFF',
    fontSize: 14,
    marginTop: 5,
    marginLeft: 15,
  },
  button: {
    width: 150,
    borderColor: '#FFFFFF',
    borderWidth: 3,
    borderRadius: 100,
    alignItems: 'center',
    alignSelf: 'center',

  },
  buttonText: {
    color: '#FFFFFF',
    margin: 10,
    fontSize: 16,
  },
  datePicker: {
    flex: 0.6,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    paddingLeft: 10,
    paddingRight: 10,
    height: 40,
  },

});