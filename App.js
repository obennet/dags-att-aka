import React, {Component} from 'react';
import {StyleSheet, Text, View, TouchableNativeFeedback} from 'react-native';
import Resa from './screens/Resa';
import Map from './screens/Map';
import LinearGradient from 'react-native-linear-gradient';
import {createStackNavigator, createAppContainer} from 'react-navigation';
import MapView, { Marker } from 'react-native-maps';



export default class App extends Component {


  render() {
    
    return (
      <AppContainer />
     

    );
  }
}


class Home extends Component {

  render() {
    const { navigation } = this.props;
    routePoint = navigation.getParam('routePoint', 'NO-ID');
    return (
      <LinearGradient colors={['#136A8A','#85418D']} start={{x: 0.0, y: 0.25}}style={{flex: 1,}} >
        <TouchableNativeFeedback
        onPress={() => this.props.navigation.navigate('Resa')} 
        background={TouchableNativeFeedback.SelectableBackground()}>
            <View style={styles.button}>
                <Text style={styles.buttonText}>Lägg till resa</Text>
            </View>
        </TouchableNativeFeedback>
        <TouchableNativeFeedback
        onPress={() => this.props.navigation.navigate('Map', {
          routePoint: this.state.routePoint,})}
        background={TouchableNativeFeedback.SelectableBackground()}>
            <View style={styles.button}>
                <Text style={styles.buttonText}>Visa karta</Text>
            </View>
        </TouchableNativeFeedback>
        
      </LinearGradient>  
    );
  }
}

const AppStackNavigator = createStackNavigator({
  Home: Home,
  Resa: Resa,
  Map: Map,
},
{
  defaultNavigationOptions: {
    headerTintColor: '#fff',
    title: '', 
    headerTitleStyle: {
      textAlign: 'center',
      flexGrow: 1,
    },
    headerStyle: {
      backgroundColor: '#136A8A', 
      elevation: 0,
    },
    
  }
}

);

const AppContainer = createAppContainer(AppStackNavigator); 

const styles = StyleSheet.create({

  buttonText: {
    fontSize: 30,
    color: 'white',
    textAlign: 'center',
    margin: 20,
  }

});