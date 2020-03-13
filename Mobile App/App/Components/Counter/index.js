'use strict';

import React, {Component} from "react";
import {Text, View, TouchableOpacity} from "react-native";
import style from "./style";
import css from '@styles/global'


export default class Counter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      counter:this.props.start,
      id:this.props.id
    }
    this.increase=this.increase.bind(this);
    this.decrease=this.decrease.bind(this);
  }

  increase(){
    var newCounter=this.props.max==this.state.counter?this.state.counter:this.state.counter+1;
    this.props.callback(newCounter,this.props.id)
    this.setState({
      counter:newCounter
    })
  }

  decrease(){
    var minimum=this.props.min==0?0:1;
    var newCounter=this.state.counter==minimum?this.state.counter:this.state.counter-1;
    this.props.callback(newCounter,this.props.id)
    this.setState({
      counter:newCounter
    })
  }


  render() {
    return (
      <View style={[style.button, this.props.style,{justifyContent:"center",marginRight:2},{backgroundColor:css.dynamic.general.buttonColor,borderColor:css.dynamic.general.buttonBorderColor},{flex:1,flexDirection:this.props.vertical?"column":"row"},{"overflow":"hidden",borderRadius:css.dynamic.general.rounded+""=="true"?3:0}]}>
        <TouchableOpacity style={{flex:1}} onPress={this.decrease}>
          <Text style={[style.buttonText,{color:css.dynamic.general.buttonText}]}>{"-"}</Text>
        </TouchableOpacity>
        <View style={{flex:1}}>
          <Text style={[style.buttonText,{color:css.dynamic.general.buttonText}]}>{this.state.counter}</Text>
        </View>
        <TouchableOpacity style={{flex:1}} onPress={this.increase}>
          <Text style={[style.buttonText,{color:css.dynamic.general.buttonText}]}>{"+"}</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
