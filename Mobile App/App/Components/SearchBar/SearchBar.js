import React, { Component } from 'react'
import { Text, View,TextInput } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import Shadow from '../Theme/Shadow';
import SearchBarStyle from "./SearchBar.style"

export default class SearchBar extends Component {

    constructor(props){
        super(props);
        this.state={
            text:""
        }
        this.handleChangeText=this.handleChangeText.bind(this);
        this.clearText=this.clearText.bind(this);
    }

    clearText(){
        this.setState({text:""})
    }

    blur(){

    }

    
    handleChangeText(text){
        this.setState({text:text})
        this.props.onChangeText(text);
    }

  render() {
    return (
        <View style={SearchBarStyle.searchContainer}>
            <Shadow>
            <View style={SearchBarStyle.searchInnerContainer}>
                <View style={SearchBarStyle.iconContainer}>
                    <Ionicons name={"ios-search"} size={24} color={"gray"} />
                </View>
                <View style={SearchBarStyle.searchTextContainer}>
                    <TextInput  value={this.state.text} placeholder={"Search"} onChangeText={this.handleChangeText} />
                </View>
            </View>
            </Shadow>
        </View>
        
      
    )
  }
}
