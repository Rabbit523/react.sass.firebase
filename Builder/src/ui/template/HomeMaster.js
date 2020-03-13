/*eslint array-callback-return: "off"*/
/* eslint-disable */
import React, { Component } from 'react'
import firebase from './../../config/database'
import Config from './../../config/app'
import { Link } from 'react-router'
import T from './../../translations/translate'
import Languages from './../../components/Languages'
//const CircularJSON = require('circular-json')

import ReactFlagsSelect from 'react-flags-select';
import 'react-flags-select/css/react-flags-select.css';

var md5 = require('md5');
const ConditionalDisplay = ({condition, children}) => condition ? children : <div></div>;

export default class HomeMaster extends Component {
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

    checkIsSuperAdmin(){
       if(this.props.checkIsSuperAdmin)
            return (
                <ul className="dropdown-menu" role="menu">
                    <li><Link to="/account">Account</Link></li>
                    <ConditionalDisplay condition={Config.isSaaS}>
                        <li><Link to="/billing">Billing</Link></li>
                    </ConditionalDisplay>
                    <li><Link to="settings/rab_saas_site">Settings</Link></li>
                    <li><Link to="users/users">Users</Link></li>
                    <li><Link to="translation/preview">Translations</Link></li>
                    <li className="divider" />
                    <li role="button"><a onClick={this.props.logout}>Logout</a></li>
                </ul>
            )
            else return (
                <ul className="dropdown-menu" role="menu">
                    <li><Link to="/account">Account</Link></li>
                    <ConditionalDisplay condition={Config.isSaaS}>
                        <li><Link to="/billing">Billing</Link></li>
                    </ConditionalDisplay>
                    <li className="divider" />
                    <li role="button"><a onClick={this.props.logout}>Logout</a></li>
                </ul>
            )
    }

    createUserView(){
        return (
            <li className="dropdown userDropdown">
                <a href="#" className="dropdown-toggle" data-toggle="dropdown"><img alt="" className="img-circle img-responsive fireadmin-user_image" src={this.props.userPhoto} /></a>
                {this.checkIsSuperAdmin()}
            </li>
        );
    }

    render() {
        return (
            <div className="main-panel" style={{ 'width': '100%', 'maxHeight':'100% !important'}}>
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
                                <ConditionalDisplay condition={this.props.user.displayName}>
                                    <li style={{ 'paddingTop': '10px'}}><Link to="/account" style={{ 'paddingLeft': '73px', 'paddingRight':'2px'}}>Hello, {this.props.getFirstName(this.props.user.displayName)}</Link></li>
                                </ConditionalDisplay>
                                {this.createUserView()}
                                <li className="separator hidden-lg hidden-md" />
                                <Languages 
                                    countries={this.props.countries}
                                    defaultCountry={this.props.defaultCountry}
                                />
                            </ul>
                        </div>
                    </div>
                </nav>
                <br/><br/><br/><br/>
                {this.props.children}
            </div>  
        )
    }
}
