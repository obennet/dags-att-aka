import React, {Component} from 'react';
import {StyleSheet, Text, View, TextInput, AsyncStorage, Image, TouchableNativeFeedback, TouchableHighlight, Keyboard} from 'react-native';
import DateTimePicker from '../components/DateTimePicker';
import LinearGradient from 'react-native-linear-gradient';
import MapView from 'react-native-maps';


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
        pointCoords: []}

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
            }&destination=place_id:${destinationPlaceId}&key=AIzaSyDnKUjuiM5vwA9Fsg5syGWlmCuqzo9kU4o`
          );
          const json = await response.json();
          console.log(json);
          this.setState({
            predictions: [],
            destination: destinationName,
            routePoint: json,
          });
          Keyboard.dismiss();
        } catch (error) {
          console.error(error);
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
    return (
        <LinearGradient colors={['#136A8A','#85418D']} start={{x: 0.0, y: 0.25}}style={{flex: 1,}} >
        
        {/* <View style = {styles.header}>
            <Text style={styles.headerText}>{this.state.name}</Text>
        </View> */}

        <View style={{flexDirection: 'row', marginBottom: 10, marginTop: 10,}}>
        <Text style={styles.preInput}>Namn:</Text>
            <TextInput 
                style={styles.textInput} 
                placeholder='Titel'
                onChangeText={(name) => this.setState({name})}
                placeholderTextColor='white' 
                underlineColorAndroid='transparent'>
            </TextInput>
        </View>

        <View style={{ marginBottom: 10,}}>
            <TextInput placeholder="Enter destination..." 
                value = {this.state.destination} 
                style = {styles.destinationInput}
                onChangeText={destination => this.onChangeDestination(destination)}
            />
            {predictions}
        </View>

        <View style={{flexDirection: 'row', marginBottom: 10,}}>
            <Text style={styles.preInput}>Till:</Text>
            <TextInput 
                style={styles.textInput} 
                placeholder='' 
                onChangeText={(till) => this.setState({till})}
                value={this.state.till}
                placeholderTextColor='white' 
                underlineColorAndroid='transparent'>
            </TextInput>
        </View>

        <View style={{flexDirection: 'row', marginBottom: 10,}}>
            <Text style={styles.preInput}>Ankomst:</Text>
            <DateTimePicker />
            
            
        </View>      
        <View style={{justifyContent: 'center', flexDirection: 'row', marginTop: 10,}}>
            <Image source={require('../bilder/walkicon.png')} style={styles.icon}/>
            <Image source={require('../bilder/bikeicon.png')} style={styles.icon}/>
            <Image source={require('../bilder/caricon.png')} style={styles.icon}/>
        </View>
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
        <TouchableNativeFeedback
        onPress={() =>  this.props.navigation.navigate('Home', {
            routePoint: this.state.routePoint,
        })} 
        background={TouchableNativeFeedback.SelectableBackground()}>
            <View style={styles.button}>
                <Text style={styles.buttonText}>Lägg till</Text>
            </View>
        </TouchableNativeFeedback>

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
    header: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 56,
        marginBottom: 10,
    },
    headerText: {
        color: 'white',
        fontSize: 18,
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
    button:{
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
    }
});