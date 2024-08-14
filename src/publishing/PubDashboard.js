import React, { useEffect, useState } from 'react';
import { Box, Typography, Modal, Container } from '@mui/material';
import { supabase } from '../supabaseClient';
import PubSidebar from './PubSidebar';
import AddSearch from './addSearch';
import PubBookmarks from './PubBookmarks';
import PubLikes from './PubLikes';

const PubDashboard = () => {
    const [profile, setProfile] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [open, setOpen] = useState(false);
    const [userInteractions, setUserInteractions] = useState({});

    useEffect(() => {
        const fetchUserProfileAndSearches = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();

                if (!user) {
                    throw new Error("User not logged in");
                }

                setUser(user);

                const { data: profileData, error: profileError } = await supabase
                    .from('profiles')
                    .select('first_name, last_name')
                    .eq('id', user.id)
                    .single();

                if (profileError) throw profileError;

                setProfile(profileData);

                const { data: interactions, error: interactionsError } = await supabase
                    .from('user_interactions')
                    .select('project_id, is_bookmarked, is_liked')
                    .eq('user_id', user.id);

                if (interactionsError) throw interactionsError;

                const interactionMap = {};
                interactions.forEach(interaction => {
                    interactionMap[interaction.project_id] = {
                        isBookmarked: interaction.is_bookmarked,
                        isLiked: interaction.is_liked,
                    };
                });

                setUserInteractions(interactionMap);

            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfileAndSearches();
    }, []);

    const handleInteractionChange = (projectId, interactionType, isActive) => {
        setUserInteractions(prevState => ({
            ...prevState,
            [projectId]: {
                ...prevState[projectId],
                [interactionType === 'bookmark' ? 'isBookmarked' : 'isLiked']: isActive,
            }
        }));
    };

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
            <PubSidebar onAddSearchClick={handleOpen} />

            <Box sx={{ flexGrow: 1, p: 3, overflowY: 'auto' }}>
                <Typography variant="h4" gutterBottom>
                    Publishing Dashboard
                </Typography>

                {profile && (
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            mt: 3,
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

                {user && (
                    <>
                        <PubBookmarks
                            userId={user.id}
                            userInteractions={userInteractions}
                            onInteractionChange={handleInteractionChange}
                        />
                        <PubLikes
                            userId={user.id}
                            userInteractions={userInteractions}
                            onInteractionChange={handleInteractionChange}
                        />
                    </>
                )}

                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="add-search-modal-title"
                    aria-describedby="add-search-modal-description"
                    sx={{ overflow: 'auto' }}
                >
                    <Container
                        maxWidth="md"
                        sx={{
                            mt: 5,
                            mb: 5,
                            backgroundColor: '#fff',
                            borderRadius: 2,
                            padding: 3,
                            maxHeight: '80vh',
                            overflowY: 'auto',
                        }}
                    >
                        <AddSearch />
                    </Container>
                </Modal>
            </Box>
        </Box>
    );
};

export default PubDashboard;
