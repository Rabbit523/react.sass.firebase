/*eslint array-callback-return: "off"*/
/* eslint-disable */
import React, { Component } from 'react'
import firebase from '../config/database'
import Config from   './../config/app'
import Card from './../ui/template/Card'
import Image from './../components/fields/Image'
import Input from './../components/fields/Input'
import UserUI from './../ui/template/User'
import T from './../translations/translate'

var md5 = require('md5');
const ConditionalDisplay = ({condition, children}) => condition ? children : <div></div>;

export default class User extends Component {
  
  constructor(props){
    super(props);

    this.state = {
      user: {},
      password: "",
      confirmPass: ""
    }

    this.authListener = this.authListener.bind(this);
    this.setUpName = this.setUpName.bind(this);
    this.resetPassword = this.resetPassword.bind(this);
  }

  componentDidMount(){
    this.authListener();
  }
  
  authListener(){
    const setUser=(user)=>{
    this.setState({user:user})
    }

    //Now do the listner
    firebase.app.auth().onAuthStateChanged(function(user) {
    if (user) {
        setUser(user);
        // User is signed in.
        console.log("User has Logged  in Master");
        console.log(user.email);
        
    } else {
        // No user is signed in.
        console.log("User has logged out Master");
    }
    });
  }

  //Setup user display name
  setUpName(displayName){
    console.log("got --- "+displayName)
    var user=firebase.app.auth().currentUser;

    this.setState({ user:user });
    user.updateProfile({
      displayName: displayName
    }).then(function() {
      console.log("Updated"),
      firebase.app.database().ref('users/'+ firebase.app.auth().currentUser.uid).update({
        displayName: displayName
      })   
    }).catch(function(error) {
      console.log("error "+error.message)
    });
  }

  //Setup user image
  setUpUserImage(linkToImage){
    firebase.app.auth().currentUser.updateProfile({
      photoURL: linkToImage
    }),
    firebase.app.database().ref('users/'+ firebase.app.auth().currentUser.uid).update({
      userImage: linkToImage
    })
  }
  
  //Reset password 
  /*resetPassword(){
    if(this.state.password.length > 4){
      if(this.state.password === this.state.confirmPass){
        firebase.app.auth().currentUser.updatePassword(this.state.password).then(function() {
          alert("Your password has been sucesfully updated");
        }).catch(function(error) {
          alert(error.message)
        });
      }else{
        alert("Password fields doesn't match")
        //$('#alert2').show()
        //setTimeout(function(){ $('#alertPasswordFields2').hide(); }, 2000);
      }
    }else{
      //alert("Please fill out password fields. Minimum required in 5 characters")
      $('#alertPasswordFields').show()
      setTimeout(function(){ $('#alertPasswordFields').hide(); }, 2000);
    }
  }*/

  resetPassword(password, confirmPass){
    if(password.length > 4){
      if(password === confirmPass){
        firebase.app.auth().currentUser.updatePassword(password).then(function() {
          if($('#alertPasswordSaved').length){
            $('#alertPasswordSaved').show()
            setTimeout(function(){ $('#alertPasswordSaved').hide(); }, 2000);
          }else{
            alert("Your password has been sucesfully updated");
          }
        }).catch(function(error) {
          alert(error.message)
        });
      }else{
        if($('#alertPasswordFields2').length){
          $('#alertPasswordFields2').show()
          setTimeout(function(){ $('#alertPasswordFields2').hide(); }, 2000);
        }else{
          alert("Password fields doesn't match");
        }
      }
    }else{
      if ($('#alertPasswordFields').length){
        $('#alertPasswordFields').show()
        setTimeout(function(){ $('#alertPasswordFields').hide(); }, 2000);
      }else {
        alert("Please fill out password fields. Minimum required in 5 characters");
      }
    }
  }

render() {
    return (
        <UserUI
            userPhoto={this.state.user.photoURL?this.state.user.photoURL:'http://www.gravatar.com/avatar/' + md5(this.state.user.email+"")+"?s=512"}
            user={this.state.user}
            setUpName={this.setUpName}
            resetPassword={this.resetPassword}
            setUpUserImage={this.setUpUserImage}
        />
    )
  }
}
