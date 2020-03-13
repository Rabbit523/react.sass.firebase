/*
  Created by Dimov Daniel
  Mobidonia
  daniel@mobidonia.com
*/
import React, { Component } from "react";
import {ScrollView, Text, View, Image,Share} from "react-native";
import Navbar from '@components/Navbar'
import css from '@styles/global'
import T from '@functions/translation'
import Button from '@uniappbuttons/Button';




export default class OrderDetail extends Component {

  //The constructor
  constructor(props) {

    //Our props can be ditectly in the props.data or props.navigation.state.params
    //First time, data goes in properties,
    //Later it is passed in navigation state
    //Let's find out where they are
    var isDataInProps = props.navigation.state.params == null;

    super(props);
    var theProps = isDataInProps ? props : props.navigation.state.params;

    this.state = {
      pr: theProps,
    }
      
  }

  showShareLink() {
    
        return (
          <View style={css.layout.shareOrderButton}>
            
              <Button
                title="Share"
                onPress={() => {
                  Share.share({
                    title: this.props.navigation.state.params.data.item.id,
                    url: "his.props.navigation.state.params.data.item.id",
                  })
                }}
                text="Share"
              />
            </View>
         
        )
      }
   

  render() {
    return (
      <View style={{flex: 1}}>
        <View>
          <Navbar navigation={this.props.navigation} isRoot={false} />
        </View>

        <ScrollView>
          <View style={css.layout.orderDetailView}>
            <Text style={css.layout.orderName}>
              {this.props.navigation.state.params.data.item.order[0].name}
            </Text>
            <View style={css.layout.orderContent}>
              <Text style={[css.layout.orderUser,{marginBottom:10}]}>
                {T.user}{"\n"}
                {this.props.navigation.state.params.data.item.delivery.email}
              </Text>
              <Text style={{ textAlign: "center", fontSize: 13, color: "#000000", fontWeight: "400"}}>
                {T.orderStatus}{"\n"}
                {this.props.navigation.state.params.data.item.status == "Just created"?"Just created":"Used"}
              </Text>
              <Image
                style={css.layout.qrImage}
                source={{ uri: 'http://chart.apis.google.com/chart?cht=qr&chs=300x300&chl=' + this.props.navigation.state.params.data.item.id+ '&chld=H|0' }}
              />

              <View style={css.layout.orderID}>
                <Text style={{textAlign: "center"}}>
                  {T.orderID}{"\n"}
                  #{this.props.navigation.state.params.data.item.order[0].id}
                </Text>
              </View>
            </View>
            </View>
            <View>
              {this.showShareLink()}
            </View>
        </ScrollView>
        
        
      </View>
    );
  }
}