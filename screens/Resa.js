import React, {Component} from 'react';
import {StyleSheet, Text, View, TextInput, AsyncStorage, Image, TouchableNativeFeedback} from 'react-native';
import DateTimePicker from '../components/DateTimePicker';
import InputComp from '../components/InputComp';


export default class Resa extends Component {
    constructor(props) {
        super(props);
        this.state = { name: '',från: '',till: ''}

      }
  render() {
    return (
      <View style = {styles.container}>
        
        <View style = {styles.header}>
            <Text style={styles.headerText}>{this.state.name}</Text>
        </View>

        <InputComp />

        <View style={{flexDirection: 'row', marginBottom: 10,}}>
            <Text style={styles.preInput}>Från:</Text>
            <TextInput 
                style={styles.textInput} 
                placeholder='' 
                onChangeText={(från) => this.setState({från})}
                value={this.state.från}
                placeholderTextColor='white' 
                underlineColorAndroid='transparent'>
            </TextInput>
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
        onPress={this.saveName}
        background={TouchableNativeFeedback.SelectableBackground()}>
            <View style={styles.button}>
                <Text style={styles.buttonText}>Lägg till</Text>
            </View>
        </TouchableNativeFeedback>
        <TouchableNativeFeedback
        onPress={this.showName}
        background={TouchableNativeFeedback.SelectableBackground()}>
            <View style={styles.button}>
                <Text style={styles.buttonText}>Visa</Text>
            </View>
        </TouchableNativeFeedback>
                

      </View>
    );
    
  }
  saveName=()=> {
    const {name} = this.state;

    AsyncStorage.setItem('name', name);

    }
    showName = async() =>{
        this.state.name = await AsyncStorage.getItem('name');
        alert(this.state.name);
    }
    
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