import React, { useEffect, useState } from 'react';
import { Box, Container, Grid } from '@mui/material';
import styled from '@emotion/styled';

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

function RegenerateAds() {
  const [timer, setTimer] = useState(30);
  const [isClaimButtonEnabled, setIsClaimButtonEnabled] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(null);

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
    const urlParams = new URLSearchParams(window.location.search);
    const encodedPhoneNumber = urlParams.get('ad_id');
    console.log('encodedPhoneNumber', encodedPhoneNumber);
    if (encodedPhoneNumber) {
      setPhoneNumber(Buffer.from(encodedPhoneNumber, 'base64').toString('ascii'));
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

  const handleClaim = async () => {
    // Send a request to your server to regenerate messages
    const response = await fetch('/api/regenerate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phoneNumber }),
    });

    // Handle the response
    if (response.ok) {
      alert('You have successfully claimed 10 additional messages!');
    } else {
      alert('An error occurred while claiming your messages. Please try again later.');
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
            {phoneNumber ? (
              isClaimButtonEnabled ? (
                <button onClick={handleClaim}>Claim 10 Messages</button>
              ) : (
                <button disabled>{`Claim 10 Messages (available in ${timer}s)`}</button>
              )
            ) : (
              <p style={{textAlign:'center'}}>
                Thank you for viewing our ads page. Unfortunately, we could not gather your phone number. Please
                text "REGENERATE" to 12018449959, and use the link provided to claim your reward.
              </p>
            )}
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

export default RegenerateAds;