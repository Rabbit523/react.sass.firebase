/*
  Created by Dimov Daniel
  Mobidonia
  daniel@mobidonia.com
*/
import React, {Component} from 'react'
import WebView from 'react-native'
import CartFunction from '@functions/cart'

export default class ShopifyPayment extends Component {

  //The constructor
  constructor(props) {
      super(props)
      this.state = {url: this.props.shopifyLink}
      this.fetchCardData=this.fetchCardData.bind(this);
      this.refresh=this.refresh.bind(this);
  }
  

  componentDidMount(){
      this.fetchCardData();
  }

  fetchCardData() {
    var _this=this;
    CartFunction.getShopifyUrlParameters(function(additions){
        var fullUrl=(_this.props.shopifyLink+"/cart/").replace("//cart","/cart")+additions




        _this.setState({
            url:fullUrl
        })
    })
  }

  refresh(){
    this.fetchCardData();
  }

  _onNavigationStateChange(webViewState) {
    if(!this.processed){
      const url = webViewState.url

      if (url.indexOf("/thank_you")>-1) {
        this.processed = true;
        this.props.setPaymentStatus("approved")
      }
    }
}

  render () {

    return (
      <WebView style={{flex:1}}
        source={{uri: this.state.url}}
        onNavigationStateChange={this._onNavigationStateChange.bind(this)}
        javaScriptEnabled={true}
        startInLoadingState={true}
        domStorageEnabled={true}
        >
      </WebView>
    )
  }


  


}
