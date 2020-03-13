'use strict';

import React, {Component} from "react";
import {Text, View, TouchableOpacity} from "react-native";
import css from '@styles/global'


export default class StateButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      setup:this.props.display,
      number:this.props.number,
      title: this.props.title,
      style:this.props.style,
      isDisabled:this.props.disabled
    }
  }


  render() {
    return (
        <View style={css.layout.stateButton}>
          <TouchableOpacity onPress={this.props.onPress} disabled={this.props.disabled}>
                <Text style={this.props.style}>{this.props.number}</Text>
                <Text style={css.layout.stateBtnTitle}>{this.props.title}</Text>
          </TouchableOpacity>
        </View>
      
     
    );
  }
}
