import React, { Component } from "react";
import { Text, View, TouchableOpacity,ImageBackground, TextInput,Image,ScrollView,ActivityIndicator} from 'react-native';
import * as firebase from 'firebase';
import T from '@functions/translation';
import css from '@styles/global';
import AppEventEmitter from "@functions/emitter"
import Login from '@containers/Users/LoginScreen'
import { ImagePicker } from 'expo';
import * as Permissions from 'expo-permissions'
import ButtonUNI from '@uniappbuttons/AccentButton';
import SmartIcon from '@smarticon';
import ProfileSettingsUI from '@components/LoginUI/ProfileSettingsUI';
import appConfig from '../../../app.json';



export default class ProfileSettings extends Component {
    constructor(props) {
        super(props);

        this.state = {
            userEmail:"",
            isLoggedIn:false,
            waitingForStatus:true,
            progress: 1,
            name:"",
            avatar:"",
            isReady: false,
            description:"",
            animating:false,
            instagram:"",
            facebook:"",
            updateProf:false,
            bio:"",
            fullName:"",
            token:""
            
         };

         this.setUpCurrentUser=this.setUpCurrentUser.bind(this);
         this.updateProfile=this.updateProfile.bind(this);
         this.writeUserData=this.writeUserData.bind(this);
         this.back=this.back.bind(this);
         this.logOutPress=this.logOutPress.bind(this);
         this._pickImage=this._pickImage.bind(this);
         this.uploadAsFile=this.uploadAsFile.bind(this);
    }  

    componentDidMount(){
        //Check if user is logged in
        AppEventEmitter.addListener('', firebase.auth().onAuthStateChanged(this.setUpCurrentUser));
        
    }

    checkUserState(){
        
        this.setState({
            waitingForStatus:false
        });
    }

    setUpCurrentUser(user){
        if (user != null) {
           
         // User is signed in.
         var userId = firebase.auth().currentUser.uid;
        var _this=this;
        firebase.database().ref(appConfig.expo.extra.firebaseMetaPath + '/users/' + userId).once('value').then(function(snapshot) {
           
            _this.setState({
                description:snapshot.val().description== null?"":snapshot.val().description,
                instagram:snapshot.val().instagram== null?"":snapshot.val().instagram,
                facebook:snapshot.val().facebook== null?"":snapshot.val().facebook,
                bio:snapshot.val().bio == null?"":snapshot.val().bio,
                userEmail:snapshot.val().email == null?"":snapshot.val().email,
                avatar:user.photoURL != null?user.photoURL:"",
                waitingForStatus:false,
                isLoggedIn:true,
                name : snapshot.val().username == null?"":snapshot.val().username,
                fullName: snapshot.val().fullName == null?"":snapshot.val().fullName,
                token: snapshot.val().token == null?"":snapshot.val().token
            })
            
        })

        } else {
            //TODO
            //Add event emitter to show the login screens
            //Reorganize the code

            // User is not signed in
            this.setState({
                waitingForStatus:false,
                isLoggedIn:false,
            })
        }
    }

    /**
     * 
     * @param {String} name 
     * @param {String} userEmail 
     * @param {String} description 
     * @param {String} facebook 
     * @param {String} instagram 
     * @param {String} bio 
     * @param {String} avatar 
     * @param {String} fullName 
     */
    updateProfile(name,userEmail,description,facebook,instagram,bio,avatar,fullName){
        var user = firebase.auth().currentUser;
        this.writeUserData(user.uid,name, userEmail,description,facebook,instagram,bio,avatar,fullName);
        this.setState({
            updateProf:true
        })
        var _this=this;
        user.updateProfile({
          displayName: name
        }).then(function()  {
          // Update successful.
          AppEventEmitter.emit('profileUpdate');
          AppEventEmitter.emit('profileUpdateDefInfo');
          alert("Your informations are updated")
        _this.setState({
            updateProf:false
        })
        }).catch(function(error) {
          // An error happened.
         alert(error)
        });
        
    }

