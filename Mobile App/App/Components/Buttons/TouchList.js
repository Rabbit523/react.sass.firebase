import React, { Component } from 'react';
import { View, Text,ScrollView } from 'react-native';
import TocuhItem from '@uniappbuttons/TocuhItem';
class TouchList extends Component {
  constructor(props) {
    super(props);
    this.state = {
        activeIndex:null,
        categoryItems:props.categoryItems,
        categoryId:null
    };
    this.setCategory = this.setCategory.bind(this);
  }

  setCategory(index,id){
    
    if(this.state.activeIndex==null){
        //None selected
        
        this.setState({
            activeIndex:index
        })
       this.props.callBack(id,this.props.collection_key)
    }else{
        //Already selected
        if(index!=this.state.activeIndex){
          
            this.setState({
                activeIndex:index,
            })
            this.props.callBack(id,this.props.collection_key)
          }else{
            
            this.setState({
                activeIndex:null,
            })
            this.props.callBack(null,null)
          }
         
    }

  
    
   
  }

  render() {
    var _this=this;
    return (
        <ScrollView
        horizontal={true}
        style={{flexDirection:"row",marginBottom: 20,}} relatedData={this.state.activeIndex}>
        { 
          this.props.categoryItems.map(function(val, index){
            
            return(
              <TocuhItem item={val} active={_this.state.activeIndex==null?true:(_this.state.activeIndex==index)} index={index} callBack={(li,id)=>{_this.setCategory(li,id)}}></TocuhItem>
            )
          })
        }
     </ScrollView>
    );
  }
}

export default TouchList;
