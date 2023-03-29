import React from 'react';
import { Box, Container, Link, Typography } from '@mui/material';
import { styled } from '@mui/system';

const StyledFooter = styled(Box)`
  background-color: #000;
  color: #fff;
  padding: 2rem 0;
`;

const FooterLink = styled(Link)`
  color: inherit;
  &:hover {
    text-decoration: underline;
  }
`;

const Footer = () => {
  return (
    <StyledFooter>
      <Container>
        <Typography variant="body1">
          <FooterLink href="/privacy-policy">Privacy Policy</FooterLink> |{' '}
          <FooterLink href="/terms-and-conditions">Terms & Conditions</FooterLink>
        </Typography>
      </Container>
    </StyledFooter>
  );
};

export default Footer;