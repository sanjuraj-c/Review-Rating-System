// src/components/common/LoadingSpinner.tsx

import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { ClipLoader } from 'react-spinners';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
  variant?: 'circular' | 'dots';
  fullPage?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = 'Loading...',
  size = 'medium',
  variant = 'circular',
  fullPage = false,
}) => {
  const getSize = () => {
    switch (size) {
      case 'small':
        return 24;
      case 'large':
        return 60;
      default:
        return 40;
    }
  };

  const spinner = variant === 'circular' ? (
    <CircularProgress
      size={getSize()}
      sx={{ color: 'primary.main' }}
    />
  ) : (
    <ClipLoader
      color="#2563eb"
      size={getSize()}
      speedMultiplier={0.8}
    />
  );

  const content = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
      }}
    >
      {spinner}
      {message && (
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
            textAlign: 'center',
          }}
        >
          {message}
        </Typography>
      )}
    </Box>
  );

  if (fullPage) {
    return (
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          zIndex: 9999,
        }}
      >
        {content}
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 4,
      }}
    >
      {content}
    </Box>
  );
};

// Inline loading component for buttons
export const InlineLoader: React.FC<{ size?: number }> = ({ size = 16 }) => (
  <CircularProgress
    size={size}
    sx={{
      color: 'inherit',
      marginRight: 1,
    }}
  />
);

export default LoadingSpinner;