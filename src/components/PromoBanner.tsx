import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

interface PromoBannerProps {
  image: string;
  title: string;
  subtitle?: string;
}

const PromoBanner: React.FC<PromoBannerProps> = ({ image, title, subtitle }) => {
  return (
    <Paper
      sx={{
        position: 'relative',
        height: 200,
        backgroundImage: `url(${image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        borderRadius: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        textAlign: 'center',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 10,
          left: 10,
          bgcolor: '#F5A623',
          px: 2,
          py: 1,
          borderRadius: 1,
        }}
      >
        <Typography variant="h6" sx={{ color: 'white' }}>
          14 Days
        </Typography>
      </Box>
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="h6">
            {subtitle}
          </Typography>
        )}
      </Box>
    </Paper>
  );
};

export default PromoBanner;