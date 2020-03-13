import React, {Component} from "react";
import {Text, View} from "react-native";
import { Badge } from 'react-native-elements';



export default class Tag extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tagText: this.props.tagText,
      bgColor: this.props.bgColor
    }
  }

  render() {

    return (
      <View style={{marginLeft:10, marginBottom: 10}}>
        <Badge containerStyle={{ backgroundColor: this.props.bgColor,flex:1}}>
          <Text style={{color: 'white'}}>{this.props.tagText}</Text>
        </Badge>

      </View>
    );
  }
}
