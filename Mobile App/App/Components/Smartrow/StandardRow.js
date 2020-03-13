'use strict';

import React, {Component} from "react";
import {Text, View, Image} from "react-native";
import style from "./style";
import css from '@styles/global'
import moment from 'moment';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const ConditionalDisplay = ({condition, children}) => condition ? children : <View></View>;

export default class StandardRow extends Component {
  constructor(props) {
    super(props);
    this.state = {}
    this.chatOrListofUsersView=this.chatOrListofUsersView.bind(this);
    
  }

   /**
   * Get the prop "from" and show view for chat or list of users
   */
  chatOrListofUsersView(){
    var rowsStyle=css.dynamic.rows;
    if(this.props.from == "chats"){

      return(
        <View style={style.standardRowTitleAreaUsers} >
            <View style={{flexDirection:"row",marginTop:10}}>
              <Text  style={[style.nameAndLastname,{color:rowsStyle.titleColorOnRow}]} >{this.props.title}</Text>
              <View style={{alignItems:"flex-end",marginRight:10,flex:1}}>
                  <Text  style={[style.username,{color:rowsStyle.titleColorOnRow,paddingLeft:80,marginRight:10,textAlign:"right"}]} >{moment(this.props.lastChat).fromNow()}</Text>
              </View>
            </View>
            <Text  style={[style.username,{color:rowsStyle.titleColorOnRow,marginBottom:12}]} >{this.props.subtitle.text}</Text>
          </View>
      )
    }else if(this.props.from == "listOfUsers"){
      return(
        <View style={style.standardRowTitleArea} >
            <Text  style={[style.nameAndLastname,{color:rowsStyle.titleColorOnRow}]} >{this.props.title}</Text>
            <Text  style={[style.username,{color:rowsStyle.titleColorOnRow}]} >{this.props.subtitle}</Text>
        </View>
      )
    }else if(this.props.from == "GroupChat"){
      return(
        <View style={style.standardRowTitleAreaUsers} >
            <View style={{flexDirection:"row",marginTop:10}}>
              
              <Text  style={[style.nameAndLastname,{color:rowsStyle.titleColorOnRow}]} >{this.props.subtitle}</Text>
              <View style={{alignItems:"flex-end",marginRight:10,flex:1}}>
              <ConditionalDisplay condition={this.props.isClicked}>
                  <MaterialIcons name={"check-circle"} size={22} style={{ color: "gray" }} />
              </ConditionalDisplay>
                
              </View>
            </View>
             
          </View>
      )
    }
  }

 

  render() {
    return (
      <View>
        <View style={[style.standardRow,{backgroundColor:css.dynamic.rows.backgroundColor}]}>
          <View style={style.standardRowImageIconArea} >
            <Image style={style.userImage} source={this.props.image != ""?{uri:this.props.image}:require('@images/blank-image.jpg')} />
          </View>
          {this.chatOrListofUsersView()}
          <ConditionalDisplay condition={this.props.from == null}>
          <View style={style.standardRowTitleArea} >
              <Text  style={[{color:css.dynamic.rows.titleColorOnRow}]} >{this.props.title}</Text>
          </View>
          <View style={style.standardRowArrowArea}>
              <MaterialIcons name={"navigate-next"} size={24} style={{ color: css.dynamic.rows.arrowColor }} />
          </View>
          </ConditionalDisplay>
         
       </View>
        <View style={[style.standardRowSeparator,{backgroundColor:css.dynamic.rows.backgroundColor}]}><View style={[style.border,{backgroundColor:css.dynamic.rows.separatorColor}]} ></View></View>
        </View>
       
    );
  }
}
