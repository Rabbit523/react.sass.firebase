'use strict';

import React, {Component} from "react";
import { View, TouchableOpacity, Image,ActivityIndicator,Animated} from "react-native";
import navBarStyle from "./style";
import css from '@styles/global'
import SmartIcon from '@smarticon';
var to = require('to-case')
const scrollAnimation =  new Animated.Value(1);
export default class Navbar extends Component {
  
  constructor(props) {
   
    super(props);
   
    this.state = {}
    this.backActions=this.backActions.bind(this);
  }


  backActions(){
    if(!this.props.isRoot||(css.dynamic.general&&css.dynamic.general.layout&&css.dynamic.general.layout=="grid")){
      this.props.navigation.goBack(null)
    }else{
      this.props.navigation.openDrawer()
    }
  }

  render() {
     
    const _this = this
    var tintToUse=(css.dynamic.navBar.detailsTintColor&&this.props.detailsView?css.dynamic.navBar.detailsTintColor:css.dynamic.navBar.tintColor)
    const renderLeftbutton=function(){
      if(!_this.props.isRoot||(css.dynamic.general&&css.dynamic.general.layout&&css.dynamic.general.layout=="grid")){
        //Back button, in child screens and in all screens in grid nav
        return (
          <View><SmartIcon defaultIcons={"MaterialIcons"} name={"keyboard-arrow-left"} size={24} color={tintToUse} /></View>
        )
      }else{
        if(css.dynamic.general&&css.dynamic.general.layout&&css.dynamic.general.layout=="tabs"){
          //Tabs, do nothing
          return <View style={{width:24}}></View>
        }else{
          //Side menu, show hamburger
          //Home button
          return (<View><SmartIcon defaultIcons={"MaterialIcons"} name={"FeAlignLeft"} size={24} color={tintToUse} /></View>)
        }
       
      }
    }

    const showIndicator=function(){
      return(
         <ActivityIndicator
                      animating={_this.props.isLoading}
                      size="small" 
                      color="#000000"
                      hidesWhenStopped={true}/>
      )
    }


    const renderRightbutton=function(){
      var tintToUse=(css.dynamic.navBar.detailsTintColor&&_this.props.detailsView?css.dynamic.navBar.detailsTintColor:css.dynamic.navBar.tintColor)
      if(!_this.props.showRightButton){
        //Back button
        return (
          <View></View>
        )
      }else{
        //Dashboard button
        return (<View><SmartIcon defaultIcons={"MaterialIcons"} name={to.slug(_this.props.rightButton).replace("md-","")} size={20} color={tintToUse} /></View>)
      }

    }

    /*
       <StatusBar barStyle={css.dynamic.navBar.barStyle} />
        <View>
          <View style={[navBarStyle.statusBar,{backgroundColor:css.dynamic.navBar.statusBarBackgroundColor}]}>
          </View>
        </View>
    */

    return (
      <View>
        <View>
          <View style={[navBarStyle.container,{backgroundColor:
              (css.dynamic.navBar.detailsBackgroundColor&&this.props.detailsView?css.dynamic.navBar.detailsBackgroundColor:css.dynamic.navBar.backgroundColor)
            }]}>
            <TouchableOpacity  onPress={this.backActions}>
              <View style={navBarStyle.leftArea}>
                {renderLeftbutton()}
              </View>
            </TouchableOpacity>
            <View style={navBarStyle.centerArea}>
              <Animated.Image
                source={require('@images/navlogo.png')}
                style={[navBarStyle.navLogo, { opacity: scrollAnimation }]}
              />
             </View>
            <TouchableOpacity  onPress={this.props.rightAction}>
              <View style={navBarStyle.rightArea}>
                {_this.props.isLoading?showIndicator():renderRightbutton()}
              </View>
            </TouchableOpacity>

          </View>
        </View>
        <View style={[navBarStyle.border,{height:0,backgroundColor:css.dynamic.navBar.borderColor}]} ></View>
      </View>

    );
  }
}
