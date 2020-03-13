import React, { Component } from 'react';
import { View, Text,TextInput } from 'react-native';
import { FormLabel, FormInput} from 'react-native-elements'
import css from '@styles/global';

class Input extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <View>
        <Text style={[{textAlign: 'left', color:'#666b73',fontSize:18, fontWeight:"bold", marginBottom:5,fontFamily: 'lato-bold',marginLeft:10}]}>{this.props.config.label}</Text>
        
         <FormInput
            underlineColorAndroid={'black'}
            onChangeText={(event) => {
              this.props.callBack(event,this.props.key1)
            }}
            autoCapitalize = 'none'
            placeholder={this.props.value}
         />
      </View>
    );
  }
}

export default Input;
