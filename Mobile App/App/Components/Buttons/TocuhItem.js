'use strict';

import React, {Component} from "react";
import { Text, View,TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'

import SmartIcon from '@smarticon';
const ConditionalDisplay = ({condition, children}) => condition ? children : <View></View>;
export default class TocuhItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      item:this.props.item,
      active:this.props.active
    }
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    if (this.props.active !== prevProps.active) {
      this.setState({
        active:this.props.active
      })
    }
  }

 
  handleChange = (index,id) =>{
    
    this.props.callBack(index,id);
    
  }

  render() {
    return (
      <View key={this.props.index}>

        <TouchableOpacity onPress={() =>{this.handleChange(this.props.index,this.state.item.id)} }
       >
        <View style={{borderRadius:10,margin:4,marginBottom:15,paddingLeft:10,
          shadowColor: "#000",
          opacity:this.state.active?1:0.3,
          shadowOpacity: 0.1,
          shadowRadius: 4,
          shadowOffset: { width: 0, height: 4 },
          elevation: 5,
          alignItems:"center"
         }}>
        
        
          <LinearGradient  colors={gradients[(this.props.index%gradients.length)]}
          style={{width:50,height:50,borderRadius:25,justifyContent:"center",alignItems:"center",marginBottom:5}}>
              <SmartIcon defaultIcons={"MaterialIcons"} name={this.state.item.icon}  size={30} color='#ffffff'/>
          </LinearGradient>
          
          <View>
            <Text style={{color:"#434F64",fontWeight:'300',fontFamily: 'lato-bold'}}>{this.state.item.title}</Text>
          </View>
        
      </View>
      </TouchableOpacity>
      </View>
     
    );
  }
}
const gradients=[
    ['#fad0c4','#ff9a9e'],
    ['#fbc2eb','#a18cd1'],
    ['#ffecd2','#fcb69f'],
    ['#ff9a9e','#fecfef'],
    ['#f6d365','#fda085'],
    ['#fbc2eb','#a6c1ee'],
    ['#fdcbf1','#e6dee9'],
    ['#a1c4fd','#c2e9fb'],
    ['#d4fc79','#96e6a1'],
    ['#84fab0','#8fd3f4'],
    ['#cfd9df','#e2ebf0'],
    ['#a6c0fe','#f68084'],
    ['#fccb90','#d57eeb'],
    ['#e0c3fc','#8ec5fc'],
    ['#f093fb','#f5576c'],
    ['#4facfe','#00f2fe'],
    ['#43e97b','#38f9d7'],
    ['#fa709a','#fee140'],
    ['#a8edea','#fed6e3'],
    ['#89f7fe','#66a6ff']
  ];
  

  