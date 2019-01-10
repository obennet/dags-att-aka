import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Resa from './screens/Resa';
import LinearGradient from 'react-native-linear-gradient';


export default class App extends Component {

  render() {
    return (
      <LinearGradient colors={['#136A8A','#85418D']} start={{x: 0.0, y: 0.25}}style={{flex: 1,}} >
        <Resa />
      </LinearGradient>  
    );
  }
 
}


const styles = StyleSheet.create({

});