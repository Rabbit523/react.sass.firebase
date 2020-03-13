'use strict';

import React, {Component} from "react";
import {Text, View,ImageBackground} from "react-native";
import style from "./style";
import css from '@styles/global'
import { LinearGradient } from 'expo-linear-gradient'

//TODO make it with LinerGardian with the new expo


export default class Tiles extends Component {
  constructor(props) {
    super(props);
    this.state = {
      setup:this.props.display
    }
  }


  render() {
    var styleOfGrid={};
    if(this.state.setup.grid_with_space){
      //with space
      if(this.state.setup.grid_rows==1){
        styleOfGrid=style.tileImage1withSpace;
      }else if(this.state.setup.grid_rows==2){
        styleOfGrid=style.tileImage2withSpace;
      }else if(this.state.setup.grid_rows==3){
        styleOfGrid=style.tileImage3withSpace;
      }else if(this.state.setup.grid_rows==4){
        styleOfGrid=style.tileImage4withSpace;
      }
    }else{
      //No space
      if(this.state.setup.grid_rows==1){
        styleOfGrid=style.tileImage1noSpace;
      }else if(this.state.setup.grid_rows==2){
        styleOfGrid=style.tileImage2noSpace;
      }else if(this.state.setup.grid_rows==3){
        styleOfGrid=style.tileImage3noSpace;
      }else if(this.state.setup.grid_rows==4){
        styleOfGrid=style.tileImage4noSpace;
      }
    }
    return (
      <ImageBackground style={[styleOfGrid,{"overflow":"hidden",borderRadius:css.dynamic.general.rounded+""=="true"?10:0}]} source={{uri:this.props.image}}>
      <LinearGradient
          colors={[css.dynamic.rows.imageRowColor,css.dynamic.rows.imageRowColor]}
          style={style.imageRowShadow}
        >
        <View style={style.imageRowTitleArea} >
          <Text style={[css.static.defaultTitle,{textAlign: 'center',color:css.dynamic.category.textColor}]}>{this.props.title}</Text>
          <Text style={[{marginLeft:10,marginRight:10,textAlign: 'center',color:css.dynamic.category.textColor,fontSize:16,opacity:0.8,fontWeight:"normal"}]}>{this.props.description}</Text>
        </View>
        </LinearGradient>
      </ImageBackground>
    );
  }
}
