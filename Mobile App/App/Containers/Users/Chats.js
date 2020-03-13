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
import SearchBar from "@components/SearchBar/SearchBar"
import AppEventEmitter from "@functions/emitter"
import Login from '@containers/Users/LoginScreen'
export default class ListOfUsers extends Component {
  //Key extractor for the Flat list
  _keyExtractor = (item, index) => index;

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
      refresh:false,
      
    }

    //Bind functions
    this.getUsers=this.getUsers.bind(this);
    this.renderItem=this.renderItem.bind(this);
    this.setUpCurrentUser=this.setUpCurrentUser.bind(this)
    this.showHideSearch=this.showHideSearch.bind(this);
    this.searchChange=this.searchChange.bind(this);
    
  }

    componentWillMount(){
      AppEventEmitter.addListener('ChangeGroupName', this.getUsers);
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
            this.getUsers();
            //this.getAllUsers()
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
    this.props.navigation.navigate('CreateGroupChat');
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
  getUsers(){
    var _this=this;
    
    var data=[];
    firebase.database().ref('/chats/'+firebase.auth().currentUser.uid).orderByChild("lastChat").on('value', function(snapshot) {
        data=[];
        
        snapshot.forEach(childSnap=>{
            var user=childSnap.val();
            user.uid=childSnap.key;
            data.push(user)
        })

        _this.setState({
             items:[],
             items:data.reverse(),
             itemsStore:data,
             refresh:!_this.state.refresh
             
            });
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
          "title": "name",
          "image": "avatar",
          "lastChat":"lastChat",
          "subtitle": "lastMessage"
          
        },
        "listing_style": ""
      };
    return (
      <TouchableOpacity  onPress={()=>{this.openChat(item)}}>
        <Smartrow isListing={true} from="chats" item={item} display={{listingSetup:listingSetup}}>
        </Smartrow>
      </TouchableOpacity>
    )
  }

  /**
   * Open the chat screen
   * @param {Object} item 
   */
  openChat(item){
    if((item.uid.indexOf('group_') !== -1)){
      // here also add the group of ids
      this.props.navigation.navigate('Chat', {chatID:item.uid,path:"messages/",groupChatIds:item.usersInTheChat,groupChatName:item.name,groupAvatar:item.avatar});
    }else{
      this.props.navigation.navigate('Chat', {selectedUser:item.uid,path:"messages/"});
    }
  }

  render (){
    if(this.state.isLoggedIn){  
    
    return (
        <View style={[css.layout.containerBackground,{flex:1}]}>

            <Navbar navigation={this.props.navigation} isRoot={this.state.isRoot} showRightButton={true} rightButton={"FeEdit"} rightAction={this.showHideSearch} />
            
           
              <SearchBar  ref={search => this.search = search} onChangeText={this.searchChange}  />
           

            <FlatList
              style={{ flex: 1 }}
              data={this.state.items}
              keyExtractor={this._keyExtractor}
              renderItem={this.renderItem}
              extraData={this.state.items}
             />

        </View>
        )
    }
    else if(this.state.waitingForStatus){
      return(<View/>)
    }
    else if(!this.state.isLoggedIn){
      return(<Login navigation={this.props.navigation}/>)
    }
  }
}