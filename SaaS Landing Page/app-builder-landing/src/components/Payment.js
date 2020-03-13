/* eslint-disable */
import React, { Component } from 'react'
import ScrollableAnchor from 'react-scrollable-anchor';

export default class Payment extends Component {

  createPaymentPlan(plan, howManyPlans){
    return (
      <div className={"col-md-"+(howManyPlans<3?(howManyPlans==1?"12":"6"):"4")}>
        <div className="card card-coin card-plain">
          <div className="card-header">
            <img src={plan.image} className="img-center img-fluid"/>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-12 text-center">
                <h3 className="text-uppercase">{plan.name}</h3>
                <span>Plan</span>
                <hr/>
                <h4 style={{ 'fontWeight':'bold' }}>{plan.price}</h4>
                <hr className="line-primary" />
              </div>
            </div>
            <div className="row">
              <ul className="list-group">{
                plan.features.map((feature, index)=>{
                  return (  
                    <li className="list-group-item" key={index}>{feature}</li>
                  );
                })
              }
              </ul>
            </div>
          </div>
          <div className="card-footer text-center">
            <a className="btn btn-primary btn-simple" href={this.props.info.linkToApp}>Get Plan</a>
          </div>
        </div>
      </div>
    );
  }

  render() {
    return (
      <ScrollableAnchor id={'pricing'}>
        <section className="section section-lg section-coins">
        {/*<img src="../assets/img/path3.png" className="path" />*/}
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <hr className="line-info" />
              <h1>Choose the plan<span className="text-info"> that fits your needs</span></h1>
            </div>
          </div>
          <div className="row">{
            Object.keys(this.props.plans).map((key)=>{
              return this.createPaymentPlan(this.props.plans[key],Object.keys(this.props.plans).length)
            })
          }
          </div>
        </div>
        </section>      
      </ScrollableAnchor>
    )
  }
}
