import React from 'react';
import { Box, Container } from '@mui/material';
import UpgradeSubscription from './UpgradeSubscription';
import HowItWorks from './HowItWorks';

const Home = () => {
  return (
    <Box py={5}>
      <Container>
        <HowItWorks />
        <UpgradeSubscription />
      </Container>
    </Box>
  );
};

export default Home;