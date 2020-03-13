/*eslint no-unused-vars: "off"*/
import React from 'react';
import ReactDOM from 'react-dom';
import Admin from './Admin';
import Login from './Login';
import Splash from './Splash';
import Config from   './config/app';
import design from   './ui/template/Config';
import * as FirebaseSDK from 'firebase';
import Translation from './translations/translate';
import defaultLanguage from './config/gb_translation'

require("firebase/firestore");

//console.log = function() {}
import firebase from './config/database'
import { isBuffer } from 'util';

//Remove data fethced
var configReceived=!Config.remoteSetup;
var fetcherFirebaseApp = FirebaseSDK.initializeApp(Config.firebaseConfig,"fetcher");

if(Config.remoteSetup){
  //Do a remote setuo of the admin
  var connectionPath=Config.remotePath;
  if(Config.allowSubDomainControl){
    //Control by subdomain
    connectionPath=Config.subDomainControlHolder+window.THE_DOMAIN;
  }

  if(Config.saasappadmindata){
    //We have SAAS AppAdm.in project
    //On the location appadmin_pointers/data/DOMAIN -- we have the path to the config for the particular admin
    var pathWherePathIsStored=Config.saasappadmindata+window.THE_DOMAIN;
    console.log(pathWherePathIsStored);
    fetcherFirebaseApp.database().ref(pathWherePathIsStored).once('value').then(function(snapshot) {
      console.log(snapshot.val())
      startFetchingAdminConfig(snapshot.val());
    })
  }else{
    //Like before, on the path ew have the real data for th admin, load it
    startFetchingAdminConfig(connectionPath);
  }


 
}else{
  // Legacy, local setup
  firebase.app=FirebaseSDK.initializeApp(Config.firebaseConfig,"default");
  checkLoginStatus();
  
}

/**
 * Fetch Cofig data
 * @param {String} connectionPath 
 */
function startFetchingAdminConfig(connectionPath){
  
  fetcherFirebaseApp.database().ref(connectionPath).once('value').then(function(snapshot) {
    console.log(snapshot.val())
    Config.firebaseConfig=snapshot.val().firebaseConfig;
    Config.adminConfig=snapshot.val().adminConfig;
    Config.navigation=snapshot.val().navigation;
    Config.pushSettings=snapshot.val().pushSettings;
    firebase.app=FirebaseSDK.initializeApp(Config.firebaseConfig,"default");
    configReceived=true;
    checkLoginStatus();
    displayApp();
  });
}




//AUTHENTICATION
var loggedIn=false;

//CURRENT LANGUAGE
var language=null;
var availableLaguages=[];

/**
 * Finds user langague
 */
function startSettingBackednLanguage(){
  
  //1. Get user language
  var curLangRef = firebase.app.database().ref('users/'+firebase.app.auth().currentUser.uid);
      curLangRef.on('value', function(snapshot) {
            var currentLangData=snapshot.val()&&snapshot.val().language?snapshot.val().language.toUpperCase():"GB";
            language=currentLangData;
            Translation.fetchAndSetLanguageAndSetUser(currentLangData,false,function(allAvailableLanguages){
              loggedIn=true;
              availableLaguages=allAvailableLanguages;
              displayApp();
            });
    });
}

function importDefaultLanguage(){
  var curPath = firebase.app.database().ref('/translations');
  curPath.on('value', function(snapshot) {
    if(snapshot.val()){
      console.log("Default language exist!")
    }else{
      var defLang = defaultLanguage.gbTranslation;
      curPath.update({
        gb: defLang
      })
      console.log("Default language imported!")
    }
  });
}

function checkLoginStatus(){
  
  if(Config.firebaseConfig.apiKey){
    firebase.app.auth().onAuthStateChanged(function(user) {
      if (user) {
        // User is signed in.
        console.log("User is signed in "+user.email);

        if(Config.adminConfig.allowedUsers!=null&&Config.adminConfig.allowedUsers.indexOf(user.email)===-1){
          //Error, this user is not allowed anyway
          alert("The user "+user.email+" doens't have access to this admin panel!");
          firebase.app.auth().signOut();
        }else{
          

          //Update Paths
         for (let index = 0; index < Config.navigation.length; index++) {
          Config.navigation[index].path=Config.navigation[index].path.replace("{useruuid}",user.uid); 
          if( Config.navigation[index].subMenus){
            for (let subIndex = 0; subIndex < Config.navigation[index].subMenus.length; subIndex++) {
              Config.navigation[index].subMenus[subIndex].path=Config.navigation[index].subMenus[subIndex].path.replace("{useruuid}",user.uid); 
            }
          }
         }

         //import default language to database
         importDefaultLanguage();

         //Start fetching language data for user
         startSettingBackednLanguage();
          

         //Do we have our pushSettings remoutly configurable
         if(Config.pushSettings.remoteSetup){
          var fetcherPushConfigFirebaseApp = FirebaseSDK.initializeApp(Config.firebaseConfig,"pushFetcher");
          fetcherPushConfigFirebaseApp.database().ref(Config.pushSettings.remotePath).once('value').then(function(snapshot) {
            //alert("FETCH PUSH CONFIG")
            //alert(snapshot.val())
            Config.pushSettings=snapshot.val();
            displayApp();
          });
         }else{
          displayApp();
         }
          
        }



      } else {
        // No user is signed in.
        console.log("No user is signed in ");
        loggedIn=false;
        displayApp();
        if(window.display){
            window.display();
        }

      }
  })
  }else{
    // No user is signed in.
      console.log("No user is signed in, step 1 ");
      loggedIn=false;
      displayApp();
      if(window.display){
          window.display();
      }
  }
}



function displayApp(){
  if(!configReceived){
     ReactDOM.render(
        <Splash />,
        document.getElementById('root')
      );
  }else{
    //Show splash window
    if(loggedIn){
      ReactDOM.render(
        <Admin currentLangData={{
          currentLang:language,
          availableLaguages:availableLaguages
        }} />,
        document.getElementById('root')
      );
    }else{
      ReactDOM.render(
        <Login />,
        document.getElementById('root')
      );
    }
  }
  
}
displayApp();
