/*eslint array-callback-return: "off"*/
import React, { Component } from 'react'
import firebase from './../../config/database'
import Config from   '../../config/app'
import { Link } from 'react-router'
import T from './../../translations/translate'
import Languages from './../../components/Languages'

var md5 = require('md5');
const ConditionalDisplay = ({condition, children}) => condition ? children : <div></div>;
export default class NavBarDefault extends Component {

    constructor(props){
        super(props);

        this.state = {
            user: {}
        }

        this.createUserView = this.createUserView.bind(this);
        this.checkIsSuperAdmin = this.checkIsSuperAdmin.bind(this);
    }

    componentDidMount(){
        this.authListener();
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
            console.log("User has Logged  in Master");
            console.log(user.email);
            
        } else {
            // No user is signed in.
            console.log("User has logged out Master");
        }
        });
    }

    createUserView(){
        if(this.props.user){
            var userPhoto=this.props.user.photoURL?this.props.user.photoURL:'http://www.gravatar.com/avatar/' + md5(this.props.user.email+"")+"?s=512";
        }
       
        return (
            <li className="dropdown userDropdown">
                <a href="#" className="dropdown-toggle" data-toggle="dropdown"><img alt="" className="img-circle img-responsive fireadmin-user_image" src={userPhoto} /></a>
                {this.checkIsSuperAdmin()}
            </li>
        );
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
        if(isSuperAdmin)
            return (
                <ul className="dropdown-menu" role="menu">
                    <li><Link to="/account">{T.td("Account")}</Link></li>
                    <ConditionalDisplay condition={Config.isSaaS}>
                        <li><Link to="/billing">{T.td("Billing")}</Link></li>
                    </ConditionalDisplay>
                    <li><Link to="settings/rab_saas_site">{T.td("Settings")}</Link></li>
                    <li><Link to="users/users">{T.td("Users")}</Link></li>
                    <li><Link to="translation/preview">{T.td("Translations")}</Link></li>
                    <li className="divider" />
                    <li role="button"><a onClick={this.handleLogout}>{T.td("Logout")}</a></li>
                </ul>
            )
            else return (
                <ul className="dropdown-menu" role="menu">
                    <li><Link to="/account">{T.td("Account")}</Link></li>
                    <ConditionalDisplay condition={Config.isSaaS}>
                        <li><Link to="/billing">{T.td("Billing")}</Link></li>
                    </ConditionalDisplay>
                    <li className="divider" />
                    <li role="button"><a onClick={this.handleLogout}>{T.td("Logout")}</a></li>
                </ul>
            )
    }

    handleLogout(e) {
        e.preventDefault();
    
        console.log('The link was clicked.');
        firebase.app.auth().signOut();
    }

    getFirstName(userDisplayName){
        if(userDisplayName){
            var splitUserName = userDisplayName.split(" ");
            return (<span style={{ color: '#e91e63'}}>{splitUserName[0]}</span>);
        }
    }

    render() {
        return (
            <nav className="navbar navbar-transparent navbar-absolute">
                <div className="container-fluid">
                    <div className="navbar-minimize">
                    </div>
                    <div className="navbar-header" style={{ 'paddingTop': '13px'}}>
                        <button type="button" className="navbar-toggle" data-toggle="collapse">
                            <span className="sr-only">Toggle navigation</span>
                            <span className="icon-bar" />
                            <span className="icon-bar" />
                            <span className="icon-bar" />
                        </button>
                        <a className="navbar-brand" href="#"><h7><b>{T.td('Dashboard')}</b></h7></a>
                    </div>
                    <div className="collapse navbar-collapse">
                        <ul className="nav navbar-nav navbar-right">
                            <ConditionalDisplay condition={this.state.user.displayName}>
                                <li style={{ 'paddingTop': '10px'}}><Link to="/account" style={{ 'paddingLeft': '73px', 'paddingRight':'2px'}}>{T.td("Hello")}, {this.getFirstName(this.state.user.displayName)}</Link></li>
                            </ConditionalDisplay>
                            {this.createUserView()}
                            <li className="separator hidden-lg hidden-md" />
                            <Languages 
                                countries={this.props.currentLangData.availableLaguages}
                                defaultCountry={this.props.currentLangData.currentLang}
                            />
                        </ul>
                        {this.props.search?<form className="navbar-form navbar-right" role="search" style={{ 'paddingTop': '13px'}}>
                            <div className="form-group form-search is-empty">
                                <input type="text" onChange={this.props.onChange} className="search-query form-control" value={this.props.filter} placeholder={T.td("Search apps")} />
                            <span className="material-input" />
                            </div>
                        </form>:<div></div>}
                        
                    </div>
                </div>
            </nav>
        )
  }
}
