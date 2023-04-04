import React, { useState, useEffect } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import ReactSelect from 'react-select';
import 'react-phone-input-2/lib/style.css';
import PhoneInput from 'react-phone-input-2';

const CheckoutForm = () => {
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [succeeded, setSucceeded] = useState(null);
  const [phone, setPhone] = useState('');
  const [selectedTier, setSelectedTier] = useState({});
  const [prices, setPrices] = useState([]);
  const stripe = useStripe();
  const elements = useElements();

  const fetchCustomerId = async (phone) => {
    const response = await fetch('https://aireply-create-bbvm7acjya-uc.a.run.app', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phone }),
    });
  
    const { customerId } = await response.json();
    return customerId;
  };

  const fetchPrices = async () => {
    const response = await fetch('https://aireply-prices-bbvm7acjya-uc.a.run.app', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const { prices } = await response.json();
    setPrices(prices.data);


    // Set the initial selected tier to the first price ID in the prices array
    if (prices.data.length > 0) {
      setSelectedTier({
        id: prices.data[0].id,
        name: prices.data[0].product.name,
        interval: prices.data[0].recurring.interval,
      });
    }
  };

  const createPaymentMethod = async () => {
    const { paymentMethod, error } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
    });
  
    if (error) {
      setError(error.message);
      return null;
    }
  
    return paymentMethod.id;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!phone) return;

    setProcessing(true);

    // Create a payment method
    const paymentMethodId = await createPaymentMethod();
    if (!paymentMethodId) {
      setProcessing(false);
      return;
    }
  
    const customerId = await fetchCustomerId(phone);

    const response = await fetch('https://aireply-stripe-bbvm7acjya-uc.a.run.app', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ paymentMethodId, customerId: customerId, tierObj: selectedTier.value, phone: phone }),
    });

    const { error } = await response.json();
  
    if (error) {
      console.error('Subscription failed:', error);
      setError(error);
    } else {
      setSucceeded('Welcome to TextAIReply! You should be receiving a text message shortly to opt-in.');
      setPhone('');
      setSelectedTier({
        id: prices.data[0].id,
        name: prices.data[0].product.name,
        interval: prices.data[0].recurring.interval,
      });

      // Clear the card fields
      elements.getElement(CardElement).clear();
    }
  
    setProcessing(false);
  };

  const handleChange = (event) => {
    setError(event.error ? event.error.message : '');
  };

  const handlePhoneChange = (value) => {
    setPhone(value);
  };

  const handleTierChange = (selectedOption) => {
    setSelectedTier(selectedOption);
  };

  useEffect(() => {
    fetchPrices();
  }, []);

  const tierOptions = prices.map((price) => ({
    label: `${price.product.name} - ${(price.unit_amount / 100).toFixed(2)} / ${price.recurring.interval_count !== 1 ? price.recurring.interval_count : ''} ${price.recurring.interval}`,
    value: {
      id: price.id,
      name: price.product.name,
      interval: price.recurring.interval_count,
    },
  }));

  const CARD_ELEMENT_OPTIONS = {
    style: {
      base: {
        color: '#32325d',
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

  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    width: '400px',
    margin: '0 auto',
  };

  const formGroupStyle = {
    marginBottom: '20px',
  };

  const labelStyle = {
    marginBottom: '10px',
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

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <div style={formGroupStyle}>
        <label htmlFor="phone">Phone Number (VOIP numbers are prohibited):</label>
        <PhoneInput
          country={'us'}
          value={phone}
          onChange={handlePhoneChange}
          placeholder="Phone Number (VOIP numbers are prohibited)"
          required
        />
      </div>

      <div style={formGroupStyle}>
        <label htmlFor="tier">Select a Tier:</label>
        <ReactSelect
          id="tier"
          value={selectedTier}
          onChange={(selectedOption) => handleTierChange(selectedOption)}
          options={tierOptions}
        />
      </div>

      <div style={formGroupStyle}>
        <label style={labelStyle}>Card Information</label>
        <CardElement options={CARD_ELEMENT_OPTIONS} onChange={handleChange} />
      </div>
      {error && <div style={errorMessageStyle}>{error}</div>}
      {succeeded && <div style={succeededMessageStyle}>{succeeded}</div>}
      <button disabled={!stripe || processing || succeeded} style={buttonStyle}>
        {processing ? 'Processing...' : 'Pay'}
      </button>
    </form>
  );
};

export default CheckoutForm;