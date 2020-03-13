'use strict';

import React, {Component} from "react";
import { View, Image} from "react-native";
import style from "./style";
import css from '@styles/global'

export default class SingleImage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      setup:this.props.display
    }
  }


  render() {
    return (
       <View style={[style.singleImageWrapper]}>
          <Image source={{uri:this.props.url}} style={[style.singleImage,{"overflow":"hidden",borderRadius:css.dynamic.general.rounded+""=="true"?4:0}]}></Image>
       </View>
    );
  }
}
