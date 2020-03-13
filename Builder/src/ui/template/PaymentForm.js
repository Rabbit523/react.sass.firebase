import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { CardElement, injectStripe } from 'react-stripe-elements'
import { toast, ToastContainer } from 'react-toastify';
import ReactLoading from 'react-loading'
import firebase from '../../config/database'
import "react-toastify/dist/ReactToastify.css";

var md5 = require('md5');

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: '16px',
      color: '#fff',
      letterSpacing: '0.025em',
      '::placeholder': {
        color: '#87bbfd',
      },
      iconColor: '#c4f0ff'
    },
    invalid: {
      color: '#9e2146',
    }
  }
};

class PaymentForm extends Component {
  state = {
    name: "",
    email: "",
    phone: "",
    customer_id: null,
    redirect: false,
    loading: false
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    const { allowedQty, plan_id, router } = this.props;
    this.setState({ loading: true });
    let { token } = await this.props.stripe.createToken({name: this.state.name});    
    fetch("https://us-central1-appsiest.cloudfunctions.net/app/charge", {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        token: token.id,
        amount: allowedQty===10?1000:allowedQty===20?1500:2000,
        name: this.state.name,
        email: this.state.email
      })
    })
    .then(response => {
      this.setState({ loading: false });
      return response.json();
    })
    .then(data => {
      if (data.status === "succeeded") {
        var obj = {
          id: data.id,
          name: this.state.name,
          phone: this.state.phone,
          subscription_plan_id: plan_id,
          allowedQty: allowedQty,
          amount: data.amount / 100,
          customer: data.customer,
          receipt_url: data.receipt_url,
          payment_method: data.payment_method,
          refund_url: data.refunds.url,
          created: data.created,
          status: data.status
        };
        toast.success("Purchase is completed!");
        firebase.app.database().ref('/stripePayments/' + md5(firebase.app.auth().currentUser.email)).set(obj)
        .then(()=> {
          firebase.app.database().ref(`/users/${firebase.app.auth().currentUser.uid}`).update({
            planName: allowedQty===10?'Starter':allowedQty===20?'Pro':'Rocket',
            customerName: obj.name,
            linkToStripe: obj.receipt_url
          });
          setTimeout(() => {
            router.push('/');
          }, 3000);
        });
      }
    })
    .catch(err => {
      toast.error("Purchase is failed!");
    });
  }

  render() {
    const { allowedQty } = this.props;
        
    return (
      <div className="card-stripe">
        <ToastContainer />
        {this.state.loading && <ReactLoading type={'spin'} color={'#fff'} height={'auto'} width={'100%'} className="loading"/>}
        <form onSubmit={this.handleSubmit}>
          <fieldset>
            <div className="row">
              <label>Name</label>
              <input name="name" type="text" placeholder="Jane Doe" required autoComplete="name" onChange={this.handleChange}></input>
            </div>
            <div className="row">
              <label>Email</label>
              <input name="email" type="email" placeholder="janedoe@gmail.com" required autoComplete="email" onChange={this.handleChange}></input>
            </div>
            <div className="row">
              <label>Phone</label>
              <input name="phone" type="tel" placeholder="(941) 555-0123" required autoComplete="tel" onChange={this.handleChange}></input>
            </div>
          </fieldset>
          <fieldset>
            <div className="row">
              <CardElement {...CARD_ELEMENT_OPTIONS}/>
            </div>
          </fieldset>
          <button type="submit">Pay {allowedQty===10?'$10':allowedQty===20?'$15':'$20'}</button>
        </form>
      </div>
    );
  }
}

export default withRouter(injectStripe(PaymentForm));