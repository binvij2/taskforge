import React from 'react';
import { Drawer, Box } from '@mui/material';

interface DetailDrawerProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function DetailDrawer({ open, onClose, children }: DetailDrawerProps) {
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: { xs: '100%', sm: 560, md: 680 },
          maxWidth: '100vw',
        },
      }}
      PaperProps={{
        sx: {
          bgcolor: 'background.default',
        },
      }}
    >
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {children}
      </Box>
    </Drawer>
  );
}