'use strict';

import React, {Component,PropTypes} from "react";
import {Text, View, TouchableOpacity, Image, UIManager, LayoutAnimation} from "react-native";
import style from "./style";
import css from '@styles/global'
import fun from '@functions/common'
import Counter from '@components/Counter';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient'
import StarRating from 'react-native-star-rating';
const ConditionalDisplay = ({condition, children}) => condition ? children : <View></View>;

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

  showCounter(start){
    if(this.props.isCart){
      return (<Counter  start={this.props.qty} {...this.props} vertical={true}/>)
    }else{
      return (<View />)
    }
  }


  render() {
    
    const rtlText = this.state.rtl && { textAlign: 'right', writingDirection: 'rtl' };
    const rtlView = this.state.rtl && { flexDirection: 'row-reverse' };
    var position = this.props.image.lastIndexOf("/")+1

    var rowsStyle=css.dynamic.rows;
    if(this.props.isSpecial){
      rowsStyle=css.dynamic.specialRows;
    }
 
    var bgGradient=[rowsStyle.backgroundColor,rowsStyle.backgroundColor];
    if(rowsStyle.backgroundGradient){
      bgGradient=[];
      rowsStyle.backgroundGradient.map((item,index)=>{
        bgGradient.push(item.color);
      })
    }

    return (
      <View style={style.listWraper}>
        <LinearGradient colors={bgGradient} style={[style.listRow,{backgroundColor:rowsStyle.backgroundColor,borderRadius:css.dynamic.general.rounded+""=="true"?10:0}]}>
        <ConditionalDisplay condition={this.props.image != ""}>
          <Image source={
              {uri: this.props.image}
              } 
              style={[style.imageInList,{borderRadius:css.dynamic.general.rounded+""=="true"?10:0}]}></Image>
        </ConditionalDisplay>
        
            {/* code for thumbNails
             !this.props.haveThumbnails?
              [this.props.image.slice(0, position), this.props.thumbPrefix, this.props.image.slice(position)].join(''):
              */}
          <View style={!this.props.isCart?style.infoPanelInList:style.infoPanelInListWithCart}>
            <Text numberOfLines={1} style={[style.titleinList,rtlText,{color:rowsStyle.titleColorOnRow}]}>{this.state.title}</Text>
            <ConditionalDisplay condition={this.state.description != ""}>
               <Text numberOfLines={4} style={[style.descriptionInList,rtlText,{color:rowsStyle.desciptionColor}]}>{this.state.description}</Text>
            </ConditionalDisplay>
            
            <View style={[{flex:1,flexDirection:"row"},rtlView]}>
              <Text numberOfLines={1} style={[style.subtitleInList,rtlText,{color:rowsStyle.subtitleColor}]}>{this.state.subtitle}</Text>
              <ConditionalDisplay condition={this.props.showRating && this.props.numReview>0}>
              <View style={{alignItems:"center",justifyContent: 'flex-end',flex:1,flexDirection:"row"}}>
                <StarRating
                        disabled={true}
                        emptyStar={'ios-star-outline'}
                        fullStarColor={'#e2d112'}
                        fullStar={'ios-star'}
                        halfStar={'ios-star-half'}
                        iconSet={'Ionicons'}
                        maxStars={5}
                        rating={this.props.rating}
                        starSize={18}
                    />
                    <Text style={{marginLeft:5,marginRight:5}}>{this.props.numReview > 0 ? this.props.numReview : "0"}</Text>
              </View>
              </ConditionalDisplay>
              
            </View>
          </View>
          {this.showCounter()}
        </LinearGradient>
      </View>
    );
  }
}
