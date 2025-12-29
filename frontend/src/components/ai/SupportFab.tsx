import React from 'react';
import { Fab, Tooltip } from '@mui/material';
import { HiQuestionMarkCircle } from 'react-icons/hi';

export default function SupportFab() {
  return (
    <Tooltip title="Help & Support" placement="left">
      <Fab
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          bgcolor: '#F06A6A',
          color: 'white',
          boxShadow: '0px 4px 12px rgba(240, 106, 106, 0.25)',
          '&:hover': {
            bgcolor: '#D84D4D',
            boxShadow: '0px 6px 16px rgba(240, 106, 106, 0.35)',
          },
        }}
        onClick={() => {
          alert('Help & Support - Coming Soon!');
        }}
      >
        <HiQuestionMarkCircle size={28} />
      </Fab>
    </Tooltip>
  );
}