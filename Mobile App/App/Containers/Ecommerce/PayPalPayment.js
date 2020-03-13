/*
  Created by Dimov Daniel
  Mobidonia
  daniel@mobidonia.com
*/
import React, {PropTypes,Component} from 'react'
import { View, Text,WebView } from 'react-native'
import PayPalAPI from '../../Functions/paypal'
import Config from '../../../config'
import CartFunction from '@functions/cart';


export default class PayPalPayment extends Component {

  //The constructor
  constructor(props) {
      super(props)
      this.paypalapi=PayPalAPI.create();
      this.access_token = "";
      this.state = {url: 'https://www.paypal.com'}
      this.shouldCheckURL = true // use to make sure accept or cancel only execute once.
      this.refresh=this.refresh.bind(this);
      this.prepareToken=this.prepareToken.bind(this);
  }

  

  prepareToken(){
     var _this=this;

      const setPaymentDetails = (json, access_token) => {
          this.executeURL = json.links[2].href // execute => store accept payment request
          this.access_token = access_token
          console.log(json.links[1].href+"<-->----");
          this.setState({
              url: json.links[1].href, //approval_url => user accept payment request
          })
      }

      //STEP 1 -- Start by getting the Access token
      this.paypalapi.getAccessToken((token)=>{
        //Save the token locally and start getting the payment URLS
        this.access_token = token;

        //Get order data
        CartFunction.getPayPalItem(function(order){
          //Compose the payment info
          var payment_element = {
              intent: 'sale',
              redirect_urls: {
                  return_url: Config.paypal.return_url,
                  cancel_url: Config.paypal.cancel_url,
              },
              payer: {
                  payment_method: 'paypal'
              },
              transactions: order,
          }

         
          

          //STEP 2 - GET the payment url
            _this.paypalapi.getPaymentURLs(token,JSON.stringify(payment_element),(execute,approval_url)=>{
              console.log(approval_url+"<== approval")
              _this.execute = execute;
              _this.setState({
                  url: approval_url
              })
            })

        })

      })
  }

  componentDidMount() {
    this.prepareToken();
  }


  refresh(){
    this.setState({access_token:"",url:"https://www.paypal.com"})
    this.prepareToken();
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



   getParameterByName(name, url) {
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}


  _onNavigationStateChange(webViewState) {
      if(!this.processed){
        const url = webViewState.url
      
        if (url.indexOf(Config.paypal.return_url)>-1) {
            this.processed = true
            var payerId=this.getParameterByName("PayerID",url);
           

            //STEP 3 - Aprouve the payment
            this.paypalapi.executePayment(payerId,this.execute,this.access_token,(response)=>{
              if (response.data.state == 'approved') {
                  this.props.setPaymentStatus(response.data.state)
                  this.props.closePopUp()
              } else {
                  

              }
            })

        } else if (url.indexOf(Config.paypal.cancel_url)>-1) {
            this.processed = false
            this.props.setPaymentStatus("canceled")
            this.props.closePopUp()
        }
      }
  }


}


const mapStateToProps = (state) => {
  return {
    cart: state.cart,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}