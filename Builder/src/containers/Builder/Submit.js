/*eslint no-useless-escape: "off"*/
/* eslint-disable */
import React, { Component } from 'react'
import Wizzard from "./../../ui/template/Wizzard";
import NavBar from './../../ui/template/NavBar'
import firebase from '../../config/database'
import Config from   '../../config/app';
import T from './../../translations/translate'
var fileDownload = require('js-file-download');
import { saveAs } from 'file-saver';
var JSZip = require("jszip");


const appJSONTemplate={
    "expo": {
      "name": "App Platform - UniApp",
      "description": "App Platform - All in one React Native Universal Mobile App. \nThis is all in one Multi-Purpose Expo React Native Mobile app.\nIt works for iPhone and Android. In fact, this is a bundle of multiple apps, that follow same design and coding pattern. Buy this app for for $49$ on https://codecanyon.net/item/universal-app-platform-full-multipurpose-all-in-one-react-native-mobile-app/21247686",
      "slug": "uniexpoapp",
      "privacy": "public",
      "sdkVersion": "30.0.0",
      "version": "1.0.0",
      "orientation": "portrait",
      "primaryColor": "#cccccc",
      "platforms": [
        "ios",
        "android"
      ],
      "splash": {
        "image": "./assets/images/splash.png",
        "resizeMode": "contain",
        "backgroundColor": "#ffffff"
      },
      "extra": {
        "firebaseMetaPath": "/meta"
      },
      "icon": "./assets/icons/app.png",
      "loading": {
        "icon": "./assets/icons/loading.png",
        "hideExponentText": false
      },
      "packagerOpts": {
        "assetExts": [
          "ttf",
          "mp4"
        ]
      },
      "ios": {
        "supportsTablet": true,
        "bundleIdentifier": "com.mobidonia.uniexpoapp"
      },
      "android": {
        "package": "com.mobidonia.uniexpoapp"
      }
    }
  };
export default class Submit extends Component {

    constructor(props){
        super(props);
        this.state={
            app: null,
            name: "",
            id: "",
            appImage:""
        }
        this.submitApp = this.submitApp.bind(this);
        this.getSubmitContent = this.getSubmitContent.bind(this);
        this.startDownload = this.startDownload.bind(this);
    }


    componentDidMount(){
        var _this=this;
        var wholeApp = firebase.app.database().ref(Config.appEditPath);
        wholeApp.on('value', function(snapshot) {
            _this.setState({
              app:snapshot.val(),
              name:snapshot.val().name,
              id:snapshot.val().id,
              appImage:snapshot.val().appImage,
            })
        });
    }

     arrayBufferToBase64(buffer) {
        var binary = '';
        var bytes = [].slice.call(new Uint8Array(buffer));
      
        bytes.forEach((b) => binary += String.fromCharCode(b));
      
        return window.btoa(binary);
      };

    startDownload(){
        var slug=this.getSlug();
        appJSONTemplate.expo.name=this.state.app.name;
        appJSONTemplate.expo.description="Made with react app builder";
        appJSONTemplate.expo.slug=slug;
        appJSONTemplate.expo.extra.firebaseMetaPath=Config.appEditPath;
        appJSONTemplate.expo.extra.firebaseConfig=Config.firebaseConfig;
        appJSONTemplate.expo.android.package=this.state.id;
        appJSONTemplate.expo.ios.bundleIdentifier=this.state.id;

        var packageJSON={
            "name": "myapp",
            "version": "9.0.0",
            "description": "ReactApp",
            "author": "example@example.com",
            "private": true,
            "dependencies": {
            "react-native": "https://github.com/expo/react-native/archive/sdk-32.0.0.tar.gz"
            },
            "devDependencies": {}
            };

        var zip = new JSZip();
        zip.folder(slug).file("app.json", JSON.stringify(appJSONTemplate, null, 2));
        zip.folder(slug).file("package.json", JSON.stringify(packageJSON, null, 2));
        fetch("https://cors-anywhere.herokuapp.com/"+this.state.app.appImage,{mode: 'cors'}).then((response) =>{
                response.blob().then(image => {
                    zip.folder(slug).folder("assets").folder("icons").file("app.png", image);
                    zip.generateAsync({type:"blob"}).then(function (blob) { // 1) generate the zip file
                        saveAs(blob, slug+".zip");                      // 2) trigger the download
                    }, function (err) {
                        alert(err)
                    })
                  })
        })

        

        
    }

    getSlug(){
        var lastIndex=Config.appEditPath.lastIndexOf("/");
        lastIndex++;
        var slug=Config.appEditPath.substring(lastIndex);
        return slug;
    }

