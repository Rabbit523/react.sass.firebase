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
class CreateGroupChat extends Component {
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
      selected:new Map(),
      selectedUsers:[],
      groupChatName:[],
      currentUserUsername:""
    }

    //Bind functions
  
    this.renderItem=this.renderItem.bind(this);
    this.getAllUsers=this.getAllUsers.bind(this);
    this.setUpCurrentUser=this.setUpCurrentUser.bind(this)
    this.searchChange=this.searchChange.bind(this);
    this.createChat = this.createChat.bind(this);
  }

    componentDidMount(){
        firebase.auth().onAuthStateChanged(this.setUpCurrentUser)
    }

    setUpCurrentUser(user){
          
      if (user != null) {
            this.setState({
              currentUserUsername:user.displayName
            })
            this.getAllUsers()
          
          // User is signed in.
          
      } else {
          // User is not signed in
        
      }
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
              objToAdd.isClicked=false;
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
      <TouchableOpacity  onPress={()=>{this.selectAndAddTheUser(item,data.index)}}>
        <Smartrow isListing={true} from="GroupChat" isClicked={!!this.state.selected.get(data.index)} item={item} display={{listingSetup:listingSetup}}>
        </Smartrow>
      </TouchableOpacity>
    )
  }
 
 
  selectAndAddTheUser(item,index){
    
    this.setState((state) => {
        // copy the map rather than modifying state.
        const selected = new Map(state.selected);
        selected.set(index, !selected.get(index)); // toggle
        return {selected};

      });
      if(!!this.state.selected.get(index) == false){
        this.setState({
            selectedUsers:this.state.selectedUsers.concat([item.id]),
            groupChatName:this.state.groupChatName.concat([item.username])
          })
         
      }else{
        for (var i=this.state.selectedUsers.length-1; i>=0; i--) {
            if (this.state.selectedUsers[i] === item.id) {
                this.state.selectedUsers.splice(i, 1);
                this.state.groupChatName.splice(i,1);
              }
            }
          }
    }

  createChat(){

   
    // 1. Create random id 
    var chatID = 'group_'+Math.random().toString(36).substr(2, 9);
    this.state.groupChatName.push(this.state.currentUserUsername)
   this.state.selectedUsers.push(firebase.auth().currentUser.uid)
    this.props.navigation.navigate('Chat', {groupChatIds:this.state.selectedUsers,chatID: chatID,path:"messages/",groupChatName:this.state.groupChatName});
   
  }



  render() {
   
      return (
        <View style={[css.layout.containerBackground,{flex:1}]}>
            <Navbar navigation={this.props.navigation} isRoot={this.state.isRoot} showRightButton={true} rightButton={"FePlus"} rightAction={this.createChat} />
            
              <SearchBar  ref={search => this.search = search} onChangeText={this.searchChange}  />
           
            <FlatList
              data={this.state.items}
              extraData={this.state}
              keyExtractor={this._keyExtractor}
              renderItem={this.renderItem}
              />
        </View>
        )
      }
}

export default CreateGroupChat;
