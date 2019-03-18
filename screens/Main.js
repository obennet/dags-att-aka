import React, { Component } from 'react';
import { StyleSheet, Alert, Text, View, AsyncStorage, Image, TouchableNativeFeedback } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import moment from "moment";
import 'moment/locale/sv';
import PushController from '../components/PushController';
import PushNotification from 'react-native-push-notification';



export default class Main extends Component {
  constructor(props) {
    super(props);
    this.check = this.check.bind(this);
    this.state = {
      mode: '',
      dateMinus: '',
      pointCoords: [],
    }
  }


  check() {
    AsyncStorage.getItem('duration').then((duration) => {
      this.setState({ duration: duration, })
    })
    AsyncStorage.getItem('destination').then((destination) => {
      this.setState({ destination: destination, })
    })
    AsyncStorage.getItem('mode').then((mode) => {
      this.setState({ mode: mode, })
    })
    AsyncStorage.getItem('selectedItem').then((selectedItem) => {
      this.setState({ selectedItem: selectedItem, })
    })
    AsyncStorage.getItem('date').then((date) => {
      this.setState({ date: date, })
    })
    AsyncStorage.getItem('durationvalue').then((durationvalue) => {
      this.setState({ durationvalue: durationvalue, })
    })
    AsyncStorage.getItem('pointCoords').then((pointCoords) => {
      this.setState({ pointCoords: JSON.parse(pointCoords), })
    })
  }

  componentWillMount() {
    this.check()
  }


  componentWillReceiveProps() {
    this.check()
  }


  visaKarta() {
    if (this.state.pointCoords != null) {
      this.props.navigation.navigate('Map', {
        pointCoords: this.state.pointCoords,
      })
    }
    else {
      Alert.alert("Lägg till destination", "Lägg till destination först genom att klicka på ändra")
    }
  }
  notis() {
    const { navigation } = this.props;
    pointCoords = navigation.getParam('pointCoords', []);
    date = navigation.getParam('date', 'NO-ID');
    durationvalue = navigation.getParam('durationvalue', 'NO-ID');
    selectedItem = navigation.getParam('selectedItem', 'NO-ID');

    const durationmargin = (durationvalue + (selectedItem) * 60);

    const dateminus = moment(date, "YYYY-MM-DD HH:mm").subtract(durationmargin, 'seconds').format('YYYY-MM-DD HH:mm');
    var created = moment(dateminus, "YYYY-MM-DD HH:mm");
    var now = new Date;
    var dur = moment.duration({ from: now, to: created });

    console.log(new Date(Date.now() + (dur.asSeconds()) * 1000));
    console.log(dur.asSeconds());
    if (dur.asSeconds() > 1) {
      PushNotification.localNotificationSchedule({
        title: "Dags att åka",
        message: "Nu är det dags att åka",
        color: "blue",
        date: new Date(Date.now() + (dur.asSeconds()) * 1000)
      });
      Alert.alert("Notis tillagd", "Du kommmer få en notis när det är dags att åka")
    }
  }

  render() {
    const durationmargin = (Number.parseInt(this.state.durationvalue) + (this.state.selectedItem) * 60);

    const dateminus = moment(this.state.date, "YYYY-MM-DD HH:mm").subtract(durationmargin, 'seconds').format('YYYY-MM-DD HH:mm');
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
    if (this.state.mode == null) {
      modeBild = (
        <Image source={require('../bilder/no-id.png')} style={styles.icon} />
      );
    }

    moment.relativeTimeThreshold('m', 59);

    if (this.state.destination == null) {
      this.setState({ destination: "Ingen destination" })
    }
    if (this.state.duration == null) {
      this.setState({ duration: "Inte angiven" })
    }
    if (this.state.selectedItem == null) {
      this.setState({ selectedItem: "0" })
    }

    return (

      <LinearGradient colors={['#0575E6', '#021B79']}
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
        <Text style={styles.destination}>Ankomst:  {moment(this.state.date).format('DD MMMM YYYY  HH:mm')}</Text>
        <Text style={styles.destination}>Avfärd:  {moment(dateminus).format('DD MMMM YYYY  HH:mm')}</Text>
        <Text style={styles.destination}>Färdtid:  {this.state.duration}</Text>
        <Text style={styles.destination}>Tidsmarginal:  {this.state.selectedItem} min</Text>


        <TouchableNativeFeedback
          onPress={() => this.visaKarta()}
          background={TouchableNativeFeedback.SelectableBackground()}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>Visa karta</Text>
          </View>
        </TouchableNativeFeedback>
        <TouchableNativeFeedback
          onPress={() => this.notis()}
          background={TouchableNativeFeedback.SelectableBackground()}>
          <View style={styles.button}>
            <Text style={styles.buttonText2}>Lägg till notis</Text>
          </View>
        </TouchableNativeFeedback>
        <PushController />
      </LinearGradient>
    );
  }
  componentDidMount() {
    setInterval(() => this.setState({ time: Date.now() }), 10000);
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
    marginTop: 20,
  },
  buttonText2: {
    fontSize: 25,
    color: 'white',
    textAlign: 'center',
    margin: 10,
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
    margin: 4,
  },

});