import { Box, Button, Typography } from '@mui/material';
import React from 'react';

interface BannerProps {
  image: string;
  title: string;
  subtitle: string;
  ctaText?: string;
  ctaLink?: string;
  bgColor: string;
}

const Banner: React.FC<BannerProps> = ({ image, title, subtitle, ctaText, ctaLink, bgColor }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        bgcolor: bgColor,
        borderRadius: 2,
        p: 2,
        mt: 2,
        backgroundImage: `url(${image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: 150,
        color: 'white',
        position: 'relative',
      }}
    >
      <Box sx={{ zIndex: 1 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          {title}
        </Typography>
        <Typography variant="h6">{subtitle}</Typography>
        {ctaText && ctaLink && (
          <Button
            variant="contained"
            href={ctaLink}
            sx={{ mt: 1, bgcolor: '#32D094', '&:hover': { bgcolor: '#45a049' } }}
          >
            {ctaText}
          </Button>
        )}
      </Box>
      <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, bgcolor: 'rgba(0, 0, 0, 0.3)' }} />
    </Box>
  );
};

export default Banner;