/* eslint-disable */
import React, { Component } from 'react'
export default class Navigation extends Component {
    constructor(props){
        super(props);
    }
  render() {
    return (
      <div>
        <nav className="navbar navbar-expand-lg fixed-top navbar-transparent " color-on-scroll={100}>
                <div className="container">
                <div className="navbar-translate">
                    <a className="navbar-brand" href="#main">{this.props.info?this.props.info.site_name:""}</a>
                    <button className="navbar-toggler navbar-toggler" type="button" data-toggle="collapse" data-target="#navigation" aria-controls="navigation-index" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-bar bar1" />
                    <span className="navbar-toggler-bar bar2" />
                    <span className="navbar-toggler-bar bar3" />
                    </button>
                </div>
                <div className="collapse navbar-collapse justify-content-end" id="navigation">
                    <div className="navbar-collapse-header">
                    <div className="row">
                        <div className="col-6 collapse-brand">
                        <a>
                        {this.props.info?this.props.info.site_name:""}
                        </a>
                        </div>
                        <div className="col-6 collapse-close text-right">
                        <button type="button" className="navbar-toggler" data-toggle="collapse" data-target="#navigation" aria-controls="navigation-index" aria-expanded="false" aria-label="Toggle navigation">
                            <i className="tim-icons icon-simple-remove" />
                        </button>
                        </div>
                    </div>
                    </div>
                    <ul className="navbar-nav">
                        {
                            this.props.info.menus?this.props.info.menus.map((menu)=>{
                                return (
                                    <li className="nav-item p-0" style={{ 'marginRight': '25px' }}> 
                                        <a className="nav-link" href={menu.link}>
                                            <span>{menu.name}</span>
                                        </a>
                                    </li>
                                );
                            }):""
                        }
                        {
                            this.props.info.social?this.props.info.social.map((social)=>{
                                return (
                                    <li className="nav-item p-0">
                                        <a className="nav-link" rel="tooltip" title={social.tooltip} data-placement="bottom" href={social.link} target="_blank">
                                        <i className={social.iconName} />
                                        <p className="d-lg-none d-xl-none">{social.name}</p>
                                        </a>
                                    </li>
                                );
                            }):""
                        }
                        <li className="nav-item">
                            <a className="nav-link btn btn-default d-none d-lg-block" href={this.props.info.linkToApp} onclick="scrollToDownload()">
                                <i className="tim-icons icon-spaceship" /> {this.props.info.actionButtonName}
                            </a>
                        </li>
                    </ul>
                </div>
                </div>
            </nav>
      </div>
    )
  }
}
