import React, {Component} from 'react';
import {StyleSheet, Text, View, TouchableNativeFeedback} from 'react-native';
import Resa from './screens/Resa';
import Map from './screens/Map';
import Main from './screens/Main';
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




const AppStackNavigator = createStackNavigator({
  Main: Main,
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
      elevation: 0,
      backgroundColor: 'transparent',
            shadowColor: 'transparent',
            elevation: 0,
    },
    headerTransparent: true,
        headerTintColor: '#fff',
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