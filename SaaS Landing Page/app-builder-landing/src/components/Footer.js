/* eslint-disable */
import React, { Component } from 'react'

export default class Footer extends Component {
    constructor(props){
        super(props);
    }  

  render() {
    return (
        <footer className="footer">
            <div className="container">
                <div className="row">
                    <div className="col-md-3">
                        <h3 className="title">{this.props.info.site_name}</h3>
                    </div>
                    <div className="col-md-3"></div>
                    <div className="col-md-3"></div>
                    <div className="col-md-3"></div>
                </div>
            </div>
        </footer>
      
    )
  }
}
