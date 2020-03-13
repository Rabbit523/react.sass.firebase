/*eslint eqeqeq: "off"*/
/*eslint no-useless-escape: "off"*/
/*eslint array-callback-return: "off"*/
/*eslint-disable-next-line: "off"*/
/* eslint-disable */

import React, {Component} from 'react'
import {browserHistory} from 'react-router'
import firebase from '../../config/database'
import Wizzard from "./../../ui/template/Wizzard";
import Tile from "./../../ui/template/Tile"
import Card from './../../ui/template/Card'
import Config from "./../../config/app"
import { Link } from 'react-router'
import T from './../../translations/translate'
import initialAppSettings from '../../config/builder/appsettings.json'
var md5 = require('md5');

const ConditionalDisplay = ({condition, children}) => condition ? children : <div></div>;

class Create extends Component {
  constructor(props){
    super(props);
    this.state = {
        apps:{},
        name:"",
        id:"",
        type:"shop",
        layout:"tabs",
        color:"#000000",
        appsMade: 0,
        appsAllowed: Config.isSaaS?0:9999,
        appsCounted:Config.isSaaS?false:true,
        subscriptionFetched:Config.isSaaS?false:true,
        plans: {},
        vendorID: ""
    }
    this.printApps=this.printApps.bind(this);
    this.cloneApp=this.cloneApp.bind(this);
    this.createStep2Content=this.createStep2Content.bind(this);
    this.checkAppCreate=this.checkAppCreate.bind(this);
    this.checkCreateUserPermission = this.checkCreateUserPermission.bind(this);
    this.getPlans = this.getPlans.bind(this);
    this.getAutoIncrementedNumOfApps = this.getAutoIncrementedNumOfApps.bind(this);
    this.licenseCodeValidation = this.licenseCodeValidation.bind(this);
  }


  componentDidMount(){

    //Templates
    var apps = firebase.app.database().ref('/apps');
    var _this=this;
    apps.on('value', function(snapshot) {
        _this.setState({
            apps:snapshot.val(),
        })  
    });

    //Apps made
    var pathToApps=Config.notSaaSAppsPath;
    if(Config.isSaaS){
        pathToApps=Config.saasAppsPath+firebase.app.auth().currentUser.uid;
    }
    var appsMade = firebase.app.database().ref(pathToApps);
    appsMade.on('value', function(snapshot) {
        _this.setState({
            appsCounted:true,
            appsMade:(Object.keys(snapshot.val()?snapshot.val():{}).length)})
    });

    //this.checkCreateUserPermission();

    //Get plans from firebase, only if SaaS
    if(Config.isSaaS){
        this.getPlans();
    }
    
  }

  //Get plans from firebase 
  getPlans(){
    var _this = this;
    firebase.app.database().ref('/rab_saas_site/pricing').on('value',function(snapshot) {
      _this.setState({
        plans: snapshot.val().plans,
        vendorID: snapshot.val().vendorID
      },() => _this.checkCreateUserPermission())
    });
  }

  checkCreateUserPermission(){
    var _this = this;
    if(Config.isSaaS){
        if (Config.adminConfig.adminUsers.includes(firebase.app.auth().currentUser.email)) {
            this.setState({ appsAllowed: 99999, subscriptionFetched:true });
        } else {        
            firebase.app.database().ref('/stripePayments/' + md5(firebase.app.auth().currentUser.email)).on('value',function(snapshot) {
                var appsAllowed=0;
                _this.state.plans.length>0?_this.state.plans.map((plan) => {
                    if(snapshot.val()&&snapshot.val().subscription_plan_id == plan.id&&snapshot.val().status!="deleted"){
                        appsAllowed=plan.allowedQty;
                    }
                }):""
                _this.setState({
                    appsAllowed: appsAllowed,
                    subscriptionFetched:true
                })
            });
        }
    }else{
        //Not saas, allow this user to create as mush apps as he wants
        _this.setState({
            subscriptionFetched:true,
            appsAllowed: 9999999
        })
    }
 }

 licenseCodeValidation(){
    if(Config.licenseCode.length > 0){
        var parts = Config.licenseCode.split("-");
        if(parts.length === 5){
            if(parts[0].length === 8 && parts[1].length === 4 && parts[2].length === 4 && parts[3].length === 4 && parts[4].length === 12){
                return true;
            }else return false;
        }    
    }else return false;
 }

