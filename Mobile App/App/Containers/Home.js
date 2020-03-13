import React, { Component } from 'react';
import {Text,View,FlatList,TouchableOpacity,Image,ActivityIndicator,ImageBackground,Platform} from "react-native";
import Navbar from '@components/Navbar'
import SearchBar from "@components/SearchBar/SearchBar"
import T from '@functions/translation'
import firebase from '@datapoint/Firebase'
import Smartrow from '@smartrow'
import TouchList from '@uniappbuttons/TouchList';
import SmartIcon from '@smarticon';
import { Constants } from 'expo';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions'
import firebaseConfig from '../../firebase_config'
import Config from '../../config'
import css from '@styles/global'
const ConditionalDisplay = ({condition, children}) => condition ? children : <View></View>;

class Home extends Component {
  _keyExtractor = (item) => item.id;

  constructor(props) {
    super(props);
    var isDataInProps=props.navigation.state.params==null
    this.state = {
        pr:isDataInProps?props.data:props.navigation.state.params,
        categoryItems:[],
        items:[],
        itemsStore:[],
        latitude:null,
        longitude:null,
        errorMessage: null,
        city:null,
        categoryId:null,
        category_collection:null,
        queryString:null,
        animating:true,
        radius:10
    };
    
   this.getCategories = this.getCategories.bind(this);
   this._getLocationAsync = this._getLocationAsync.bind(this);
   this.editLocation = this.editLocation.bind(this);
   this.callBackLatLng = this.callBackLatLng.bind(this);
   this.setCategoryId = this.setCategoryId.bind(this);
   this.fetchTheItems = this.fetchTheItems.bind(this);
   this.renderItem = this.renderItem.bind(this);
   this.openDetails = this.openDetails.bind(this);
   this.searchChange = this.searchChange.bind(this);
   this.showActivityIndicator = this.showActivityIndicator.bind(this);
   
  }

  componentDidMount(){
    this.getCategories()
  }

  componentWillMount() {
  
    if (Platform.OS === 'android' && !Constants.isDevice) {
      this.setState({
        errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
      });
    } else {
      this._getLocationAsync();
    }
  }

  _getLocationAsync = async () => {
    var _this=this
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    }

  //Set static location if Config.isPreview == true
   if(!Config.isPreview){
      //Get the current location only if lat and lng is not passed as param
      let location = await Location.getCurrentPositionAsync({});
      this.setState({ 
        latitude:location.coords.latitude,
        longitude:location.coords.longitude
      });
   }else{
     this.setState({
      latitude:37.785834,
      longitude:-122.406417
     })
   }

