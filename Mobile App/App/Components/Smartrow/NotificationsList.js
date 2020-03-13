'use strict';

import React, {Component} from "react";
import {Text, View, UIManager} from "react-native";
import style from "./style";
import css from '@styles/global'
import fun from '@functions/common'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';



export default class List extends Component {
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
      <View style={[style.NotificationWraper]}>
        <View style={[style.listRow,{backgroundColor:css.dynamic.rows.backgroundColor,borderRadius:css.dynamic.general.rounded+""=="true"?10:0}]}>
           <View style={{height:50,width:50,alignItems:"center"}}>
              {/*  Icon  */}
              <MaterialIcons name={this.props.isRead?"notifications-none":"notifications"} size={30} style={[{marginTop:10},{color: css.dynamic.general.buttonColor}]} />
           </View>
           <View style={{flex:1,padding:10,paddingLeft:0}}>
           <Text numberOfLines={1} style={[style.titleinNotification,rtlText,{color: css.dynamic.general.buttonColor}]}>{this.state.title}</Text>
           <Text numberOfLines={3} style={[style.descriptionInNotification,rtlText,{color: css.dynamic.general.buttonColor}]}>{this.state.description}</Text>
           </View>
        </View>
      </View>
    );
  }
}
