/*eslint array-callback-return: "off"*/
/* eslint-disable */
import React, { Component } from 'react'
import firebase from './../config/database'
import Config from './../config/app'
import { Link } from 'react-router'
import T from './../translations/translate'
import HomeMasterUI from './../ui/template/HomeMaster'
import Languages from './../components/Languages'
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
        var isSuperAdmin = false;
        if(Config.adminConfig.adminUsers){
            Config.adminConfig.adminUsers.map((user)=>{
                if(firebase.app.auth().currentUser.email === user){
                    isSuperAdmin = true;
                }
            })
        }
        return isSuperAdmin
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

    render(){
        return (
            <HomeMasterUI
                userPhoto={this.state.user.photoURL?this.state.user.photoURL:'http://www.gravatar.com/avatar/' + md5(this.state.user.email+"")+"?s=512"}
                user={this.state.user}
                checkIsSuperAdmin={this.checkIsSuperAdmin()}
                children={this.props.children}
                logout={this.handleLogout}
                getFirstName={this.getFirstName}

                //languages
                countries={this.props.route.currentLangData.availableLaguages}
                defaultCountry={this.props.route.currentLangData.currentLang}
            />
        )
    }
}
