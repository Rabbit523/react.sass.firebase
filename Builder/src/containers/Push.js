/*eslint eqeqeq: "off"*/
/*eslint no-unused-vars: "off"*/

import React, {Component,PropTypes} from 'react'
import Config from   '../config/app';
var request = require('superagent');
import NavBar from './../ui/template/NavBar'
import firebase from '../config/database'
import CardUI from './../ui/template/Card'
import T from './../translations/translate'

import * as firebaseREF from 'firebase';
require("firebase/firestore");

class App extends Component {

	constructor(props) {
        super(props);
   

        this.state = {
            value: '',
            status:'',
            title:'',
            longMessage:'',
            using:Config.pushSettings.pushType=="firebase"?"Firebse":(Config.pushSettings.pushType=="expo"?"Expo":"OneSignal")};

	    this.handleChange = this.handleChange.bind(this);
        this.handleChangeTitle = this.handleChangeTitle.bind(this);
        this.handleChangeLongMessage=this.handleChangeLongMessage.bind(this);
	    this.handleSubmitFirebase = this.handleSubmitFirebase.bind(this);
        this.handleSubmitOneSignal = this.handleSubmitOneSignal.bind(this);
        this.handleSubmitExpo = this.handleSubmitExpo.bind(this);
	    this.sendCallback = this.sendCallback.bind(this);
        this.displayTitle=this.displayTitle.bind(this);
        this.displayLongMessage=this.displayLongMessage.bind(this);
	 }

	handleChange(event) {
		this.setState({value: event.target.value});
	}

    handleChangeTitle(event) {
        this.setState({title: event.target.value});
    }

    handleChangeLongMessage(event){
        this.setState({longMessage:event.target.value})
    }

	sendCallback(e,r){

        //After send, save notification in firestore
        if(Config.pushSettings.saveNotificationInFireStore){
             //Get reference to firestore
            var db = firebase.app.firestore();

            // Add a new document in collection "cities"
            db.collection("notifications").doc((new Date().getTime()+"")).set({
                title: this.state.title,
                message: this.state.value,
                longMessage:Config.pushSettings.pushType=="expo"? this.state.longMessage: this.state.value
            });



        }
		console.log(r);
    	console.log(e);
		this.setState({
            title:"",
            value:"",
            longMessage:"",
			status:": SEND"
		})
	}

	handleSubmitFirebase(event) {
		//alert('A push was submitted: ' + this.state.value);
		event.preventDefault();

		var url='https://fcm.googleapis.com/fcm/send';
		var json = '{"to":"'+Config.pushSettings.pushTopic+'","notification": {"body":"'+this.state.value+'",},"priority":10,}';
		request.post(url)
    		.set('Content-Type', 'application/json')
    		.set('Authorization', 'key='+Config.pushSettings.Firebase_AuthorizationPushKey)
    		.send(json)
    		.end(this.sendCallback)
    }
    
   


    handleSubmitExpo(event){
        event.preventDefault();

        var title=this.state.title;
        var body=this.state.value;
        var longMessage=this.state.longMessage;
        
        var _this=this;

        var pathToTokens=Config.pushSettings.firebasePathToTokens;

        //Step 1 - get the tokens
        if(Config.appEditPath!= undefined){
            pathToTokens+=Config.appEditPath;
          }

          
        firebase.app.database().ref(pathToTokens).once('value').then(function(snapshot) {
            var tokens=snapshot.val();
            var notifications=[];

            
           
            Object.keys(tokens).forEach(function(key) {
                notifications.push({
                    to:tokens[key].token,
                    body: title,
                    title: body,
                    
                })
              });
             if(notifications.length>0){
                var url='https://cors-anywhere.herokuapp.com/https://exp.host/--/api/v2/push/send';
                var json = JSON.stringify(notifications);
                request.post(url)
                    //.set('Accept-Encoding', 'gzip, deflate')
                    .set('Accept', 'application/json')
                    .set('Content-Type', 'application/json')
                    //.set('User-Agent', 'expo-server-sdk-node/2.3.3')
                    .send(json)
                    .end(_this.sendCallback)
             }else{
                 alert("There are no subscribed tokens");
             }

          });
    }

    handleSubmitOneSignal(event) {
        //alert('A push was submitted: ' + this.state.value);
        event.preventDefault();

        var url='https://onesignal.com/api/v1/notifications';
        var json = {
          "app_id":Config.pushSettings.oneSignal_APP_KEY,
          "included_segments":Config.pushSettings.included_segments,
          "headings":{"en": this.state.title},
          "contents":{"en": this.state.value}
        }

        request.post(url)
            .set('Content-Type', 'application/json')
            .set('Authorization', 'Basic '+Config.pushSettings.oneSignal_REST_API_KEY)
            .send(json)
            .end(this.sendCallback)
    }

    displayTitle(){
        if(Config.pushSettings.pushType!="firebase"){
                            return (<div className="form-group label-floating is-empty">
                                <label className="control-label">{T.ts("Message title")}</label>
                                <input type="text" className="form-control" value={this.state.title} onChange={this.handleChangeTitle} />
                            <span className="material-input"></span></div>)}else{ return (<div></div>)}
    }

    displayLongMessage(){
        if(Config.pushSettings.pushType=="expo"){
                            return (<div className="form-group label-floating is-empty">
                                <label className="control-label">{T.ts("Message body")}</label>
                                <input type="text" className="form-control" value={this.state.longMessage} onChange={this.handleChangeLongMessage} />
                            <span className="material-input"></span></div>)}else{ return (<div></div>)}
    }





  render() {
    return (
			<div className="content">
			<NavBar  currentLangData={this.props.route.currentLangData} />
            <div className="row">
                <CardUI class="col-md-6"  name={this.state.using} title={T.ts("Send push notification with")+" " +this.state.using}  showAction={false}>
                    <br />
                    <form onSubmit={Config.pushSettings.pushType=="firebase"?this.handleSubmitFirebase:(Config.pushSettings.pushType=="expo"?this.handleSubmitExpo:this.handleSubmitOneSignal)}>
                        {this.displayTitle()}
                        <div className="form-group label-floating is-empty">
                            <label className="control-label">{T.ts("Message text")}</label>
                            <input type="text" className="form-control" value={this.state.value} onChange={this.handleChange} />
                        <span className="material-input"></span></div>
                        {this.displayLongMessage()}
                        <button type="submit" className={Config.designSettings.submitButtonClass}>{T.td("Submit")}</button>
                    </form>
                </CardUI>

                <CardUI class="col-md-6"  name={this.state.using+"preview"} title={T.td("Preview")}  showAction={false}>
                    <br /><br />
                    <div className="iphone">
                    	<img className="iphoneImg" src="iphone.png" alt="" />
      					<span className="pushText">{this.state.title}  {Config.pushSettings.pushType=="firebase"?"":<br />} {this.state.value}</span>
                    </div>
                </CardUI>
      </div>
			</div>
    )
  }
}
export default App;
