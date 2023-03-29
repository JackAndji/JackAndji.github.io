import React, { useState } from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Box, Container, Grid, Typography } from '@mui/material';
import styled from '@emotion/styled';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import image1 from './assets/images/AI-responding_text-message.webp';
import image2 from './assets/images/text_message.webp';
import image3 from './assets/images/chatbot_conversation.webp';
import image4 from './assets/images/mobile_phone.webp';
import image5 from './assets/images/accepting_free_tier.webp';
import image6 from './assets/images/optin_fun.webp';
import image7 from './assets/images/premium.webp';
import image8 from './assets/images/customer_service.webp';

const StyledAccordion = styled(Accordion)`
  background-color: #f5f5f5;
  box-shadow: none;
  margin-bottom: 1rem;
  &:last-child {
    margin-bottom: 0;
  }
`;

const StyledAccordionSummary = styled(AccordionSummary)`
  font-size: 1.25rem;
  font-weight: 600;
`;

const StyledAccordionDetails = styled(AccordionDetails)`
  background-color: #ffffff;
`;

const StyledImage = styled.img`
  width: 100%;
  max-width: 200px;
  height: auto;
`;

const HowItWorks = () => {
  const [expanded, setExpanded] = useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const items = [
    {
      title: 'AI-Powered Text Messaging',
      description: 'AIReply utilizes advanced artificial intelligence to provide instant, accurate, and engaging responses to your text messages, revolutionizing the way you communicate. By integrating cutting-edge AI technology, our service ensures you receive context-aware replies that mimic human conversation, making communication more efficient and enjoyable. AIReply is adaptable to various industries and use-cases, providing tailored responses based on your specific needs, and facilitating seamless interactions between you and your audience.',
      image: image1,
    },
    {
      title: 'The Advantages of Text Messaging',
      description: 'Text messaging offers convenience, speed, and accessibility over traditional phone apps. With AIReply, you\'ll enjoy seamless communication without the need for additional software or downloads. Text messages are less intrusive than phone calls, allowing you to communicate at your own pace and making it easier to multitask and manage your daily activities. In addition, text messaging boasts a high open rate and response rate, ensuring that your messages are more likely to be seen and acted upon compared to other communication methods.',
      image: image2,
    },
    {
      title: 'Harnessing the Power of ChatGPT AI',
      description: 'Our service leverages ChatGPT, a state-of-the-art AI model, to generate human-like responses to your texts. Experience the benefits of faster, more accurate, and context-aware replies. ChatGPT AI ensures your conversations flow naturally and intelligently, providing you with a more satisfying and efficient communication experience. By utilizing advanced machine learning techniques, ChatGPT continuously improves its performance, adapting to your unique communication style and providing increasingly better responses over time.',
      image: image3,
    },
    {
      title: 'No VOIP Numbers Allowed',
      description: 'To maintain the quality and integrity of our service, we do not support the use of VOIP numbers. AIReply is designed for use with genuine mobile numbers only. This policy helps us prevent potential misuse and maintain a high level of service for our users, ensuring you can enjoy AIReply with confidence and trust. By restricting usage to authentic mobile numbers, we can more effectively safeguard user privacy and security, while also fostering a respectful and reliable communication environment.',
      image: image4,
    },
    {
      title: 'Enjoy Our Free Tier',
      description: 'Experience AIReply without any commitment. Our free tier offers a generous allowance of text messages, no signup required. Give it a try and discover the benefits of AI-powered texting. If you find AIReply useful, you can always upgrade to a premium plan to access increased messaging limits. Our tiered pricing structure is designed to accommodate a wide range of needs and budgets, ensuring that everyone can take advantage of the power of AI-driven communication.',
      image: image5,
    },
    {
      title: 'Opt-In Policy & No Spam Guarantee',
      description: 'In compliance with new regulations, users need to opt-in when texting for the first time. Rest assured, we respect your privacy and will never send you unsolicited messages. AIReply is committed to maintaining a high standard of user experience, which means ensuring that your communication remains free from spam and unwanted messages. We prioritize user satisfaction and adhere to strict guidelines that promote transparency, trust, and responsible usage of our AI-driven communication platform.',
      image: image6,
    },
    {
      title: 'Upgrade to Premium',
      description: 'Looking for more? Our premium tiers offer increased messaging limits. Sign up below or click here to explore our pricing options and elevate your texting experience. With a premium plan, you\'ll enjoy dedicated customer support to help you get the most out of AIReply. By investing in a premium package, you can unlock the full potential of our AI-driven communication service and experience the ultimate in convenience and efficiency.',
      image: image7,
    },
    {
      title: 'Have Questions?',
      description: 'Contact us for more information about AIReply. Our dedicated support team is ready to assist you and ensure you get the most out of our service. Whether you\'re a new user looking for guidance or an experienced user seeking advanced tips, our team is here to help you make the most of AIReply. We are committed to providing exceptional customer service and support, so don\'t hesitate to reach out if you have any questions, concerns, or feedback about our platform.',
      image: image8,
    },
  ];

  return (
    <Box py={5}>
      <Container>
        <Typography variant="h4" component="h2" gutterBottom>
          How It Works
        </Typography>
        {items.map((item, index) => (
          <StyledAccordion key={index} expanded={expanded === index} onChange={handleChange(index)}>
            <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6" component="h3">
                {item.title}
              </Typography>
            </StyledAccordionSummary>
            <StyledAccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography>{item.description}</Typography>
                </Grid>
                <Grid item xs={12} sm={6} container justifyContent="flex-end">
                  <StyledImage src={item.image} alt={item.title} />
                </Grid>
              </Grid>
            </StyledAccordionDetails>
          </StyledAccordion>
        ))}
      </Container>
    </Box>
  );
};

export default HowItWorks;