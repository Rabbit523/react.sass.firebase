/*eslint no-useless-escape: "off"*/
/* eslint-disable */
import React, {Component} from 'react'
import NavItem from '../components/NavItem'
import Config from   '../config/app';
import firebase from './../config/database'
import MasterUI from './../ui/template/Master'
import T from './../translations/translate'
var md5 = require('md5');

//const CircularJSON = require('circular-json')
 
const ConditionalWrap = ({condition, wrap, children}) => condition ? wrap(children) : children;
  

/**
 * Master View,  Represents the side/main navigation
 */
class Master extends Component {

  constructor(props) {
    super(props);
    this.state = {user:{}};
    this.handleLogout = this.handleLogout.bind(this);
    this.authListener = this.authListener.bind(this);
    this.printMenuItem= this.printMenuItem.bind(this);
  }

  componentDidMount() {
    this.authListener();
  }

  /**
   * Function that start the Firebase listener for authentication change
   */
   authListener(){
      const setUser=(user)=>{
        this.setState({user:user})
      }

      //Now do the listner
      firebase.app.auth().onAuthStateChanged(function(user) {
        if (user) {
          setUser(user);
          // User is signed in.
          console.log("User has Logged  in Master");
          console.log(user.email);
          if(window.setSideBG){
            window.setSideBG(Config.adminConfig.design.sidebarBg);
          }
          
        } else {
          // No user is signed in.
          console.log("User has logged out Master");
        }
      });
  }

  checkIsSuperAdmin(){
    var isSuperAdmin = false;
    if(Config.adminConfig.adminUsers){
        Config.adminConfig.adminUsers.map((user)=>{
            if(firebase.app.auth().currentUser.email === user){
                isSuperAdmin = true;
            }
        })
    }
    return isSuperAdmin;
  }

  /**
   * Logout function
   * @param {Event} e 
   */
  handleLogout(e) {
    e.preventDefault();

    console.log('The link was clicked.');
    firebase.app.auth().signOut();
  }

  /**
   * Validate URL
   * @param {String} str 
   */
  ValidURL(str) {
    var regex = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
    if(!regex.test(str)) {
      return false;
    } else {
      return true;
    }
  }

  /**
   * Print menu items
   * @param {Oject} menu 
   */
  printMenuItem(menu){
    var menuPath=this.ValidURL(menu.path)?menu.path:menu.path.replace(/\//g, Config.adminConfig.urlSeparator);
    if(menu.subMenus&&menu.subMenus.length>0){
      return (
        <li>
          <a data-toggle="collapse" href={"#"+menuPath} className="collapsed" aria-expanded="false">
            <i className="material-icons">{menu.icon}</i>
              <ConditionalWrap
                condition={Config.designSettings.sideMenuTextWrappedInParagraph}
                wrap={children => <p>{children}</p>}
              >
            <span>{T.td(menu.name)}
            <b className="caret"></b></span></ConditionalWrap>
          </a>
          <div className="collapse" id={menuPath} aria-expanded="false">
            <ul className="nav">
              {menu.subMenus.map(this.printMenuItem)}
            </ul>
          </div>
        </li>
      )
    }else{
      return (<NavItem index={menu.isIndex} onlyActiveOnIndex={menu.isIndex} menuPath={menuPath}   to={menu.link+"/"+menuPath}>
          <i className="material-icons">{menu.icon}</i>
          <ConditionalWrap
           condition={Config.designSettings.sideMenuTextWrappedInParagraph}
           wrap={children => <p>{children}</p>}
          >
          <span>{T.td(menu.name)}</span></ConditionalWrap>
        </NavItem>)
    }

  }


  /**
   * Main render function
   */
  render() {
    
    //Prepare the environment
    if(this.props.params&&this.props.params.sub && (this.props.location.pathname.indexOf('sections')===1 || this.props.location.pathname.indexOf('home')===1)){
      console.log(JSON.stringify(this.props.location))
      if(this.props.params.sub!=="null"){
        //Used for the app builder
        var pathToApps=Config.notSaaSAppsPath+"/"+this.props.params.sub;
        if(Config.isSaaS){
            pathToApps=Config.saasAppsPath+firebase.app.auth().currentUser.uid+"/"+this.props.params.sub;
        }

        Config.appEditPath=pathToApps;
      }
    }

    if(this.props.location.pathname.indexOf('chome')===1){
      console.log(JSON.stringify(this.props.location))
      if(this.props.params.sub!=="null"){
        //Used for the app builder
        var pathToApps=Config.notSaaSAppsPath+"/"+this.props.params.sub;
        if(Config.isSaaS){
            pathToApps=Config.saasAppsPath+md5(firebase.app.auth().currentUser.email)+"/"+this.props.params.sub;
        }

        Config.appEditPath=pathToApps;
      }
    }

    //Additional syles that you can send to your template. ex. imageSetup
    var bgStyle = {
      backgroundImage: 'require(../../assets/img/'+Config.adminConfig.design.sidebarBg+')',
    };

    return (
      <MasterUI 
        userPhoto={this.state.user.photoURL?this.state.user.photoURL:'http://www.gravatar.com/avatar/' + md5(this.state.user.email+"")+"?s=512"}
        user={this.state.user}
        logout={this.handleLogout}
        printMenuItem={this.printMenuItem}
        additionalStyle1={bgStyle}
        children={this.props.children}
        ValidURL={this.ValidURL}

        checkIsSuperAdmin={this.checkIsSuperAdmin}

        //languages
        countries={this.props.route.currentLangData.availableLaguages}
        defaultCountry={this.props.route.currentLangData.currentLang}
      />
    )
  }
}


export default Master;
