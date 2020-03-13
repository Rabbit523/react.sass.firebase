/*
  Created by Dimov Daniel
  Mobidonia
*/
import React, {Component} from "react";
import {View,TouchableOpacity,FlatList} from "react-native";
import Navbar from '@components/Navbar'
import firebase from '@datapoint/Firebase'
import css from '@styles/global'
import Smartrow from '@smartrow'
import Config from '../../../config'
import SearchBar from "@components/SearchBar/SearchBar"
import Login from '@containers/Users/LoginScreen'
import appConfig from '../../../app.json';

const ConditionalDisplay = ({condition, children}) => condition ? children : <View></View>;

export default class ListOfUsers extends Component {
  //Key extractor for the Flat list
  _keyExtractor = (item, index) => item.id;

  //The constructor
  constructor(props) {
    var isDataInProps = props.navigation.state.params == null;
    super(props);
    var theProps = isDataInProps ? "" : props.navigation.state.params;
    //Init state
    this.state = {
      items:[],
      showSearch: false,
      listOf:theProps.listOf,
      userId:theProps.userId,
      isRoot: false,
      itemsStore:[],
      selected:"all",
      isLoggedIn:false,
      waitingForStatus:true,
      contactName:this.props.navigation.state.params.contactName
      
    }

    //Bind functions
    this.getUsers=this.getUsers.bind(this);
    this.renderItem=this.renderItem.bind(this);
    this.getAllUsers=this.getAllUsers.bind(this);
    this.setUpCurrentUser=this.setUpCurrentUser.bind(this)
    this.showHideSearch=this.showHideSearch.bind(this);
    this.searchChange=this.searchChange.bind(this);
  }

    componentDidMount(){
    
      firebase.auth().onAuthStateChanged(this.setUpCurrentUser)
      
    }

    setUpCurrentUser(user){
          
      if (user != null) {
        this.setState({
              
          waitingForStatus:false,
          isLoggedIn:true,
          
      })
            if(this.state.listOf != null)
          {
            this.getUsers();
          }else{
            this.setState({
              isRoot:true
            })
            this.getAllUsers()
          }
          // User is signed in.
          
      } else {
          // User is not signed in
          this.setState({
              waitingForStatus:false,
              isLoggedIn:false,
          })
      }
  }

    /**
  * Showing and hiding the searh bar
  */
  showHideSearch(){
    if(this.state.showSearch){
      //Now when hidding, clear the text
      this.search.clearText();
      this.search.blur();
    }
    this.setState({showSearch:!this.state.showSearch});
  }

  /**
  * searchChange - on search
  * @param {String} e, the entered string
  */
  searchChange(e){
    if(e.length==0){
      //User has removed all the string, or it has
      this.setState({items:this.state.itemsStore,selected:"all"})
    }else if(e.length>2){
      //Do filter
      var filtered=this.state.itemsStore.filter(function (el) {return el.username.toLowerCase().indexOf(e.toLowerCase())>-1});
      this.setState({items:filtered})
    }
  }
   
    /**
  * getUsers
  *
  */
  getAllUsers(){
    var _this=this;
    //var data=[];
    firebase.database().ref(appConfig.expo.extra.firebaseMetaPath+'/users/').once('value', function(snapshot) {
      var data=[];
        snapshot.forEach(childSnap=>{
          
         //if(appConfig.expo.extra.firebaseMetaPath == childSnap.val().appPath){
           
            var user=childSnap.val();
            user.uid=childSnap.key;
            if(childSnap.key != firebase.auth().currentUser.uid){
              var objToAdd=user
              //Add the id, on each object, easier for referencing
              objToAdd.id=childSnap.key;
              objToAdd.username=objToAdd.username||"/"; //Username is required
              data.push(objToAdd);
            //}else{
              //do nothing
             
            //}
          }else{
            //do nothing
          }
            
            
        })

        //If Contact name is passed from the Add Contact
        if(_this.state.contactName != null)
        {
          var filtered=data.filter(function (el) {return el.username.toLowerCase().indexOf(_this.state.contactName.toLowerCase())>-1});
          _this.setState({items:filtered})
        } else{
          _this.setState({
            items:data,
            itemsStore:data,
          })
        }
       
      });
  }
  /**
  * getUsers
  *
  */
  getUsers(){
    var _this=this;
    //var data=[];
    firebase.database().ref(appConfig.expo.extra.firebaseMetaPath+'/users/'+this.state.userId+"/"+this.state.listOf+"/").once('value', function(snapshot) {
      var data=[];
        snapshot.forEach(childSnap=>{
         
          //if(appConfig.expo.extra.firebaseMetaPath == childSnap.val().appPath){
            
            var user=childSnap.val();
            user.uid=childSnap.key;
            user.username=user.username||"/"; //Username is required
            data.push(user)
          //}else{
            //do nothing
          //}
        })
        _this.setState({
            items:data,
            itemsStore:data,
          })
          
      });
  }

  /**
  * renderItem - render a row
  * @param {Object} data
  */
 renderItem(data){
    //We have our real data in data.item since FlatList wraps the data
    var item=data.item;
    var listingSetup={
        "fields": {
    
          "title": "fullName",
          "image": "avatar",
          "subtitle": "username",
        },
        "listing_style": ""
      };
    return (
      <TouchableOpacity  onPress={()=>{this.openProfile(item)}}>
        <Smartrow isListing={true} from="listOfUsers" item={item} display={{listingSetup:listingSetup}}>
        </Smartrow>
      </TouchableOpacity>
    )
  }
 

  openProfile(item){
    var profileScreen=Config.profileScreensInSubMenu?"SubProfile":"Profile";
    
    this.props.navigation.navigate(profileScreen,{data:item.uid,showBackButton:true,showFollow:true,listOf:this.state.listOf})
  }

  render() {
    if(this.state.isLoggedIn)
    {
      return (
        <View style={[css.layout.containerBackground,{flex:1}]}>
            <Navbar navigation={this.props.navigation} isRoot={this.state.isRoot} showRightButton={true} rightButton={"FeSearch"} rightAction={this.showHideSearch} />
            <ConditionalDisplay condition={this.state.showSearch} >
              <SearchBar  ref={search => this.search = search} onChangeText={this.searchChange}  />
            </ConditionalDisplay>
            <FlatList
              //style={{marginBottom: 70}}
              data={this.state.items}
              keyExtractor={this._keyExtractor}
              renderItem={this.renderItem}
              />
        </View>
        )
    }else if(this.state.waitingForStatus){
      return(<View/>)
    }
    else if(!this.state.isLoggedIn){
      return(<Login navigation={this.props.navigation}/>)
    }
    
    }
}