  endStep(){
      //Check if it already exists
      var slug=this.state.name.replace(/ /g,'').toLowerCase(); 
      var pathToApps=Config.notSaaSAppsPath;
      if(Config.isSaaS){
          pathToApps=Config.saasAppsPath+firebase.app.auth().currentUser.uid;
      }

      var apps = firebase.app.database().ref(pathToApps+"/"+slug);
        var _this=this;
        apps.once('value', function(snapshot) {
            if(JSON.stringify(snapshot.val()).length>10){
                window.getDemo().showNotification('bottom','right','danger',"The name <b>"+_this.state.name+"</b> is aready added. Pls change name.","");
            }else{
                //All ok
                _this.getAutoIncrementedID(_this.state.type,_this.state.name,_this.state.id,_this.state.layout);
                _this.getAutoIncrementedNumOfApps();
            }
            
        });    
  }

  getAutoIncrementedNumOfApps(){
    var num_of_apps_ai = firebase.app.database().ref('/users/'+firebase.app.auth().currentUser.uid+'/numOfApps');
    num_of_apps_ai.transaction(function(ai) {
        if (ai) {
            ai++;
        }else{
            ai=1;
        }
        return ai;
      },function(e,done,ai){
        firebase.app.database().ref('/users/'+firebase.app.auth().currentUser.uid).update({
          numOfApps: ai.val()
        });
      });
  }

  printApps(){
    var _this=this;
    return Object.keys(this.state.apps).map(function(key) {
        return (_this.renderAppTemplate(_this.state.apps[key],key));
    })
  }


  getAutoIncrementedID(from,to,id,layout) {
    var _this=this;
    var rab_pointers_ai=firebase.app.database().ref('/rab_pointers/ai/nextValue');
    rab_pointers_ai.transaction(function(ai) {
      if (ai) {
          ai++;
      }else{
          ai=1;
      }
      return ai;
    },function(e,done,ai){
        //alert(ai.val());
        _this.cloneApp(from,to,id,layout,ai.val());
    });
  }

  cloneApp(from,to,id,layout,rabid){
    var app = firebase.app.database().ref('/apps/'+from);
    var _this=this;
    app.once('value', function(snapshot) {
        var appToBeSaved=snapshot.val();

        var slug=to.replace(/ /g,'').toLowerCase(); 

        //Convert to json 
        var jsRepr=JSON.stringify(appToBeSaved);
        //console.log(jsRepr);
        var find = 'data_point\":\"';
        var re = new RegExp(find, 'g');
        jsRepr = jsRepr.replace(re, 'data_point\":\"'+slug+'_');
        appToBeSaved=JSON.parse(jsRepr);
       // console.log(jsRepr);

        appToBeSaved.name=to;
        appToBeSaved.slug=slug;
        appToBeSaved.id=id;
        appToBeSaved.rabid=rabid;
        appToBeSaved.design.general.layout=layout;

        //Now add settings, since v 11. 
        appToBeSaved.settings=initialAppSettings;
       
        var pathToApps=Config.notSaaSAppsPath;
        if(Config.isSaaS){
            pathToApps=Config.saasAppsPath+firebase.app.auth().currentUser.uid;
        }



        firebase.app.database().ref(pathToApps+"/"+ slug).set(appToBeSaved);
        firebase.app.database().ref("/rab_pointers/data/"+rabid).set(pathToApps+"/"+ slug);

        browserHistory.goBack();
    });
  }


  renderAppTemplate(appData,key){
    return (
        <Tile 
            image={appData.appImage}
            onClick={()=>{
                //Move to next tab and set selected
                this.setState({
                    type:key,
                    stepsActivity:["","active",""]})}}
            isIcon={false}
            subTitle={""}
            title={appData.name}
            buttonTitle={T.td("Use this template")}
        />
    )
  }


  checkAppCreate(){
      if(this.state.name<3){
          alert(T.ts("App name missing"))
      }else if(this.state.id<3){
        alert(T.ts("App package id missing"));
      }else{
          this.endStep();
      }
  }

  createStep3Content(){
      return (<div className="row">
      <br />
      <div className="col-sm-2">
          
      </div>
      <div className="col-sm-8">
          <div className="input-group">
              <span className="input-group-addon">
                  <i className="material-icons">border_color</i>
              </span>
              <div className={Config.designSettings.editElementDivClass}>
                  <label className="control-label">{T.td("App name")}
                      <small> ( {T.td("required")} )</small>
                  </label>
                  <input name="name" onChange={(event)=>{this.setState({name:event.target.value})}} type="text" className="form-control" />
              </div>
          </div>
          <div className="input-group">
              <span className="input-group-addon">
                  <i className="material-icons">linear_scale</i>
              </span>
              <div className={Config.designSettings.editElementDivClass}>
                  <label className="control-label">{T.td("Package id")}
                      <small> ( {T.td("required")} ex. com.mycompany.app )</small>
                  </label>
                  <input name="packageid" type="text"  onChange={(event)=>{this.setState({id:event.target.value})}} className="form-control" />
              </div>
          </div>
          <button onClick={this.checkAppCreate} className={Config.designSettings.submitButtonClass}>{T.td("Create app")}</button>

      </div>
      
  </div>)
  }

