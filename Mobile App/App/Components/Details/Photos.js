import React, {Component} from "react";
import {Text, View, TouchableOpacity,ScrollView, UIManager,FlatList} from "react-native";
import style from "./style";
import css from '@styles/global'
import SingleImage from './SingleImage'
import Shadow from './../Theme/Shadow'

export default class Photos extends Component {
  constructor(props) {
    super(props);
    this.state = {
      setup:this.props.display,
      rtl:css.dynamic.general.isRTL,
      
    }
    this.showPhotos=this.showPhotos.bind(this);
    this.renderItem=this.renderItem.bind(this);
  }

  

  componentWillMount() {
    if (UIManager.setLayoutAnimationEnabledExperimental)
      UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  renderItem({ item, index }) {
    return (<TouchableOpacity  key={item.photo} onPress={()=>{this.props.onPress(index)}} ><SingleImage url={item.photo} ></SingleImage></TouchableOpacity>)
    }

  showPhotos(){
    if(!this.props.isVertical)
    {
      return(
      <ScrollView style={style.scrollView}
                        directionalLockEnabled={true}
                        horizontal={true}>

                <View style={{flexDirection:'row',justifyContent:'center',marginBottom:10}}>
                  {this.props.photos.map((item,index)=>{
                    
                    return (<TouchableOpacity  key={item.photo} onPress={()=>{this.props.onPress(index)}} ><Shadow shadowOpacity={0.2}><SingleImage  url={item.photo}></SingleImage></Shadow></TouchableOpacity>)
                  })}
                </View>
            </ScrollView>
  )
  }
    else{
      return(
        <FlatList
          contentContainerStyle={{flexDirection: 'row',flexWrap: 'wrap'}}
          data={this.props.photos}
          renderItem={this.renderItem}
    />
      )
    }
  }

  render() {
    const rtlText = this.state.rtl && { textAlign: 'right', writingDirection: 'rtl' };
    const rtlView = this.state.rtl && { flexDirection: 'row-reverse' };
    return (

      <View style={[{marginTop:15,marginLeft:5, marginRight:5}]}>
        <Text style={[{textAlign: 'left', color:'#666b73',fontSize:20, fontWeight:"bold", marginBottom:5,fontFamily: 'lato-bold'},rtlText]}>{this.props.title}</Text>
          {this.showPhotos()}
      </View>
    );
  }
}