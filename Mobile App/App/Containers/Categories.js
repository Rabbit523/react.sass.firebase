/*
  Created by Dimov Daniel
  Mobidonia
  daniel@mobidonia.com
*/
import React, {Component,PropTypes} from "react";
import {Text,View,Image,FlatList,TouchableOpacity,Linking,ActivityIndicator} from "react-native";
import Navbar from '@components/Navbar'
import firebase from '@datapoint/Firebase'
import css from '@styles/global'
import Smartrow from '@smartrow'
import Config from '../../config'
import {
  AdMobBanner,
  PublisherBanner,
  AdMobRewarded
} from 'expo-ads-admob';

import T from '@functions/translation'



export default class Categories extends Component {

  //Key extractor for the Flat list
  _keyExtractor = (item, index) => item.id;

  //The constructor
  constructor(props) {

    //Our props can be ditectly in the props.data or props.navigation.state.params
    //First time, data goes in properties,
    //Later it is passed in navigation state
    //Let's find out where they are
    var isDataInProps=props.navigation.state.params==null;

    super(props);
    var theProps=isDataInProps?props:props.navigation.state.params;
    if(theProps.data.categorySetup&&theProps.data.categorySetup.category_style=="list"){
      theProps.data.categorySetup.category_style="grid1";
    }


    //Check if we have sub menus
    var menus=theProps.data&&theProps.data.categorySetup&&theProps.data.categorySetup.subMenus?theProps.data.categorySetup.subMenus:[];

    this.state = {
      categories:[],
      pr:theProps,
      data_point:"",
      menus:menus,
      animating:true
    }

    //Bind functions
    this.getCategories=this.getCategories.bind(this);
    this.renderItem=this.renderItem.bind(this);
    this.renderMenuItem=this.renderMenuItem.bind(this);
    this.renderHeaderImage=this.renderHeaderImage.bind(this);
  }

  //Component Mount function
  componentDidMount() {
    if(this.state.pr.data.categorySetup.subMenus){
      //Menu items - no need to fetch any data

    }else{
      //Normal category - fetch categories
      this.getCategories(this.state.pr.data.categorySetup.data_point);
    }
  }

  //Get the data of the category
  getCategories(path){
    //Get the meta data

    //Get reference to this
    var _this=this;

    //Update the state with the path to firestore

    this.setState({data_point:path})

    //Get reference to Firestore
    var db = firebase.firestore();

    //Place to store the categories
    var categories = [];
    
    //Start getting the categories
    db.collection(path).get().then(function(querySnapshot) {
      if(querySnapshot == null){
        
        categories = []
        _this.setState({
          
          animating:false
        })
      }else{
        querySnapshot.forEach(function(doc) {
          
          var objToAdd=JSON.parse(doc._document.data.toString());
          //Add the id, on each object, easier for referencing
          objToAdd.id=doc.id;
          categories.push(objToAdd);
      
      

      });
    


      //After data is stored in data, update the state
      //This will re-render the screen
      _this.setState({
        categories:categories,
        animating:false
      })
    }
    });
  
  }

  /**
  * renderHeaderImage - display header image or empty view
  */
  renderHeaderImage(){
    if(this.state.pr&&
      this.state.pr.data&&
      this.state.pr.data.categorySetup&&
      this.state.pr.data.categorySetup.display_header_image&&
      this.state.pr.data.categorySetup.category_image){
      //Show a photo
      return (<View><Image style={css.static.headerImage} source={{uri:this.state.pr.data.categorySetup.category_image}} /></View>)
    }else{
      //Return empty View
      return (<View></View>)
    }
  }


