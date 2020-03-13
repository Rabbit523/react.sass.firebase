import React, {Component} from "react";
import {Text, View,  UIManager, ScrollView, Dimensions,Linking } from "react-native";
import css from '@styles/global'
import theme from './../Theme/theme';
import HTML from 'react-native-render-html';



export default class Description extends Component {
  constructor(props) {
    super(props);
    this.state = {
      setup:this.props.display,
      rtl:css.dynamic.general.isRTL
    }
  }

  componentWillMount() {
    if (UIManager.setLayoutAnimationEnabledExperimental)
      UIManager.setLayoutAnimationEnabledExperimental(true);
     
  }



  render() {
      const rtlText = this.state.rtl && { textAlign: 'right', writingDirection: 'rtl' };
      const rtlView = this.state.rtl && { flexDirection: 'row-reverse' };
    return (
      <View style={[{margin:20,marginLeft:10,marginRight:10},rtlText]}>
        <Text style={[theme.sectionHeaderTitle,{marginBottom:5},rtlText]}>{this.props.title}</Text>
        <HTML t
         html={"<uni>"+this.props.text+"</uni>"} imagesMaxWidth={Dimensions.get('window').width} onLinkPress={(event, href)=>{
            Linking.openURL(href)
          }}/>
      </View>
    );
  }
}
