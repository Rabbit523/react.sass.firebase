import React, {Component} from "react";
import {Text, View} from "react-native";
import css from '@styles/global'
import SmartIcon from '@smarticon'


export default class InfoBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      setup:this.props.display,
      iconName: this.props.iconName,
      descText: this.props.descText,
      color: this.props.color
    }
  }

render() {
const icon = (<SmartIcon name={this.props.iconName} size={23} color={this.props.color} />)
    return (
      <View style= {[css.layout.infoBoxStyle,{justifyContent: 'flex-start'}]}>
      <View style={{marginRight:5}}>
          {icon}
      </View>
        <Text style={{color:this.props.color,fontSize: 16,fontFamily: 'open-sans'}}>{this.props.descText}</Text>
      </View>
    );
  }
}
