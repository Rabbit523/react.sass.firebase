import React, {StyleSheet, Dimensions, PixelRatio,Platform} from "react-native";
var headerHeight=40;
const {width, height, scale} = Dimensions.get("window"),
    vw = width / 100,
    vh = height / 100,
    vmin = Math.min(vw, vh),
    vmax = Math.max(vw, vh);
//The forgraound color on the progress indicator
const activeColor="#BD1C1D"; //#fe7013

exports.isIphoneX = () => {
  let d = Dimensions.get('window');
  const { height, width } = d;

  return (
    // This has to be iOS duh
    Platform.OS === 'ios' &&

    // Accounting for the height in either orientation
    (height === 812 || width === 812)
  );
}
const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

function wp (percentage) {
    const value = (percentage * viewportWidth) / 100;
    return Math.round(value);
}
const IS_IOS = Platform.OS === 'ios';
const slideHeight = viewportHeight * 0.27;
const slideWidth = wp(60);
const itemHorizontalMargin = wp(2);

const sliderWidth = viewportWidth;
const itemWidth = slideWidth + itemHorizontalMargin;

const entryBorderRadius = 8;
exports.sliderWidth=sliderWidth;
exports.itemWidth=itemWidth;
exports.w=width;
exports.h=height;

exports.static=StyleSheet.create({
    "headerImage":{
      "height":180,
      "width":width,
    },
    "border":{
      "height":1,
    },
    container: {
      flex: 1,
      backgroundColor: '#ffffff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    text:{
      color:"black"
      
    },
    imageHolder:{
      flex:75,
       alignItems: 'center',
       justifyContent: 'center',
    },
    imageLogoHolder:{
      alignItems: 'center',
      justifyContent: 'center',
      marginTop:40,
      marginBottom:20
    },
    image:{
      width:200,
      height:200,
    },
    logo:{
      width:100,
      height:100,
      borderRadius: 70,
    },
    loading:{
      flex:25,
       alignItems: 'center',
       justifyContent: 'center',
    },
    list: {
      justifyContent: 'center',
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    detailsScroll:{
      paddingVertical: 20,
      bottom:0,
      flex:1,
    },
    intemInfoLabel: {
        fontSize: 12,
        marginLeft: 10,
        marginTop: 4,
        marginRight: 8,
        color: '#333',
        fontWeight: '300',
    },
    paymentOptionsStyle:{
      height:100,
      justifyContent: "space-around",
      flexDirection: 'row',
      marginTop: 10,
      marginBottom: 10
    },
    paymentOption: {
      flex:1,
      width:(width/2)-50,
      borderRadius: 4,
      borderColor: "#ddd",
      borderWidth: 1,
      alignSelf: "center",
      alignItems: "center",
      justifyContent: "space-around",
      
      },
    paymentOptionImage: {
      height:50,
      width:100
    },
    defaultTitle: {
      color:"#434F64",
      fontFamily: 'lato-black',
      fontWeight: "900",
      fontSize:25,
    }
});

exports.layout=StyleSheet.create({
  containerFlexability:{
    flex:1
  },
  containerBackground:{
    backgroundColor:"rgba(0,0,0,0)"
  },
  commonContainer:{
    //backgroundColor:'green',
    justifyContent: 'center',
    alignItems: 'center',
    //marginBottom:80,
  },
  categoryList:{
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  scrollableTabViewStyle:{
    backgroundColor: '#fff'
  },
  stepIndicatorBackground:{
    backgroundColor:"#eeeeee"
  },
  cardHolder:{
    flex:10,
    paddingRight:10,
    paddingLeft:10,
    paddingBottom:10
  },
  cartSubHolder:{
    height:70,
    flexDirection: 'row'
  },
  cardBackButtonHolder:{
    flex:2,
    paddingRight:10
  },
  orderCompletedStyleIcon:{
    alignItems:"center",
    justifyContent:"center",
    marginTop:30,
    borderRadius:60,
    height:120,
    width:120,
    backgroundColor:"red"
  },
  orderCompletedStyleText:{
    marginTop:10,
    padding:20,
    alignItems:"center",
    flex:1
  },
  orderCounter:{
    marginLeft:10,
    flex: 1,
    flexDirection: 'row',
    marginRight:10
  },
  orderOption:{
    marginLeft:10,
    flex: 1,
    marginRight:10
  },
  createInfoStr1:{
    flex:1,
    flexDirection: 'row',
    paddingLeft:20,
    paddingRight:20
  },
  orderDisplaySubContainer:{
    flex:1,
    height:26,
    backgroundColor:"gray",
    borderRadius:13,
    justifyContent:"center"
  },
  orderDisplayContainer:{
    flex:1,
    margin:10
  },
  orderDisplayText:{
    color:"#ffffff",
    marginLeft:10,
    width:200
  },
  noItemsTextStyle:{
    justifyContent: 'center',
    textAlign:'center',
    marginTop:10,
    opacity:0.7,
    fontFamily: 'open-sans'
  },
  scrollableTabViewStyle:{
    padding: 0,
    margin: 0
  },
  tabLabelStyle:{
    flex:1,
    alignItems:"center"
    
  },
  tagViewStyle:{
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  infoBoxStyle:{
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft:10,
    marginBottom:10,
    marginTop:10
  },
  mapOverlay:{
    position: 'absolute',
    left: 0,
    bottom: 10,
    width: width,
    height: 150,
    backgroundColor: "rgba(0,0,0,0)",
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    height:550,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 0,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    marginTop:height-550>0?(height-550)/2:0,
  },
  orderDetailView:{
    flex: 1, 
    marginTop: 20, 
    marginLeft: 20, 
    marginRight: 20, 
    marginBottom: 0, 
    backgroundColor: "white", 
    flexDirection: 'column'
  },
  orderName:{
    marginTop: 15, 
    marginLeft: 20, 
    fontSize: 18, 
    fontWeight: "600" 
  },
  orderContent:{
    flex: 1, 
    alignItems: 'center', 
    marginTop: 40, 
    marginBottom: 10, 
    flexDirection: 'column', 
    
  },
  orderUser:{
    textAlign: "center", 
    fontSize: 15, 
    color: "#8c8c8c", 
    fontWeight: "600"
  },
  qrImage:{
    width: 250, 
    height: 250, 
    marginTop: 30
  },
  orderID:{
    alignItems: 'center', 
    marginTop: 30, 
    textAlign: "center"
  },
  shareOrderButton:{
    flex: 1,
    marginTop: 5,
    marginLeft:20,
    marginRight:20
  },
  googleFBLogin:{
    marginLeft: 25,
    height: 50,
    width:50,
   

  },
  loginButton:{
    marginRight:55,
    marginLeft:55,
    alignItems: 'center',
    borderRadius: 40
  },
  loginBtnTxt:{
    margin:20,
    color:'white',
    fontFamily: 'lato-regular',
    fontSize:16
  },
  createAccountTxt:{
    fontFamily: 'lato-bold',
    fontSize:30,
    marginLeft:20,
    marginTop:30,
    marginBottom:10
  },
  name:{
    fontFamily: 'lato-black',
    fontSize:25,
    marginTop:17,
    width:width/2-5
  },
  nameProf1:{
    fontFamily: 'lato-black',
    fontSize:25,
    marginTop:30,
    marginLeft:15,
    width:width/2
  },
  subSreateAccountTxt:{
    fontFamily: 'lato-regular',
    fontSize:14,
    marginLeft:30,
    marginBottom:15,
    color:'rgb(131, 131, 131)'
  },
  
  signUpButtonContainer:{
    marginLeft: 30,
    marginRight: 30,
    backgroundColor:'rgb(233, 69, 120)',
    alignItems: 'center',
    borderRadius: 5
  },
  signUpButtonText:{
    fontFamily: 'lato-bold',
    fontSize:16,
    color:'white',
    
  },
    createAccount:{
    alignItems: 'center',
    marginTop: 10,
    padding: 10,
    fontFamily: 'lato-regular',
    color: 'white', 
    fontSize: 16
  },
  line:{
    marginTop:5,
    borderColor: '#d5d5e0',
    borderWidth: 0.5,
    marginLeft:0,
    marginRight:0,
    marginBottom:5
  },
  alreadyHaveAccountTxt:{
    fontFamily: 'lato-regular',
    fontSize: 14,
    marginTop:35,
    color:'rgb(135, 135, 135)'
  },
  emailFPTxt:{
    fontSize:16,
    fontFamily:'lato-regular',
    color:'rgb(151, 153, 157)',
    marginLeft:20
  },
  forgetPassTxt:{
    marginTop:80,
    marginLeft:50,
    fontSize:45,
    fontFamily:'lato-bold'
  },
  forgetPassAndCAParent:{
    flex:1,
    alignItems: 'center',
    marginTop:30
  },
  subForgetPassTxt:{
    marginTop:20,
    marginLeft:50,
    fontSize:16,
    fontFamily:'lato-regular',
    color:'rgb(156, 158, 163)',
    marginBottom:50
  },
  imageBackground:{
    width: '100%', 
    height: '100%'
  },
  profileImage:{
    width: '100%', 
    height: height/2+100,
    position: 'absolute'
  },
  profileImage2Style:{
    width: 100, 
    height: 120,
    //margin:10,
    borderRadius:10

    
  },
  logo:{
    width:100,
    height:100,
    justifyContent:'center',
    marginLeft: 'auto',
    marginRight:'auto',
    marginTop:70
  },
  emailAndPasswordTextInput:{
    borderColor: 'rgb(233, 233, 233)',
    fontFamily: 'lato-regular', 
    borderWidth: Platform.OS == 'android' ? 0 : 1,
    marginLeft:30,
    marginRight:30,
    height: 50,
    paddingLeft:8,
    marginTop: 5,
    fontSize: 15,
    color:'#666666'
  },
  descriptionTextInput:{
    borderColor: 'rgb(233, 233, 233)',
    fontFamily: 'lato-regular', 
    borderWidth: 1,
    marginLeft:30,
    marginRight:30,
    height: 100,
    paddingLeft:8,
    marginTop: 5,
    fontSize: 15,
    color:'#666666'
  },
  emailAndPasswordText:{
    fontFamily: 'lato-bold', 
    marginTop: 20, 
    marginLeft:30, 
    color: 'rgb(101, 102, 212)', 
    fontSize: 12
  },
  forgetPass:{
    fontFamily: 'lato-regular', 
    marginTop: 10,
    color: 'white', 
    fontSize: 16
  },
  loginContainer:{
    marginTop: 50,
    marginLeft: 30,
    marginRight: 30,
    backgroundColor: 'rgba(0,0,0,0)',
    borderRadius: 10,
    height: 180
  },
  signUpContainer:{
    marginLeft: 20,
    marginRight: 20,
    backgroundColor: 'white',
    height: 600
  },
  orFBGoogle:{
    backgroundColor: 'rgba(0,0,0,0)',
    marginTop:20,
    textAlign: 'center'
  },
  fbOrGoogleContainer:{
    flexDirection: 'row', 
    alignItems: 'center',
    marginLeft:100,
    marginRight:40,
    marginTop:20
  },
  avtivityIndicator:{
    height: 100,
    marginTop:10,
    marginBottom:10
  },
  forgetPassContainer:{
    marginTop: 40,
    marginLeft: 50,
    marginRight: 50,
    backgroundColor: 'white',
    borderRadius: 10,
    height: 140
  },
  activityIndicatorView:{
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    opacity: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    height:height-200
  },
  loginInput:{
    position: 'absolute',
    left: Platform.OS == 'android' ? 0 : 10,
    right: 20,
    height: 20,
    fontSize: 14,color: '#FFF',
    height: Platform.OS == 'android' ? 40 : 40,
    paddingVertical: 0,
    borderBottomWidth: Platform.OS == 'android' ? 0 : 1,
  },
  imageChat: {
    width: 150,
    height: 100,
    borderRadius: 13,
    margin: 3,
    resizeMode: 'cover'
  },
  activityIndicatorView2:{
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    opacity: 0.5,
    alignItems: 'center',
    height:height-200
  },
  activitiIndicatorContainer2:{
    height: 80,
    width: 80,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  
   
},

  activitiIndicatorContainer:{
    backgroundColor: '#FFFFFF',
    height: 80,
    width: 80,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
},
  activityIndicator:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  profileImageEdit:{
    width: 110, 
    height: 110,
    borderRadius: 55,
    
  },
  profileImageParent:{
    justifyContent: 'center',
    alignItems: 'center',
    marginTop:40,
    marginBottom:30
  },
  logoutButton:{
    marginTop: 10,
    marginLeft: 90,
    marginRight: 90
  },
  updateProfileButton:{
    marginTop: 45,
    marginLeft: 50,
    marginRight: 50
  },
  welcomeText:{
    fontSize:43,
    fontFamily:'lato-light',
    color:"white",
    textAlign: 'center'
  },
  emailTxtLogin:{
    fontSize:18,
    fontFamily:'lato-light',
    color:"white",
    marginLeft:10
  },
  profileInfoContainer:
  {
    backgroundColor: 'white',
    height: 300,
    borderTopLeftRadius:40,
    borderTopRightRadius:40,
   
  },
  bio:{
    color:'#77777a',
    fontFamily: 'lato-regular',
    fontSize: 14,
    marginLeft:20,
    marginBottom:10
  },
  sideNavText:{
    color:'#77777a',
    fontFamily: 'lato-regular',
    fontSize: 14,
    marginTop:5
  },
  sideNavTxtParent:{
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom:10
  },
  descrption:{
    fontFamily: 'lato-regular',
    fontSize: 14,
    marginTop:10,
    marginRight:20
    
  },
  descrption2:{
    fontFamily: 'lato-regular',
    fontSize: 14,
    marginTop:10,
    marginRight:20,
    marginLeft:20
    
  },
  navigationBtnParent:{
    flex:1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  stateButtonParent:{
    height:50,
    flex: 1, 
    flexDirection: 'row',
    marginBottom:15,
    alignItems: 'center',
    justifyContent: 'center'
    
  },
  stateButton:{
    height:50,
    flex: 1, 
    flexDirection: 'column', 
    alignItems: 'center', 
    justifyContent: 'center',
    
  },
  stateBtnNumber:{
    fontFamily: 'lato-bold',
    fontSize: 16,
    textAlign:'center',
    color:'white'
  },
  stateBtnNumber2:{
    fontFamily: 'lato-regular',
    fontSize: 16,

    color:'black',  
    textAlign:'auto',
   

  },
  stateBtnTitle:{
    color:'#a3a3a3',
    fontFamily: 'lato-regular',
    fontSize: 12,
    textAlign:'center',
  },
  streamView:{
    marginTop:15,
    marginLeft:5, 
    marginRight:5,
    justifyContent:'center',
    alignItems:'center'
  },
  stationName:{
    fontFamily:'lato-regular',
    fontSize:16,
    marginBottom:30
  },
  stationImg:{
    width: 180, 
    height: 180,
    borderRadius:90,
    marginBottom:30
  },
  subtitleStream:{
    fontFamily:'lato-light',
    fontSize:18,
    marginBottom:10
  },
  songName:{
    fontFamily:'lato-light',
    fontSize:18,
    marginBottom:30,
    color:'#acacac'
  },
  buttonCircle: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(0, 0, 0, .2)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slideInnerContainer: {
    width: itemWidth,
    height: slideHeight,
    paddingHorizontal: itemHorizontalMargin,
    paddingBottom: 18 // needed for shadow
},
shadow: {
    position: 'absolute',
    top: 0,
    left: itemHorizontalMargin,
    right: itemHorizontalMargin,
    bottom: 18,
    shadowColor: "black",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 10,
    borderRadius: entryBorderRadius
},
imageContainer: {
    flex: 1,
    marginBottom: IS_IOS ? 0 : -1, // Prevent a random Android rendering issue
    backgroundColor: 'white',
    borderTopLeftRadius: entryBorderRadius,
    borderTopRightRadius: entryBorderRadius
},
imageContainerEven: {
    backgroundColor: "black"
},
image: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'cover',
    borderRadius: IS_IOS ? entryBorderRadius : 0,
    borderTopLeftRadius: entryBorderRadius,
    borderTopRightRadius: entryBorderRadius
},
// image's border radius is buggy on iOS; let's hack it!
radiusMask: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: entryBorderRadius,
    backgroundColor: 'white'
},
radiusMaskEven: {
    backgroundColor: "black"
},
textContainer: {
    justifyContent: 'center',
    paddingTop: 20 - entryBorderRadius,
    paddingBottom: 20,
    paddingHorizontal: 16,
    backgroundColor: 'white',
    borderBottomLeftRadius: entryBorderRadius,
    borderBottomRightRadius: entryBorderRadius
},
textContainerEven: {
    backgroundColor: "black"
},
title: {
    color: "black",
    fontSize: 13,
    fontWeight: 'bold',
    letterSpacing: 0.5
},
titleEven: {
    color: 'white'
},
subtitle: {
    marginTop: 6,
    color: "grey",
    fontSize: 12,
    fontStyle: 'italic'
},
subtitleEven: {
    color: 'rgba(255, 255, 255, 0.7)'
}
  
})

exports.dynamic={}