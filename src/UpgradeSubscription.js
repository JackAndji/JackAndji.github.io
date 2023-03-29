import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from './CheckoutForm';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const UpgradeSubscription = () => {
  return (
    <div>
      <h2>Upgrade Subscription</h2>
      <h3>Coming Soon!</h3>
      {/* <Elements stripe={stripePromise}>
        <CheckoutForm />
      </Elements> */}
    </div>
  );
};

export default UpgradeSubscription;