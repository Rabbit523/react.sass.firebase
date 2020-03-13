/* eslint-disable */
import React, { Component } from 'react'
import {Link} from 'react-router'
import firebase from './../../config/database'
import Languages from './../../components/Languages'
import T from './../../translations/translate'

/**
 * Create the nav bar 
 * 
 * Available props
 * items
 * path
 * title
 */
export default class NavBarUI extends Component {

    constructor(props){
        super(props);
    }    
    
    generateBreadCrumb(items,path){
        if(items){
            return (<div>
            {
                items.map((item,index)=>{
                if(index===0){
                    path+=item;
                }else{
                    path+="+"+item;
                }
                return (<Link className="navbar-brand" to={path}>{item==="rab_saas_site"?T.ts(item):item} <span className="breadcrumbSeparator">{index===items.length-1?"":"/"}</span><div className="ripple-container"></div></Link>)
            })}
          </div>)
        }else{
            return (<div></div>)
        }
    }

    render() {
        return (
            <nav className="navbar navbar-transparent navbar-absolute fireadminbar">
                <div className="container-fluid">
                {
                    this.props.hideHamburger?
                    <div></div>:
                    <div className="navbar-minimize">
                        <button id="minimizeSidebar" className="minimizeSidebar btn btn-round btn-white btn-fill btn-just-icon">
                            <i className="material-icons visible-on-sidebar-regular">more_vert</i>
                            <i className="material-icons visible-on-sidebar-mini">view_list</i>
                        <div className="ripple-container"></div></button>
                    </div>
                }
                    
                    <div className="navbar-header">
                        <button type="button" className="navbar-toggle" data-toggle="collapse">
                            <span className="sr-only">Toggle navigation</span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                        </button>
                        {this.generateBreadCrumb(this.props.items,this.props.path)}
                    </div>

                    <div className="collapse navbar-collapse">
                            <ul className="nav navbar-nav navbar-right">
                                <li className="separator hidden-lg hidden-md" />
                                {
                                    this.props.hideHamburger?
                                    <div></div>:
                                    <Languages
                                        countries={this.props.currentLangData.availableLaguages}
                                        defaultCountry={this.props.currentLangData.currentLang}
                                    />
                                }
                                
                            </ul>
                    </div>
                   
                </div>
            </nav>
        )
    }
}
