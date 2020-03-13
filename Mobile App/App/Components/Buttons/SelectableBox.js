'use strict';

import React, {Component} from "react";
import { View, TouchableOpacity, Image} from "react-native";
import css from '@styles/global'


export default class SelectableBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      setup:this.props.display,
      isSelected:props.isSelected
    }
    this.handleThePress=this.handleThePress.bind(this);
  }

  handleThePress(){
    this.setState({
      isSelected:!this.state.isSelected

    })
    this.props.onPress();
  }





  render() {
    var image=this.props.isPayPal?require('@images/paypal.png'):require('@images/delivery.png');
    return (
      <View  style={{flex:1}}>
        <TouchableOpacity
        style={[{backgroundColor:this.props.isSelected?css.layout.stepIndicatorBackground:"#fff"},
        css.static.paymentOption]}
          onPress={this.handleThePress}>
          <Image
            style={css.static.paymentOptionImage}
            source={image}
          />
        </TouchableOpacity>
      </View>
    );
  }
}
