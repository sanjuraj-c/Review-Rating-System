// src/components/common/Footer.tsx

import React from 'react';
import { Box, Typography, Container, Divider } from '@mui/material';
import { Star } from '@mui/icons-material';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: 'grey.50',
        borderTop: '1px solid',
        borderColor: 'grey.200',
        mt: 'auto',
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
          }}
        >
          {/* Brand */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            {/* <Star sx={{ color: 'primary.main' }} /> */}
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: 'text.primary',
              }}
            >
              ReviewRater 
            </Typography>
          </Box>

          {/* Copyright */}
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              textAlign: { xs: 'center', sm: 'right' },
            }}
          >
            © {currentYear} ReviewRater AI. Built with React, Django & AI.
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Description */}
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
            textAlign: 'center',
            maxWidth: 600,
            mx: 'auto',
          }}
        >
          Powered by artificial intelligence to provide instant and accurate review ratings.
          Submit your review and get real-time AI-generated star ratings.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;