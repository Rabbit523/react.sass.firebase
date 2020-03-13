/* eslint-disable */
import React, { Component } from 'react';
import firebase from './config/database'
import Config from './config/app';
import LoginUI from './ui/template/Login'
import * as firebaseCLASS from 'firebase';
require("firebase/firestore");



const request = require('superagent');

var md5 = require('md5');

class Login extends Component {

  constructor(props) {

    super(props);

    this.state = {
      error: '',
      isLogin: true,
    };
    this.authenticateLogin = this.authenticateLogin.bind(this);
    this.authenticateRegister = this.authenticateRegister.bind(this);
    this.changeIsLogin = this.changeIsLogin.bind(this);
    this.showGoogleLogin = this.showGoogleLogin.bind(this);
  }

  /**
   * update login/register state 
   * @param {boolean} isLogin 
   */
  changeIsLogin(isLogin) {
    this.setState({
      isLogin: isLogin
    })
  }

  authenticateLogin(username, password, displayName) {
    const displayError = (error) => {
      this.setState({ error: error });
    }


    if (Config.adminConfig.allowedUsers != null && Config.adminConfig.allowedUsers.indexOf(username) === -1) {
      //Error, this user is not allowed anyway
      displayError("This user doens't have access to this admin panel!");
    } else {
      firebase.app.auth().signInWithEmailAndPassword(username, password)
        .then(
          function (data) {
            console.log("Yes, user is logged in");
          }
        )
        .catch(function (error) {
          // Handle Errors here.
          console.log(error.message);
          displayError(error.message);

        });
    }
  }

  /**
   * Send password reset link
   * @param {String} emailAddress 
   */
  sendPasswordResetLink(emailAddress){
    firebase.app.auth().sendPasswordResetEmail(emailAddress).then(function() {
      alert("Password reset email is sent on your email "+emailAddress);
    }).catch(function(error) {
      alert(error.message)
    });
  }

  authenticateRegister(username, password, displayName) {
   
    const displayError = (error) => {
      this.setState({ error: error });
    }

    firebase.app.auth().createUserWithEmailAndPassword(username, password).then(function () {
        if(!Config.isDemo){
          firebase.app.auth().currentUser.updateProfile({
            displayName: displayName
          }),
  
          firebase.app.database().ref('users/'+ firebase.app.auth().currentUser.uid).set({
            projectUser: true,
            displayName: displayName,
            numOfApps: 0,
            email: username,
            language: "gb"
          })
        }else{
          firebase.app.auth().currentUser.updateProfile({
            displayName: displayName
          }),
          
          firebase.app.database().ref('users/'+ firebase.app.auth().currentUser.uid).set({
            projectUser: true,
            displayName: displayName,
            numOfApps: 0,
            email: username,
            language: "gb"
          }),

          firebase.app.database().ref('stripePayments/'+ md5(username)).set({
            status: "active",
            subscription_plan_id: "552947"
          })
        }
      })
      .catch(function (error) {
        // Handle Errors here.
        console.log(error.message);
        displayError(error.message);
      });
  }

  authWithGoogle() {
    var provider = new firebaseCLASS.auth.GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/firebase.readonly');
    
    firebase.app.auth().signInWithPopup(provider).then(function (result) {
      // This gives you a Google Access Token. You can use it to access the Google API.
      var token = result.credential.accessToken;

      var url='https://firebase.googleapis.com/v1beta1/projects';
		request.get(url)
    		.set('Content-Type', 'application/json')
    		.set('Authorization', 'Bearer '+token)
        .end(function(e,r){
          
          console.log(r);
    	    console.log(e);
        })
        
      
      //console.log("the token is  "+token);
      // The signed-in user info.
      //var user = result.user; 
      // ...
      var usersPath = firebase.app.database().ref('/users/'+result.user.uid);
      usersPath.on('value', function(snapshot) {
          if(snapshot.val()){
            console.log("User "+result.user.email+" logged in via Google")
          }else{
            usersPath.set({
              displayName: result.user.displayName,
              email: result.user.email,
              language: "gb"
            })
          }
      });
    }).catch(function (error) {
      // Handle Errors here.
      //var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      //var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      //var credential = error.credential;
      console.log(errorMessage);
      // ...
    });
  }

  showGoogleLogin() {
    if (Config.adminConfig.allowRegistration||(Config.adminConfig.allowedUsers != null && Config.adminConfig.allowedUsers.length > 0 && Config.adminConfig.allowGoogleAuth)) {
      return (<div>
        <p className="category text-center">
          <a onClick={this.authWithGoogle} className="btn btn-social btn-fill btn-google">
            <i className="fa fa-google"></i>&nbsp;&nbsp;&nbsp;Login with google
            </a>
        </p>
        <br />
        <p className="category text-center">Or login using email</p>
      </div>)
    } else {
      return (<div></div>)
    }
  }

  render() {
    return (
      <LoginUI
        authWithGoogle={this.authWithGoogle}
        showGoogleLogin={this.showGoogleLogin}
        authenticate={this.state.isLogin ? this.authenticateLogin : this.authenticateRegister}
        error={this.state.error}
        isRegister={!this.state.isLogin}
        changeIsLogin={this.changeIsLogin}
        sendPasswordResetLink={this.sendPasswordResetLink}
      />
    );
  }
}

export default Login;
