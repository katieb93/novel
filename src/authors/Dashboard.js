// /Users/katiebrown/site-for-novels/src/authors/Dashboard.js

import React, { useEffect, useState } from 'react';
import { Box, Typography, Modal, Container } from '@mui/material';
import { supabase } from '../supabaseClient'; // Adjust the import path as needed
import CardCarousel from './CardCarousel'; // Adjust the import path as needed
import Sidebar from './AuthorSidebar';
import AddProject from './addProject'; // Adjust the import path as needed

const Dashboard = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [open, setOpen] = useState(false); // State to manage modal visibility

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                // Get the current user's ID asynchronously
                const { data: { user } } = await supabase.auth.getUser();

                if (!user) {
                    throw new Error("User not logged in");
                }

                // Fetch the user's profile data
                const { data: profileData, error: profileError } = await supabase
                    .from('profiles') // Assuming there is a 'profiles' table
                    .select('first_name, last_name')
                    .eq('id', user.id)
                    .single(); // Fetch the single profile matching the user's ID

                if (profileError) throw profileError;

                // Set the profile data
                setProfile(profileData);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, []);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
            {/* Sidebar on the left */}
            <Sidebar onAddProjectClick={handleOpen} />

            {/* Main content area */}
            <Box sx={{ flexGrow: 1, p: 3 }}>
                {/* Box for displaying user name in the top right corner */}
                {profile && (
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            mt: 3, // margin-top to separate from the carousel
                            position: 'relative',
                        }}
                    >
                        <Box
                            sx={{
                                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                                color: '#fff',
                                padding: '8px 16px',
                                borderRadius: '4px',
                            }}
                        >
                            <Typography variant="body1">
                                {profile.first_name} {profile.last_name}
                            </Typography>
                        </Box>
                    </Box>
                )}
                {/* Box for the Carousel */}
                <Box sx={{ mb: 3 }}>
                    <CardCarousel />
                </Box>

                {/* Modal for Add Project */}
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="add-project-modal-title"
                    aria-describedby="add-project-modal-description"
                    sx={{ overflow: 'auto' }} // Enable scrolling for the modal itself
                >
                    <Container
                        maxWidth="sm"
                        sx={{
                            mt: 5,
                            mb: 5,
                            backgroundColor: '#fff',
                            borderRadius: 2,
                            padding: 3,
                            maxHeight: '80vh', // Constrain height of the modal
                            overflowY: 'auto', // Enable scrolling within the modal
                        }}
                    >
                        <AddProject />
                    </Container>
                </Modal>
            </Box>
        </Box>
    );
};

export default Dashboard;
