/*
  Created by Dimov Daniel
  Mobidonia
*/
import React, {Component} from "react";
import {View,TouchableOpacity,StyleSheet,ScrollView,AsyncStorage,FlatList,ActivityIndicator} from "react-native";
import Navbar from '@components/Navbar'
import firebase from '@datapoint/Firebase'
import css from '@styles/global'
import fun from '@functions/common'
import CartFunction from '@functions/cart'
import ScrollableTabView, {DefaultTabBar,ScrollableTabBar } from 'react-native-scrollable-tab-view';
import StepIndicator from '@components/StepIndicator';
import Smartrow from '@smartrow'

import { Text,FormLabel, FormInput, Button } from 'react-native-elements'
import Config from '../../../config'
import moment from 'moment';
import Icon from 'react-native-vector-icons/Ionicons';
import T from '@functions/translation'
import * as Font from 'expo-font'


export default class Orders extends Component {
  //The key extraxtor
  _keyExtractor = (item, index) => item.id+index;

  //The constructor
  constructor(props) {
    super(props);

    //Init state
    this.state = {
      items:[],
      animating: true

    }

    //Bind functions
    this.getOrders=this.getOrders.bind(this);
    this.renderItem=this.renderItem.bind(this);
  }

  //Component mount function
  componentDidMount(){

    //Reference to this
    var _this=this;

    //Get the user id
    CartFunction.getArtificalUserID(function(userID,error){
      _this.getOrders(userID);
    })
  }

  /**
  * createInfo - creates single order info row
  * @param {String} str1 - left part
  * @param {String} str2 - right part
  * @param {Boolean} isbold - is right part in bold
  */
  createInfo(str1,str2,isbold=false){
    return (
      <View style={css.layout.createInfoStr1}>
          <View style={{flex:1}}>
            <Text>{str1}</Text>
          </View>
          <View style={{flex:1}}>
            <Text style={{textAlign:"right",fontWeight:isbold?"bold":"normal"}}>{str2}</Text>
          </View>
        </View>)
  }

  /**
  * renderItem - render single order in the FlatList
  * @param {Object} data data to display
  */
  renderItem(data){
   
    var item=data.item.order[0]
    
    var listingSetup={
      "fields": {
  
        "title": "name",
        "image": "image",
        "subtitle": "price",
        "description": "quantity"

      },
      "listing_style": "orderList"
    };

    return (
      <TouchableOpacity  onPress={()=>{this.openDetail(data)}}>  
        <Smartrow
          min={0}
          isListing={true}
          isCart={false}
          callback={this.qtyChanger}
          item={item}
          id={item.id}
          key={item.id}
          display={{listingSetup:listingSetup}} />
      </TouchableOpacity >
    )
  }

  openDetail(item){
    this.props.navigation.navigate('OrderDetail',{data:item})
   }

  /**
  * getOrders - Get the orders of the user
  * @param {String} userID
  */
  getOrders(userID){
    //Get the meta data
    var defPath = "orders"
    var pathFBConf = Config.config.orders_collection_data_point

    var path = pathFBConf != null?pathFBConf:defPath

    var _this=this;


    var db=firebase.firestore();
    var data = [];
    var ref=db.collection(path);
    ref=ref.where('userID', '==', userID)


    ref.get()
    .then(snapshot => {
      if(snapshot == null){
        data = [];
      }else{
        snapshot
        .docs
        .forEach(doc => {
          var objToAdd=JSON.parse(doc._document.data.toString());
          objToAdd.id=doc.id;
          data.push(objToAdd);
        });
      }

      
      _this.setState({
        items:data.reverse(),
        animating:false
      })
     

    });
  }

  /**
  * renderIf - render a text label if there is no items
  * @param {Object} numItems
  */
  renderIf(numItems){
    if(numItems == 0 && this.state.animating == false){
       return (
          <Text style={css.layout.noItemsTextStyle}>{T.no_orders}</Text>
        )
    }
  }


  render() {
    return (
      <View style={[css.layout.containerBackground,{flex:1}]}>
          
          <Navbar navigation={this.props.navigation} isRoot={this.props.isRoot} showRightButton={false}  />
          {this.renderIf(this.state.items.length)}
          <FlatList
            data={this.state.items}
            keyExtractor={this._keyExtractor}
            renderItem={this.renderItem}
          />
      </View>
      )
    }
}