    //Submit the app and set to firebase 
    submitApp(){
        firebase.app.database().ref(Config.appEditPath+"/appIsSubmited").set(true);
        
        var user=firebase.app.auth().currentUser;
        var objectToSet={
            appId:this.state.app.rabid,
            userDisplayName:user.displayName,
            userEmail:user.email,
            }

        firebase.app.database().ref("rab_pointers/apps_queue/"+this.state.app.rabid+"_both").set(objectToSet);
    }

    //Show apple informations form
    showSubmitContent(){
        return (
            <div className="col-md-12">
                <a onClick={this.submitApp} className={"btn "+Config.designSettings.submitButtonClass}>{T.td("Submit app")}</a>
            </div>
        );
    }

    getSubmitContent(){
        if(this.state.app!=null&&this.state.app.id){
            //1. Doens' have status show the submit button
            if(!this.state.app.appIsSubmited){
                return this.showSubmitContent();
            }else{
                //Appis submited
                return (<div> <h3>App is submited!</h3>
                    <p>There is no need for additional submision since we have Real Time Updates to the app content. 
                    <br />If you wnat to change App name, Icon, logo or splash, do that and come back here.</p></div>)
            }
            //2. has submite status , show already send
        }else{
            return (<div>...</div>)
        }
    }


    createTheiPhoneContent(){
        return (
            <div>
               
                <div className="col-md-12">
                   <hr/>
                    <p>After you have received the email you should do the following tasks in order to publish your app.</p>
                    <br/>

                    <h4><b>Step 3.1. Download the app project files</b></h4>
                    <p><a className={"btn "+Config.designSettings.submitButtonClass} onClick={()=>{this.startDownload()}}>Download <b>Project Files</b></a></p>
                    
                    <br /><br />

                    <h4><b>Step 3.2. Install Node and Expo CLI</b></h4>
                    <p>First you will need Node program.<br/> 
                                        Install it from here<br/> 
                        <a href="https://nodejs.org/en/">https://nodejs.org/en/</a>
                    </p>
                    <br/>
                    <p>Run this command in your Command Prompt or terminal.<br/>
                        <b>Mac</b>: <i>sudo npm install expo-cli --global</i><br/>
                        <b>Windows</b> (Open Command Prompt as administrator): <i>npm install expo-cli --global</i> 
                    </p>
                    <br/>


                    <h4><b>Step 3.3. Login in the Expo CLI</b></h4>
                    <p>Run the command: <i>expo login</i><br/>
                        Username: <b>{Config.buildAccountUsername||"mobidoniabuild"}</b><br/>
                        Password: <b>{Config.buildAccountPassword||"AppBuild"}</b>
                    </p>
                    <br/>

                    <h4><b>Step 3.4. Install the node modules</b></h4>
                    <p>Unizi the project files. Using command line navigate to that folder and run</p>
                    <p><i>npm install</i></p>
                    <br/>

                   
                   
                    <h4><b>Step 3.5. Publish the ios app</b></h4>
                    <p>In command prompt or terminal run<br/>  
                    <i>expo bi --no-publish</i><br/><br/>
                    </p>
                    <p>Follow the onescreen instructions!</p>
                </div>


            </div>
        )
    }

    createTheiAndroidContent(){
        return (
            <div>
                <br /><br />
                Download the .apk file that you will get in the email, and publish it on Google Play.
            </div>
        )
    }


    render() {
        return (
        <div className="main-panel">
            <div className="container">
            <NavBar  currentLangData={this.props.route.currentLangData}></NavBar>
            <Wizzard 
            title={this.state.name?T.td("App Submit")+": "+this.state.name:T.td("App Submit")}
            steps={[{
                name:"submit",
                icon:"check_circle_outline",
                title:T.td("Step 1. Submit"),
                active:"active",
                label1:T.ts("Submit you app for compilation"),
                label2:T.ts("We will compile your app and send you email when done."),
                content:this.getSubmitContent()
            },
            {
                name:"android",
                icon:"android",
                title:T.td("Step 2. Publish Android"),
                active:"active",
                label1:T.ts("Shortly after submit, you will get an email"),
                label2:T.ts("With link to the Android app that you will be able to publish on Google Play"),
                content:this.createTheiAndroidContent()
            },
            {
                name:"ios",
                icon:"phone_iphone",
                title:T.td("Step 3. Publish iPhone"),
                active:"active",
                label1:T.ts("Shortly after submit"),
                label2:T.ts("You will get an email when you can start with the steps bellow."),
                content:this.createTheiPhoneContent()
            }]}
            />
            </div>
        </div>
        )
    }
}