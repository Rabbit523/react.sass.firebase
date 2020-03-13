import React, { Component } from 'react';
import {
  Dimensions,
  ScrollView,
  View,
  ImageBackground,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image
} from 'react-native';

import SmartIcon from '@smarticon';
import css from '@styles/global';
var to = require('to-case')
import { BlurView } from 'expo';
import { SafeAreaView } from 'react-navigation'


const paddingValue = 8;
const uri = 'https://s3.amazonaws.com/exp-icon-assets/ExpoEmptyManifest_192.png';
const ConditionalWrap = ({condition, wrap, children}) => condition ? wrap(children) : children;
export default class Grid extends Component {
  static navigationOptions = {
    
    title: 'Login',
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
        menus:props.data,
    }
    const screenWidth = Dimensions.get('window').width;
    this.itemSize = {
      width: (screenWidth - (paddingValue * 6)) / 2-10,
      height: (screenWidth - (paddingValue * 6)) / 2,
    };
    this.renderItems=this.renderItems.bind(this);

    
    
  }
  
  onItemPressed(item){
    this.props.navigation.navigate(item.name, null)
  }

  renderItems = () => this.props.data.navigation.menus.map((route, index) => (
    
   <View>
     <TouchableOpacity
        style={{ ...this.itemSize,flexDirection:"column",marginTop:20,backgroundColor:this.props.design.general.gridButtonsColor||"#273177",borderRadius: 30,opacity:0.7,alignItems:"center",justifyContent:"center"}}
        
        onPress={() => this.onItemPressed(route)}>
         <BlurView tint={"dark"}  intensity={50} style={StyleSheet.absoluteFill}>
         </BlurView>
         < View style = {
           [styles.icon, {
             backgroundColor: this.props.design.general.colors?this.props.design.general.colors[index % this.props.design.general.colors.length].color:"#5B9AEF",
             width: 50,
             height: 50,
             alignItems: "center",
             justifyContent: "center",
             borderRadius: 25
           }]
         } >
            <SmartIcon defaultIcons={"MaterialIcons"} name={route.icon}  size={30} color={this.props.design.general.buttonText||"#ffffff"}/>
        </View>
        
        <Text style={{fontSize: 14,fontWeight: "600",color:this.props.design.general.colors?this.props.design.general.colors[index % this.props.design.general.colors.length].color:"#fff"}}>{route.name}</Text>
  </TouchableOpacity>
   </View>
    
  
  ));


  renders() {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ width: 300, height: 600, backgroundColor:blue }} ></View>

        {/* Adjust the tint and intensity */}
        <BlurView tint="light" intensity={50} style={StyleSheet.absoluteFill}>
          
        </BlurView>


      </View>
    );
  }



  render() {
      
    var navigationColorBackground=this.props.design.general.navigationColorBackground||"#162367";
    var shouldWeShowImageBg=true;//this.props.design.general.showBackgroundImage;
    if(shouldWeShowImageBg){
      var navigationColorBackground=['rgba(0,0,0,0)','rgba(0,0,0,0)'];
    }
    return (
      <ConditionalWrap
          isLoading={this.state.data}
          condition={shouldWeShowImageBg}
          wrap={children => <ImageBackground 
            source={
              this.props.design.general.backgroundImage?{uri:this.props.design.general.backgroundImage}:require('@images/login_bg.jpg')}
            style={[css.layout.imageBackground,{flex:1}]}
            >{children}</ImageBackground>}
          >
          <SafeAreaView>
          <View style={{backgroundColor:shouldWeShowImageBg?'rgba(255, 255, 255, 0.0)':this.props.design.general.navigationColorBackground, height:40,justifyContent:"center", marginLeft:25,marginTop:25}}>
            <Text style={{color:"white",fontSize:20,fontWeight:"bold"}}>{this.props.data.name}</Text>
          </View>
          <ScrollView
              style={{
                  backgroundColor:navigationColorBackground,
                  padding: paddingValue*2,
                }}
              contentContainerStyle={styles.rootContainer}>

              {this.renderItems()}
          </ScrollView>

          </SafeAreaView>
         
      </ConditionalWrap>
        );
  }

}

  const styles = StyleSheet.create({
    rootContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent:"space-between"
    },
    icon: {
      marginBottom: 16,
    },
  });