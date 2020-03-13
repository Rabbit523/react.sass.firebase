/*
  Created by Dimov Daniel
  Mobidonia
  daniel@mobidonia.com
*/
console.disableYellowBox = true; //Set to false in development

import React from 'react';
import { LinearGradient } from 'expo-linear-gradient'
import * as Font from 'expo-font'
import { StyleSheet, Text, View, Image, ScrollView,Button,FlatList,TouchableOpacity,AsyncStorage,LayoutAnimation,Dimensions,NetInfo} from 'react-native';
import { MaterialIcons, Ionicons,Feather } from '@expo/vector-icons';
import firebase from '@datapoint/Firebase'
import * as firebase2 from 'firebase';
require("firebase/firestore");
import css from '@styles/global'
import AppListStyle from "@components/Smartrow/style";
import Master from '@containers/Master'
import MapScreen from '@containers/MapScreen'
import Categories from '@containers/Categories'
import Details from '@containers/Details'
import Gallery from '@containers/Gallery'
import NotificationScreen from '@containers/Notifications'
import Cart from '@ecommerce/Cart'
import Orders from '@ecommerce/Orders'
import OrderDetail from '@containers/OrderDetail'
import WebScreen from '@containers/WebScreen'
import Home from '@containers/Home';
import Review from '@containers/Review';
import NavigationIcon from '@navigationicon'
import Config from './config'
import fun from '@functions/common';
var to = require('to-case')
import appConfig from './app.json'
import SmartIcon from '@smarticon';
import { Notifications } from 'expo';
import { BarCodeScanner } from 'expo-barcode-scanner'
import * as Permissions from 'expo-permissions'
import {version} from './package.json';
import AppEventEmitter from "@functions/emitter"
import Login from '@containers/Users/LoginScreen'
import ForgetPassword from '@containers/Users/ForgetPassword'
import SignUp from '@containers/Users/SignUpScreen'
import ProfileSettings from '@containers/Users/ProfileSettings'
import {
 
  AdMobInterstitial
  
} from 'expo-ads-admob';
import Profile from '@containers/Users/Profile'
import ListOfUsers from '@containers/Users/ListOfUsers'
import AddContact from '@containers/Users/AddContact'
import CreateGroupChat from '@containers/Users/CreateGroupChat'
import Chats from '@containers/Users/Chats'
import Form from '@containers/Form'
import Scanner from '@ecommerce/Scanner'
import Grid from './App/Containers/MenuLayouts/Grid'
import OrderAction from '@ecommerce/OrderAction'
import { ActionSheetProvider, connectActionSheet } from '@expo/react-native-action-sheet';
import Chat from '@containers/Users/Chat'
import AppIntroSlider from 'react-native-app-intro-slider';
import {  createBottomTabNavigator,createStackNavigator,createDrawerNavigator,DrawerNavigator,DrawerItems,StackNavigator,TabNavigator,createAppContainer } from 'react-navigation';
import LocationScreen from '@containers/LocationScreen';
/**
* MyMastSreen  - creates master screen
* @param {Object} navigation - the navigation data
* @param {Object} data - informations about the current screen
* @param {Object} design - design informations
* @param {Boolean} isRoot - how we should display the navigation bar
*/
const MyMastSreen = ({ navigation, data, design,isRoot,config}) => (
  <Master data={data} navigation={navigation} design={design} isRoot={isRoot} config={config}/>
);

/**
* Home  - creates master screen
* @param {Object} navigation - the navigation data
* @param {Object} data - informations about the current screen
* @param {Object} design - design informations
* @param {Boolean} isRoot - how we should display the navigation bar
*/
const MyHomeSreen = ({ navigation, data, design,isRoot,config}) => (
  <Home data={data} navigation={navigation} design={design} isRoot={isRoot} config={config}/>
);
/**
* MyMapSreen  - creates mao screen
* @param {Object} navigation - the navigation data
* @param {Object} data - informations about the current screen
* @param {Object} design - design informations
* @param {Boolean} isRoot - how we should display the navigation bar
*/
const MyMapSreen = ({ navigation, data, design,isRoot,config }) => (
  <MapScreen data={data} navigation={navigation} design={design} isRoot={isRoot} config={config} />
);


/**
* MyCategoriesSreen  - creates categoris screen
* @param {Object} navigation - the navigation data
* @param {Object} data - informations about the current screen
* @param {Object} design - design informations
* @param {Boolean} isRoot - how we should display the navigation bar
* @param {Object} [subMenus] - list of submenus to display
*/
const MyCategoriesSreen = ({ navigation, data, design,isRoot,subMenus,config }) => (
  <Categories data={data} navigation={navigation} isRoot={isRoot} subMenus={subMenus} config={config}/>
);

/**
* MyWebSreen  - creates web screen
* @param {Object} navigation - the navigation data
* @param {Object} data - informations about the current screen
* @param {Object} design - design informations
* @param {Boolean} isRoot - how we should display the navigation bar
*/
const MyWebSreen = ({ navigation, data, design,isRoot,config,fromNotification }) => (
  <WebScreen data={data} navigation={navigation} isRoot={isRoot} config={config} fromNotification={fromNotification} />
);

const MyLocationScreen = ({ navigation, data, design,isRoot,config }) => (
  <LocationScreen data={data} navigation={navigation} isRoot={isRoot} config={config} />
);

const MyScannerScreen = ({ navigation, data, design,isRoot,isReqUserVarification,config }) => (
  <Scanner data={data} navigation={navigation} isRoot={isRoot} isReqUserVarification={isReqUserVarification} config={config} />
);

const MyFormScreen = ({ navigation, data, design,isRoot,isReqUserVarification,config,formSetup, collectionName }) => (
  <Form data={data} navigation={navigation} isRoot={isRoot} isReqUserVarification={isReqUserVarification} config={config} formSetup={formSetup} collectionName={collectionName} />
);

const MyGridScreen = ({ navigation, data, design,isRoot,isReqUserVarification,config }) => (
    <Grid data={data} navigation={navigation} design={design} isRoot={isRoot} isReqUserVarification={isReqUserVarification} config={config} />
  );

  
const MyDetailsFromScanner = ({ navigation, data, design,isRoot,config }) => (
  <OrderAction data={data} navigation={navigation} isRoot={isRoot} config={config} />
);


/**
* MyDetailsSreen  - creates details screen
* @param {Object} navigation - the navigation data
* @param {Object} data - informations about the current screen
* @param {Object} design - design informations
* @param {Boolean} isRoot - how we should display the navigation bar
* @param {Object} [subMenus] - list of submenus to display
* @param {Object} config - configuration data
*/
const MyDetailsSreen = ({ navigation, data, design,isRoot,subMenus,config }) => (
  <Details data={data} navigation={navigation} design={design} config={config} />
);

