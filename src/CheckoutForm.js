import React, { useState, useEffect } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import ReactSelect from 'react-select';
import 'react-phone-input-2/lib/style.css';
import PhoneInput from 'react-phone-input-2';

const CheckoutForm = () => {
  const urlSearchParams = new URLSearchParams(window.location.search);
  const adId = urlSearchParams.get('ad_id');
  const decodedPhone = adId ? atob(decodeURI(adId)) : '';

  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [succeeded, setSucceeded] = useState(null);
  const [phone, setPhone] = useState(decodedPhone);
  const [email, setEmail] = useState('');
  const [selectedTier, setSelectedTier] = useState({});
  const [prices, setPrices] = useState([]);
  const [nameOnCard, setNameOnCard] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const stripe = useStripe();
  const elements = useElements();

  const fetchCustomerId = async (phone, email) => {
    const response = await fetch('https://aireply-create-bbvm7acjya-uc.a.run.app', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phone: btoa(phone), email: email ? btoa(email) : undefined, name: btoa(nameOnCard) }),
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
      billing_details: {
        name: nameOnCard,
        postal_code: postalCode,
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
    if (!phone || !nameOnCard || !postalCode) return;

    setProcessing(true);

    // Create a payment method
    const paymentMethodId = await createPaymentMethod();
    if (!paymentMethodId) {
      setProcessing(false);
      return;
    }
  
    const customerId = await fetchCustomerId(phone, email);

    const response = await fetch('https://aireply-stripe-bbvm7acjya-uc.a.run.app', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ paymentMethodId, customerId: customerId, tierObj: selectedTier.value, phone: phone ? btoa(phone) : undefined, email: email ? btoa(email) : undefined }),
    });

    const { error } = await response.json();
  
    if (error) {
      console.error('Subscription failed:', error);
      setError(error);
    } else {
      setSucceeded('Welcome to TextAIReply! You should be receiving a text message shortly to opt-in.');
      setNameOnCard('');
      setPostalCode('');
      setPhone('');
      setEmail('');
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

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleNameChange = (event) => {
    setNameOnCard(event.target.value);
  };

  const handlePostalCodeChange = (event) => {
    setPostalCode(event.target.value);
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
    maxWidth: '100%',
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
        <label htmlFor="email">Email Address (optional, for account recovery):</label>
        <input
          type="email"
          id="email"
          value={email}
          style={textInputStyles}
          onChange={handleEmailChange}
          placeholder="Email Address"
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
        {processing ? 'Processing...' : 'Pay'}
      </button>
    </form>
  );
};

export default CheckoutForm;