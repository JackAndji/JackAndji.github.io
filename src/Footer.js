import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import { styled } from '@mui/system';
import { NavLink } from 'react-router-dom';

const StyledFooter = styled(Box)`
  background-color: #000;
  color: #fff;
  padding: 2rem 0;
`;

const FooterLink = styled(NavLink)`
  color: inherit;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const Footer = () => {
  return (
    <StyledFooter>
      <Container>
        <Typography variant="body1">
          <FooterLink to="/privacy-policy">Privacy Policy</FooterLink> |{' '}
          <FooterLink to="/terms-and-conditions">Terms & Conditions</FooterLink>
        </Typography>
      </Container>
    </StyledFooter>
  );
};

export default Footer;