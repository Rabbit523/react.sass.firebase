import React, { Component } from 'react';
import { View, Text,FlatList } from 'react-native';
import {CheckBox } from 'react-native-elements'

class CheckBoxComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categories:this.props.data,
      checked:false,
      
      referenceID:this.props.referenceID
    };
    this.handleChange = this.handleChange.bind(this);
  }
  

  componentDidUpdate(prevProps) {
    
    // Typical usage (don't forget to compare props)
    if (this.props.data !== prevProps.data) {
      
      this.setState({
        categories: this.props.data,
        referenceID:this.props.data[0].id
      })
     
    }
    if(this.props.referenceID !== prevProps.referenceID){
      
      this.setState({
        referenceID: this.props.referenceID,
      })
    }
    
    
  }

  /**
   * 
   */
  handleChange = (id) => {

    this.setState({
      referenceID:id
    })
    this.props.callBackForCategory(id)
    
  }


  render() {
    return (
      <View>
        <Text style={[{textAlign: 'left', color:'#666b73',fontSize:18, fontWeight:"bold", marginBottom:5,fontFamily: 'lato-bold',marginLeft:10}]}>{this.props.config.label}</Text>
        <FlatList
          data={this.state.categories}
          keyExtractor={this._keyExtractor}
          extraData={this.state}
          renderItem={({item, index}) =>
            <CheckBox
              left
              title={item.title}
              checkedIcon='dot-circle-o'
              uncheckedIcon='circle-o'
              checkedColor="gray"
              containerStyle={{width:150,backgroundColor:"transparent",borderColor:"transparent"}}
              onPress={() => 
               this.handleChange(item.id)
              }
              checked={this.state.referenceID == item.id?true:false}
                
            />
           }
        />
      </View>
    );
  }
}

export default CheckBoxComponent;
