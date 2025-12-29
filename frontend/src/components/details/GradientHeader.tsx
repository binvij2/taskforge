import React from 'react';
import { Paper, Stack, Typography, IconButton, Box, Chip } from '@mui/material';
import { HiX } from 'react-icons/hi';

interface GradientHeaderProps {
  title: string;
  subtitle?: string | React.ReactNode;
  icon?: React.ReactNode;
  badge?: string;
  kpi?: string;
  onClose: () => void;
}

export default function GradientHeader({
  title,
  subtitle,
  icon,
  badge,
  kpi,
  onClose,
}: GradientHeaderProps) {
  return (
    <Paper
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 2,
        background: (theme) => theme.palette.gradients.headerPrimary,
        color: 'white',
        borderRadius: 0,
        p: 3,
        boxShadow: '0px 4px 12px rgba(240, 106, 106, 0.2)',
      }}
      elevation={0}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
        <Stack direction="row" spacing={2} flex={1}>
          {icon && (
            <Box
              sx={{
                width: 56,
                height: 56,
                bgcolor: 'rgba(255, 255, 255, 0.2)',
                borderRadius: 3,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.75rem',
              }}
            >
              {icon}
            </Box>
          )}
          <Box flex={1}>
            <Typography variant="h5" fontWeight={700} gutterBottom sx={{ letterSpacing: '-0.01em' }}>
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="body2" sx={{ opacity: 0.95 }}>
                {subtitle}
              </Typography>
            )}
            {badge && (
              <Chip
                label={badge}
                size="small"
                sx={{
                  mt: 1,
                  bgcolor: 'rgba(255, 255, 255, 0.25)',
                  color: 'white',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                }}
              />
            )}
          </Box>
        </Stack>
        <Stack direction="row" spacing={1} alignItems="center">
          {kpi && (
            <Paper
              sx={{
                px: 2.5,
                py: 1.5,
                bgcolor: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                borderRadius: 2,
                border: '1px solid rgba(255, 255, 255, 0.25)',
              }}
            >
              <Typography variant="caption" sx={{ opacity: 0.9, display: 'block' }}>
                Story Points
              </Typography>
              <Typography variant="h6" fontWeight={700}>
                {kpi}
              </Typography>
            </Paper>
          )}
          <IconButton
            onClick={onClose}
            sx={{
              color: 'white',
              bgcolor: 'rgba(255, 255, 255, 0.15)',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.25)',
              },
            }}
          >
            <HiX size={20} />
          </IconButton>
        </Stack>
      </Stack>
    </Paper>
  );
}