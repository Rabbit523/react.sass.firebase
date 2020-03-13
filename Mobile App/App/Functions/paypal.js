import Config from '../../config'
import base64 from 'base-64'
import apisauce from 'apisauce';

const PAYPAL_URL = Config.paypal.sandBoxMode ? 'https://api.sandbox.paypal.com/v1' : 'https://api.paypal.com/v1'

const defaultHeader= {
    'Accept': 'application/json',
    'Accept-Language': 'en_US',
    'content-type': 'application/x-www-form-urlencoded',
    'Authorization': 'Basic ' + base64.encode(Config.paypal.clientID + ':' + Config.paypal.secretKey),
};


// our "constructor"
const create = (baseURL = PAYPAL_URL) => {
  // ------
  // STEP 1 - apisauce object
  // ------
  //
  // Create and configure an apisauce-based api object.
  //
  const api = apisauce.create({
    // base URL is read from the "constructor"
    baseURL,
    // here are some default headers
    headers: {
      'Cache-Control': 'no-cache'
    },
    // 10 second timeout...
    timeout: 10000
  })




  // Force OpenWeather API Key on all requests
  /*api.addRequestTransform((request) => {
    request.params['APPID'] = '0e44183e8d1018fc92eb3307d885379c'
  })*/

  // Wrap api's addMonitor to allow the calling code to attach
  // additional monitors in the future.  But only in __DEV__ and only
  // if we've attached Reactotron to console (it isn't during unit tests).
  if (__DEV__ && console.tron) {
    api.addMonitor(console.tron.apisauce)
  }

  const logger=(result)=>{

  }

  // ------
  // STEP 2 - FUNCTIONS
  // ------

  //ACCESS TOKEN FUNCTION
  const getAccessToken = (callback) => {
    api.post('/oauth2/token', "grant_type=client_credentials", {headers: defaultHeader}).then((result) => {
      if(result.ok){
        callback(result.data.access_token);
      }else{
        logger(result);
      }

    })
  }

  //GETTING PAYPAL URLS FUNCTOIN
  const getPaymentURLs = (access_token, body, callback) => {
    theHeader={
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + access_token
    };



    api.post('/payments/payment', body, {headers: theHeader}).then((result) => {
      
      if(result.ok){
        logger(result);
        callback(result.data.links[2].href,result.data.links[1].href);
      }else{
        logger(result);
      }

    })
  }

  //Execute the payment
  const executePayment = (payerId,execute,access_token,callback) => {
    theHeader={
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + access_token
    };

    //var executePath=execute.replace(PAYPAL_URL,"");


    api.post(execute, JSON.stringify({payer_id: payerId}), {headers: theHeader}).then((result) => {
      if(result.ok){
        logger(result);
        callback(result);
      }else{
        logger(result);
      }

    })
  }

  // ------
  // STEP 3 - RETURN FUNCTIONS
  // ------
  return {
    // a list of the API functions from step 2
    getAccessToken:getAccessToken,
    getPaymentURLs:getPaymentURLs,
    executePayment:executePayment,
  }
}

// let's return back our create method as the default.
export default {
  create
}
