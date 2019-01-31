import React, {Component} from 'react';
import {StyleSheet, Text, View, TouchableNativeFeedback} from 'react-native';
import Resa from './screens/Resa';
import Main from './screens/Main';
import LinearGradient from 'react-native-linear-gradient';
import {createStackNavigator, createAppContainer} from 'react-navigation';

export default class App extends Component {
  render() {
    return (
      <AppContainer />
    );
  }
}


class Home extends Component {

  render() {
    return (
      <LinearGradient colors={['#136A8A','#85418D']} start={{x: 0.0, y: 0.25}}style={{flex: 1,}} >
        <TouchableNativeFeedback
        onPress={() => this.props.navigation.navigate('Resa')} 
        background={TouchableNativeFeedback.SelectableBackground()}>
            <View style={styles.button}>
                <Text style={styles.buttonText}>Lägg till resa</Text>
            </View>
        </TouchableNativeFeedback>
      </LinearGradient>  
    );
  }
}

const AppStackNavigator = createStackNavigator({
  Home: Home,
  Resa: Resa,
},
{
  defaultNavigationOptions: {
    headerTintColor: '#fff',
    title: 'DAGS ATT ÅKA', 
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

});