'use strict';

import React, {Component,PropTypes} from "react";
import {Text, View, TouchableOpacity, Image,ActionSheetIOS} from "react-native";
import { MaterialIcons, Ionicons, Feather } from '@expo/vector-icons';
import { Components } from 'expo';
var to = require('to-case')
import css from '@styles/global'

import fun from '@functions/common'

export default class NavigationIcon extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  getMeTheIcon(){
      if(to.slug(this.props.icon).indexOf("md-")==0){
        return (<MaterialIcons name={to.slug(this.props.icon).replace("md-","")} size={24} style={{ color: this.props.tintColor }} />)  
      }if(to.slug(this.props.icon).indexOf("io-")==0){
          var theIcon=to.slug(this.props.icon).replace("io-","");
          if(this.props.focused){
            theIcon=theIcon.replace("-outline","");
          }
          
        return (<Ionicons name={theIcon} size={css.dynamic.general.hideTabIconName?30:24} style={{ marginTop:css.dynamic.general.hideTabIconName?10:0,color: this.props.tintColor }} />)  
      }if(to.slug(this.props.icon).indexOf("fe-")==0){
        return (
        <Feather 
          name={to.slug(this.props.icon).replace("fe-","")} 
          size={css.dynamic.general.hideTabIconName?24:20} 
          style={{ 
            marginTop:css.dynamic.general.hideTabIconName?(css.isIphoneX()?10:0):0,
            color: this.props.tintColor 
          }} 
          />)  
      }else{
        return (<View></View>)
      }
      
  }

  render() {
    return (
        <View style={{justifyContent:'center'}}>
            {this.getMeTheIcon()}
        </View>
    );
  }
}