    logOutPress(){
        var userId = firebase.auth().currentUser.uid;
        var _this=this
        if(_this.state.token != null){
            firebase.database().ref('users/' + userId+"/token").set(null);
        }
        firebase.auth().signOut().then(function() {
            // Sign-out successsful.
            
            //Delete the push tocken for the current user
         
            
            AppEventEmitter.emit('goToLoginScreens');
            
           }, function(error) {
            // An error happened.
          });
          this.setState({
            
            waitingForStatus:false,
            isLoggedIn:false
        })
        
    }


    _pickImage = async () => {
     
        await Permissions.askAsync(Permissions.CAMERA_ROLL);
        let result = await ImagePicker.launchImageLibraryAsync({
          allowsEditing: true,
          quality:1,
        });
        
        if (!result.cancelled) {
            this.setState({
                avatar:result.uri
            })
         await this.uploadAsFile(result.uri, (progress) => {})
        }
    }

    uploadAsFile = async (uri, progressCallback) => {
        
        const response = await fetch(uri);
        var _this=this
        this.setState({
            animating:true
        })
        const blob = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function() {
              resolve(xhr.response); // when BlobModule finishes reading, resolve with the blob
           };
           xhr.onerror = function() {
             reject(new TypeError('Network request failed')); // error occurred, rejecting
           };
           xhr.responseType = 'blob'; // use BlobModule's UriHandler
           xhr.open('GET', uri, true); // fetch the blob from uri in async mode
           xhr.send(null); // no initial data
         });
        var metadata = {
          contentType: 'image/png',
        };
       
        let name = new Date().getTime() + "-media.png"
        
        const ref = firebase
          .storage()
          .ref()
          .child('usersphotos/' + name)
       

          var uploadTask = ref.put(blob, metadata);
          uploadTask.on('state_changed', function(snapshot){
 
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            
            switch (snapshot.state) {
              case firebase.storage.TaskState.PAUSED: // or 'paused'
                
                break;
              case firebase.storage.TaskState.RUNNING: // or 'running'
                
                break;
            }
          }, function(error) {
            
          }, function() {
            
            uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                
                var user = firebase.auth().currentUser;
  
                user.updateProfile({
                    photoURL: downloadURL
                }).then(function() {
                
                    // Update successful.
               
                alert("Your picture is updated. Click on update profile")
                _this.setState({
                    animating:false,
                    avatar:downloadURL
                })
                
                AppEventEmitter.emit('profileUpdateDefInfo');
                blob.close();
                }).catch(function(error) {
                // An error happened.
                    alert(error)
                    blob.close();
                });
            });
          });
          
    }


    writeUserData(userId, name, email,description,facebook,instagram,bio,avatar,fullName) {
        firebase.database().ref(appConfig.expo.extra.firebaseMetaPath + '/users/' + userId).set({
          username: name,
          email: email,
          description:description,
          facebook:facebook,
          instagram:instagram,
          bio:bio,
          avatar:avatar,
          fullName:fullName
        });
    }

    back()
    {
        this.props.navigation.pop();
    }

    render(){
        if(this.state.isLoggedIn){
            //Show Profile
            
            return( 
                <ProfileSettingsUI
                    userEmail={this.state.userEmail}
                    name={this.state.name}
                    avatar={this.state.avatar}
                    description={this.state.description}
                    animating={this.state.animating}
                    instagram={this.state.instagram}
                    facebook={this.state.facebook}
                    updateProf={this.state.updateProf}
                    bio={this.state.bio}
                    fullName={this.state.fullName}
                    callbackBackAction={this.back}
                    callBackLogOutPress={this.logOutPress}
                    callbackUpdateProfile={this.updateProfile}
                    _pickImage={this._pickImage}
                >
                </ProfileSettingsUI>
                );
        }else if(this.state.waitingForStatus){
            //Show empty window
          
            return( <View/>);
        }else if(!this.state.isLoggedIn){
            //Show login
           
           return(<Login navigation={this.props.navigation} isReqUserVarification={this.props.isReqUserVarification} allowedUsers={this.props.allowedUsers}/>)
        }
    }
}