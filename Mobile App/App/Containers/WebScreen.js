/*
  Created by Dimov Daniel
  Mobidonia
  daniel@mobidonia.com
*/
import React, {Component} from "react";
import {WebView,View} from "react-native";
import Navbar from '@components/Navbar'
import Config from '../../config'
import {
  AdMobBanner,
  PublisherBanner,
  AdMobRewarded
} from 'expo-ads-admob';



export default class WebScreen extends Component {


  //The constructor
  constructor(props) {

    //Our props can be ditectly in the props.data or props.navigation.state.params
    //First time, data goes in properties,
    //Later it is passed in navigation state
    //Let's find out where they are
    var isDataInProps=props.navigation.state.params==null;

    super(props);
    var theProps=isDataInProps?props:props.navigation.state.params;
    
   
    this.state = {
      pr:theProps,
    }
  }
 
  /**
   * showBanner - if  showBannerAds is true
   */
  showBanner()
  {
    if(Config.showBannerAds == true)
    {
      return (
        <AdMobBanner
          bannerSize="fullBanner"
          adUnitID={Config.bannerID}
          didFailToReceiveAdWithError={this.bannerError}
        />
      )
    }
  }

  

  render() {
    
      var bootstrapedHTML='<html>'+
       '<head>'+
            '<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">'+
            '<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>'+
            '<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>'+
        '</head>'+
        '<body><div class="container"><div class="row">'
            +(this.state.pr&&this.state.pr.fromNotification?this.state.pr.data:this.state.pr.data.html)+
            
        '</div></div></body>'+
      '</html>';
    return (
      <View style={{flex:1,flexDirection:'column'}}> 
          <View>
          <Navbar navigation={this.props.navigation} detailsView={true} isRoot={false} />
          </View>
          
          <View style={{flex:1}}>
            <WebView
                scalesPageToFit={false}
                javaScriptEnabled={true}
                source={this.state.pr.data.webSource != null?(this.state.pr.data.webSource == 'html'?{html:bootstrapedHTML}:{uri:this.state.pr.data.url}):{html:bootstrapedHTML}}
            />
          </View>
      </View>



     
    );
  }
}
