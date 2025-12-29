import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    gradients: {
      headerPrimary: string;
      panelDark: string;
      softSurface: string;
    };
  }
  interface PaletteOptions {
    gradients?: {
      headerPrimary?: string;
      panelDark?: string;
      softSurface?: string;
    };
  }
}

export const theme = createTheme({
  palette: {
    primary: {
      main: '#F06A6A',
      light: '#FF9A8B',
      dark: '#D84D4D',
    },
    secondary: {
      main: '#6AA3F0',
      light: '#8BB9FF',
      dark: '#4D84D8',
    },
    success: {
      main: '#6FCF97',
      light: '#9AE4B8',
      dark: '#56B67D',
    },
    warning: {
      main: '#F2C94C',
      light: '#FFE08A',
      dark: '#D4A838',
    },
    error: {
      main: '#EB5757',
      light: '#FF8080',
      dark: '#C93E3E',
    },
    background: {
      default: '#FAFBFC',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#151B26',
      secondary: '#6C7A93',
    },
    divider: '#E4E7EB',
    gradients: {
      headerPrimary: 'linear-gradient(135deg, #F06A6A 0%, #F2994A 100%)',
      panelDark: 'linear-gradient(135deg, #3A4A5E 0%, #2B3644 100%)',
      softSurface: 'linear-gradient(135deg, #FAFBFC 0%, #F4F6F8 100%)',
    },
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
    h1: {
      fontSize: '2rem',
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.3,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.4,
      letterSpacing: '-0.01em',
    },
    h4: {
      fontSize: '1.125rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    h6: {
      fontSize: '0.875rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '0.9375rem',
      lineHeight: 1.6,
      letterSpacing: '0.01em',
    },
    body2: {
      fontSize: '0.8125rem',
      lineHeight: 1.5,
    },
    button: {
      fontSize: '0.875rem',
      fontWeight: 500,
      textTransform: 'none',
      letterSpacing: '0.01em',
    },
    caption: {
      fontSize: '0.75rem',
      lineHeight: 1.5,
    },
  },
  shape: {
    borderRadius: 12,
  },
  spacing: 8,
  shadows: [
    'none',
    '0px 1px 2px rgba(0, 0, 0, 0.06)',
    '0px 1px 3px rgba(0, 0, 0, 0.08)',
    '0px 2px 4px rgba(0, 0, 0, 0.08)',
    '0px 2px 6px rgba(0, 0, 0, 0.1)',
    '0px 4px 8px rgba(0, 0, 0, 0.1)',
    '0px 6px 12px rgba(0, 0, 0, 0.12)',
    '0px 8px 16px rgba(0, 0, 0, 0.12)',
    '0px 10px 20px rgba(0, 0, 0, 0.14)',
    '0px 12px 24px rgba(0, 0, 0, 0.14)',
    '0px 14px 28px rgba(0, 0, 0, 0.16)',
    '0px 16px 32px rgba(0, 0, 0, 0.16)',
    '0px 18px 36px rgba(0, 0, 0, 0.18)',
    '0px 20px 40px rgba(0, 0, 0, 0.18)',
    '0px 22px 44px rgba(0, 0, 0, 0.2)',
    '0px 24px 48px rgba(0, 0, 0, 0.2)',
    '0px 26px 52px rgba(0, 0, 0, 0.22)',
    '0px 28px 56px rgba(0, 0, 0, 0.22)',
    '0px 30px 60px rgba(0, 0, 0, 0.24)',
    '0px 32px 64px rgba(0, 0, 0, 0.24)',
    '0px 34px 68px rgba(0, 0, 0, 0.26)',
    '0px 36px 72px rgba(0, 0, 0, 0.26)',
    '0px 38px 76px rgba(0, 0, 0, 0.28)',
    '0px 40px 80px rgba(0, 0, 0, 0.28)',
    '0px 42px 84px rgba(0, 0, 0, 0.3)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontSize: '0.875rem',
          fontWeight: 500,
          padding: '10px 20px',
          boxShadow: 'none',
          transition: 'all 0.2s ease',
        },
        contained: {
          boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.06)',
          '&:hover': {
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.12)',
            transform: 'translateY(-1px)',
          },
          '&:active': {
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.08)',
            transform: 'translateY(0)',
          },
        },
        outlined: {
          borderWidth: '1.5px',
          '&:hover': {
            borderWidth: '1.5px',
            backgroundColor: 'rgba(0, 0, 0, 0.02)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.06)',
          border: '1px solid #E4E7EB',
          transition: 'all 0.2s ease',
          '&:hover': {
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
        elevation1: {
          boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.06)',
          border: '1px solid #E4E7EB',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontSize: '0.75rem',
          height: 26,
          borderRadius: 8,
          fontWeight: 500,
        },
        filled: {
          border: '1px solid rgba(0, 0, 0, 0.08)',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          fontSize: '0.875rem',
          borderBottom: '1px solid #E4E7EB',
          padding: '16px',
        },
        head: {
          fontSize: '0.75rem',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          backgroundColor: '#FAFBFC',
          color: '#6C7A93',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            backgroundColor: '#FFFFFF',
            transition: 'all 0.2s ease',
            '&:hover': {
              backgroundColor: '#FAFBFC',
            },
            '&.Mui-focused': {
              backgroundColor: '#FFFFFF',
            },
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          backgroundColor: '#FFFFFF',
        },
      },
    },
  },
});