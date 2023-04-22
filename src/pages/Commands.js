import React, { useEffect, useState } from 'react';
import { Box, Container, Grid } from '@mui/material';
import styled from '@emotion/styled';
import TextField from '@mui/material/TextField';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

const StyledAdSlot = styled('ins')`
  display: block;
`;

const StyledTopBanner = styled(StyledAdSlot)`
  width: 100%;
  height: 90px;
`;

const StyledSidebarAd = styled(StyledAdSlot)`
  width: 160px;
  height: 600px;
`;

const StyledBottomBanner = styled(StyledAdSlot)`
  width: 100%;
  height: 90px;
`;

function Commands() {
  const [timer, setTimer] = useState(30);
  const [isClaimButtonEnabled, setIsClaimButtonEnabled] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [encodedPhoneNumber, setEncodedPhoneNumber] = useState(null);
  const [email, setEmail] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [apiVersion, setApiVersion] = useState('3');
  const [action, setAction] = useState('');

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8540522665805455';
    script.async = true;
    script.setAttribute('crossorigin', 'anonymous');
    document.head.appendChild(script);

    (window.adsbygoogle = window.adsbygoogle || []).push({});

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  useEffect(() => {
    const fullUrl = window.location.href;
    const urlParams = new URLSearchParams(fullUrl.substring(fullUrl.indexOf("?")));
    const encodedPhoneNumber = urlParams.get("ad_id");
    const action = urlParams.get("action");
    console.log("encodedPhoneNumber", encodedPhoneNumber);
    console.log("action", action);
    if (encodedPhoneNumber) {
      setEncodedPhoneNumber(encodedPhoneNumber);
      setPhoneNumber(atob(encodedPhoneNumber));
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

  const handleAction = async () => {
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
        email: data.email ? btoa(data.email) : undefined,
        apiKey: data.apiKey ? btoa(data.apiKey) : undefined,
        apiVersion: data.apiVersion,
      }),
    });
  
    const jsonResponse = await response.json();
  
    // Handle the response
    if (response.ok) {
      switch (action) {
        case 'connect':
          alert('You have successfully connected your OpenAI API key!');
          break;
        case 'regenerate':
          alert('You have successfully claimed 10 additional messages!');
          break;
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
    if (action === 'regenerate') {
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
    } else if (action === 'register') {
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
        email && isClaimButtonEnabled ? (
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
    } else {
      return (
        <div style={{textAlign:'center'}}>
          <p>Thank you for viewing our ads page. Unfortunately, we could not gather your phone number or action.</p>
          <p>This page can be used to "REGISTER" you email address, "CONNECT" your own OpenAI API key, or "REGENERATE" extra text messages.</p>
          <p>Please text any of these commands to 12018449959, and use the link provided. If you are still having issues, please email contact@textaireply.com for further assistance.</p>
        </div>
      )
    }
  };

  return (
    <Box py={5}>
      <Container>
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12}>
            <StyledTopBanner
              className="adsbygoogle"
              data-ad-client="ca-pub-8540522665805455"
              data-ad-slot="1951504556"
              data-ad-format="auto"
              data-full-width-responsive="true"
            />
          </Grid>
  
          <Grid item xs={12} md={3}>
            <StyledSidebarAd
              className="adsbygoogle"
              data-ad-client="ca-pub-8540522665805455"
              data-ad-slot="5758849633"
              data-ad-format="auto"
              data-full-width-responsive="true"
            />
          </Grid>
  
          <Grid item xs={12} md={6}>
            <StyledAdSlot
              className="adsbygoogle"
              data-ad-client="ca-pub-8540522665805455"
              data-ad-slot="2063147204"
              data-ad-format="auto"
              data-full-width-responsive="true"
            />
            {renderContent()}
          </Grid>
  
          <Grid item xs={12} md={3}>
            <StyledSidebarAd
              className="adsbygoogle"
              data-ad-client="ca-pub-8540522665805455"
              data-ad-slot="9219620484"
              data-ad-format="auto"
              data-full-width-responsive="true"
            />
          </Grid>
  
          <Grid item xs={12}>
            <StyledBottomBanner
              className="adsbygoogle"
              data-ad-client="ca-pub-8540522665805455"
              data-ad-slot="6162174315"
              data-ad-format="auto"
              data-full-width-responsive="true"
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default Commands;