  createStep1Content(){
    return(<div className="row">{this.printApps()}</div>)
  }

  createStep2Content(){
    return(<div className="row">
       
            <Tile 
                icon={"tab"}
                onClick={()=>{this.setState({
                    layout:"tabs",
                    stepsActivity:["","","active"]})}}
                isIcon={true}
                subTitle={""}
                title={T.td("Tabs")}
                buttonTitle={T.td("Use this layout")}
            />
            <Tile 
                icon={"subject"}
                onClick={()=>{this.setState({
                    layout:"side",
                    stepsActivity:["","","active"]})}}
                isIcon={true}
                subTitle={""}
                title={T.td("Side")}
                buttonTitle={T.td("Use this layout")}
            />
    </div>)
  }

  render(){
    if(this.state.subscriptionFetched&&this.state.appsCounted){
        if(this.state.appsMade>=this.state.appsAllowed||!this.licenseCodeValidation()){
            return (
                <div className="main-panel" style={{ width: '100%'}}>
                    <div className="row">
                        <div className="col-md-8 col-md-offset-2">
                            <Card
                                name={"Billing Option"}
                                title={!this.licenseCodeValidation()?"Item Purchase Code":"Subscription Options"}
                                showAction={false}
                            >
                            <ConditionalDisplay condition={this.state.appsAllowed === 0}>
                                <div className="row">
                                    <div className="col-md-12">
                                        <h3> {T.ts("You don't have any Subscription Plan")}.</h3>
                                        <h3> {T.ts("Please Purchase now")}.</h3>
                                    </div>
                                    <div className="col-md-11 col-md-offset-1">
                                        <Link type="submit" className={"pull-right btn "+Config.designSettings.submitButtonClass} to="/billing">{T.td("Purchase now")}</Link>
                                    </div>
                                </div>
                            </ConditionalDisplay>
                            <ConditionalDisplay condition={this.state.appsMade === this.state.appsAllowed&&this.state.appsAllowed!=0}>
                                <div className="row">
                                    <div className="col-md-12">
                                        <h3> {T.ts("You have reach the limit for maximum apps")}.</h3>
                                        <h3> {T.ts("Please update your Subscription Plan")}.</h3>
                                    </div>
                                    <div className="col-md-11 col-md-offset-1">
                                        <Link type="submit" className={"pull-right btn "+Config.designSettings.submitButtonClass} to="/billing">{T.td("Purchase now")}</Link>
                                    </div>
                                </div>
                            </ConditionalDisplay>
                            <ConditionalDisplay condition={!this.licenseCodeValidation()}>
                                <div className="row">
                                    <div className="col-md-12">
                                        <h3> {T.ts("You don't have Item Purchase Code or your Item Purchase Code is not valid")}.</h3>
                                        <h3> {T.ts("Please update your Item Purchase Code")}.</h3>
                                    </div>
                                </div>
                            </ConditionalDisplay>
                            </Card>
                        </div>
                    </div>
                </div>)
        }else{
            return (
                <div className="main-panel" style={{ width: '100%'}}>
                    <div className="container-fluid">
                        <div className="col-sm-2"></div>

                        <input type="hidden" id="appType"  ref={(input) => this.appType = input}   />
                        <input type="hidden" id="appLayout"  ref={(input) => this.appLayout = input} />
                    
                        <Wizzard 
                            title={T.ts("Let's make an app")}
                            stateRelate={this.state.apps}
                            stepsActivity={this.state.stepsActivity}
                            steps={[
                            {
                                name:"template",
                                icon:"flip_to_front",
                                title:T.td("Template"),
                                label1:T.ts("Select the app type"),
                                label2:T.ts("What kind of app you will make?"),
                                content:this.createStep1Content()
                            },{
                                name:"layout",
                                icon:"drag_indicator",
                                title:T.td("Layout"),
                                label1:T.ts("Select the app layout"),
                                label2:T.ts("What kind of app you will make?"),
                                content:this.createStep2Content()
                            },
                            {
                                name:"overview",
                                icon:"check_circle_outline",
                                title:T.td("Overview"),
                                label1:T.ts("Confirm selected and entered data"),
                                label2:T.ts("All informations are required"),
                                content:this.createStep3Content()
                            }]}
                            />

                            <br />
                            <div className="centar text-center">
                                <a className="button" href="/">{T.td("Cancel creating app")}</a>
                            </div>
                    </div>
                </div>
            )
        }
    }else{
        return (<div>{T.td("Loading")} ...</div>)
        }
    }
}
export default Create;