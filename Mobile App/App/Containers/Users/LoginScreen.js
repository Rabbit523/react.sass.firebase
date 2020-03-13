import React from 'react';
import {Alert} from 'react-native';
import * as firebase from 'firebase';
import Config from '../../../config'
import T from '@functions/translation';
import LoginScreenUI from '@components/LoginUI/LoginScreenUI';
import AppEventEmitter from "@functions/emitter"

class LoginScreen extends React.Component {

  static navigationOptions = {
    
    title: 'Login',
    header: null,
  };

  
  constructor(props){
    super(props);
    this.state = {
      
      loading: false,
      isReqUserVarification:false

    };
    
    this.loginWithFacebook=this.loginWithFacebook.bind(this);
    this.signInWithGoogleAsync=this.signInWithGoogleAsync.bind(this);
    this.onLoginPress=this.onLoginPress.bind(this)
    this.checkAllowedUsers=this.checkAllowedUsers.bind(this);
    this.forgotPassword=this.forgotPassword.bind(this);
    this.onSignInPress=this.onSignInPress.bind(this);
  }

  /**
   * Check if the entered mail is in the allowed list of users
   * @param {String} email 
   */
  checkAllowedUsers(email)
    {
      users=[]
      this.props.allowedUsers.map((item)=>{
        users.push(item.email)
        
      })
      if(users.indexOf(email) > -1){
        this.onLoginPress()
      }else{
        alert(T.userWithNoAccess)
      }
  }

  /**
   * Login button pressed
   * @param {String} email 
   * @param {String} password 
   */
  onLoginPress(email, password)
  {
      this.setState({
        loading: true
      })

      
      var _this=this;
      firebase.auth().signInWithEmailAndPassword(email, password).then(() => {
        _this.setState({
          loading: false
        })
        AppEventEmitter.emit('goToAppScreensNavi');

      }).catch(function(error){
      
        Alert.alert(error.message)
        _this.setState({
          loading: false
        })
        
      })
      
  }

  /**
   * Login with fb
   */
  async loginWithFacebook() {
      const { type, token } = await Expo.Facebook.logInWithReadPermissionsAsync(Config.loginSetup.facebookID, { permissions: ['public_profile'] })
          if (type == 'success') {
            const credential = firebase.auth.FacebookAuthProvider.credential(token)
            firebase.auth().signInWithCredential(credential).catch((error) => {
              AppEventEmitter.emit('goToAppScreensNavi');
          })
        }
  }

  /**
   * Login with google
   */
  async signInWithGoogleAsync() {
      try {
        const result = await Expo.Google.logInAsync({
          iosClientId: Config.loginSetup.googleIOSid,
          androidClientId: Config.loginSetup.googleAndroidId,
          scopes: ['profile', 'email'],
        });
    
        if (result.type === 'success') {
          AppEventEmitter.emit('goToAppScreensNavi');
          return result.accessToken;
          
        } else {
          return {cancelled: true};
        }
      } catch(e) {
        return {error: true};
      }
  }

  /**
   * Go to the SignUp screen
   */
  onSignInPress()
  {
    this.props.navigation.navigate('SignUp')
  }

  

  shouldComponentUpdate() {
    return false
  }

  

/**
 * Go to forget password screen
 */
  forgotPassword(){
      this.props.navigation.navigate('ForgetPassword')
  }

  

  render() {
    return (
      <LoginScreenUI
        loading={this.state.loading}
        isReqUserVarification={this.props.isReqUserVarification}
        callBackLogin={this.onLoginPress}
        callBackCheckAllowedUsers = {this.checkAllowedUsers}
        callBackForgetPass = {this.forgotPassword}
        callbackOnSignInPress = {this.onSignInPress}
        callBackLoginWithFacebook = {this.loginWithFacebook}
        callBackSignInWithGoogleAsync= {this.signInWithGoogleAsync}
      >
      </LoginScreenUI>
    );
  }
}

export default LoginScreen;
