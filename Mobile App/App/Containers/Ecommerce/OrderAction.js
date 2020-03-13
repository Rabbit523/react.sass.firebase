/*
  Created by Dimov Daniel
  Mobidonia
  daniel@mobidonia.com
*/
import React, { Component } from "react";
import {ScrollView, Text, View, Image } from "react-native";
import Navbar from '@components/Navbar'
import css from '@styles/global'
import T from '@functions/translation'
import Button from '@uniappbuttons/Button';
import firebase from '@datapoint/Firebase'


var db=firebase.firestore();
export default class OrderAction extends Component {


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
      pr: theProps.data,
      
      username:"",
      time:"",
      order:"",
      status:"",
      image:""
    }
    this.getOrder=this.getOrder.bind(this)
    this.showTicketUse=this.showTicketUse.bind(this)
  }

  showTicketUse() {
    return (
        <View style={css.layout.shareOrderButton}>
             <Button
                disabled={true}
                onPress={() => {
                    if(this.state.status != "Used ticket")
                    {
                        var orderRef = db.collection('orders').doc(this.state.pr);
                        orderRef.update({ status: "Used ticket" });
                        alert("Now the ticket is used!")
                        this.setState({
                          status:"Used ticket"
                        })
                    }
                    else{
                        alert("Ticket is already used")
                    }
                   }}
                text={this.state.status == "Used ticket"?"Ticket is used":"Use the ticket"}
              />
            </View>
         
        )
      }
   componentDidMount(){
    this.getOrder()
   }

  getOrder(){
   _this=this
    var orderRef = db.collection('orders').doc(this.state.pr);
    var getDoc = orderRef.get()
        .then(doc => {
          if (!doc.exists) {
            alert('No such document!');
          } else {
           
            var objToAdd=JSON.parse(doc._document.data.toString());
            objToAdd.id=doc.id;
            
            

            _this.setState({
                order: objToAdd.order[0].name,
                username:objToAdd.delivery.email,
                time:objToAdd.time,
                status:objToAdd.status,
                image:objToAdd.order[0].image
            })
          }
        })
        .catch(err => {
          alert('Error getting document', err);
        });
    
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
              {this.state.order}
            </Text>
            <View style={css.layout.orderContent}>
              <Text style={css.layout.orderUser}>
                {T.user}{"\n"}
                {this.state.username}
              </Text>
              <Image
                style={css.layout.qrImage}
                source={{ uri: this.state.image }}
              />

              
            </View>
            </View>
            <View>
            {this.showTicketUse()}
            </View>
        </ScrollView>
        
      </View>
    );
  }
}