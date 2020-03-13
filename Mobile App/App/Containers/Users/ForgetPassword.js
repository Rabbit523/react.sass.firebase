import React, { Component} from "react";
import { Text, View, TouchableOpacity,ScrollView} from 'react-native';
import { FormInput } from 'react-native-elements'
import * as firebase from 'firebase';
import T from '@functions/translation';
import css from '@styles/global';
import SmartIcon from '@smarticon';
import ButtonUNI from '@uniappbuttons/AccentButton';
import ForgetPassComponent from '@components/LoginUI/ForgetPass';
  

export default class ForgetPassword extends Component {
    static navigationOptions = {
        title: '',
        header: null
      };
    constructor(props) {
        super(props);
        this.state = {
            userEmail:""
        };
     this.resetPasswordPressed=this.resetPasswordPressed.bind(this);
     this.backToLogin=this.backToLogin.bind(this);
    
    }  

/**
 * Reset password with email
 * @param {String} userEmail 
 */
resetPasswordPressed(userEmail){
    firebase.auth().sendPasswordResetEmail(userEmail).then(function() {
       //Email sent.
      alert("Email sent");
      }).catch(function(error) {
       alert(error.message)
      });
      
}

/**
 * Back to login
 */
backToLogin()
{
    this.props.navigation.pop();
}
  
render(){
    return(
        <ForgetPassComponent callBackResetPass={this.resetPasswordPressed } callBackBack={this.backToLogin} ></ForgetPassComponent>
    );
  }
}
