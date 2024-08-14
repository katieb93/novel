// /Users/katiebrown/site-for-novels/src/publishing/PubSidebar.js

import React from 'react';
import { Drawer, List, ListItem, ListItemText } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom

const PubSidebar = ({ onAddSearchClick }) => {
  const drawerWidth = '25vw'; // 1/4 of the screen width
  const navigate = useNavigate(); // Hook for navigation

  const menuItems = [
    { text: 'Dashboard', path: '/publishing/PubDashboard' },
    { text: 'Profile', path: '/publishing/PubProfile' },
    // { text: 'Add Search', action: onAddSearchClick },
    { text: 'Add Search', action: onAddSearchClick, disabled: true }, // Disabled Add Search

    { text: 'Search Manuscripts', path: '/manuscriptSearch' },
  ];

  const handleNavigation = (path) => {
    navigate(path); // Use navigate to programmatically navigate
  };

  const currentPath = window.location.pathname; // Get the current path

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
      }}
    >
      <List>
        {menuItems.map((item, index) => {
          const isActive = item.path && currentPath === item.path;

          return (
            <ListItem
              key={index}
              button={!isActive && !item.disabled}
              component="div"
              onClick={() => item.path ? handleNavigation(item.path) : item.action && item.action()}
              disabled={item.disabled}
              sx={{
                backgroundColor: isActive ? 'primary.main' : 'transparent', // Highlight active item
                color: isActive ? '#fff' : 'inherit', // Change text color for active item
                fontWeight: isActive ? 'bold' : 'normal', // Bold for active item
                fontSize: isActive ? '1.2rem' : '1rem', // Increase font size for active item
                pointerEvents: isActive || item.disabled ? 'none' : 'auto',
                opacity: item.disabled ? 0.5 : 1,
                padding: isActive ? '12px 16px' : '8px 16px', // Increase padding for active item
                borderRadius: '4px', // Optional: add a border radius for the active item
              }}
            >
              <ListItemText primary={item.text} />
            </ListItem>
          );
        })}
      </List>
    </Drawer>
  );
};

export default PubSidebar;

