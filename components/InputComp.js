import React, {Component} from 'react';
import {StyleSheet, View, Text, TextInput} from 'react-native';


export default class InputComp extends Component {
    constructor(props) {
        super(props);
        this.state = { name: '' }
      }
  
      render() {
        return(
        <View style={{flexDirection: 'row', marginBottom: 10,}}>
        <Text style={styles.preInput}>Namn:</Text>
            <TextInput 
                style={styles.textInput} 
                placeholder=''
                onChangeText={(name) => this.setState({name})}
                placeholderTextColor='white' 
                underlineColorAndroid='transparent'>
            </TextInput>
        </View>
        );
        }
}


const styles = StyleSheet.create({
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
});