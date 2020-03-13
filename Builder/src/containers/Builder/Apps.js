/*eslint eqeqeq: "off"*/
/*eslint no-unused-vars: "off"*/
/*eslint no-useless-escape: "off"*/
/*eslint no-redeclare: "off"*/
/*eslint array-callback-return: "off"*/
/* eslint-disable */
import React, {Component} from 'react'
import firebase from '../../config/database'
import componentsData from '../../config/builder/components.json'
import AppsData from '../../config/builder/apps.json'
import Tile from './../../ui/template/Tile'
import Config from   './../../config/app'
import { Link } from 'react-router'
import SkyLight from 'react-skylight'
import NavBarDefault from './../../ui/template/NavBarDefault'
import { config } from '../../config/firebase_config';
import T from './../../translations/translate'
var md5 = require('md5');

const ConditionalDisplay = ({condition, children}) => condition ? children : <div></div>;

class Apps extends Component {
  constructor(props){
    super(props);
    this.state = {
        apps:{},
        allapps:{},
        filter:"",
        user:{},
        appsMade: 0,
        appsAllowed: Config.isSaaS?0:99999,
        plans: {},
        vendorID: ""
    }
    this.printApps = this.printApps.bind(this);
    this.searchChange = this.searchChange.bind(this);
    this.checkSubscriptionStatus = this.checkSubscriptionStatus.bind(this);
    this.manageButtonCreateApp = this.manageButtonCreateApp.bind(this);
    this.getPlans = this.getPlans.bind(this);
    this.licenseCodeValidation = this.licenseCodeValidation.bind(this);
  }


  componentDidMount(){
    var pathToApps=Config.notSaaSAppsPath;
    if(Config.isSaaS){
        pathToApps=Config.saasAppsPath+firebase.app.auth().currentUser.uid;
    }
    var apps = firebase.app.database().ref(pathToApps);
    var _this=this;
    apps.on('value', function(snapshot) {
        _this.setState({
            apps:snapshot.val(),
            allapps:snapshot.val(),
            appsMade:(Object.keys(snapshot.val()?snapshot.val():{}).length)})
    });
    
    //Check if components exists
    var components=firebase.app.database().ref('/components');
    var _this=this;
    components.once('value', function(snapshot) {
     
        if(snapshot.val()==null){
            window.getDemo().showNotification('bottom','right','danger',"Components are not installed. Will try to install now");
            _this.installComponents();
        }else{
            if(JSON.stringify(snapshot.val())!=JSON.stringify(componentsData)){
                window.getDemo().showNotification('bottom','right','warning',"There is an update for components. Will try to install now");
                _this.installComponents();
            }
        }
    });

     //Check if apps exists
     var templates=firebase.app.database().ref('/apps');
     var _this=this;
     templates.once('value', function(snapshot) {
         if(snapshot.val()==null){
             window.getDemo().showNotification('bottom','right','danger',"Templates are not installed. Will try to install now");
             _this.installTemplates();
         }else{

            var normalizeDatabaseState=(JSON.stringify(snapshot.val())).replace(/[^a-z\d ]+/i, '');
            var normalizeLocalState=(JSON.stringify(AppsData)).replace(/[^a-z\d ]+/i, '');
            if(normalizeDatabaseState!=normalizeLocalState){
                window.getDemo().showNotification('bottom','right','warning',"There is an update for templates. Will try to install now");
                _this.installTemplates();
            }
        }
     });

     this.authListener();
     
     //Get plans from firebase, only if it is SaaS
     if (!Config.adminConfig.adminUsers.includes(firebase.app.auth().currentUser.email)) {
        if(Config.isSaaS){
            this.getPlans();
        }
     } else {
         this.setState({ appsAllowed: 99999 });
     }

     //Purchase Licence Code Validation
     if(!this.licenseCodeValidation()){
        this.dialogLicenceCode.show();
     }
    }

    authListener(){
        const setUser=(user)=>{
        this.setState({user:user})
        }

        //Now do the listner
        firebase.app.auth().onAuthStateChanged(function(user) {
        if (user) {
            setUser(user);
            // User is signed in.
        } else {
            // No user is signed in.
            console.log("User has logged out Master");
        }
        });
    }

    //Get plans from firebase 
    getPlans(){
        var _this = this;
        firebase.app.database().ref('/rab_saas_site/pricing').on('value',function(snapshot) {
        _this.setState({
            plans: snapshot.val().plans,
            vendorID: snapshot.val().vendorID
            },() => _this.checkSubscriptionStatus())
        });
    }

    checkSubscriptionStatus(){
        var _this = this;
        if(Config.isSaaS){
            firebase.app.database().ref('/stripePayments/' + md5(firebase.app.auth().currentUser.email)).on('value',function(snapshot) {
                var appsAllowed=0;
                _this.state.plans.length>0?_this.state.plans.map((plan) => {
                    if(snapshot.val() && snapshot.val().subscription_plan_id == plan.id && snapshot.val().status!="deleted"){
                        appsAllowed=plan.allowedQty;
                    }
                }):""
                _this.setState({
                    appsAllowed: appsAllowed
                })
            });
        }else{
            //Not saas, allow this user to create as mush apps as he wants
            _this.setState({
                appsAllowed: 9999999
            })
        }
    }