const MyReviewSreen = ({ navigation, data, design,isRoot,subMenus,config }) => (
  <Review data={data} navigation={navigation} design={design} config={config} />
);

/**
* MyGallerySreen  - creates gallery screen
* @param {Object} navigation - the navigation data
* @param {Object} data - informations about the current screen
* @param {Object} design - design informations
* @param {Boolean} isRoot - how we should display the navigation bar
* @param {Object} [subMenus] - list of submenus to display
*/
const MyGallerySreen = ({ navigation, data, design,isRoot,subMenus, config }) => (
  <Gallery data={data} navigation={navigation} design={design} isRoot={isRoot} config={config} />
);

/**
* MyCartSreen  - creates cart screen
* @param {Object} navigation - the navigation data
* @param {Object} data - informations about the current screen
* @param {Object} design - design informations
* @param {Boolean} isRoot - how we should display the navigation bar
* @param {Object} [subMenus] - list of submenus to display
*/
const MyCartSreen = ({ navigation, data, design,isRoot,subMenus,config }) => (
  <Cart data={data} navigation={navigation} design={design} config={config}  />
);


/**
* MyOrdersSreen  - creates orders screen
* @param {Object} navigation - the navigation data
* @param {Object} data - informations about the current screen
* @param {Object} design - design informations
* @param {Boolean} isRoot - how we should display the navigation bar
* @param {Object} [subMenus] - list of submenus to display
*/
const MyOrdersSreen = ({ navigation, data, design,isRoot,subMenus,config }) => (
  <Orders data={data} navigation={navigation} design={design} isRoot={isRoot} config={config}  />
);

/**
* MyOrdersDetailSreen  - creates orders screen
* @param {Object} navigation - the navigation data
* @param {Object} data - informations about the current screen
* @param {Object} design - design informations
* @param {Boolean} isRoot - how we should display the navigation bar
* @param {Object} [subMenus] - list of submenus to display
*/
const MyOrderDetailSreen = ({ navigation, data, design,isRoot,subMenus,config }) => (
  <OrderDetail data={data} navigation={navigation} design={design} isRoot={isRoot} config={config}  />
);


/**
* MyNotificationsSreen  - creates notifications screen
* @param {Object} navigation - the navigation data
* @param {Object} data - informations about the current screen
* @param {Object} design - design informations
* @param {Boolean} isRoot - how we should display the navigation bar
* @param {Object} [subMenus] - list of submenus to display
*/
const MyNotificationsSreen = ({ navigation, data, design,isRoot,subMenus, config }) => (
  <NotificationScreen data={data} navigation={navigation} design={design} isRoot={isRoot} config={config} />
);



/**
* MyProfileSettingsSreen - creates notifications screen
* @param {Object} navigation - the navigation data
* @param {Object} data - informations about the current screen
* @param {Object} design - design informations
* @param {Boolean} isRoot - how we should display the navigation bar
* @param {Object} [subMenus] - list of submenus to display
*/
const MyProfileSettingsSreen = ({ navigation, data, design,isRoot,subMenus,isReqUserVarification,allowedUsers,config }) => (
  <ProfileSettings data={data} navigation={navigation} design={design} isRoot={isRoot} isReqUserVarification={isReqUserVarification} allowedUsers={allowedUsers} config={config} />
);

/**
* MyProfileSreen - creates notifications screen
* @param {Object} navigation - the navigation data
* @param {Object} data - informations about the current screen
* @param {Object} design - design informations
* @param {Boolean} isRoot - how we should display the navigation bar
* @param {Object} [subMenus] - list of submenus to display
*/
const MyProfileSreen = ({ navigation, data, design,isRoot,subMenus,config }) => (
  <Profile data={data} navigation={navigation} design={design} config={config}  />
);
/**
* MyListOfUsersSreen - creates notifications screen
* @param {Object} navigation - the navigation data
* @param {Object} data - informations about the current screen
* @param {Object} design - design informations
* @param {Boolean} isRoot - how we should display the navigation bar
* @param {Object} [subMenus] - list of submenus to display
*/
const MyListOfUsersSreen = ({ navigation, data, design,isRoot,subMenus,config }) => (
  <ListOfUsers data={data} navigation={navigation} design={design} config={config}  />
);

/**
* MyListOfUsersSreen - creates notifications screen
* @param {Object} navigation - the navigation data
* @param {Object} data - informations about the current screen
* @param {Object} design - design informations
* @param {Boolean} isRoot - how we should display the navigation bar
* @param {Object} [subMenus] - list of submenus to display
*/
const MyChatsSreen = ({ navigation, data, design,isRoot,subMenus,config, id, path}) => (
  <Chats data={data} navigation={navigation} design={design} config={config} id={id} path={path}  />
);

/**
* MyListOfUsersSreen - creates notifications screen
* @param {Object} navigation - the navigation data
* @param {Object} data - informations about the current screen
* @param {Object} design - design informations
* @param {Boolean} isRoot - how we should display the navigation bar
* @param {Object} [subMenus] - list of submenus to display
*/
const MyCreateGroupChatSreen = ({ navigation, data, design,isRoot,subMenus,config, id, path}) => (
  <CreateGroupChat data={data} navigation={navigation} design={design} config={config} id={id} path={path}  />
);
/**
* MyAddContactSreen - creates notifications screen
* @param {Object} navigation - the navigation data
* @param {Object} data - informations about the current screen
* @param {Object} design - design informations
* @param {Boolean} isRoot - how we should display the navigation bar
* @param {Object} [subMenus] - list of submenus to display
*/
const MyAddContactSreen = ({ navigation, data, design,isRoot,subMenus,config }) => (
  <AddContact data={data} navigation={navigation} design={design} config={config}  />
);
const MyLoginSreen = ({ isReqUserVarification, allowedUsers,config }) => (
  <Login   isReqUserVarification={isReqUserVarification} allowedUsers={allowedUsers} config={config}/>
);

const MyChatSreen = ({ navigation, data, design,isRoot,subMenus,config }) => (
  <Chat data={data} navigation={navigation} design={design}/>
);

const MyForgetPassSreen = ({ isReqUserVarification, allowedUsers,config }) => (
  <ForgetPassword isReqUserVarification={isReqUserVarification} allowedUsers={allowedUsers} config={config}/>
);
const MySignUpSreen = ({ isReqUserVarification, allowedUsers,config}) => (
  <SignUp isReqUserVarification={isReqUserVarification} allowedUsers={allowedUsers} config={config}/>
);


