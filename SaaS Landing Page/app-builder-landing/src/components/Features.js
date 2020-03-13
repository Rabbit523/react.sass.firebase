/* eslint-disable */
import React, { Component } from 'react'
import ScrollableAnchor from 'react-scrollable-anchor';
export default class Features extends Component {

  render() {
    return (
      <body className="profile-page">
       <ScrollableAnchor id={'features'}>
          <div className="wrapper">{
              this.props.features.map((feature, index)=>{
                var ind = index + 1;
                return (
                  <div className="section" key={index}>
                    <div className="container">
                      <div className="row justify-content-between">
                        <div className={index%2===0?"col-md-6 order-md-2":"col-md-6 order-md-1"}>
                          <div className="row justify-content-between align-items-center">
                            <img className="feature-image d-block" src={feature.image} alt=""/>
                          </div>
                        </div>
                        <div className="col-md-5 order-md-1">
                          <h1 className="profile-title text-left">{feature.name}</h1>
                          <h5 className="text-on-back">{"0"+ ind}</h5>
                          <p className="profile-description text-left">{feature.description}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            }
          </div>
        </ScrollableAnchor>
      </body>
    )
  }
}
