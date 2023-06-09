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
import image9 from './assets/images/cancellation_review.webp';
import image10 from './assets/images/register_email.webp';
import image11 from './assets/images/commands.webp';
import image12 from './assets/images/open_gpt_4.webp';

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
      description: (
        <Typography>
          AIReply utilizes advanced artificial intelligence to provide instant, accurate, and engaging responses to your text messages, revolutionizing the way you communicate. By integrating cutting-edge AI technology, our service ensures you receive context-aware replies that mimic human conversation, making communication more efficient and enjoyable. AIReply is adaptable to various industries and use-cases, providing tailored responses based on your specific needs, and facilitating seamless interactions between you and your audience.
        </Typography>
      ),
      image: image1,
    },
    {
      title: 'The Advantages of Text Messaging',
      description: (
        <Typography>
          Text messaging offers convenience, speed, and accessibility over traditional phone apps. With AIReply, you\'ll enjoy seamless communication without the need for additional software or downloads. Text messages are less intrusive than phone calls, allowing you to communicate at your own pace and making it easier to multitask and manage your daily activities. In addition, text messaging boasts a high open rate and response rate, ensuring that your messages are more likely to be seen and acted upon compared to other communication methods.
        </Typography>
      ),
      image: image2,
    },
    {
      title: 'Harnessing the Power of ChatGPT AI',
      description: (
        <Typography>
          Our service leverages ChatGPT, a state-of-the-art AI model, to generate human-like responses to your texts. Experience the benefits of faster, more accurate, and context-aware replies. ChatGPT AI ensures your conversations flow naturally and intelligently, providing you with a more satisfying and efficient communication experience. By utilizing advanced machine learning techniques, ChatGPT continuously improves its performance, adapting to your unique communication style and providing increasingly better responses over time.
        </Typography>
      ),
      image: image3,
    },
    {
      title: 'Unlock GPT-4',
      description: 'We are excited to announce the availability of GPT-4, the latest AI technology powering our platform. GPT-4 is automatically included in all Premium Plans. For $3.99/month, you can add GPT-4 without chaning your text message limit, or for an additional $2/month, you can add GPT-4 to the Basic Plan. Experience even more advanced and accurate AI-driven communication with GPT-4.',
      image: image12
    },
    {
      title: 'Email Registration & Enhanced Security',
      description: (
        <Typography>
        By registering with an email address, you add an extra layer of security to your account. In case you lose access to your phone number, your email address serves as a backup for account recovery. Simply contact our customer service team, and they\'ll assist you in regaining access to your account using your registered email. This feature ensures that your account remains secure and that you can continue enjoying our services without any interruptions.
        </Typography>
      ),
      image: image10,
    },
    {
      title: 'No VOIP Numbers Allowed',
      description: (
        <Typography>
          To maintain the quality and integrity of our service, we do not support the use of VOIP numbers. AIReply is designed for use with genuine mobile numbers only. This policy helps us prevent potential misuse and maintain a high level of service for our users, ensuring you can enjoy AIReply with confidence and trust. By restricting usage to authentic mobile numbers, we can more effectively safeguard user privacy and security, while also fostering a respectful and reliable communication environment.
        </Typography>
      ),
      image: image4,
    },
    {
      title: 'Text Commands for Quick Access',
      description: (
        <Box>
          <Typography>Our service offers a variety of single-word text commands for quick access to essential features and information:</Typography>
          <ul>
            <li>COMMANDS: View these commands via text.</li>
            <li>STOP: Stop all messages from our service.</li>
            <li>HELP: Receive help information.</li>
            <li>INFO: Get additional information about your account.</li>
            <li>REGISTER: Register your email address to your phone number for additional security and recovery.</li>
            <li>UNREGISTER: Unregister your email address from your phone number.</li>
            <li>CONNECT: Connect with your API key to access GPT-3 or GPT-4 responses.</li>
            <li>DISCONNECT: Disconnect your API key.</li>
            <li>UPGRADE: Subscribe to our subscription plans.</li>
            <li>PAYMENT: Update your subscription payment information.</li>
            <li>##CANCEL: Cancel your subscription.</li>
          </ul>
          <Typography>These commands allow you to effortlessly interact with our service and access key features at your fingertips.</Typography>
        </Box>
      ),
      image: image11,
    },
    {
      title: 'Enjoy Our Free Tier',
      description: (
        <>
        <Typography>
          Experience AIReply without any commitment or signup. Our free tier offers 10 text message responses per week – simply text 12018449959 to get started. You'll need to opt-in with your first text response, but once you've done that, you can enjoy AI-powered texting without signing up for anything. Discover the benefits of AI-driven communication at your fingertips.
        </Typography>
        <br/>
        <Typography>
          If you find AIReply useful and want to access more features, you can always upgrade to one of our premium plans. Our tiered pricing structure is designed to accommodate a wide range of needs and budgets, providing increased messaging limits and removing the weekly restriction. Take advantage of the power of AI-driven communication tailored to your needs.
        </Typography>
        </>
      ),
      image: image5,
    },
    {
      title: 'Pricing and Subscription Plans',
      description: (
        <Box>
          <Typography>Explore our range of subscription plans tailored to fit your messaging needs. Each plan offers different messaging limits and unlocks the weekly restriction.</Typography>
          <ul>
            <li>GPT-4: unlock GPT-4.</li>
            <li>Basic Plan: 150 text messages per month for $7.99/month</li>
            <li>Basic Plan w/ GPT-4: 150 text messages per month with GPT-4 for $9.99/month</li>
            <li>Premium Plan: 1,000 text messages per month (includes GPT-4) for $19.99/month</li>
          </ul>
        </Box>
      ),
      image: image7,
    },
    {
      title: 'Cancellation and Refund Policy',
      description: (
        <Typography>
          Please note that there are no refunds for our subscription plans. To cancel your subscription, simply text ##CANCEL to our service or email contact@textaireply.com with your phone number and a cancellation request. We recommend reviewing the terms and conditions of your chosen plan carefully before making a purchase.
        </Typography>
      ),
      image: image9,
    },
    {
      title: 'Opt-In Policy & No Spam Guarantee',
      description: (
        <Typography>
          In compliance with new regulations, users need to opt-in when texting for the first time. Rest assured, we respect your privacy and will never send you unsolicited messages. AIReply is committed to maintaining a high standard of user experience, which means ensuring that your communication remains free from spam and unwanted messages. We prioritize user satisfaction and adhere to strict guidelines that promote transparency, trust, and responsible usage of our AI-driven communication platform.
        </Typography>
      ),
      image: image6,
    },
    {
      title: 'Have Questions?',
      description: (
        <Typography>
          Contact us for more information about AIReply. Our dedicated support team is ready to assist you and ensure you get the most out of our service. Whether you\'re a new user looking for guidance, have questions about our plans, or need help with cancellations, our team is here to help. We are committed to providing exceptional customer service and support, so don\'t hesitate to reach out if you have any questions, concerns, or feedback about our platform. Email us at contact@textaireply.com.
        </Typography>
      ),
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
                  {item.description}
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