const ConditionalDisplay = ({condition, children}) => condition ? children : <View></View>;
const paddingValue = 8;
const screenWidth = Dimensions.get('window').width;
    this.itemSize = {
      width: (screenWidth - (paddingValue * 6)) / 2,
      height: (screenWidth - (paddingValue * 6)) / 2,
    };
export default class App extends React.Component {
  //The drawler nav, initialy null, this is build while in runtime
  static navi=null;
  static loginNavi=null;
  
  //The construcor
  constructor(props){
    super(props);
    this.state = {
            isReady:false,
            metaLoaded:false,
            meta:{},
            allAppsData:[],
            notification: {},
            fontLoaded: false,
            userAuthenticated:false,
            avatar:require('@images/logo.png'),
            userEmail:"",
            name:'',
            bio:"",
            openBCScanner:false,
            hasCameraPermission: true,
            lastScannedData:null,
            showSliders:false,
            showRealApp: false,
            slides: [],
            status:false,
            data:[],
            isGridView:false,
            showAppScreens:true, //Show directly app screens
            
        };

    //Bind functions to this
    this.retreiveMeta=this.retreiveMeta.bind(this);
    this.createNavigation=this.createNavigation.bind(this);
    this.chekIfHaveSliders=this.chekIfHaveSliders.bind(this);
    this.retreiveAppDemos=this.retreiveAppDemos.bind(this);
    this.renderAppRow=this.renderAppRow.bind(this);
    this.alterUserState=this.alterUserState.bind(this);
    this.setUpCurrentUser=this.setUpCurrentUser.bind(this);
    this.setUpUserDataFromFB=this.setUpUserDataFromFB.bind(this);
    this.openScanner=this.openScanner.bind(this);
    this.back=this.back.bind(this);
    this.goToLoginScreens = this.goToLoginScreens.bind(this);
    this.appScreensNavi = this.appScreensNavi.bind(this);
    this.checkIfPushTokenExist = this.checkIfPushTokenExist.bind(this);
  }

alterUserState(isLoggedIn){
    this.setState({
      showAppScreens:isLoggedIn
    })
}

setUpUserDataFromFB(){
    firebase.auth().onAuthStateChanged(this.setUpCurrentUser)
}

setUpCurrentUser(user){
    if (user != null) 
    {
      var _this=this;
      firebase.database().ref('/users/' + firebase.auth().currentUser.uid).once('value').then(function(snapshot) {
          
          _this.setState({
            avatar:user.photoURL != null?{uri: user.photoURL}:require('@images/blank-image.jpg'),
              name:snapshot.val().username,
              bio:snapshot.val().bio,
          })
      });
      
      //Check if Push Tocken exist
      setTimeout(function(){
        _this.checkIfPushTokenExist()
      }, 2000);
    } else {
        // No user is signed in.
       this.setState({
         showAppScreens:true
       })
      }
}

componentDidMount(){
  //Check if user is logged i
  AppEventEmitter.addListener('goToAppScreensNavi',this.appScreensNavi);
  AppEventEmitter.addListener('goToLoginScreensNavi',this.goToLoginScreens);
  AppEventEmitter.addListener('profileUpdateDefInfo', this.setUpUserDataFromFB.bind(this));
  this.setUpUserDataFromFB()


  NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectionChange);

  NetInfo.isConnected.fetch().done(
    (isConnected) => {this.setState({ status: isConnected }); }
  );

  if(Config.loginSetup.anonymousLogin){
    firebase.auth().signInAnonymously().catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      alert(errorCode+" : "+errorMessage);
    });
  }


}

componentWillUnmount() {
 
  //var _this=this;
  //NetInfo.isConnected.removeEventListener('change', this.handleConnectionChange);

 
}


handleConnectionChange = (isConnected) => {
 this.setState({ status: isConnected });
}


/**
 * Show the App Screens, HOME + Settings by updating state
 * @memberof App
 */
appScreensNavi(){
  this.setState({
    showAppScreens:true
  })
}

/**
 * Open the login screen, by updating state
 * @memberof App
 */
goToLoginScreens(){
  this.setState({
    showAppScreens:false
  })
}

async checkIfPushTokenExist(){
  const value = await AsyncStorage.getItem("token");
  if(value != null){
    firebase.database().ref('/users/' + firebase.auth().currentUser.uid).update({
      token:value
    })
  }else{

  }
}

  //When component is mounted
  async componentWillMount() {

    
    //ASK FOR CAMERA ONLT IF IS PREVIEW TRUE AND SHOWBARCODE TRUE
    if(Config.isPreview){
      const { status } = await Permissions.askAsync(Permissions.CAMERA);
      this.setState({hasCameraPermission: status === 'granted'});
    }
  
    

      AppEventEmitter.addListener('user.state.changes', this.alterUserState);

      //Check login status
      // Listen for authentication state to change.
      firebase.auth().onAuthStateChanged((user) => {
        if (user != null) {
          this.setState({
            showAppScreens:true
          });
        }else{
          this.state.showAppScreens=false;
        }
      });

      if(!Config.isPreview){
        
        //Load the data automatically, this is normal app and refister for Push notification
        this.registerForPushNotificationsAsync();
        Notifications.addListener(this._handleNotification);
        this.retreiveMeta();
      }else{
        //Load list of apps
        this.retreiveAppDemos();
      }

      await Font.loadAsync({
        //"Material Icons": require("@expo/vector-icons/fonts/MaterialIcons.ttf"),
        //"Ionicons": require("@expo/vector-icons/fonts/Ionicons.ttf"),
       // "Feather": require("@expo/vector-icons/fonts/Feather.ttf"),
        'open-sans': require('./assets/fonts/OpenSans-Regular.ttf'),
        'lato-light': require('./assets/fonts/Lato-Light.ttf'),
        'lato-regular': require('./assets/fonts/Lato-Regular.ttf'),
        'lato-bold': require('./assets/fonts/Lato-Bold.ttf'),
        'lato-black': require('./assets/fonts/Lato-Black.ttf'),
        'roboto-medium': require('./assets/fonts/Roboto-Medium.ttf'),
        'roboto-bold': require('./assets/fonts/Roboto-Bold.ttf'),
        'roboto-light': require('./assets/fonts/Roboto-Light.ttf'),
        'roboto-thin': require('./assets/fonts/Roboto-Thin.ttf'),
        
      });
      
      this.setState({ isReady: true,fontLoaded: true });
}

  openScanner(){
    this.setState({
      openBCScanner:true
    });
  }
 
  _handleBarCodeRead = ({ data }) => {
    
    if (data !== this.state.lastScannedData) {
      
      LayoutAnimation.spring();
      this.setState({ lastScannedData: data });
      var decodedData = decodeURIComponent(data);
    
    var spl = decodedData.split(";")

    var url = ".firebaseapp.com"

    // Configure firebaseConfig from config.js
    Config.firebaseConfig = {
      apiKey : spl[0],
      authDomain : spl[1] + url ,
      databaseURL : "https://" + spl[1] + ".firebaseio.com",
      projectId : spl[1],
      storageBucket : spl[1] + ".appspot.com"
    }
  
    var _this=this;
     //Configure firebaseMetaPath  from app.json
     appConfig.expo.extra.firebaseMetaPath = spl[2];

    //Set the preview to false
    Config.isPreview = false

    firebase.app("[DEFAULT]").delete().then(function() {


      firebase.initializeApp(Config.firebaseConfig);
      
      /**
       *  Fix for latest version on Firestore
       */
      const firestore=firebase.firestore();
      
      firestore.settings({timestampsInSnapshots:true});
      //END FIX 

      _this.retreiveMeta()
      
     
     
    });
    }
    
    
  }


  _handleNotification = (notification) => {
    this.setState({notification: notification});
  };


