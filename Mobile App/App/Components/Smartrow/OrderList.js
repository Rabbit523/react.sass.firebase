'use strict';

import React, {Component} from "react";
import {Text, View, Image, UIManager} from "react-native";
import style from "./style";
import css from '@styles/global'
import fun from '@functions/common'
import T from '@functions/translation'


export default class OrderList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      setup:this.props.display,
      title:this.props.title,
      description:this.props.description,
      subtitle:this.props.subtitle,
      subtitleFunctions:this.props.subtitleFunctions,
      rtl:css.dynamic.general.isRTL

    }
    this.applyChanges=this.applyChanges.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    // You don't have to do this check first, but it can help prevent an unneeded render
    if (nextProps.startTime !== this.state.startTime) {
      this.setState({ startTime: nextProps.startTime });
    }else{
      this.setState({subtitleFunctions:nextProps.subtitleFunctions})
      var _this=this;
      setTimeout(function(){ _this.applyChanges(); }, 500);

    }
  }


  componentWillMount() {
    if (UIManager.setLayoutAnimationEnabledExperimental)
      UIManager.setLayoutAnimationEnabledExperimental(true);
  }


  applyChanges(){
     //Title
    if(this.props.titleFunctions!=null){
      this.setState({
        title:fun.callFunction(this.props.title,this.props.titleFunctions)
      })
    }

    //Description
    if(this.props.descriptionFunctions!=null){
      this.setState({
        description:fun.callFunction(this.props.description,this.props.descriptionFunctions)
      })
    }


    //Subtitle
    if(this.state.subtitleFunctions!=null){
      this.setState({
        subtitle:fun.callFunction(this.props.subtitle,this.state.subtitleFunctions)
      })
    }
  }

  componentDidMount(){
    //Check function
    this.applyChanges();

  }


  render() {
    
    const rtlText = this.state.rtl && { textAlign: 'right', writingDirection: 'rtl' };
    const rtlView = this.state.rtl && { flexDirection: 'row-reverse' };
    return (
      <View style={style.listWraper}>
      <View style={[style.listRow,{backgroundColor:css.dynamic.rows.backgroundColor,borderRadius:css.dynamic.general.rounded+""=="true"?10:0}]}>
        <Image source={{uri: this.props.image}} style={[style.imageInList,{borderRadius:css.dynamic.general.rounded+""=="true"?10:0}]}></Image>
        <View style={!this.props.isCart?style.infoPanelInList:style.infoPanelInListWithCart}>
            <Text numberOfLines={1} style={[style.titleinList,rtlText]}>{this.state.title}</Text>
            <Text numberOfLines={1} style={[style.subtitleInList,rtlText,{marginTop: 12}]}>{T.quantity}{this.state.description}</Text>
            <Text numberOfLines={1} style={[style.subtitleInList,rtlText,{marginTop: 3}]}>{T.price}{parseInt(this.state.description)*this.state.subtitle}</Text>
        </View>
      </View>
    </View>
    );
  }
}