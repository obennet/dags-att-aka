import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, AsyncStorage, Image, TouchableNativeFeedback, TouchableOpacity, Keyboard, Alert } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import PolyLine from '@mapbox/polyline';
import DatePicker from 'react-native-datepicker';
import { WheelPicker } from 'react-native-wheel-picker-android';



export default class Resa extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: 'Titel',
      från: '',
      till: '',
      error: "",
      latitude: 58.3670717,
      longitude: 12.3297716,
      destination: "",
      predictions: [],
      pointCoords: [],
      duration: '',
      durationvalue: 0,
      date: "",
      mode: 'NO-ID',
      selectedItem: 0,
    }

    this.persistData = this.persistData.bind(this);
  }
  state = {
    selectedItem: 0,
  }

  onItemSelected = selectedItem => {
    this.setState({ selectedItem })
  }

  persistData() {
    let duration = this.state.duration
    let destination = this.state.destination
    let mode = this.state.mode
    let selectedItemInt = (Number.parseInt(this.state.selectedItem, 10)) * 5
    let selectedItem = JSON.stringify(selectedItemInt)
    let date = this.state.date
    let durationvalue = JSON.stringify(this.state.durationvalue)
    let pointCoords = JSON.stringify(this.state.pointCoords)

    AsyncStorage.setItem('duration', duration).done();
    AsyncStorage.setItem('destination', destination).done();
    AsyncStorage.setItem('mode', mode).done();
    AsyncStorage.setItem('selectedItem', selectedItem).done();
    AsyncStorage.setItem('date', date).done();
    AsyncStorage.setItem('durationvalue', durationvalue).done();
    AsyncStorage.setItem('pointCoords', pointCoords).done();


    if (this.state.destination == 0 || this.state.date == 0 || this.state.mode == "") {
      Alert.alert(
        "Fyll i allt", "Du måste fylla i alla fält innan du kan fortsätta",
      )

    }
    else {
      this.props.navigation.navigate('Main', {
        pointCoords: this.state.pointCoords,
        date: this.state.date,
        durationvalue: this.state.durationvalue,
        selectedItem: selectedItemInt,
      })
    }
  }
  componentDidMount() {
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
      const durationvalue = json.routes[0].legs[0].duration.value;
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
        durationvalue: durationvalue,
      });
      Keyboard.dismiss();
    } catch (error) {
      Alert.alert(
        "Ogiltig destination", "Du måste välja en destination som går att nå med antingen bil, cykel eller till fots",
      )
    }
  }


  render() {
    const wheelPickerData = ['0', '5', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55', '60'];
    const predictions = this.state.predictions.map(prediction => (
      <TouchableOpacity
        onPress={() => this.getRouteDirections(prediction.place_id, prediction.structured_formatting.main_text)}
        key={prediction.id}>
        <View>
          <Text style={styles.suggestions}>{prediction.description}</Text>
        </View>
      </TouchableOpacity>
    ));
    let input = null;
    let icon = null;
    let selectedItemInt = (Number.parseInt(this.state.selectedItem, 10)) * 5;

    if (this.state.mode == 'NO-ID') {
      icon = (
        <View>
          <Text style={{ color: 'white', fontSize: 30, textAlign: 'center', marginTop: 70, }}>Välj färdmedel</Text>
          <View style={{ justifyContent: 'center', flexDirection: 'row', marginTop: 10, }}>
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
        </View>
      );
    }
    if (this.state.mode == 'walking') {
      icon = (
        <View style={{ justifyContent: 'center', flexDirection: 'row', marginTop: 70, }}>
          <Image source={require('../bilder/walkicon.png')} style={styles.icon} />
        </View>
      );
    }
    if (this.state.mode == 'bicycling') {
      icon = (
        <View style={{ justifyContent: 'center', flexDirection: 'row', marginTop: 70, }}>
          <Image source={require('../bilder/bikeicon.png')} style={styles.icon} />
        </View>
      );
    }
    if (this.state.mode == 'driving') {
      icon = (
        <View style={{ justifyContent: 'center', flexDirection: 'row', marginTop: 70, }}>
          <Image source={require('../bilder/caricon.png')} style={styles.icon} />
        </View>
      );
    }

    if (this.state.mode != 'NO-ID') {

      input = (
        <View>
          <View style={{ marginBottom: 10, marginTop: 20, }}>
            <TextInput placeholder="Ange destination"
              placeholderTextColor='grey'
              value={this.state.destination}
              style={styles.destinationInput}
              onChangeText={destination => this.onChangeDestination(destination)}
            />
            {predictions}
          </View>

          <View style={{ flexDirection: 'row', marginBottom: 10, }}>
            <DatePicker
              style={styles.datePicker}
              date={this.state.date}
              mode="datetime"
              androidMode='spinner'
              placeholder="Välj ankomstid"
              format="YYYY-MM-DD HH:mm"
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              customStyles={{
                dateIcon: {
                  width: 0,
                },
                dateText: {
                  color: 'black',
                },
                dateInput: {
                  borderWidth: 0,
                },
                placeholderText: {
                  color: 'grey',
                }
              }}
              onDateChange={(date) => { this.setState({ date: date }) }}
            />
          </View>
          <View style={styles.wheelContainer}>
            <Text style={styles.marginal}>Välj tidsmarginal i minuter</Text>
            <WheelPicker
              selectedItem={this.state.selectedItem}
              indicatorColor='white'
              selectedItemTextColor='white'
              isCyclic={true}
              data={wheelPickerData}
              onItemSelected={this.onItemSelected} />
          </View>

          <TouchableOpacity
            onPress={this.persistData}
            background={TouchableNativeFeedback.SelectableBackground()}>
            <View style={styles.button}>
              <Text style={styles.buttonText}>Lägg till</Text>
            </View>
          </TouchableOpacity>
        </View>
      );
    }


    return (
      <LinearGradient colors={['#0575E6', '#021B79']} start={{ x: 0.0, y: 0.25 }} style={{ flex: 1, }} >
        {icon}
        {input}
      </LinearGradient>
    );

  }
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
    textAlign: 'center'
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
    margin: 20,
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
    marginTop: 40,
  },
  buttonText: {
    color: '#FFFFFF',
    margin: 10,
    fontSize: 16,
  },
  datePicker: {
    backgroundColor: 'white',
    paddingLeft: 10,
    paddingRight: 10,
    height: 40,
    flex: 1,
    marginLeft: 20,
    marginRight: 20,
  },
  wheelContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  marginal: {
    color: 'white',
    fontSize: 16,
    marginBottom: 20,
  }

});