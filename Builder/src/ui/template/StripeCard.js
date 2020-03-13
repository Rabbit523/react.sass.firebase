import React, { Component } from 'react'
import { Elements, StripeProvider } from 'react-stripe-elements';
import PaymentForm from './PaymentForm';


export default class StripeCard extends Component {

  constructor(props) {
    super(props);

    this.state = {
      stripe: null,
      allowedQty: 0
    };    
  }

  componentDidMount() {
    this.setState({
      stripe: window.Stripe(this.props.config.key), allowedQty: this.props.config.allowedQty, plan_id: this.props.config.plan_id
    });
  }  

  render() {
    const { allowedQty, plan_id, stripe } = this.state;
    return (
      <StripeProvider stripe={stripe}>
        <Elements>
          <PaymentForm allowedQty={allowedQty} stripe={stripe} plan_id={plan_id}/>
        </Elements>
      </StripeProvider>
    );
  }
}