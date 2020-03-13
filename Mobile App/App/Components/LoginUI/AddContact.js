import React, { Component} from "react";
import { Text, View,ScrollView} from 'react-native';
import { FormInput } from 'react-native-elements'
import T from '@functions/translation';
import css from '@styles/global';
import ButtonUNI from '@uniappbuttons/AccentButton';
import Navbar from '@components/Navbar'


class AddContact extends Component {
  constructor(props) {
    super(props);
    this.state = {
        contactName:""
    };
    
  }


  render() {
    return (
        <View style={[css.layout.containerBackground,{flex:1}]}>
            <Navbar navigation={this.props.navigation} isRoot={true} />
            <ScrollView style={{backgroundColor:'white'}}>  
                  
                  <Text style={css.layout.subForgetPassTxt}>
                      {T.enterContactName}
                  </Text>
                  <View style={{marginLeft:30,marginRight:30}}>
                        <Text style={css.layout.emailFPTxt}>{T.contactName}</Text>
                        <FormInput
                            value={this.state.contactName}
                            ref={contactName => this.contactName = contactName}
                            autoCapitalize = 'none'
                            onChangeText={text => this.setState({contactName:text})}
                            inputStyle={{color:'rgb(233, 69, 120)',fontSize:20}}
                        
                        />
                        <ButtonUNI 
                            onPress={() => this.props.callBack(this.state.contactName)}
                            color1='rgb(233, 69, 120)'
                            color2='rgb(233, 69, 120)'
                            style={[css.layout.signUpButtonContainer,{marginTop:105}]}
                            title={T.find}
                            textStyle={[css.layout.signUpButtonText,{margin:18}]}
                        />
                  </View>
                  
                </ScrollView> 
        </View>
    );
  }
}

export default AddContact;
