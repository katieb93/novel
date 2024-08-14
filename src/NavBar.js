import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Menu, MenuItem } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient'; // Adjust the import path as needed
import AccountCircle from '@mui/icons-material/AccountCircle';

const Navbar = () => {
    const [userType, setUserType] = useState(null);
    const [user, setUser] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null); // For the profile dropdown menu
    const [loginAnchorEl, setLoginAnchorEl] = useState(null); // For the login dropdown menu
    const [loading, setLoading] = useState(true); // New loading state
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserType = async () => {
            try {
                setLoading(true); // Start loading
                const { data: { user } } = await supabase.auth.getUser();

                if (!user) {
                    setUserType(null);
                    setUser(null);
                    setLoading(false); // Stop loading
                    return;
                }

                const { data: profileData, error } = await supabase
                    .from('profiles')
                    .select('user_type')
                    .eq('id', user.id)
                    .single();

                if (error) throw error;

                setUserType(profileData.user_type);
                setUser(user);
            } catch (error) {
                console.error('Error fetching user type:', error.message);
            } finally {
                setLoading(false); // Stop loading
            }
        };

        fetchUserType();

        // Listen for auth state changes
        const { data: authListener } = supabase.auth.onAuthStateChange(() => {
            fetchUserType();
        });

        // Clean up the auth listener on component unmount
        return () => {
            authListener?.subscription?.unsubscribe();
        };
    }, []);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLoginMenuOpen = (event) => {
        setLoginAnchorEl(event.currentTarget);
    };

    const handleLoginMenuClose = () => {
        setLoginAnchorEl(null);
    };

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error('Error logging out:', error.message);
        } else {
            setUser(null);
            setUserType(null);
            navigate('/'); // Redirect to home page after logout
        }
    };

    // If loading, don't render anything yet
    if (loading) {
        return null;
    }

    return (
        <AppBar position="static" sx={{ backgroundColor: '#333' }}>
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    NovelSite
                </Typography>

                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button color="inherit" component={Link} to="/">
                        Home
                    </Button>

                    {/* Dashboard Button - Conditionally redirect to the correct dashboard */}
                    {user && (
                        <Button
                            color="inherit"
                            component={Link}
                            to={userType === 1 ? "/authors/Dashboard" : "/publishing/PubDashboard"}
                        >
                            Dashboard
                        </Button>
                    )}

                    {user && (
                        <>
                            <IconButton
                                size="large"
                                edge="end"
                                color="inherit"
                                onClick={handleMenuOpen}
                            >
                                <AccountCircle />
                            </IconButton>
                            <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={handleMenuClose}
                                PaperProps={{
                                    elevation: 0,
                                    sx: {
                                        overflow: 'visible',
                                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                        mt: 1.5,
                                        '&:before': {
                                            content: '""',
                                            display: 'block',
                                            position: 'absolute',
                                            top: 0,
                                            right: 14,
                                            width: 10,
                                            height: 10,
                                            bgcolor: 'background.paper',
                                            transform: 'translateY(-50%) rotate(45deg)',
                                            zIndex: 0,
                                        },
                                    },
                                }}
                                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                            >
                                <MenuItem component={Link} to="/Account" onClick={handleMenuClose}>
                                    Account Settings
                                </MenuItem>
                                <MenuItem onClick={() => { handleLogout(); handleMenuClose(); }}>
                                    Sign out
                                </MenuItem>
                            </Menu>
                        </>
                    )}
                    
                    {!user && (
                        <>
                            <Button
                                color="inherit"
                                onClick={handleLoginMenuOpen}
                            >
                                Login
                            </Button>

                            <Menu
                                anchorEl={loginAnchorEl}
                                open={!user && Boolean(loginAnchorEl)}
                                onClose={handleLoginMenuClose}
                                PaperProps={{
                                    elevation: 0,
                                    sx: {
                                        overflow: 'visible',
                                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                        mt: 1.5,
                                        '&:before': {
                                            content: '""',
                                            display: 'block',
                                            position: 'absolute',
                                            top: 0,
                                            right: 14,
                                            width: 10,
                                            height: 10,
                                            bgcolor: 'background.paper',
                                            transform: 'translateY(-50%) rotate(45deg)',
                                            zIndex: 0,
                                        },
                                    },
                                }}
                                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                            >
                                <MenuItem component={Link} to="/authors/authorsLogIn" onClick={handleLoginMenuClose}>
                                    Author
                                </MenuItem>
                                <MenuItem component={Link} to="/publishing/publishingLogIn" onClick={handleLoginMenuClose}>
                                    Industry Member
                                </MenuItem>
                            </Menu>
                        </>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
