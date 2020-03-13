'use strict';

import React, {Component,PropTypes} from "react";
import {ScrollView,Text, View, TouchableOpacity, Image,StatusBar} from "react-native";
import navBarStyle from "./style";
import css from '@styles/global'

import SelectableButton from "../Buttons/SelectableButton"


export default class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tags:this.props.options,
      selected:this.props.default?this.props.default:"all"
    }
    this.showValue=this.showValue.bind(this);
  }

  componentDidMount(){
    //alert(this.props.default?this.props.default:"all")
    this.props.selector(this.props.default?this.props.default:"all");
  }

  showValue(value){
    this.setState({
      selected:value
    })
    this.props.selector(value);
  }

  

  render() {
    const _this = this
    var tintToUse=(css.dynamic.navBar.detailsTintColor&&this.props.detailsView?css.dynamic.navBar.detailsTintColor:css.dynamic.navBar.tintColor)
    return (
      <View style={{backgroundColor:"transparent"}}>
        <View style={{backgroundColor:"transparent"}}>
          <View style={
            [
              navBarStyle.containerBar,
            //{backgroundColor:(css.dynamic.navBar.detailsBackgroundColor&&this.props.detailsView?css.dynamic.navBar.detailsBackgroundColor:css.dynamic.navBar.backgroundColor)},
              {backgroundColor:"transparent"},
            ]}>

             <ScrollView style={navBarStyle.barContent}
                        directionalLockEnabled={true}
                        horizontal={true}>

                <View style={{flexDirection:'row',justifyContent:'center'}}>
                  {this.props.options.map((item,index)=>{
                    var isSelected=item.id==this.state.selected;
                    return (<SelectableButton key={item.id} {...this.props} onPressAction={this.showValue} isSelected={isSelected} title={item.title} idOfSelect={item.id} tintToUse={this.props.tintColor?this.props.tintColor:tintToUse} />)
                  })}
                </View>
            </ScrollView>

            

          </View>
        </View>
      
      </View>

    );
  }
}
