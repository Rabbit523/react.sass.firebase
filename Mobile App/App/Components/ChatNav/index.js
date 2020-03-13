'use strict';

import React, {Component} from "react";
import { View, TouchableOpacity, Image,Text} from "react-native";
import navBarStyle from "./style";
import css from '@styles/global'
import SmartIcon from '@smarticon';
var to = require('to-case')

export default class ChatNav extends Component {
  constructor(props) {
    super(props);
    this.state = {}
    this.backActions=this.backActions.bind(this);
  }


  backActions(){
    if(!this.props.isRoot||(css.dynamic.general&&css.dynamic.general.layout&&css.dynamic.general.layout=="grid")){
      this.props.navigation.goBack(null)
    }else{
      //this.props.navigation.openDrawer()
    }
  }

  

  render() {
    var _this=this
    const renderRightbutton=function(){
     
      if(!_this.props.showRightButton){
        //Back button
        return (
          <SmartIcon defaultIcons={"MaterialIcons"} name={"FeSettings"} size={28} color={"black"}  />
        )
      }else{
        //Dashboard button
        return (<View><SmartIcon defaultIcons={"MaterialIcons"} name={to.slug(_this.props.rightButton).replace("md-","")} size={25} color={"black"} /></View>)
      }
  
    }
  
    return (
      <View>
        <View>
          <View style={[navBarStyle.container,{backgroundColor:
              (css.dynamic.navBar.detailsBackgroundColor&&this.props.detailsView?css.dynamic.navBar.detailsBackgroundColor:css.dynamic.navBar.backgroundColor)
            }]}>
            <TouchableOpacity  onPress={this.props.backAction}>
              <View style={navBarStyle.leftArea}>
                <View>
                  <SmartIcon defaultIcons={"MaterialIcons"} name={"keyboard-arrow-left"} size={30} color={"black"} />
                </View>
              </View>
            </TouchableOpacity>
            <View style={navBarStyle.centerArea}>
              <Text style={{fontSize:20,numberOfLines:1}}>{this.props.userName}</Text>
            </View>
            <View style={navBarStyle.rightArea}>
                <Image style={[navBarStyle.navLogo,{marginRight: 10}]} source={this.props.userAvatar != null ?{uri: this.props.userAvatar }:require('@images/blank-image.jpg')} />
                <TouchableOpacity  onPress={this.props.rightAction}>
                  {renderRightbutton()}
                </TouchableOpacity>
              </View>
            </View>
        </View>
        <View style={[navBarStyle.border,{height:0.5,backgroundColor:"#bfbfbf"}]} ></View>
      </View>

    );
  }
}
