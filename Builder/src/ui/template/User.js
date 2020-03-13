/*eslint array-callback-return: "off"*/
/* eslint-disable */
import React, { Component } from 'react'
import firebase from '../../config/database'
import Config from './../../config/app'
import Card from './../../ui/template/Card'
import StripeCard from './../../ui/template/StripeCard'
import SkyLight from 'react-skylight'
import Image from './../../components/fields/Image'
import Input from './../../components/fields/Input'
import T from './../../translations/translate'

var md5 = require('md5');
const ConditionalDisplay = ({ condition, children }) => condition ? children : <div></div>;

export default class User extends Component {

  constructor(props) {
    super(props);

    this.state = {
      password: "",
      confirmPass: "",
      features: [],
      planName: "",
      subscription: null,
      user: {},
      plans: {},
      stripe: {},
      vendorID: ""
    }

    this.setUpBillingInfo = this.setUpBillingInfo.bind(this);
    this.setUpSubscriptionOptions = this.setUpSubscriptionOptions.bind(this);
    this.getPlans = this.getPlans.bind(this);
  }

  componentDidMount() {
    //Find user
    this.setState({
      user: firebase.app.auth().currentUser
    })
    //Check current subscription status
    this.checkSubscriptionStatus();
    //Get plans from firebase
    this.getPlans();
  }

  //Get plans from firebase 
  getPlans() {
    var _this = this;
    firebase.app.database().ref('/rab_saas_site/pricing').on('value', function (snapshot) {
      _this.setState({
        plans: snapshot.val().plans,
        vendorID: snapshot.val().vendorID
      });
    });
  }

  //Connect to firebase to get current user subscription status and set it in state
  checkSubscriptionStatus() {
    var _this = this;
    firebase.app.database().ref('/stripePayments/' + md5(firebase.app.auth().currentUser.email)).on('value', function (snapshot) {
      _this.setState({
        subscription: snapshot.val()
      })
    });
  }

  //Setup view for billing 
  setUpBillingInfo(plan, subscription) {
    return (
      <div className="row">
        <div className="col-md-3 colBilling">
          <h4 className="colBillingText">{plan.name}</h4>
        </div>
        <div className="col-md-3 colBilling">
          <a className="btn btn-secondary" onClick={() => {
            this.setState({
              features: plan.features,
              planName: plan.name
            }, () => this.dialog.show()
            );
          }}>{T.ts("Features")}</a>
        </div>
        <div className="col-md-3 colBilling">
          <h4 className="colBillingText">{plan.price}</h4>
        </div>
        <div className="col-md-3 colBilling">
          {this.buttonSubscriptionShow(plan, subscription)}
        </div>
      </div>
    );
  }

  //Setup subscription options for updating and canceling subscription
  setUpSubscriptionOptions(subscription) {
    if (subscription && subscription.update_url && subscription.cancel_url && subscription.status != "deleted") {
      return (
        <div className="col-md-12">
          <a href={subscription.update_url} target="_blank" className={"btn " + Config.designSettings.buttonInfoClass}>{T.ts("Update Billing Info")}</a>
          <a href={subscription.cancel_url} target="_blank" className={"btn " + Config.designSettings.submitButtonClass}>{T.ts("Cancel Subscription")}</a>
        </div>
      )
    } else {
      return (<div></div>)
    }
  }

  //Check subscription status of user and set show options for subscription button
  buttonSubscriptionShow(plan, subscription) {
    if (!subscription) {
      return (<a type="submit" onClick={() => {
        this.setState({
          stripe: { allowedQty: plan.allowedQty, key: Config.stripe_api_key, plan_id: plan.id }
        }, () => this.stripeDialog.show()
        );
        this.stripeDialog.show();
      }} className={"btn " + Config.designSettings.submitButtonClass}>{T.td("Purchase now")}</a>
      )
    } else {
      if (subscription.status != "deleted" && plan.id + "" === subscription.subscription_plan_id + "") {
        return (
          <a type="submit" className={"btn " + Config.designSettings.submitButtonClass} disabled><i className="material-icons">done</i> {T.td("Current plan")}</a>
        )
      } else {
        return (<a type="submit" onClick={() => {
          this.setState({
            stripe: { allowedQty: plan.allowedQty, key: Config.stripe_api_key, plan_id: plan.id }
          }, () => this.stripeDialog.show()
          );
          this.stripeDialog.show();
        }} className={"btn " + Config.designSettings.submitButtonClass}>{subscription.status == "deleted" ? T.td("Purchase now") : T.td("Switch")}</a>
        )
      }
    }
  }

