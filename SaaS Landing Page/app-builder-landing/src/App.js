/* eslint-disable */
import React, { Component } from 'react'
import * as firebase from 'firebase'
import Navigation from './components/Navigation'
import HeaderMain from './components/HeaderMain'
import Footer from './components/Footer'
import Payment from './components/Payment'
import Features from './components/Features'
import Config from './config/app'
import ReactGA from 'react-ga'

class App extends Component {

  constructor(props){
    super(props);

    if (!firebase.apps.length) {
      firebase.initializeApp(Config.firebaseConfig);
    }
    
    this.state = {
      info: {},
      types: null,
      plans: {}
    }

    this.getInfo = this.getInfo.bind(this);  
  }

  componentDidMount(){
    this.getInfo(); 
  }

  checkGAUniquedID(id){
    if(id){
      var idValidation = /(UA|YT|MO)-\d+-\d+/i.test(id);
      if(idValidation){
        //ReactGA.initialize('UA-102630608-4'); // Here we should use our GA id
        ReactGA.initialize(id);
        ReactGA.pageview("/");
    
        console.log("Google Analytics Unique ID initialized!");
      }else console.log("Google Analytics Unique ID initialized is wrong!");
    }else{
      console.log("You don't have setup your Google Analytics Unique ID!");
    }
  }

  getInfo(){
    var _this = this;
    firebase.database().ref('/rab_saas_site').on('value', function (snapshot) {
        _this.setState({
          info: snapshot.val(),
          plans: snapshot.val().pricing.plans,
        },()=>{
          if(snapshot.val().GAUniqueID){
            _this.checkGAUniquedID(snapshot.val().GAUniqueID)
          }
        }) 
    });   
  }
  render() {
    return (
      <div>
        <Navigation
          info={this.state.info}
          />
        <div className="wrapper">
          <HeaderMain
            info={this.state.info}
            />
          <Features
            features={this.state.info.features||[]}
            />
          <Payment
            info={this.state.info}
            plans={this.state.plans||[]}
            pricing={this.state.info.pricing||[]}
            />
        </div>
        <Footer
          info={this.state.info}
          />
      </div>
    );
  }
}

export default App;
