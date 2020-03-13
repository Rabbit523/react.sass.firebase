'use strict';

import React, {Component} from "react";
import {Text, View, TouchableOpacity,ImageBackground, UIManager} from "react-native";
import style from "./style";
import css from '@styles/global'
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient'

export default class HeaderImage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      setup:this.props.display,
      rtl:css.dynamic.general.isRTL

    }
  }

  componentWillMount() {
    if (UIManager.setLayoutAnimationEnabledExperimental)
      UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  renderPlay(){
    if(this.props.hasVideo){
     
      return (
        <TouchableOpacity onPress={this.props.onPress}>
          <View style={[style.headerImage,{position:"absolute",flex:1,justifyContent:"center",alignItems:"center"}]}>
            <View style={{height:100,width:100,padding:0,backgroundColor:"rgba(255,255,255,0.8)", borderRadius:css.dynamic.general.rounded+""=="true"?25:0,justifyContent:"center",alignItems:"center"}}>
              <Ionicons style={{marginTop:5,marginLeft:10}} name={"ios-play-outline"} size={80} color={css.dynamic.general.buttonColor} />
            </View>
          </View>
        </TouchableOpacity>
        )
    }else{
      return (<View></View>)
    }
  }


  render() {
    const rtlText = this.state.rtl && { textAlign: 'right', writingDirection: 'rtl' };
    const rtlView = this.state.rtl && { flexDirection: 'row-reverse' };
    return (
      <ImageBackground style={[style.headerImage,{borderRadius:css.dynamic.general.rounded+""=="true"?7:0}]} source={{uri:this.props.image}}>
        {this.renderPlay()}
        <LinearGradient
            colors={['transparent',"black"]}
            start={[0.0,0.0]}
            end={[0.0,1.0]}
            style={style.imageRowShadow}
          >
          <View style={style.imageRowTitleArea} >
            <Text numberOfLines={1} style={[{textAlign: "center",color:css.dynamic.category.textColor,fontSize:23,fontWeight:"bold",fontFamily:'lato-bold'},rtlText]}>{this.props.title}</Text>
          </View>
        </LinearGradient>
      </ImageBackground>
    );
  }
}