  render() {
    var dialogOverlay = {
      height: '143%'
    };
    var dialogStyle = {
      width: '40%',
      marginLeft: '-20%',
      top: '90%'
    };
    var stripeDialogStyle = {
      backgroundColor: '#6772e5',
      width: '40%',
      marginLeft: '-20%',
      top: '90%'
    };
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-10">
            <div className="row">
              <Card
                class="col-md-3 col-md-offset-2"
                name={"userDataRight"}
                title={T.td("User Info")}
                showAction={false}
              >
                <div className="row">
                  <br /><br />
                  <div className="col-md-12">
                    <div className="col-md-10 col-md-offset-1">
                      <Image
                        class="img-circle img-responsive center-block"
                        wrapperClass=" "
                        theKey="image"
                        value={this.props.userPhoto}
                        updateAction={(imageName, linkToImage) => { this.props.setUpUserImage(linkToImage) }}
                      >
                      </Image>
                    </div>
                    {/*<div className="clearfix"></div>*/}
                    <div className="col-md-8 col-md-offset-2">
                      <h4 className="text-center">{this.props.user.displayName}</h4>
                      <p className="text-center"><b>{this.props.user.email}</b></p>
                    </div>
                  </div>
                </div>
              </Card>
              <div className="col-md-7">
                <div className="row">
                  <Card
                    class="col-md-12"
                    name={"userDataRight"}
                    title={T.td("My Profile")}
                    showAction={false}
                  >
                    <div className="row">
                      <div className="form-group-md col-md-10 col-md-offset-1">
                        <div className="row">
                          <label className="col-md-3 col-form-label labelUserProfile">{T.td("Full Name")}</label>
                          <div className="col-md-7">
                            <ConditionalDisplay condition={this.props.user.email}>
                              <Input
                                class="col-md-7"
                                theKey="name"
                                value={this.props.user.displayName}
                                updateAction={(nameKey, displayName) => { this.setUpName(displayName) }}
                              >
                              </Input>
                            </ConditionalDisplay>
                          </div>
                        </div>
                        <br /><br />
                      </div>
                    </div>
                  </Card>
                  <ConditionalDisplay condition={!Config.isDemo}>
                    <Card
                      class="col-md-12"
                      name={"userPassword"}
                      title={T.td("Reset Password")}
                      showAction={false}
                    >
                      <div className="row">
                        <div className="form-group-md col-md-10 col-md-offset-1">
                          <div className="row">
                            <label className="col-md-3 col-form-label labelUserProfile">{T.ts("New Password")}</label>
                            <div className="col-md-7">
                              <Input
                                class="col-md-7"
                                theKey="password"
                                value={this.state.password}
                                type={"password"}
                                updateAction={(nameKey, newpassword) => {
                                  this.setState({
                                    password: newpassword
                                  })
                                }}
                              >
                              </Input>
                            </div>
                          </div>
                        </div>
                        <div className="form-group-md col-md-10 col-md-offset-1">
                          <div className="row">
                            <label className="col-md-3 col-form-label labelUserProfile">{T.ts("New Password Confirmation")}</label>
                            <div className="col-md-7">
                              <Input
                                class="col-md-7"
                                theKey="passwordConfirm"
                                value={this.state.confirmPass}
                                type={"password"}
                                updateAction={(nameKey, newpassword) => {
                                  this.setState({
                                    confirmPass: newpassword
                                  })
                                }}
                              >
                              </Input>
                            </div>
                          </div>
                          <br /><br />
                          <a type="submit" onClick={() => { this.props.resetPassword(this.state.password, this.state.confirmPass) }} className={"btn " + Config.designSettings.submitButtonClass} disabled={Config.isDemo ? true : false}>Change password</a>
                        </div>
                      </div>
                    </Card>
                  </ConditionalDisplay>
                  <Card name={"Billing"} title={T.ts("Subscription")} showAction={false}>
                    <div className="row">
                      <div className="col-md-12">
                        <br /><br />
                        <div className="col-md-12" >{
                          this.state.plans.length > 0 ? this.state.plans.map((plan) => {
                            return this.setUpBillingInfo(plan, this.state.subscription);
                          }) : ""
                        }
                        </div>
                      </div>
                    </div>
                    <br /><br /><br />
                  </Card>
                  <ConditionalDisplay condition={this.state.subscription && this.state.subscription.update_url && this.state.subscription.cancel_url && this.state.subscription.status != "deleted"}>
                    <Card name={"Billing Option"} title={T.ts("Subscription Options")} showAction={false}>
                      <br />
                      <div className="row">
                        {this.setUpSubscriptionOptions(this.state.subscription)}
                      </div>
                      <br />
                    </Card>
                  </ConditionalDisplay>
                  <SkyLight hideOnOverlayClicked ref={ref => (this.dialog = ref)} title={this.state.planName + " " + T.ts("Plan Features")} dialogStyles={dialogStyle} overlayStyles={dialogOverlay}>
                    <hr />
                    {this.state.features.map((feature, key) => (
                      <h3 key={key}><i className="material-icons">done</i> {feature}</h3>
                    ))}
                  </SkyLight>
                  <SkyLight hideOnOverlayClicked ref={ref => (this.stripeDialog = ref)} dialogStyles={stripeDialogStyle} overlayStyles={dialogOverlay}>
                    <StripeCard config={this.state.stripe}/>
                  </SkyLight>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
