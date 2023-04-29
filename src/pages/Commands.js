import React, { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Box, Container, Grid } from '@mui/material';
import TextField from '@mui/material/TextField';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

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

function Commands() {
  const [timer, setTimer] = useState(0);
  const [isClaimButtonEnabled, setIsClaimButtonEnabled] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [encodedPhoneNumber, setEncodedPhoneNumber] = useState(null);
  const [email, setEmail] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [apiVersion, setApiVersion] = useState('3');
  const [action, setAction] = useState('');
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [succeeded, setSucceeded] = useState(null);
  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    const fullUrl = window.location.href;
    const urlParams = new URLSearchParams(fullUrl.substring(fullUrl.indexOf("?")));
    const encodedPhoneNumber = urlParams.get("ad_id");
    const action = urlParams.get("action");
    if (encodedPhoneNumber) {
      setEncodedPhoneNumber(decodeURI(encodedPhoneNumber));
      setPhoneNumber(atob(decodeURI(encodedPhoneNumber)));
    }
    if (action) {
      setAction(action);
    }
  }, []);

  useEffect(() => {
    if (timer > 0) {
      const timeoutId = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(timeoutId);
    } else {
      setIsClaimButtonEnabled(true);
    }
  }, [timer]);

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
    });
  
    if (error) {
      setError(error.message);
      return null;
    }
  
    return paymentMethod.id;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
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
  
      // Clear the card fields
      elements.getElement(CardElement).clear();
    }
  
    setProcessing(false);
  };

  const handleAction = async event => {
    let data = {
      phoneNumber: encodedPhoneNumber,
      action,
    };
  
    if (action === 'register') {
      data.email = btoa(email);
    } else if (action === 'connect') {
      data.apiKey = btoa(apiKey);
      data.apiVersion = apiVersion;
    }
  
    const response = await fetch('https://aireply-command-bbvm7acjya-uc.a.run.app', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phoneNumber: encodedPhoneNumber,
        action: data.action,
        email: data.email ? data.email : false,
        apiKey: data.apiKey ? data.apiKey : false,
        apiVersion: data.apiVersion,
      }),
    });
  
    const jsonResponse = await response.json();
  
    // Handle the response
    if (response.ok) {
      // eslint-disable-next-line default-case
      switch (action) {
        case 'connect':
          alert('You have successfully connected your OpenAI API key!');
          break;
        // case 'regenerate':
        //   alert('You have successfully claimed 10 additional messages!');
        //   break;
        case 'register':
          alert('You have successfully registered your email address!');
          break;
      }
    } else {
      if (jsonResponse.error === 'Invalid API key') {
        alert('Invalid API key. Please check your API key and try again.');
      } else if (jsonResponse.error === 'API key does not have access to GPT-4') {
        alert('Your API key does not have access to GPT-4. We have connected your API key with GPT-3. If you feel this is an error please email contact@textaireply.com.');
      } else {
        alert('An error occurred while processing your action. Please try again later.');
      }
    }
  };

  const renderContent = () => {
    /*if (action === 'regenerate') {
      return (
        isClaimButtonEnabled ? (
          <div>
            <p>Your reward will go to phone number: {phoneNumber}</p>
            <p>If this is not your phone number, please text "REGENERATE" to 12018449959, and use the link provided to claim your reward.</p>
            <p>If you are still getting the wrong number, please email contact@textaireply.com.</p>
            <button onClick={handleAction}>Claim 10 Messages</button>
          </div>
        ) : (
          <div>
            <p>Your reward will go to phone number: {phoneNumber}</p>
            <p>If this is not your phone number, please text "REGENERATE" to 12018449959, and use the link provided to claim your reward.</p>
            <p>If you are still getting the wrong number, please email contact@textaireply.com.</p>
            <button disabled>{`Claim 10 Messages (available in ${timer}s)`}</button>
          </div>
        )
      )
    } else */if (action === 'register') {
      return (
        email && isClaimButtonEnabled ? (
          <div>
            <p>Your email will be registered to phone number: {phoneNumber}</p>
            <p>If this is not your phone number, please text "REGISTER" to 12018449959, and use the link provided to register your email address.</p>
            <p>If you are still getting the wrong number, please email contact@textaireply.com.</p>
            <TextField
              label="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
            />
            <button onClick={handleAction}>Register</button>
          </div>
        ) : (
          <div>
            <p>Your email will be registered to phone number: {phoneNumber}</p>
            <p>If this is not your phone number, please text "REGISTER" to 12018449959, and use the link provided to register your email address.</p>
            <p>If you are still getting the wrong number, please email contact@textaireply.com.</p>
            <TextField
              label="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
            />
            <button disabled>{`Register (${isClaimButtonEnabled ? 'email required' : 'available in' + timer + 's'})`}</button>
          </div>
        )
      )
    } else if (action === 'connect') {
      return (
        apiKey && isClaimButtonEnabled ? (
          <div>
            <p>Your API key will be registered to phone number: {phoneNumber}</p>
            <p>If this is not your phone number, please text "CONNECT" to 12018449959, and use the link provided to connect your API key.</p>
            <p>If you are still getting the wrong number, please email contact@textaireply.com.</p>
            <TextField
              label="API Key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
            <ToggleButtonGroup
              value={apiVersion}
              exclusive
              onChange={(e, value) => setApiVersion(value)}
            >
              <ToggleButton value="3">GPT-3.5 Turbo</ToggleButton>
              <ToggleButton value="4">GPT-4</ToggleButton>
            </ToggleButtonGroup>
            <button onClick={handleAction}>Connect</button>
          </div>
        ) : (
          <div>
            <p>Your API key will be registered to phone number: {phoneNumber}</p>
            <p>If this is not your phone number, please text "CONNECT" to 12018449959, and use the link provided to connect your API key.</p>
            <p>If you are still getting the wrong number, please email contact@textaireply.com.</p>
            <TextField
              label="API Key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
            <ToggleButtonGroup
              value={apiVersion}
              exclusive
              onChange={(e, value) => setApiVersion(value)}
            >
              <ToggleButton value="3">GPT-3.5 Turbo</ToggleButton>
              <ToggleButton value="4">GPT-4</ToggleButton>
            </ToggleButtonGroup>
            <button disabled>{`Connect (${isClaimButtonEnabled ? 'api key required' : 'available in' + timer + 's'})`}</button>
          </div>
        )
      )
    } else if (action === 'payment') {
      return (        
        <Elements stripe={stripePromise}>
          <p>Update your payment information for phone number: {phoneNumber}</p>
          <p>If this is not your phone number, please text "PAYMENT" to 12018449959, and use the link provided to update your payment information.</p>
          <p>If you are still getting the wrong number, please email contact@textaireply.com.</p>

          <form onSubmit={handleSubmit} style={formStyle}>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Card Information</label>
              <CardElement options={CARD_ELEMENT_OPTIONS} onChange={handleChange} />
            </div>
            {error && <div style={errorMessageStyle}>{error}</div>}
            {succeeded && <div style={succeededMessageStyle}>{succeeded}</div>}
            <button disabled={!stripe || processing || succeeded} style={buttonStyle}>
              {processing ? 'Processing...' : 'Update'}
            </button>
          </form>
        </Elements>
      );
    } else {
      return (
        <div style={{textAlign:'center'}}>
          <p>Welcome to our Commands page. Unfortunately, we could not gather your phone number or command.</p>
          <p>This page can be used to "REGISTER" your email address or "CONNECT" your own OpenAI API key.</p>
          <p>Please text any of these commands to 12018449959, and use the link provided. If you are still having issues, please email contact@textaireply.com for further assistance.</p>
        </div>
      )
    }
  };

  return (
    <Box py={5}>
      <Container>
        <Grid container spacing={2} justifyContent="center">  
          <Grid item xs={12} md={6}>
            {renderContent()}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default Commands;