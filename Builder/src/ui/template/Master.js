/*eslint no-unused-vars: "off"*/
/*eslint no-script-url: "off"*/
/*eslint no-unused-expressions: "off"*/
/*eslint array-callback-return: "off"*/
import React, { Component } from 'react'
import Config from   './../../config/app';
var pjson = require('../../../package.json');
import NavItem from '../../components/NavItem'
import { Link } from 'react-router'
import firebase from '../../config/database'

const ConditionalDisplay = ({condition, children}) => condition ? children : <div></div>;


/**
 * 
 *  Avalilable props
 * 
 *  {String} userPhoto - the user image
 *  {Object} user  - the current logged in user in firebase
 *  {Function} logout - the logout function, no paramas
 *  {Function} printMenuItem - function for priting the menu. Param 1 menu items
 *  {Object} additionalStyle1
 *  {React} children - childrens to display
 *   
 */

export default class MasterUI extends Component {

    constructor(props) {

        super(props);
        this.state = {};

        this.checkIsSuperAdmin = this.checkIsSuperAdmin.bind(this);
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
                <ul className="nav">
                    <li><Link to="/account">Account</Link></li>
                    <li><Link to="translation/preview">Translations</Link></li>
                    <li role="button"><a onClick={this.props.logout}>Logout</a></li>
                </ul>
            )
            else return (
                <ul className="nav">
                    <li><Link to="/account">Account</Link></li>
                    <li role="button"><a onClick={this.props.logout}>Logout</a></li>
                </ul>
            )
    }

    render() {
        return (
            <div className="wrapper">
                <div  id="theSideBar" className="sidebar" has-image="true" data-active-color={Config.adminConfig.design.dataActiveColor} data-background-color={Config.adminConfig.design.dataBackgroundColor}>
                <div className="sidebar-wrapper">
                    <div className="user">
                        <div className="photo">
                            <img  alt="" src={this.props.userPhoto} />
                        </div>
                        <div className="info">
                            <a data-toggle="collapse" href="#collapseExample" className="collapsed">{this.props.user.displayName}<b className="caret"></b></a>
                            <div className="collapse" id="collapseExample">
                                {/*<ul className="nav">
                                    <li><Link to="/account">Account</Link></li>
                                <li>
                                    <a role="button" onClick={this.props.logout} >Logout</a>
                                </li>
                                
                                </ul>*/}
                                {this.checkIsSuperAdmin()}
                            </div>
                        </div>
                    </div>
                    <ul className="nav">
                    {Config.navigation.map(this.props.printMenuItem)}
                    </ul>
                </div>


                <div className="sidebar-background"  style={this.props.additionalStyle1}></div>


                </div>


                <div className="main-panel">
                    {this.props.children}
                    <footer className="footer">
                        <div className="container-fluid">
                            <nav className="pull-left">
                                <ul>

                                </ul>
                            </nav>
                            <p className="copyright pull-right">
                                &copy;
                                <script>
                                    document.write(new Date().getFullYear())
                                </script>
                                <a href="#">{Config.adminConfig.appName}</a>, {Config.adminConfig.slogan}.  v{pjson.version}
                            </p>
                        </div>
                    </footer>
                </div>
            </div>
        )
    }
}
