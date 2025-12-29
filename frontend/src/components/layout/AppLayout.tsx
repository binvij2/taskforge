import React, { useState } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Stack,
  useMediaQuery,
  useTheme,
  IconButton,
} from '@mui/material';
import { HiViewBoards, HiViewList, HiCalendar, HiFolder, HiHome, HiMenu } from 'react-icons/hi';
import { useRouter } from 'next/router';
import Link from 'next/link';

const drawerWidth = 260;

interface AppLayoutProps {
  children: React.ReactNode;
}

const navigationItems = [
  { text: 'Dashboard', icon: <HiHome size={20} />, path: '/' },
  { text: 'Board', icon: <HiViewBoards size={20} />, path: '/board' },
  { text: 'Backlog', icon: <HiViewList size={20} />, path: '/backlog' },
  { text: 'Sprints', icon: <HiCalendar size={20} />, path: '/sprints' },
  { text: 'Projects', icon: <HiFolder size={20} />, path: '/projects' },
];

export default function AppLayout({ children }: AppLayoutProps) {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#FAFBFC' }}>
      <Box sx={{ p: 3, pb: 2 }}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: 2,
              background: 'linear-gradient(135deg, #F06A6A 0%, #F2994A 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography variant="body1" fontWeight={700} sx={{ color: 'white' }}>
              DT
            </Typography>
          </Box>
          <Typography variant="h6" fontWeight={700} sx={{ color: '#151B26' }}>
            DevTaskBoard
          </Typography>
        </Stack>
      </Box>
      <Divider sx={{ borderColor: '#E4E7EB' }} />
      <List sx={{ flex: 1, py: 2, px: 2 }}>
        {navigationItems.map((item) => {
          const isActive = router.pathname === item.path;
          return (
            <Link key={item.text} href={item.path} passHref legacyBehavior>
              <ListItemButton
                component="a"
                selected={isActive}
                sx={{
                  mb: 0.5,
                  borderRadius: 2,
                  py: 1.25,
                  transition: 'all 0.2s ease',
                  '&.Mui-selected': {
                    bgcolor: '#FFFFFF',
                    color: '#F06A6A',
                    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.06)',
                    '&:hover': {
                      bgcolor: '#FFFFFF',
                    },
                    '& .MuiListItemIcon-root': {
                      color: '#F06A6A',
                    },
                  },
                  '&:hover': {
                    bgcolor: '#FFFFFF',
                    boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.04)',
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isActive ? '#F06A6A' : '#6C7A93',
                    minWidth: 40,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontSize: '0.9375rem',
                    fontWeight: isActive ? 600 : 500,
                  }}
                />
              </ListItemButton>
            </Link>
          );
        })}
      </List>
      <Divider sx={{ borderColor: '#E4E7EB' }} />
      <Box sx={{ p: 2.5 }}>
        <Stack
          direction="row"
          spacing={1.5}
          alignItems="center"
          sx={{
            p: 1.5,
            borderRadius: 2,
            bgcolor: '#FFFFFF',
            border: '1px solid #E4E7EB',
            transition: 'all 0.2s ease',
            '&:hover': {
              boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.06)',
            },
          }}
        >
          <Avatar
            src="https://i.pravatar.cc/150?img=1"
            sx={{ width: 36, height: 36 }}
          />
          <Box>
            <Typography variant="body2" fontWeight={600} sx={{ color: '#151B26' }}>
              John Doe
            </Typography>
            <Typography variant="caption" sx={{ color: '#6C7A93' }}>
              Developer
            </Typography>
          </Box>
        </Stack>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      {isMobile && (
        <AppBar
          position="fixed"
          sx={{
            display: { md: 'none' },
            bgcolor: '#FFFFFF',
            color: 'text.primary',
            boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.08)',
            borderBottom: '1px solid #E4E7EB',
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <HiMenu size={24} />
            </IconButton>
            <Typography variant="h6" noWrap component="div" fontWeight={700}>
              DevTaskBoard
            </Typography>
          </Toolbar>
        </AppBar>
      )}
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              border: 'none',
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              border: 'none',
              borderRight: '1px solid #E4E7EB',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          mt: { xs: 7, md: 0 },
        }}
      >
        {children}
      </Box>
    </Box>
  );
}