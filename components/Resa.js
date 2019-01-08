import React, {Component} from 'react';
import {StyleSheet, Text, View, TextInput, AsyncStorage, Image} from 'react-native';
import DatePicker from 'react-native-datepicker';


export default class Resa extends Component {
    constructor(props) {
        super(props);
        this.state = { namn: 'Resa' };
        this.state = { från: '' };
        this.state = { till: '' };
        this.state = {date:""};
      }
  render() {
    return (
      <View style = {styles.container}>
        
        <View style = {styles.header}>
            <Text style={styles.headerText}>{this.state.namn}</Text>
        </View>

        <View style={{flexDirection: 'row', marginBottom: 10,}}>
            <Text style={styles.preInput}>Namn:</Text>
            <TextInput 
                style={styles.textInput} 
                placeholder=''
                onChangeText={(namn) => this.setState({namn})}
                value={this.state.namn}
                placeholderTextColor='white' 
                underlineColorAndroid='transparent'>
            </TextInput>
        </View>

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
            <DatePicker
                style={styles.datePicker}
                date={this.state.date}
                mode="datetime"
                placeholder="Välj ankomstid"
                format="YYYY-MM-DD      HH:mm"
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                customStyles={{
                dateIcon: {
                    width: 0,
                }, 
                dateText: {
                    color: '#FFFFFF',      
                },
                dateInput:{
                    borderWidth: 0,
                },
                placeholderText: {
                    color: '#FFFFFF',   
                }
                // ... You can check the source to find the other keys.
                }}
                onDateChange={(date) => {this.setState({date: date})}}
            />
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
            
        

      </View>
    );
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
    input: {
        
    },
    preInput: {
        color: '#FFFFFF',
        padding: 10,
        marginLeft: 10,
        flex: 0.18,
        fontSize: 14,
    },
    textInput: {
        padding: 10,
        color: '#FFFFFF',
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        flex: 0.70,
        fontSize: 14,
        height: 40,
    },
    datePicker:{
        flex: 0.7,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        paddingLeft: 10, 
        paddingRight: 10,
        height: 40,
    },
    icon: {
        height: 90,
        width: 90,
        marginLeft: 10,
        marginRight: 10,
    },
    altContainer: {
        borderColor: '#FFFFFF',  
        borderWidth: 4, 
        padding: 20, 
        paddingBottom: 30,
        margin: 40, 
        marginTop: 20,
    },
    when: {
        color: '#FFFFFF', 
        fontSize: 18, 
        marginBottom: 5, 
        textAlign: 'center',
    },
    preAlt: {
        color: '#FFFFFF',
        fontSize: 16,
        marginTop: 5,
        marginLeft: 15,
    },
});