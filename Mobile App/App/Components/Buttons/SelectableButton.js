'use strict';

import React, {Component,PropTypes} from "react";
import {Text, View, TouchableOpacity, Image} from "react-native";
import style from "./style";
import css from '@styles/global'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Components } from 'expo';
import fun from '@functions/common'
import { Button } from 'react-native-elements';
import SmartIcon from '@smarticon';


const ConditionalWrap = ({condition, wrap, children}) => condition ? wrap(children) : children;
const ConditionalDisplay = ({condition, children}) => condition ? children : <View></View>;



export default class SelectableButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      setup:this.props.display,
      isSelected:this.props.isSelected,
      value:this.props.idOfSelect
    }
    
    this.handleThePress=this.handleThePress.bind(this);
  }

  handleThePress(){
    //alert(this.state.value);
   this.props.onPressAction(this.state.value);
  }





  render() {
    return (
      <View style={{flex:1,alignItems:"center"}}>
       <ConditionalDisplay condition={ this.props.isSelected&&this.props.tabRarStyle=="tabBar4"}>
          <View style={{justifyContent:"center",backgroundColor:this.props.accentColor?this.props.accentColor:this.props.tintToUse,height:1,width:30,borderRadius:0}}></View>
        </ConditionalDisplay>
        <Button
            {...this.props}
            color={this.props.tintToUse}
            fontFamily={this.props.isSelected?'lato-bold':'lato-regular'}
            titleStyle={{fontSize:43,fontFamily:'lato-regular',color:this.props.tintToUse,textAlign: 'center'}}
           
            onPress={this.handleThePress}
            buttonStyle={{
                backgroundColor: "rgba(92, 99,216, 0)",
                height: 30,
                borderColor: this.props.isSelected?(this.props.accentColor?this.props.accentColor:this.props.tintToUse):"rgba(92, 99,216, 0)",
                borderWidth: this.props.tabRarStyle=="tabBar1"?1:0,
                borderRadius: 15,
                paddingLeft:10,
                paddingRight:10,
                paddingTop:3,
                paddingBottom:3,
                margin:0,
                opacity:this.props.isSelected?1:0.7
            }}
           containerViewStyle={{marginLeft:5,marginRight:5}}
      />
       <ConditionalDisplay condition={ this.props.isSelected&&this.props.tabRarStyle=="tabBar3"}>
          <View style={{justifyContent:"center",backgroundColor:this.props.accentColor?this.props.accentColor:this.props.tintToUse,height:1,width:30,borderRadius:0}}></View>
        </ConditionalDisplay>
       <ConditionalDisplay condition={ this.props.isSelected&&this.props.tabRarStyle=="tabBar2"}>
          <View style={{justifyContent:"center",backgroundColor:this.props.accentColor?this.props.accentColor:this.props.tintToUse,height:6,width:6,borderRadius:3}}></View>
        </ConditionalDisplay>
        
      </View>
    );
  }
}