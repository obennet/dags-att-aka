import React, {Component} from 'react';
import {StyleSheet,} from 'react-native';
import DatePicker from 'react-native-datepicker';

export default class DateTimePicker extends Component {
    constructor(props) {
        super(props);
        this.state = { date: "" }
      }
  
      render() {
        return(
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

        );


}
}


const styles = StyleSheet.create({
datePicker:{
    flex: 0.6,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    paddingLeft: 10, 
    paddingRight: 10,
    height: 40,
},

});