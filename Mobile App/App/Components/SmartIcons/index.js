'use strict';

import React, {Component,PropTypes} from "react";
import {Text, View, TouchableOpacity, Image,ActionSheetIOS} from "react-native";
import { MaterialIcons, Ionicons,Feather} from '@expo/vector-icons';

import { Components } from 'expo';
var to = require('to-case')
import css from '@styles/global'

import fun from '@functions/common'

export default class SmartIcon extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  getMeTheIcon(){
    
      if(this.props.name&&to.slug(this.props.name).indexOf("md-")==0){
        return (<MaterialIcons name={to.slug(this.props.name).replace("md-","")} size={this.props.size} style={{ color: this.props.color }} />)  
      }else if(this.props.name&&to.slug(this.props.name).indexOf("io-")==0){
        return (<Ionicons name={to.slug(this.props.name).replace("io-","").replace("-outline","")} size={this.props.size} style={{color: this.props.color }} />)  
      }else if(this.props.name&&to.slug(this.props.name).indexOf("fe-")==0){  
        return (<Feather  name={to.slug(this.props.name).replace("fe-","")} size={this.props.size} style={{color: this.props.color }} />)  
      }else if(this.props.name&&this.props.name.length>4&&this.props.defaultIcons=="MaterialIcons"){
        //Default but explicitly set
        return (<MaterialIcons name={to.slug(this.props.name).replace("md-","")} size={this.props.size} style={{ color: this.props.color }} />)  
      }else if(this.props.name&&this.props.name.length>4){
        //Default Ionic  
        return (<Ionicons name={to.slug(this.props.name).replace("io-","").replace("-outline","")} size={this.props.size} style={{color: this.props.color }} />)  
      }else{
        return (<View></View>)
      }
      
  }

  render() {
    return (
        <View style={{justifyContent:'center'}} >
            {this.getMeTheIcon()}
        </View>
    );
  }
}
