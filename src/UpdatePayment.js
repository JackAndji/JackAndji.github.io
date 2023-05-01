import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Typography } from '@mui/material';

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a',
    },
  },
};

const titleStyle = {
  marginBottom: '20px',
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  width: '400px',
  maxWidth: '100%',
  margin: '0 auto',
};

const textStyle = {
  marginTop: 0,
}

const formGroupStyle = {
  marginBottom: '20px',
};

const labelStyle = {
  marginBottom: '10px',
};

const textInputStyles = {
  position: 'relative',
  fontSize: '14px',
  letterSpacing: '.01rem',
  marginTop: '0 !important',
  marginBottom: '0 !important',
  paddingInline: '8px',
  marginLeft: '0',
  background: '#FFFFFF',
  border: '1px solid #CACACA',
  borderRadius: '5px',
  lineHeight: '25px',
  height: '35px',
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box',
};

const buttonStyle = {
  backgroundColor: '#6772e5',
  color: '#ffffff',
  padding: '8px 12px',
  fontSize: '16px',
  lineHeight: '1.6',
  fontWeight: '600',
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  cursor: 'pointer',
  border: 'none',
};

const errorMessageStyle = {
  color: '#fa755a',
  marginBottom: '20px',
};

const succeededMessageStyle = {
  color: '#2ecc71',
  marginBottom: '20px',
}

const UpdatePayment = ({ encodedPhoneNumber, phoneNumber, action }) => {
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [succeeded, setSucceeded] = useState(null);
  const [nameOnCard, setNameOnCard] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const stripe = useStripe();
  const elements = useElements();

  const fetchCustomerId = async phone => {
    const response = await fetch('https://aireply-create-bbvm7acjya-uc.a.run.app', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phone: phone ? btoa(phone) : undefined, email: undefined }),
    });
  
    const { customerId } = await response.json();
    return customerId;
  };

  const handleNameChange = (event) => {
    setNameOnCard(event.target.value);
  };

  const handlePostalCodeChange = (event) => {
    setPostalCode(event.target.value);
  };

  const handleChange = (event) => {
    setError(event.error ? event.error.message : '');
  };

  const updatePaymentMethod = async (customerId, paymentMethodId) => {
    const response = await fetch('https://aireply-command-bbvm7acjya-uc.a.run.app', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phoneNumber: encodedPhoneNumber,
        action: action,
        customerId: customerId,
        paymentMethodId: paymentMethodId
      }),
    });
    const { error } = await response.json();
  
    if (error) {
      setError(error);
      return false;
    }
  
    return true;
  };

  const createPaymentMethod = async () => {
    const { paymentMethod, error } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
      billing_details: {
        name: nameOnCard,
        address: {
          postal_code: postalCode,
        }
      },
    });
  
    if (error) {
      setError(error.message);
      return null;
    }
  
    return paymentMethod.id;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!nameOnCard || !postalCode) return;
  
    setProcessing(true);
  
    // Create a payment method
    const paymentMethodId = await createPaymentMethod();
    if (!paymentMethodId) {
      setProcessing(false);
      return;
    }
  
    const customerId = await fetchCustomerId(phoneNumber);
  
    const updated = await updatePaymentMethod(customerId, paymentMethodId);
  
    if (updated) {
      setSucceeded('Your payment information has been updated successfully.');
      setNameOnCard('');
      setPostalCode('');
  
      // Clear the card fields
      elements.getElement(CardElement).clear();
    }
  
    setProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <Typography variant="h6" style={titleStyle}>Update Payment Information</Typography>
      <p style={textStyle}>Update your payment information for phone number: {phoneNumber}</p>
      <p style={textStyle}>If this is not your phone number, please text "PAYMENT" to 12018449959, and use the link provided to update your payment information.</p>
      <p style={textStyle}>If you are still getting the wrong number, please email contact@textaireply.com.</p>

      <div style={formGroupStyle}>
        <label htmlFor="name">Name on Card:</label>
        <input
          type="text"
          id="name"
          value={nameOnCard}
          style={textInputStyles}
          onChange={handleNameChange}
          placeholder="Name on Card"
          required
        />
      </div>

      <div style={formGroupStyle}>
        <label style={labelStyle}>Card Information</label>
        <CardElement options={CARD_ELEMENT_OPTIONS} onChange={handleChange} />
      </div>

      <div style={formGroupStyle}>
        <label htmlFor="zipcode">Billing Postal Code:</label>
        <input
          type="text"
          id="zipcode"
          value={postalCode}
          style={textInputStyles}
          onChange={handlePostalCodeChange}
          placeholder="Billing Postal Code"
          required
        />
      </div>

      {error && <div style={errorMessageStyle}>{error}</div>}
      {succeeded && <div style={succeededMessageStyle}>{succeeded}</div>}
      <button disabled={!stripe || processing || succeeded} style={buttonStyle}>
        {processing ? 'Processing...' : 'Update'}
      </button>
    </form>
  )
};

export default UpdatePayment;