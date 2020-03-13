import React from 'react';
import { Text, View, TouchableOpacity,ImageBackground, TextInput,ScrollView,ActivityIndicator,} from 'react-native';
import * as firebase from 'firebase';
import SignUpUI from '@components/LoginUI/SignUpUI';
import appConfig from '../../../app.json';
import AppEventEmitter from "@functions/emitter"

class SignUpScreen extends React.Component {
  static navigationOptions = {
    
      title: 'Sign Up',
      header: null,
    };
  
  constructor(props){
    super(props);
    this.state = {
      loading:false
    };
    this.updateProfile=this.updateProfile.bind(this);
    this.writeUserData=this.writeUserData.bind(this);
    this.onSignUpPress=this.onSignUpPress.bind(this);
    this.onLogInPress=this.onLogInPress.bind(this);

  }

  
/**
 * Create new user
 * @param {String} email 
 * @param {String} password 
 * @param {String} name 
 */
 onSignUpPress(email, password,name)
  {
    this.setState({
      loading: true
    })
    var _this=this;
  
    firebase.auth().createUserWithEmailAndPassword(email, password).then(() => {
      _this.setState({
        loading: false
      });
      AppEventEmitter.emit('goToAppScreensNavi');
      this.updateProfile(email,name)

    }).catch(function(error) {
      alert(error.message)
      _this.setState({
        loading: false
      });
    });
 }

 /**
  * Add displayName and call writeUserData function
  * @param {String} email 
  * @param {String} name 
  */
 updateProfile(email,name){
    var user = firebase.auth().currentUser;
    var userID = firebase.auth().currentUser.uid;

  var _this=this
    setTimeout(function(){
      _this.writeUserData(userID,name,email)
      }, 1000);

    user.updateProfile({
      displayName: name
    }).then(function() {
      // Update successful.
     
    
    }).catch(function(error) {
      // An error happened.
     
    });
 }

 /**
  * Write the user in the Realtime Database
  * @param {String} userId 
  * @param {String} name 
  * @param {String} email 
  */
 writeUserData(userId, name, email) {
 
  firebase.database().ref(appConfig.expo.extra.firebaseMetaPath + '/users/' + userId+'/').update({
    username: name,
    email:email
    });
 }

/**
 * Back to LogInScreen
 */
  onLogInPress()
  {
    this.props.navigation.pop();
  }


  render() {
    return (
      <SignUpUI
        loading={this.state.loading}
        onLogInPress={this.onLogInPress}
        onSignUpPress={this.onSignUpPress}
      >
      </SignUpUI>
    );
  }
}

export default SignUpScreen;