// Function for register For PushNotifications
  async registerForPushNotificationsAsync() {

    const { status: existingStatus } = await Permissions.getAsync(
      Permissions.NOTIFICATIONS
    );

    let finalStatus = existingStatus;

    // only ask if permissions have not already been determined, because
    // iOS won't necessarily prompt the user a second time.
    if (existingStatus !== 'granted') {
      // Android remote notification permissions are granted during the app
      // install, so this will only ask on iOS
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;

    }

    // Stop here if the user did not grant permissions
    if (finalStatus !== 'granted') {
      return;
    }

    // Get the token that uniquely identifies this device
    let token = await Notifications.getExpoPushTokenAsync();

      const value = await AsyncStorage.getItem("token");

      var pathToTokens="/expoPushTokens";
      if(appConfig.expo.extra.firebaseMetaPath!="/meta"){
        pathToTokens+=appConfig.expo.extra.firebaseMetaPath;
      }


      // Get a key for a new Post.
       var newPostKey = firebase.database().ref(pathToTokens).push().key;


       if(value == null)
       {
         //Set the token in FireBase
         firebase.database().ref(pathToTokens+"/"+ newPostKey).set({
           token: token
         });
         // Save the value of the token in AsyncStorage

         try {
           await AsyncStorage.setItem("token", await Notifications.getExpoPushTokenAsync());
         } catch (error) {
           // Error saving data
         }
       }
       else {
       }
    }


  //STEP 1 - Retrive metadata from Firebase db
   retreiveMeta(){
    
    //Get the meta data
    var _this=this;
    

    if(firebase.apps.length){

      firebase.database().ref(appConfig.expo.extra.firebaseMetaPath).once('value').then(function(snapshot) {
       
        if(snapshot.val().settings!=undefined){
          //AdMob settings
          if(snapshot.val().settings.adMob!=null){
            Config.showBannerAds=snapshot.val().settings.adMob.showBannerAds == null ? false:snapshot.val().settings.adMob.showBannerAds;
           Config.showinterstitialAds=snapshot.val().settings.adMob.showinterstitialAds == null ? false:snapshot.val().settings.adMob.showinterstitialAds;
            Config.bannerID=snapshot.val().settings.adMob.bannerID == null ? "":snapshot.val().settings.adMob.bannerID;

            AdMobInterstitial.setAdUnitID(snapshot.val().settings.adMob.interstitialID == null ? "":snapshot.val().settings.adMob.interstitialID);
          
            
  
            if(Config.isTesting){
              AdMobInterstitial.setTestDeviceID("EMULATOR");
            }
            
      
            if(Config.showinterstitialAds == true)
            {
              AdMobInterstitial.requestAdAsync().then(() => AdMobInterstitial.showAdAsync());
            }
    
          }
         
          if(snapshot.val().settings.login!=null){
               //LoginSettings
            Config.loginSetup={
            welcomeText: snapshot.val().settings.login.welcomeText == null ? "":snapshot.val().settings.login.welcomeText,
            facebookLogin: snapshot.val().settings.login.facebookLogin == null ? false:snapshot.val().settings.login.facebookLogin, 
            facebookID: snapshot.val().settings.login.facebookID == null?"178511486175063":snapshot.val().settings.login.facebookID,
            googleLogin: snapshot.val().settings.login.googleLogin == null ?false:snapshot.val().settings.login.googleLogin, 
            googleIOSid: snapshot.val().settings.login.googleIOSid == null ? "148773293873-o35mgo7q5ceea45v4fhd9uqivgtjlh4j.apps.googleusercontent.com":snapshot.val().settings.login.googleIOSid,
            googleAndroidId: snapshot.val().settings.login.googleAndroidId == null? "419235345147-5ld8h97mhnk6qq257djds3bu1l9acfuu.apps.googleusercontent.com":snapshot.val().settings.login.googleAndroidId
          }

          }
         
          if(snapshot.val().settings.paypal!=null){
              //PayPal settings
          Config.paypal={
            acceptPayments: snapshot.val().settings.paypal.acceptPayments != null ? snapshot.val().settings.paypal.acceptPayments: true,
            sandBoxMode: snapshot.val().settings.paypal.sandBoxMode == null?true: snapshot.val().settings.paypal.sandBoxMode,
            clientID: snapshot.val().settings.paypal.clientID == null ? "Af_H2HSMUFkVQsDfIggWgobv-QK59pLOR6iX77TpEWLUN8ob0eBGCg48CBX1gcifFKUdu0YHRfyS6Tnl":snapshot.val().settings.paypal.clientID,
            secretKey: snapshot.val().settings.paypal.secretKey == null ? "EHrmFLREuoQ7FMIEITEKckqydqhtQan07pIy0Uhc1TnNmmE33_xWfqlFoBXHg7gjuismQQaNoSzMLWIS" : snapshot.val().settings.paypal.secretKey,
            return_url: snapshot.val().settings.paypal.return_url == null? "https://envato.com/#products": snapshot.val().settings.paypal.return_url,
            cancel_url: snapshot.val().settings.paypal.cancel_url == null? "https://market.envato.com/": snapshot.val().settings.paypal.cancel_url,
            includeShippingInfo: snapshot.val().settings.paypal.includeShippingInfo == null ? true : snapshot.val().settings.paypal.includeShippingInfo,
            currency: snapshot.val().settings.paypal.currency == null ? "USD": snapshot.val().settings.paypal.currency,
            state: snapshot.val().settings.paypal.state == null? "CA":snapshot.val().settings.paypal.state ,
            country_code: snapshot.val().settings.paypal.country_code == null?"US":snapshot.val().settings.paypal.country_code,
            postal_code: snapshot.val().settings.paypal.postal_code == null ? "95131":snapshot.val().settings.paypal.postal_code,
            city: snapshot.val().settings.paypal.city == null? "San Jose":snapshot.val().settings.paypal.city,
          }

          }
          
          if(snapshot.val().settings.orders!=null){
             //Order setup
            Config.sendToEmail= snapshot.val().settings.orders.sendToEmail == null ? "contact@mobidonia.com":snapshot.val().settings.orders.sendToEmail
          }
         

          
      }else {
        //Defined from local

      }
     
         _this.chekIfHaveSliders(snapshot.val())
        
      });
     
    } 
    
    

  }

  _renderNextButton = () => {
    return (
      <View style={css.buttonCircle}>
        <SmartIcon
          defaultIcons={"MaterialIcons"}
          name="MdArrowForward"
          color="rgba(0, 0, 0, .9)"
          size={30}
          style={{ backgroundColor: 'transparent' }}
        />
      </View>
    );
  }

  _renderDoneButton = () => {
    return (
      <View style={css.buttonCircle}>
        <SmartIcon
          defaultIcons={"MaterialIcons"}
          name="MdDone"
          color="rgba(0, 0, 0, .9)"
          size={30}
          style={{ backgroundColor: 'transparent' }}
          
        />
      </View>
    );
  }

  _onDone = async ()  => {
    // User finished the introduction. Show real app through
    // navigation or simply by controlling state
    this.createNavigation(this.state.data)
    
    try {
      await AsyncStorage.setItem('hasSeenTheSliders', "yes");
    } catch (error) {
      // Error saving data
    }
    
  }

   async chekIfHaveSliders(data){
    const hasSeenTheSliders = await AsyncStorage.getItem("hasSeenTheSliders");

    if(data.config.showSlides && data.navigation.slides != null && (hasSeenTheSliders == null||Config.isPreview) ){
      for (let index = 0; index < data.navigation.slides.length; index++) {
        data.navigation.slides[index].image={uri:  data.navigation.slides[index].image};
        data.navigation.slides[index].imageStyle = { 
          width:  data.navigation.slides[index].width|320,
          height: data.navigation.slides[index].height|267 }
          data.navigation.slides[index].textStyle={color: '#838191'};
          data.navigation.slides[index].titleStyle={color: '#302c48',fontWeight: '500'};
      }
      this.setState({
        slides:data.navigation.slides,
        showSliders:true,
        data:data
      })
     
    }
    else{
      this.createNavigation(data)
    }
  }

  //STEP 2 - Create the drawer and all the tree navigation
  createNavigation(data){
    
    var config = data.config
    //Routes structure
    var routes={};
    var defaultRoute=data.navigation.menus[0].name;
    
   
    
    //Initialize the global design - user in other components on render
    var design=data.design;
    css.dynamic=data.design;
    AppEventEmitter.emit('colors.loaded');
    isReqUserVarification=data.config.userVarification
    allowedUsers=data.config.allowedUsers
    
    Config.config = data.config
    
    //Loop in the menus, for each item create StackNavigator with routes
    //Basicaly, for each item, create his appropriate screens inside StackNavigator
    //The master-detail type is the core one - contains Master, Categories , Master Sub and Details sceen
    //Other screens like cart and orders contains single windows
    data.navigation.menus.map((item,index)=>{
      
      
      //Each menu has stack nav with 3 routes, if type is master-detail or undefined
      if(item.type=="cart"||item.sectionType=="cart"){
        //Create the required screens in StackNavigator
        var theScreen = createStackNavigator({
          Cart: { screen: ({ navigation })=>(<MyCartSreen data={item} navigation={navigation} design={design} isRoot={true} config={config} />) },
        },{
          initialRouteName:"Cart",
          headerMode:"none",
          navigationOptions: {
            headerTintColor: 'blue',
          }
        });
      } else if(item.sectionType=="web"){
        //Create the required screens in StackNavigator
        var theScreen = createStackNavigator({
          Web: { screen: ({ navigation })=>(<MyWebSreen data={item} navigation={navigation} design={design} isRoot={true} fromNotification={false} />) },
        },{
          initialRouteName:"Web",
          headerMode:"none",
          navigationOptions: {
            headerTintColor: 'blue',
          }
        });
      }else if(item.type=="orders"||item.sectionType=="orders"){
        //Create the required screens in StackNavigator
        var theScreen = createStackNavigator({
          Orders: { screen: ({ navigation })=>(<MyOrdersSreen data={item} navigation={navigation} design={design} isRoot={true} />) },
          OrderDetail: { screen: ({ navigation })=>(<MyOrderDetailSreen data={item} navigation={navigation} design={design}/>) },
        },{
          initialRouteName:"Orders",
          headerMode:"none",
          navigationOptions: {
            headerTintColor: 'blue',
          }
        });
      }else if(item.type=="map"||item.sectionType=="map"){
        //Create the required screens in StackNavigator
        var theScreen = createStackNavigator({
          Map: { screen: ({ navigation })=>(<MyMapSreen data={item} navigation={navigation} design={design} isRoot={true} />) },
          DetailsFromMap: { screen:({ navigation })=>(<MyDetailsSreen data={item} navigation={navigation} design={design} />) },
          Gallery: { screen:({ navigation })=>(<MyGallerySreen data={item} navigation={navigation} design={design} />) },
        },{
          initialRouteName:"Map",
          headerMode:"none",
          navigationOptions: {
            headerTintColor: 'blue',
          }
        });
      }else if(item.type=="notifications"||item.sectionType=="notifications"){
        //Create the required screens in StackNavigator
        var theScreen = createStackNavigator({
          Notifications: { screen: ({ navigation })=>(<MyNotificationsSreen data={item} navigation={navigation} design={design} isRoot={true} config={config} />) },
          Web: { screen:({ navigation })=>(<MyWebSreen data={item} navigation={navigation} design={design} fromNotification={true}/>) },
        },{
          initialRouteName:"Notifications",
          headerMode:"none",
          navigationOptions: {
            headerTintColor: 'blue',
          }
        });
      }else if(item.type=="addNewItem"||item.sectionType=="addNewItem"){
        //Create the required screens in StackNavigator
       
        var theScreen = createStackNavigator({
          
          Form: { screen: ({ navigation })=>(<MyFormScreen data={item} navigation={navigation} design={design} isRoot={true} formSetup={item.formSetup} collectionName={item.data_point}/>)},
        },{
          initialRouteName:"Form",
          headerMode:"none",
          navigationOptions: {
            headerTintColor: 'blue',
          }
        });
      }else if(item.type=="addContact"||item.sectionType=="addContact"){
        //Create the required screens in StackNavigator
        var theScreen = createStackNavigator({
          AddContact: { screen: ({ navigation })=>(<MyAddContactSreen data={item} navigation={navigation} design={design} isRoot={true} config={config} />) },
          CreateGroupChat: { screen: ({ navigation })=>(<MyCreateGroupChatSreen data={item} navigation={navigation} design={design} />)},
          Chat: { screen: ({ navigation })=>(<MyChatSreen data={item} navigation={navigation} design={design} />)},
          Profile: { screen: ({ navigation })=>(<MyProfileSreen data={item} navigation={navigation} design={design}  />)},
          ProfileSettings: { screen:({ navigation })=>(<MyProfileSettingsSreen data={item} navigation={navigation} design={design} isReqUserVarification={isReqUserVarification} allowedUsers={allowedUsers}/>) },
          ListOfUsers: { screen:({ navigation })=>(<MyListOfUsersSreen data={item} navigation={navigation} design={design} />) },
          Chats: { screen:({ navigation })=>(<MyChatsSreen data={item} navigation={navigation} design={design}  />) },
        },{
          initialRouteName:"AddContact",
          headerMode:"none",
          navigationOptions: {
            headerTintColor: 'blue',
          }
        });
      }else if(item.type=="profile"||item.sectionType=="profile"){
        //Create the required screens in StackNavigator
        var theScreen = createStackNavigator({
          Login: { screen: ({})=>(<MyLoginSreen  isReqUserVarification={isReqUserVarification} allowedUsers={allowedUsers} />),  navigationOptions: ({ navigation }) => ({ title: '',
          header: null,
        })
      },
          Chat: { screen: ({ navigation })=>(<MyChatSreen data={item} navigation={navigation} design={design} />)},
          Profile: { screen: ({ navigation })=>(<MyProfileSreen data={item} navigation={navigation} design={design} isRoot={true} />)},
          ProfileSettings: { screen:({ navigation })=>(<MyProfileSettingsSreen data={item} navigation={navigation} design={design} isReqUserVarification={isReqUserVarification} allowedUsers={allowedUsers}/>) },
          ListOfUsers: { screen:({ navigation })=>(<MyListOfUsersSreen data={item} navigation={navigation} design={design} />) },
          ForgetPassword: {screen: ForgetPassword},
          SignUp: { screen: SignUp },
          Login: { screen: ({})=>(<MyLoginSreen  isReqUserVarification={isReqUserVarification} allowedUsers={allowedUsers} />),  navigationOptions: ({ navigation }) => ({ title: '',
        header: null,
      })
    },
          
         },{
          initialRouteName:"Profile",
          headerMode:"none",
          navigationOptions: {
            headerTintColor: 'blue',
          }
        });
      }
      else if(item.type=="scanner"||item.sectionType=="scanner"){
        //Create the required screens in StackNavigator
        var theScreen = createStackNavigator({
          Scanner: { screen: ({ navigation })=>(<MyScannerScreen data={item} navigation={navigation} design={design} isRoot={true} />) },
          OrderAction: { screen: ({ navigation })=>(<MyDetailsFromScanner data={item} navigation={navigation} design={design} />) },
         },{
          initialRouteName:"Scanner",
          headerMode:"none",
          navigationOptions: {
            headerTintColor: 'blue',
          }
        });
      }else if(item.type=="chats"||item.sectionType=="chats"){
        //Create the required screens in StackNavigator
        var theScreen = createStackNavigator({
          Chats: { screen:({ navigation })=>(<MyChatsSreen data={item} navigation={navigation} design={design} isRoot={true} />) },
          Chat: { screen: ({ navigation })=>(<MyChatSreen data={item} navigation={navigation} design={design} />)},
          Profile: { screen: ({ navigation })=>(<MyProfileSreen data={item} navigation={navigation} design={design} />)},
          Login: { screen: ({})=>(<MyLoginSreen  isReqUserVarification={isReqUserVarification} allowedUsers={allowedUsers} />),  navigationOptions: ({ navigation }) => ({ title: '',
        header: null,
      })
    },
        },{
          initialRouteName:'Chats',
          headerMode:"none",
          navigationOptions: {
            headerTintColor: 'blue',
          }
        });
      }else if(item.type=="comments"||item.sectionType=="comments"){
        //Create the required screens in StackNavigator
        
        var theScreen = createStackNavigator({
          
          Chat: { screen: ({ navigation })=>(<MyChatSreen data={item} navigation={navigation} design={design} id={item.objectIdToShow} path="comments/"/>)},
          Profile: { screen: ({ navigation })=>(<MyProfileSreen data={item} navigation={navigation} design={design} />)},
          Login: { screen: ({})=>(<MyLoginSreen  isReqUserVarification={isReqUserVarification} allowedUsers={allowedUsers} />),  navigationOptions: ({ navigation }) => ({ title: '',
        header: null,
      })
    },
   
        },{
          initialRouteName:'Chat',
          headerMode:"none",
          navigationOptions: {
            headerTintColor: 'blue',
          }
        });
      }else if(item.type=="listOfUsers"||item.sectionType=="listOfUsers"){
        //Create the required screens in StackNavigator
        var theScreen = createStackNavigator({
          
          ListOfUsers: { screen:({ navigation })=>(<MyListOfUsersSreen data={item} navigation={navigation} design={design} isRoot={true} />) },
         
          Chat: { screen: ({ navigation })=>(<MyChatSreen data={item} navigation={navigation} design={design} />)},
          Profile: { screen: ({ navigation })=>(<MyProfileSreen data={item} navigation={navigation} design={design} />)},
          Login: { screen: ({})=>(<MyLoginSreen  isReqUserVarification={isReqUserVarification} allowedUsers={allowedUsers} />),  navigationOptions: ({ navigation }) => ({ title: '',
        header: null,
      })
    },
        },{
          initialRouteName:'ListOfUsers',
          headerMode:"none",
          navigationOptions: {
            headerTintColor: 'blue',
          }
        });
      }else if(item.type==""||item.type==null||item.type=="master-detail"||item.sectionType=="master-detail"||item.type=="wish-list"||item.sectionType=="wish-list"){
        
        //Default
       
         var initialRootName = item.initialRootName != null? item.initialRootName:"Master"

        //In case categories are the one that should be shown first
        if(item.category_first){
          initialRootName="Categories"
        }else if(item.subMenus&&item.subMenus.length>0){
          //When we have sub menus
          initialRootName="MasterSUB"
        }else if(item.goDirectlyToDetails){
          //Goes directly to details
          
          initialRootName="Details"
        }
        
        console.log(JSON.stringify(item))
        //Create the required screens in StackNavigator
        var theScreen = createStackNavigator({
          Master: { screen: ({ navigation })=>(<MyMastSreen data={item} navigation={navigation} design={design} isRoot={true} />) },
          Home: { screen: ({ navigation })=>(<MyHomeSreen data={item} navigation={navigation} design={design} isRoot={true} />) },
          LocationScreen: { screen: ({ navigation })=>(<MyLocationScreen data={item} navigation={navigation} design={design} isRoot={true} />) },
          Categories: { screen: ({ navigation })=>(<MyCategoriesSreen data={item} navigation={navigation} design={design} isRoot={item.category_first} subMenus={[]} />) },
          Review: { screen: ({ navigation })=>(<MyReviewSreen data={item} navigation={navigation} design={design} isRoot={false} subMenus={[]} />) },
          MasterSUB: { screen: ({ navigation })=>(<MyCategoriesSreen data={{'categorySetup':item}} navigation={navigation} design={design} isRoot={true} subMenus={item.subMenus} />) },
          Details: { screen:({ navigation })=>(<MyDetailsSreen data={item} navigation={navigation} design={design} isRoot={true} />) },
          Gallery: { screen:({ navigation })=>(<MyGallerySreen data={item} navigation={navigation} design={design} />) },
          ForgetPassword: {screen: ForgetPassword},
          SignUp: { screen: SignUp },
          WebSub: { screen: ({ navigation })=>(<MyWebSreen data={item} navigation={navigation} design={design} isRoot={true} fromNotification={true} />) },
          NotificationsSub: { screen: ({ navigation })=>(<MyNotificationsSreen data={item} navigation={navigation} design={design} isRoot={false} />) },
          OrdersSub: { screen: ({ navigation })=>(<MyOrdersSreen data={item} navigation={navigation} design={design} isRoot={false} />) },
          OrderDetail: { screen: ({ navigation })=>(<MyOrderDetailSreen data={item} navigation={navigation} design={design}/>) },
          ProfileSettingsSub: { screen:({ navigation })=>(<MyProfileSettingsSreen data={item} navigation={navigation} design={design} isRoot={false} />) },
          SubProfile: { screen: ({ navigation })=>(<MyProfileSreen data={item} navigation={navigation} design={design} isRoot={false} />)},
          ProfileSettings: { screen:({ navigation })=>(<MyProfileSettingsSreen data={item} navigation={navigation} design={design} />) },
          ListOfUsersSub: { screen:({ navigation })=>(<MyListOfUsersSreen data={item} navigation={navigation} design={design} />) },
          Chats: { screen:({ navigation })=>(<MyChatsSreen data={item} navigation={navigation} design={design} />) },
          Chat: { screen: ({ navigation })=>(<MyChatSreen data={item} navigation={navigation} design={design} />)},
          Form: { screen: ({ navigation })=>(<MyFormScreen data={item} navigation={navigation} design={design} />)},
          
        },{
          //initialRouteName:item.category_first?"Categories":(item.subMenus&&(item.subMenus.length>0?"MasterSUB":"Details")),
          initialRouteName:initialRootName,
          headerMode:"none",
          navigationOptions: {
            headerTintColor: 'blue',
          }
        });
      }

      //Add navigation options to each StackNavigator
      //Create icon and name
      theScreen.navigationOptions = {
        drawerLabel: item.name,
        tabBarLabel: css.dynamic.general.hideTabIconName?" ":item.name,
        drawerIcon: ({ tintColor }) => (
          <NavigationIcon icon={item.icon} size={24} tintColor={tintColor}/>
        ),
        tabBarIcon: ({ focused,tintColor }) => (
          <NavigationIcon focused={focused} icon={item.icon} tintColor={tintColor} />
        )
      };

      //For each item, inside the routes, add the route with givven name
      routes[item.name]={
        path: '/'+item.name,
        screen: theScreen,
      }
    });
    //END of the loop of menus
    //At this point we have all the routes created.

    //=== LAYOUT CREATION =======
    //Advance or simple coloring
    var tintColor=design.general&&design.general.coloring&&design.general.coloring=="advanced"?design.sideMenu.activeTintColor:design.general.buttonColor;
    
    this.loginNavi=createAppContainer(createStackNavigator({
      ForgetPassword: {screen: ForgetPassword},
      SignUp: { screen: SignUp },
      Login: {screen: Login},
    },{
        initialRouteName:'Login',
        headerMode:"none",
        navigationOptions: {
          headerTintColor: 'blue',
        }   
    }));
   
        
        
    if(design.general&&design.general.layout&&design.general.layout=="tabs"){

      //TABS
      this.navi = createAppContainer(createBottomTabNavigator(
        routes,
        {
         
          initialRouteName: defaultRoute,
          tabBarPosition: 'bottom',
          swipeEnabled: false,
          lazyLoad: true,
          animationEnabled: false,

          tabBarOptions: {
            showIcon: true,
            showLabel: !design.general.hideTabIconName,
            activeTintColor: tintColor,
            inactiveTintColor:design.sideMenu.inactiveTintColor,
            indicatorStyle: {
            backgroundColor: tintColor
           },

          style: {
            backgroundColor: design.general.backgroundColor,
           
          },
          

          },
          contentOptions: {
            activeTintColor: tintColor,
            activeBackgroundColor: design.sideMenu.activeBackgroundColor,
            inactiveTintColor:design.sideMenu.inactiveTintColor,
            inactiveBackgroundColor:design.sideMenu.inactiveBackgroundColor
          },
        }
      ));

    }else if(design.general&&design.general.layout&&design.general.layout=="grid"){
      console.log(JSON.stringify(routes))
       //GRID Navigation

      //Options for nav
      var navigationOptions = {
          header: null,
      };

       
       theGridScreen=createStackNavigator({
            GridView: { screen: ({ navigation })=>(<MyGridScreen data={data} navigation={navigation} design={design} isRoot={true} />) },
        },{
            initialRouteName:"GridView",
            headerMode:"none",
            navigationOptions: navigationOptions
        });

       routes['ourGridInitalView']={
        path: '/ourGridInitalView',
        screen: theGridScreen,
      }

       this.navi = createStackNavigator(
           routes,
           {
            initialRouteName: "ourGridInitalView",
            navigationOptions: navigationOptions
           }
       )       
    }else{
      //SIDE Navigation
      this.navi = createAppContainer(createDrawerNavigator(
        routes,
        {
          initialRouteName: defaultRoute,
          contentComponent: props =>
            <ScrollView style={{backgroundColor:design.sideMenu.sideNavBgColor}}>
              <View style={css.static.imageLogoHolder}>
                <Image style={css.layout.profileImageEdit} source={this.state.avatar} ></Image>
              </View>
              <View style={css.layout.sideNavTxtParent}>
                  <Text style={css.layout.sideNavText}>{this.state.name}</Text>
                  <Text style={css.layout.sideNavText}>{this.state.bio}</Text>
              </View>
             
              <DrawerItems {...props}></DrawerItems>
            </ScrollView>,
          contentOptions: {
            activeTintColor: tintColor,
            activeBackgroundColor: design.sideMenu.activeBackgroundColor,
            inactiveTintColor:design.sideMenu.inactiveTintColor,
            inactiveBackgroundColor:design.sideMenu.inactiveBackgroundColor
          },
        }
        ));
    }

    //=== END LAYOUT ============

    //Notify the state that we have the routes and drwer created, it should rerender the initial screen
    this.setState({
      metaLoaded:true,
      meta:data,
    })
  }
 
  

  back(){
    this.setState({
      openBCScanner:false
    })
  }

  

  //DEMO STEP 1 - Retreive list of demo apps
  retreiveAppDemos(){
    var _this=this;
    
    //Get list of apps, and put the data in the state
    firebase.database().ref("apps").once('value').then(function(snapshot) {
      var allAppsData=snapshot.val();
      var apps=[];
      Object.keys(allAppsData).map(function(key, index) {
         allAppsData[key]["key"]=key;
         apps.push(allAppsData[key])

      });
      _this.setState({allAppsData:apps})
      
    });
  }

   //DEMO STEP 2 - Crerea an app row, opens single app
   renderAppRow = ({item,index}) => (
    <TouchableOpacity onPress={()=>{
      appConfig.expo.extra.firebaseMetaPath=item.key;
      this.chekIfHaveSliders(item)
      }}>
      <View style={[AppListStyle.standardRow,{backgroundColor:"#ffffff",borderRadius:10,margin:4,marginBottom:15,paddingLeft:10,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 4 },
        elevation: 5,
        }]}>
        <LinearGradient  colors={gradients[(index%gradients.length)]}
        style={{backgroundColor:"white",width:50,height:50,borderRadius:25,justifyContent:"center",alignItems:"center"}}>
            <SmartIcon defaultIcons={"MaterialIcons"} name={item.appListIcon}  size={30} color='#ffffff'/>
        </LinearGradient>
        <View style={[AppListStyle.standardRowTitleArea,{marginLeft:15}]} >
          <Text style={{color:"#434F64",fontWeight:'300',fontFamily: 'lato-bold',}}>{fun.callFunction(item.key,"capitalizeFirstLetter,append~ App") }</Text>
        </View>
        <View style={[AppListStyle.standardRowArrowArea,{opacity:0.5}]} >
        
          <MaterialIcons name={"navigate-next"} size={24} color="#434F64"  />
        </View>
      </View>
    </TouchableOpacity>
  );

  
  //STEP 3 - render
  render() {
    
    if(this.state.metaLoaded&&this.state.isReady){
      //Data is loaded , do we need a login
      if(this.state.meta.config.loginRequired&&!this.state.showAppScreens){
        
        return (
          <ActionSheetProvider>
            <this.loginNavi isLoggedIn={this.state.showAppScreens} />
          </ActionSheetProvider>);
      }else{
        //Normaly, go inside the app
       
          return (
            <ActionSheetProvider>
              <this.navi isLoggedIn={this.state.showAppScreens} isReqUserVarification={this.state.meta.config.userVarification}  />
            </ActionSheetProvider>
            );
      }
      
    }else{
      if(!Config.isPreview){
        //Normal App, Data is not yet loaded, show the loading screen
        return (
          <View style={css.static.container}>
            <View style={css.static.imageHolder}>
              <Image style={css.static.image} source={require('@images/logo.png')} />
            </View>
            <View style={css.static.loading} >
              <Text style={css.static.text}>v {version} Loading ...</Text>
            </View>
          </View>
        )
      }else{
        //This is a preview app, show the list of Apps
        if(this.state.openBCScanner){
          const { hasCameraPermission } = this.state;

          if(hasCameraPermission === null) {
            return <Text>Requesting for camera permission</Text>;
          } else if (hasCameraPermission === false) {
            return <Text>No access to camera</Text>;
          } else {
            return (
              <View style={{ flex: 1 }}>
                  
                <BarCodeScanner
                  onBarCodeScanned={this._handleBarCodeRead}
                  style={StyleSheet.absoluteFill}
                >
                <TouchableOpacity
                  onPress={this.back}>
              
                  <View style={{marginTop:40,marginLeft:10}}>
                    <SmartIcon defaultIcons={"MaterialIcons"} name={"FeArrowLeft"}  size={25} color='white'/>
                  </View>
              </TouchableOpacity>
              </BarCodeScanner>
             </View>
            );
          }

        }else{
          if(this.state.showSliders){
            if (!this.state.showRealApp) {
              

                return <AppIntroSlider slides={this.state.slides} onDone={this._onDone} renderDoneButton={this._renderDoneButton}
                renderNextButton={this._renderNextButton}/>;
              
          
            }
            
          }else{
            if(this.state.fontLoaded){
              return (
                <View style={{padding:10,paddingTop:60,backgroundColor:"#f7f7f7",flex:1}}>
                    <View style={{flexDirection: 'row',justifyContent: 'flex-end'}}>
                       <ConditionalDisplay condition={Config.showBCScanner}>
                            <TouchableOpacity 
                                onPress={this.openScanner}>
                                <SmartIcon defaultIcons={"MaterialIcons"} name={"MdCropFree"}  size={25} color="#434F64"/>
                            </TouchableOpacity>
                       </ConditionalDisplay>
                    </View>
                    <Text style={[css.static.defaultTitle,{paddingLeft:4}]}>Select an app</Text>
                    
                    <FlatList
                      style={{marginTop:20,backgroundColor:"#f7f7f7"}}
                      data={this.state.allAppsData}
                      renderItem={this.renderAppRow}
                    />
                </View>
              )
            }else{
              return <View></View>
            }
            
        }
      }
      }

    }
  }

}

const gradients=[
  ['#fad0c4','#ff9a9e'],
  ['#fbc2eb','#a18cd1'],
  ['#ffecd2','#fcb69f'],
  ['#ff9a9e','#fecfef'],
  ['#f6d365','#fda085'],
  ['#fbc2eb','#a6c1ee'],
  ['#fdcbf1','#e6dee9'],
  ['#a1c4fd','#c2e9fb'],
  ['#d4fc79','#96e6a1'],
  ['#84fab0','#8fd3f4'],
  ['#cfd9df','#e2ebf0'],
  ['#a6c0fe','#f68084'],
  ['#fccb90','#d57eeb'],
  ['#e0c3fc','#8ec5fc'],
  ['#f093fb','#f5576c'],
  ['#4facfe','#00f2fe'],
  ['#43e97b','#38f9d7'],
  ['#fa709a','#fee140'],
  ['#a8edea','#fed6e3'],
  ['#89f7fe','#66a6ff']
];
