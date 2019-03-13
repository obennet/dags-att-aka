import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, AsyncStorage, Image, TouchableNativeFeedback, TouchableHighlight, Keyboard } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import moment from "moment";
import 'moment/locale/sv'


export default class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: '',
      dateMinus: '',
    }
  }

  check(){
    AsyncStorage.getItem('duration').then((duration) => {
      this.setState({duration: duration,})
    })
    AsyncStorage.getItem('destination').then((destination) => {
      this.setState({destination: destination,})
    })
    AsyncStorage.getItem('mode').then((mode) => {
      this.setState({mode: mode,})
    })
    AsyncStorage.getItem('ankomst').then((ankomst) => {
      this.setState({ankomst: ankomst,})
    })

  }

  componentWillMount(){
    this.check()
  }

  
  render() {
    const { navigation } = this.props;
    pointCoords = navigation.getParam('pointCoords', []);
    duration = navigation.getParam('duration', 'Inte angiven');
    durationvalue = navigation.getParam('durationvalue', 'NO-ID');
    destination = navigation.getParam('destination', 'Ingen destination');
    date = navigation.getParam('date', 'Ingen ankomsttid');
    mode = navigation.getParam('mode', 'NO-ID');  
    selectedItem = navigation.getParam('selectedItem', '0'); 


    const durationmargin = (durationvalue+(selectedItem)*60);
    
    const dateminus = moment(date, "YYYY-MM-DD HH:mm").subtract(durationmargin,'seconds').format('YYYY-MM-DD HH:mm');
    moment.updateLocale(moment.locale(), { invalidDate: "Inget angivet datum" })
    let modeBild = null;

    if (this.state.mode == "walking") {
      modeBild = (
        <Image source={require('../bilder/walkicon.png')} style={styles.icon} />
      );
    }
    if (this.state.mode == "bicycling") {
      modeBild = (
        <Image source={require('../bilder/bikeicon.png')} style={styles.icon} />
      );
    }
    if (this.state.mode == "driving") {
      modeBild = (
        <Image source={require('../bilder/caricon.png')} style={styles.icon} />
      );
    }
    if (this.state.mode == 'NO-ID') {
      modeBild = (
        <Image source={require('../bilder/no-id.png')} style={styles.icon} />
      );
    }

    moment.relativeTimeThreshold('m', 59);


    return (
      
      <LinearGradient colors={['#0575E6', '#021B79']}
        //start={{x: 0.0, y: 0.0}}
        style={{ flex: 1, }} >
        <TouchableNativeFeedback
          onPress={() => this.props.navigation.navigate('Resa')}
          background={TouchableNativeFeedback.SelectableBackground()}>
          <View style={styles.button}>
            <Text style={styles.edit}>ÄNDRA</Text>

          </View>
        </TouchableNativeFeedback>
        <Text style={styles.kvar}>Dags att åka</Text>
        <Text style={styles.duration}>{moment(dateminus, "YYYY-MM-DD h:mm").fromNow()}</Text>
        
        {modeBild}
        <Text style={styles.destination}>Till:  {this.state.destination}</Text>
        <Text style={styles.destination}>Ankomst:  {moment(date).format('DD MMMM YYYY  HH:mm')}</Text>
        <Text style={styles.destination}>Avfärd:  {moment(dateminus).format('DD MMMM YYYY  HH:mm')}</Text>
        <Text style={styles.destination}>Färdtid:  {this.state.duration}</Text>
        <Text style={styles.destination}>Tidsmarginal: {selectedItem} min</Text>
        <Text style={styles.destination}>Ankomst: {this.state.ankomst}</Text>


        <TouchableNativeFeedback
          onPress={() => this.props.navigation.navigate('Map', {
            pointCoords: pointCoords,
          })}
          background={TouchableNativeFeedback.SelectableBackground()}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>Visa karta</Text>
          </View>
        </TouchableNativeFeedback>
      </LinearGradient>
    );
  }
  componentDidMount() {
    setInterval(() => this.setState({ time: Date.now() }), 60000);
  }
  
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  buttonText: {
    fontSize: 25,
    color: 'white',
    textAlign: 'center',
    margin: 20,
  },
  edit: {
    color: 'white',
    fontSize: 15,
    marginRight: 20,
    alignSelf: 'flex-end',
    marginTop: 50,
  },
  duration: {
    color: 'white',
    fontSize: 35,
    textAlign: 'center',
    marginTop: 0,
  },
  kvar: {
    color: 'white',
    fontSize: 35,
    textAlign: 'center',
  },
  icon: {
    alignSelf: 'center',
    width: 110,
    height: 110,
    margin: 20,
  },
  destination: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    margin: 3,
  },

});