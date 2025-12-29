import React from 'react';
import { Card, CardContent, Stack, Typography, Box } from '@mui/material';

interface KpiCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color?: 'primary' | 'success' | 'warning' | 'secondary' | 'info';
  subtitle?: string;
}

export default function KpiCard({ title, value, icon, color = 'primary', subtitle }: KpiCardProps) {
  const colorMap = {
    primary: '#F06A6A',
    success: '#6FCF97',
    warning: '#F2C94C',
    secondary: '#6AA3F0',
    info: '#56CCF2',
  };

  return (
    <Card
      sx={{
        height: '100%',
        border: '1px solid #E4E7EB',
        boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.04)',
        borderRadius: 3,
        transition: 'all 0.2s ease',
        '&:hover': {
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.08)',
          transform: 'translateY(-2px)',
          borderColor: '#C4CDD5',
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography variant="body2" sx={{ color: '#6C7A93', mb: 1, fontWeight: 500 }}>
              {title}
            </Typography>
            <Typography variant="h4" fontWeight={700} sx={{ mb: subtitle ? 0.5 : 0, color: '#151B26' }}>
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="caption" sx={{ color: '#6C7A93' }}>
                {subtitle}
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2.5,
              bgcolor: colorMap[color] + '15',
              color: colorMap[color],
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
            }}
          >
            {icon}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}