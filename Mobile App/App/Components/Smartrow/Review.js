import React, { Component } from 'react';
import {Text, View, Image} from "react-native";
import style from "./style";
import css from '@styles/global'
import moment from 'moment';
import StarRating from 'react-native-star-rating';
const ConditionalDisplay = ({condition, children}) => condition ? children : <View></View>;
class Review extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  

  render() {
    var rowsStyle=css.dynamic.rows;
    return (
        <View>
          <View style={[style.standardRow2,{backgroundColor:css.dynamic.rows.backgroundColor}]}>
                <View style={[style.standardRowImageIconArea,{marginRight:10}]} >
                    <Image style={style.userImage} source={this.props.image != ""?{uri:this.props.image}:require('@images/blank-image.jpg')} />
                </View>
          <View style={style.standardRowTitleArea} >
                <Text  style={[style.nameAndLastname,{color:rowsStyle.titleColorOnRow,marginTop:10}]} >{this.props.title}</Text>
                
                  <StarRating
                      disabled={true}
                      emptyStar={'ios-star-outline'}
                      fullStarColor={'#e2d112'}
                      fullStar={'ios-star'}
                      halfStar={'ios-star-half'}
                      iconSet={'Ionicons'}
                      maxStars={5}
                      rating={this.props.rating}
                      starSize={20}
                  />
                
                
                <Text  style={[style.username,{marginTop:5}]} >{moment(this.props.lastChat).fromNow()}</Text>
                <Text  style={[style.username,{color:rowsStyle.titleColorOnRow,marginTop:5,marginBottom:10}]} >{this.props.subtitle}</Text>
                
          </View>
          
        </View>
      </View>
    );
  }
}

export default Review;
