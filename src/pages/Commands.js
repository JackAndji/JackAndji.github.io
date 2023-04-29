import React, { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { Box, Container, Grid, Typography } from '@mui/material';
import TextField from '@mui/material/TextField';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Button from '@mui/material/Button';
import UpdatePayment from '../UpdatePayment';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  width: '400px',
  margin: '0 auto',
};

const textStyle = {
  marginTop: 0,
}

const titleStyle = {
  marginBottom: '20px',
};

const buttonStyle = {
  marginTop: '20px',
};

const errorMessageStyle = {
  color: 'red',
  marginBottom: '10px',
};

const succeededMessageStyle = {
  color: 'green',
  marginBottom: '10px',
};

function Commands() {
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [encodedPhoneNumber, setEncodedPhoneNumber] = useState(null);
  const [email, setEmail] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [apiVersion, setApiVersion] = useState('3');
  const [action, setAction] = useState('');
  const [error, setError] = useState(null);
  const [succeeded, setSucceeded] = useState(null);
  const [processing, setProcessing] = useState(false);

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

  const handleAction = async () => {
    setError(null);
    setSucceeded(null);

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
          setSucceeded('You have successfully connected your OpenAI API key!');
          break;
        case 'register':
          setSucceeded('You have successfully registered your email address!');
          break;
      }
    } else {
      if (jsonResponse.error === 'Invalid API key') {
        setError('Invalid API key. Please check your API key and try again.');
      } else if (jsonResponse.error === 'API key does not have access to GPT-4') {
        setError('Your API key does not have access to GPT-4. We have connected your API key with GPT-3. If you feel this is an error please email contact@textaireply.com.');
      } else {
        setError('An error occurred while processing your action. Please try again later.');
      }
    }
    setProcessing(false);
  };

  const isEmailValid = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const renderForm = (title, buttonText, onSubmit, children) => (
    <form onSubmit={onSubmit} style={formStyle}>
      <Typography variant="h6" style={titleStyle}>{title}</Typography>
      {children}
      {error && <div style={errorMessageStyle}>{error}</div>}
      {succeeded && <div style={succeededMessageStyle}>{succeeded}</div>}
      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={processing || succeeded}
        style={buttonStyle}
      >
        {processing ? 'Processing...' : buttonText}
      </Button>
    </form>
  );

  const renderContent = () => {
    if (action === 'register') {
      const onSubmit = (event) => {
        event.preventDefault();
        setProcessing(true);

        if (isEmailValid(email)) {
          handleAction();
        } else {
          setProcessing(false);
          setError('Valid email address required.');
          return;
        }
      };

      const children = (
        <>
          <p style={textStyle}>Your email will be registered to phone number: {phoneNumber}</p>
          <p style={textStyle}>If this is not your phone number, please text "REGISTER" to 12018449959, and use the link provided to register your email address.</p>
          <p style={textStyle}>If you are still getting the wrong number, please email contact@textaireply.com.</p>
          <TextField
            label="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            fullWidth
          />
        </>
      );

      return renderForm(
        'Register Email', 
        'Register', 
        onSubmit, 
        children, 
        error,
        errorMessageStyle,
        succeeded,
        succeededMessageStyle,
        processing
      );
    } else if (action === 'connect') {
      const onSubmit = (event) => {
        event.preventDefault();
        setProcessing(true);

        if (apiKey) {
          handleAction();
        } else {
          setProcessing(false);
          setError('API key required.');
          return;
        }
      };

      const children = (
        <>
          <p style={textStyle}>Your API key will be registered to phone number: {phoneNumber}</p>
          <p style={textStyle}>If this is not your phone number, please text "CONNECT" to 12018449959, and use the link provided to connect your API key.</p>
          <p style={textStyle}>If you are still getting the wrong number, please email contact@textaireply.com.</p>
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
        </>
      );

      return renderForm(
        'Connect API', 
        'Connect', 
        onSubmit, 
        children, 
        error,
        errorMessageStyle,
        succeeded,
        succeededMessageStyle,
        processing
      );
    } else if (action === 'payment') {
      return (
        <Elements stripe={stripePromise}>
          <UpdatePayment
            encodedPhoneNumber={encodedPhoneNumber}
            phoneNumber={phoneNumber}
            action={action}
          />
        </Elements>
      );
    } else {
      return (
        <div style={{ textAlign: 'center' }}>
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