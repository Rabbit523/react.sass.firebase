import React, {Component} from "react";
import View from "react-native";
import css from '@styles/global'
import Tag from '@detailcomponents/Tag';



export default class TagView extends Component {
  constructor(props) {
    super(props);
    this.state = {}

  }

  createSingleTag(tag){
    return (
            <Tag
               bgColor={css.dynamic.general.buttonColor}
               tagText={tag}
            />
    )
  }

  render() {

    return (
       <View style={[css.layout.tagViewStyle,{justifyContent: "space-evenly"}]} >
          {this.props.tags.map((tag)=>{
            return this.createSingleTag(tag);
          })}
      </View>
    );
  }
}