  /**
  * openExternalApp - in sub menus, we can have links, use this funciton to open the links
  * @param {String} url - link to open
  */
  openExternalApp(url) {
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {

      }
    });
  }

  /**
  * openMaster - open master, link or another categories screen
  * @param {Object} item - item clicked
  */
  openMaster(item){


   

    if(item.category_first){
      //If this is another category

      this.props.navigation.navigate('Categories', {name: item.name, isRoot:false,  data:item})
    }else if(item.subMenus){
      //If this is sub menus

      this.props.navigation.navigate('MasterSUB', {name: item.name,isRoot:false,  data:{'categorySetup':item}, subMenus:item.subMenus})
    }else{
      //This is master, notification or link
      if(item.link){
        //If we have a link, open the link
        this.openExternalApp(item.link);
      } else if(item.sectionType&&item.sectionType=="notifications"){
        //If we have a link, open the link
        this.props.navigation.navigate('NotificationsSub', {name: item.name, isRoot:false,  data:item})
      }else if(item.sectionType&&item.sectionType=="profile"){
        //If we have a link, open the link
        this.props.navigation.navigate("ProfileSettingsSub")
      }else if(item.sectionType&&item.sectionType=="listOfUsers"){
        //If we have a link, open the link
        this.props.navigation.navigate('ListOfUsersSub', {name: item.name, isRoot:false,  data:item})
      }else if(item.sectionType&&item.sectionType=="orders"){
        //If we have a link, open the link
        this.props.navigation.navigate('OrdersSub', {name: item.name, isRoot:false,  data:item})
      }else{
       
        //If nothing else, this is master
        var manualItem={name: item.name, id:item.id,data_point:this.state.data_point,listingSetup:this.state.pr.data.listingSetup};
        var completeItem={ ...item, ...manualItem }
        this.props.navigation.navigate('Master', completeItem)
       
        
      }
    }
  }

  /**
  * renderItem - display single category
  * @param {Object} data current item to create
  */
  renderItem(data){
    //We have our real data in data.item since FlatList wraps the data
    var item=data.item;
    console.log("======== CAT DATA ===========")
    console.log(JSON.stringify(this.state.pr.data))
    console.log("======== END CAT DATA ===========")
    return (
      <TouchableOpacity
        onPress={()=>{this.openMaster(item)}}>
          <Smartrow
            isListing={false}
            item={item}
            display={this.state.pr.data}>
          </Smartrow>
        </TouchableOpacity>)
  }

  /**
  * renderMenuItem - display single menu item
  * @param {Object} data current item to create
  */
  renderMenuItem(data){
    //We have our real data in data.item since FlatList wraps the data
    var item=data.item;
    

    return (
      <TouchableOpacity
        onPress={()=>{this.openMaster(item)}}>
          <Smartrow
            item={item}
            display={{categorySetup:{fields:{title:"name",image:"image"}}}}>
          </Smartrow>
      </TouchableOpacity>)
  }
  /**
  * renderIf - render a text label if there is no items
  * @param {Object} numItems
  */
  renderIf(numItems){
    
    if(numItems == 0 && this.state.animating == false){
       return (
          <Text style={css.layout.noItemsTextStyle}>{T.no_categories}</Text>
        )
    }
  }

  /**
   * showBanner - if  showBannerAds is true
   */
  showBanner()
  {
    if(Config.showBannerAds == true)
    {
      return (
        <AdMobBanner
        bannerSize="fullBanner"
        adUnitID="ca-app-pub-3074088633024340/6978720590" // Test ID, Replace with your-admob-unit-id
        testDeviceID="EMULATOR"
        onDidFailToReceiveAdWithError={this.bannerError} />
      )
    }
  }

  /**
   * showActivityIndicator - only if there are no elements in subMenus
   */
  showActivityIndicator(){
    if(!this.state.pr.data.categorySetup.subMenus && this.state.animating == true)
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
    }
  }


  render() {
    var containerStyle=
        this.state.pr.data.categorySetup
      &&this.state.pr.data.categorySetup.category_style
      &&this.state.pr.data.categorySetup.category_style.indexOf('grid')!==-1
      ?css.layout.categoryList:null;

    return (
      <View style={css.layout.containerBackground}>
        <Navbar navigation={this.props.navigation} detailsView={true} isRoot={this.state.pr.isRoot}/>
          {this.showBanner()}
          

        <View style={[css.layout.commonContainer]}>
        

          <FlatList

           foot
            style={[{marginBottom:100}]}
            contentContainerStyle={containerStyle}
            ListHeaderComponent={this.renderHeaderImage()}
            data={this.state.pr.data.categorySetup.subMenus?this.state.menus:this.state.categories}
            keyExtractor={this._keyExtractor}
            ListFooterComponent={ <View style={{height:280}}></View>}
            renderItem={this.state.pr.data.categorySetup.subMenus?this.renderMenuItem:this.renderItem}
          />
         
          {this.showActivityIndicator()}
          {this.renderIf()}
        </View>



      </View>
    );
  }
}
