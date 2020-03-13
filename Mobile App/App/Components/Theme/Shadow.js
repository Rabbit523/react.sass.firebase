import React, { Component } from 'react'
import { Text, View } from 'react-native'

export default class Shadow extends Component {
    constructor(props){
        super(props)
    }
  render() {
    return (
      <View style={{flex:1,
            shadowColor: this.props.shadowColor?this.props.shadowColor:"#000",
            shadowOpacity: this.props.shadowOpacity?this.props.shadowOpacity:0.1,
            shadowRadius: 4,
            shadowOffset: { width: 0, height: 4 },
            elevation:  this.props.elevation?this.props.elevation:5}}>
        {this.props.children}
      </View>
    )
  }
}
