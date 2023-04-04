import React from 'react';
import { AppBar, Box, Container, Grid, Toolbar, Typography } from '@mui/material';
import styled from '@emotion/styled';
import backgroundImage from './assets/images/AI-powered_chatbot.webp';

// The AIReply logo and tagline.
const Logo = styled(Typography)`
  font-size: 2rem;
  font-weight: bold;
`;

const Tagline = styled(Typography)`
  font-size: 1.5rem;
  font-style: italic;
  margin-top: 1rem;
`;

const HeaderContainer = styled.div`
  background-color: #000;
`;

const HeaderBackground = styled.div`
  background-image: linear-gradient(90deg, #000, #000 0.1%, #00000080 50%, #000 99.9%, #000), url(${backgroundImage});
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  max-width: 1200px;
  padding-block: 10rem;
  margin-inline: auto;
`;

function Header() {
  return (
    <HeaderContainer>
      <HeaderBackground>
        <AppBar position="static" sx={{ backgroundColor: 'transparent', boxShadow: 'none' }}>
          <Toolbar>
            <Container>
              <Grid container alignItems="center" justifyContent="center">
                {/* AIReply logo and tagline */}
                <Grid item xs={12} sm={6}>
                  <Box textAlign={{ xs: 'center', sm: 'left' }}>
                    <Logo variant="h5" component="div">
                      AIReply
                    </Logo>
                    <Tagline variant="subtitle1" component="div">
                      Your pocket AI, responding to your texts 24/7.
                    </Tagline>
                  </Box>
                </Grid>
                {/* Additional header content can be added in this Grid item */}
                <Grid item xs={12} sm={6}></Grid>
              </Grid>
            </Container>
          </Toolbar>
        </AppBar>
      </HeaderBackground>
    </HeaderContainer>
  );
}

export default Header;