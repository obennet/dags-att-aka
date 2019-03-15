import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import Resa from './screens/Resa';
import Map from './screens/Map';
import Main from './screens/Main';
import { createStackNavigator, createAppContainer } from 'react-navigation';

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



});