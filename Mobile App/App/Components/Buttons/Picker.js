'use strict';

import React, {Component,PropTypes} from "react";
import {Text, View, TouchableOpacity, Image,ActionSheetIOS} from "react-native";
import style from "./style";
import css from '@styles/global'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Components } from 'expo';
import { ActionSheetProvider, connectActionSheet } from '@expo/react-native-action-sheet';

import fun from '@functions/common'

class Picker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      setup:this.props.display,
      value:this.props.selectedVariant[this.props.theKey]
    }
    this.openPicker=this.openPicker.bind(this);
    this.selectOption=this.selectOption.bind(this);
  }

  selectOption(index){
    if(index<this.props.option.values.length){
      this.setState({
        value:this.props.option.values[index]
      })
      this.props.callback(this.props.theKey,this.props.option.values[index]);
    }
  }

  openPicker(){
    var localRawOption=[];
    for (var i = 0; i < this.props.option.values.length; i++) {
      localRawOption.push(this.props.option.values[i]);
    }
    localRawOption.push("Cancel");
    //alert(localRawOption);
    var options={
      options:localRawOption,
      cancelButtonIndex:localRawOption.length-1,
      title:this.props.option.name
    }
  
  this.props.showActionSheetWithOptions(options,this.selectOption);

  }


  render() {
    return (
      <View  style={[{flex:1}]}>
        <TouchableOpacity style={[style.button, this.props.style,{backgroundColor:css.dynamic.general.buttonColor,borderColor:css.dynamic.general.buttonBorderColor},{"overflow":"hidden",borderRadius:css.dynamic.general.rounded+""=="true"?3:0}]} onPress={this.openPicker}>
          <Text style={[style.buttonText,{color:css.dynamic.general.buttonText}]}>{this.props.option.name+": "+this.state.value}</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
export default connectActionSheet(Picker)