    manageButtonCreateApp(){
        if(this.state.appsAllowed === 0){
            this.dialog.show();
        }else if(this.state.appsMade === this.state.appsAllowed){
            this.dialog.show();
        }else if(!this.licenseCodeValidation()){
            this.dialogLicenceCode.show();
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
       
    installTemplates(){
        var templates=firebase.app.database().ref('/apps');
        templates.set(AppsData);
        templates.on('value', function(snapshot) {
            if(snapshot.val()==null){
            }else{
                setTimeout(function(){ 
                    window.getDemo().showNotification('bottom','right','success',"Templates sucesfully installed / updated.");
                }, 2000);
            }
        });
    }

  installComponents(){
    var components=firebase.app.database().ref('/components');
    components.set(componentsData);
    components.on('value', function(snapshot) {
        if(snapshot.val()==null){
        }else{
            setTimeout(function(){ 
                window.getDemo().showNotification('bottom','right','success',"Components sucesfully installed / updated.");
             }, 2000);
            
        }
        
    });
  }

  printApps(){
    var _this=this;
    return Object.keys(this.state.apps||{}).map(function(key) {
        console.log(key)
        return (_this.renderApp(_this.state.apps[key],key));
    })
  }

  searchChange(event){
    this.setState({
        filter:event.target.value
    })

    if(event.target.value.length>0){

        var _this=this;
        var keys=Object.keys(this.state.allapps);
        var newListOfApps={};
        for (let index = 0; index < keys.length; index++) {
            const key = keys[index];
            if(this.state.allapps[key].name.toLowerCase().indexOf(event.target.value.toLowerCase())!=-1){
                newListOfApps[key]=this.state.allapps[key];
            }
        }

        this.setState({
            apps:newListOfApps,
        });
    }else{
        this.setState({
            apps:this.state.allapps,
        });
    }
  }

  renderApp(appData,key){
    return (
        <Tile 
            key={key}
            image={appData.appImage}
            link={"/#/sections/"+key}
            isIcon={false}
            subTitle={appData.id}
            title={appData.name}
            buttonTitle={T.td('Manage app')}
        />
    )
  }

  render() {

    var dialogStyle = {
        width: '40%',
        //height: '600px',
        //marginTop: '-300px',
        marginLeft: '-20%',
      };
      
    return (
    <div className="main-panel" style={{ width: '100%'}}>
        <NavBarDefault 
            currentLangData={this.props.route.currentLangData}
            onChange={this.searchChange}
            filter={this.state.filter}
            user={this.state.user}
            search={true}
        /><br/><br/><br/>
        <div className="container-fluid">
            <div className="row">

            <Tile 
              icon={"add_circle_outline"}
              link={this.state.appsMade<this.state.appsAllowed&&this.licenseCodeValidation()?"/#/create":null}
              onClick={!(this.state.appsMade<this.state.appsAllowed)||!this.licenseCodeValidation()?this.manageButtonCreateApp:null}
              isIcon={true}
              subTitle={T.ts('Create app from template')}
              title={T.td('New app')}
              buttonTitle={T.td('Create app')}
             />
           
            {this.printApps()}

            <div className="modal fade" id="exampleModal" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">{T.td("User profile")}</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">Ã—</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        ...
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-dismiss="modal">{T.td("Close")}</button>
                        <button type="button" className="btn btn-primary">{T.td("Save changes")}</button>
                    </div>
                    </div>
                </div>
                </div>
            </div>
            <SkyLight
                hideOnOverlayClicked
                ref={ref => (this.dialog = ref)}
                title={"Subscription Informations"}
                dialogStyles={dialogStyle}
                >
                <ConditionalDisplay condition={this.state.appsAllowed === 0}>
                    <div className="row">
                        <div className="col-md-12">
                            <hr />
                            <p> {T.ts("You don't have any Subscription Plan")}.</p>
                            <p> {T.ts("Please Purchase now")}.</p>
                            <hr />
                        </div>
                    </div>
                </ConditionalDisplay>
                <ConditionalDisplay condition={this.state.appsMade === this.state.appsAllowed&&this.state.appsAllowed!=0}>
                    <div className="row">
                        <div className="col-md-12">
                            <hr />
                            <p> {T.ts("You have reach the limit for maximum apps")}. </p>
                            <p> {T.ts("Please update your Subscription Plan")}.</p>
                            <hr />
                        </div>
                    </div>
                </ConditionalDisplay>
                <div className="col-md-11 col-md-offset-1">
                    <Link type="submit" className={"pull-right btn "+Config.designSettings.submitButtonClass} to="/billing">{T.td("Purchase now")}</Link>
                </div>
            </SkyLight>
            {/*Purchace code validation dialog*/}
            <SkyLight
                hideOnOverlayClicked
                ref={ref => (this.dialogLicenceCode = ref)}
                title={"Item Purchase Code Informations"}
                dialogStyles={dialogStyle}
                >
                <ConditionalDisplay condition={!this.licenseCodeValidation()}>
                    <div className="row">
                        <div className="col-md-12">
                            <hr />
                            <p> {T.ts("You don't have Item Purchase Code or your Item Purchase Code is not valid")}. </p>
                            <p> {T.ts("Please update your Item Purchase Code")}. </p>
                            <hr />
                        </div>
                    </div>
                </ConditionalDisplay>
            </SkyLight>
        </div>
        <footer className="footerfa" style={{'paddingTop': '24%'}}></footer>
    </div>     
        )
    }
}
export default Apps;