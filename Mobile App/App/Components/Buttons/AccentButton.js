'use strict';

import React, {Component,PropTypes} from "react";
import {Text, View, TouchableOpacity, Image} from "react-native";
import style from "./style";
import css from '@styles/global'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient'


export default class AccentButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      setup:this.props.display,
      color1: this.props.color1,
      color2: this.props.color2,
      title: this.props.title
    }
  }


  render() {
    return (
      
      <LinearGradient colors={[this.props.color1,this.props.color2]} start={[0.5, 0]} end={[1, 0]} style={this.props.style} >
            <TouchableOpacity onPress={this.props.onPress} >
              <View style={css.layout.loginButton}>
                <Text style={this.props.textStyle}>{this.props.title}</Text>
              </View>
            </TouchableOpacity>
      </LinearGradient>
     
    );
  }
}