   //Get the city by the given location
    let address = await Location.reverseGeocodeAsync({latitude: this.state.latitude, longitude:this.state.longitude})
    this.setState({
      city:address[0].city
    })
    setTimeout(function(){ _this.fetchTheItems(); }, 2000);
  };


   //Get the data of the category
   getCategories(){
    //Get the meta data

    //Get reference to this
    var _this=this;

    //Get reference to Firestore
    var db = firebase.firestore();

    //Place to store the categories
    var categories = [];
    

    if(this.state.pr.listingSetup.hide_all_category_filter){
      categories=[];
    }
    
    
    //Start getting the categories
    db.collection("/"+this.state.pr.listingSetup.collection_key).get().then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
          var objToAdd=JSON.parse(doc._document.data.toString());
          //Add the id, on each object, easier for referencing
          objToAdd.id=doc.id;
          categories.push(objToAdd);

      });


      //After data is stored in data, update the state
      //This will re-render the screen

      var upState={
        categoryItems:categories,
        animating:false
      }
      console.log(_this.state.pr.listingSetup.hide_all_category_filter+"<----")
      if(_this.state.pr.listingSetup.hide_all_category_filter&&categories.length>0){
        upState.selected=categories[0].id
      }

      _this.setState(upState)
     
    });
  }

  /**
   * Navigate to Location screen
   */
  editLocation(){
    this.props.navigation.navigate("LocationScreen",{latitude:this.state.latitude,longitude:this.state.longitude,callBack:this.callBackLatLng})
  }
  
  

   async callBackLatLng(lat,lng,radius){
     var _this=this
    let address = await Location.reverseGeocodeAsync({latitude: lat, longitude:lng})
    this.setState({
      longitude:lng,
      latitude:lat,
      radius:radius,
      city:address[0].city
    })
    setTimeout(function(){ _this.fetchTheItems(); }, 2000);
  }

  /**
   * 
   * @param {Double} lat 
   * @param {Double} lng 
   */
  fetchTheItems(){
    var _this=this
    var url = 'https://us-central1-'+firebaseConfig.config.projectId+'.cloudfunctions.net/';
    url+="advancedSearch?";

    //Check if queryString exist
    if(this.state.queryString != null){
      url+='query='+this.state.queryString;
    }

    //Check if categoryId exist
    if(this.state.categoryId != null){
      url+='&category_id='+this.state.categoryId;
    }
     //Check if category_collection exist
    if(this.state.category_collection != null){
      url+='&category_collection='+this.state.category_collection;
    }
    
    url+='&latitude='+this.state.latitude;
    url+='&longitude='+this.state.longitude;
    url+='&radius=500';
    url+='&limit=100';
    url+='&page=1';
    url+='&unit=K';
    url+='&neededFields=title,description,image,ownerID,'+this.state.pr.detailsSetup.fields.direction;
    
    
    fetch(url)
            .then(response => response.json())
            .then(data => {
         
              _this.setState({
                items:data,
                animating:false
              })
             })
            .catch(error => console.log("The error is: "+error));
  }

  /**
   * showActivityIndicator - only if there are no elements in subMenus
   */
  showActivityIndicator(){
    if(this.state.animating == true && this.state.items.length == 0)
    {
      return(
        <View style={css.layout.activityIndicatorView}>
          <View style={css.layout.activitiIndicatorContainer}>
            <ActivityIndicator
                  animating={this.state.animating}
                  style={css.layout.activityIndicator}
                  color={css.dynamic.general.buttonColor}
                  size="large"
                  hidesWhenStopped={true}/>
          </View>
        </View>
      )
    }else if(this.state.animating == false && this.state.items.length == 0){
      return(
        <Text style={css.layout.noItemsTextStyle}>{T.no_items}</Text>
      )
    }
  }

  /**
   * Set the passed category id
   * @param {String} id 
   * @param {String} collection 
   */
  setCategoryId(id,collection){
   var _this=this
    this.setState({
      categoryId:id,
      category_collection:collection
    })
    setTimeout(function(){ _this.fetchTheItems(); }, 2000);
  }

  /**
  * renderItem - display single category
  * @param {Object} data current item to create
  */
 renderItem(data){
  var item=data.item;
  //We have our real data in data.item since FlatList wraps the data
  var listingSetup={
    "fields": {
      "description": "description",
      "image": "image",
      "title": "title"
    },
    "listing_style": "list"
  };


  return (
    <TouchableOpacity  onPress={()=>{this.openDetails(item)}}>
      <Smartrow
        min={0}
        isListing={true}
        item={item}
        id={item.id}
        key={item.id}
        display={{listingSetup:listingSetup}} />
       </TouchableOpacity>
  )
 
}

/**
  * openDetails - opens the details screen
  * @param {Object} item item to open
  */
 openDetails(item){
  this.props.navigation.navigate('Details',{data:item})
}

/**
* searchChange - on search
* @param {String} e, the entered string
*/
searchChange(e){
var _this=this
  if(e.length==0){
    //User has removed all the string, or it has
    this.setState({
      queryString:null
    })
    //But don't forget category filter
  }else if(e.length>2){
    //Do filter
  this.setState({
    queryString:e
  })
    
  // call the feach items
  setTimeout(function(){ _this.fetchTheItems(); }, 2000);
    
  }
}

  
render(){
  return (
      <View>
          <Navbar
            navigation={this.props.navigation}
            isRoot={true}
            showRightButton={false}
          />
          <SearchBar  ref={search => this.search = search} onChangeText={this.searchChange}  />
        
         <View style={{marginBottom: 10,marginTop:15}}>
            <TouchList categoryItems={this.state.categoryItems} callBack={this.setCategoryId} collection_key={this.state.pr.listingSetup.collection_key}></TouchList>
         </View>
         
         <View style={{flexDirection:"row"}}>
          <View>
              <Text style={{color:"#434F64",fontWeight:'900',fontFamily: 'lato-bold',fontSize:23,marginLeft:10}}>{this.state.city}</Text>
          </View>
          <View style={{flex:1}}>
             <TouchableOpacity style={{flexDirection:"row",justifyContent:"flex-end",marginTop:10}} onPress={() => this.editLocation()}>
               <Text style={{color:"#5561FA",fontWeight:'300',fontFamily: 'lato-bold',fontSize:14,marginLeft:10}}>Edit</Text>
               <SmartIcon defaultIcons={"MaterialIcons"} name={"FeChevronRight"}  size={15} color="#5561FA" style={{marginRight: 10}}/>
             </TouchableOpacity>
           </View>
         </View>
         {this.showActivityIndicator()}
        
         <FlatList
            style={[{marginBottom:280,marginTop:20}]}
            data={this.state.items}
            keyExtractor={this._keyExtractor}
            renderItem={this.renderItem}
          />
      </View>
    );
}

}

export default Home;
