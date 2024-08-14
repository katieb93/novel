
// /Users/katiebrown/site-for-novels/src/Account.js

import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, Divider } from '@mui/material';
import { supabase } from './supabaseClient'; // Adjust the import path as needed

const Account = () => {
    const [profile, setProfile] = useState({
        first_name: '',
        middle_name: '',
        last_name: '',
        email: '',
        password: '',
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();

                if (!user) {
                    throw new Error("User not logged in");
                }

                const { data: profileData, error: profileError } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single();

                if (profileError) throw profileError;

                setProfile({
                    first_name: profileData.first_name || '',
                    middle_name: profileData.middle_name || '',
                    last_name: profileData.last_name || '',
                    email: user.email || '',
                });
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile(prevProfile => ({
            ...prevProfile,
            [name]: value
        }));
    };

    const handleSave = async () => {
        try {
            const { error } = await supabase
                .from('profiles')
                .update({
                    first_name: profile.first_name,
                    middle_name: profile.middle_name,
                    last_name: profile.last_name,
                })
                .eq('id', profile.id);

            if (error) throw error;

            if (profile.email !== '') {
                const { error: updateEmailError } = await supabase.auth.updateUser({
                    email: profile.email,
                });

                if (updateEmailError) throw updateEmailError;
            }

            if (profile.password !== '') {
                const { error: updatePasswordError } = await supabase.auth.updateUser({
                    password: profile.password,
                });

                if (updatePasswordError) throw updatePasswordError;
            }

            setIsEditing(false); // Exit edit mode after saving
            alert('Account updated successfully!');
        } catch (error) {
            console.error('Error updating account:', error.message);
        }
    };

    const handleCancel = () => {
        setIsEditing(false); // Exit edit mode without saving changes
    };

    const handleEdit = () => {
        setIsEditing(true); // Enter edit mode
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <Box sx={{ maxWidth: 500, mx: 'auto', mt: 4 }}>
            <Typography variant="h4" gutterBottom>Account Information</Typography>
            <Divider sx={{ mb: 2 }} />

            <Box sx={{ mb: 2 }}>
                <Typography variant="h6">First Name</Typography>
                {isEditing ? (
                    <TextField
                        name="first_name"
                        value={profile.first_name}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                    />
                ) : (
                    <Typography variant="body1">{profile.first_name}</Typography>
                )}
            </Box>

            <Box sx={{ mb: 2 }}>
                <Typography variant="h6">Middle Name</Typography>
                {isEditing ? (
                    <TextField
                        name="middle_name"
                        value={profile.middle_name}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                    />
                ) : (
                    <Typography variant="body1">{profile.middle_name || 'N/A'}</Typography>
                )}
            </Box>

            <Box sx={{ mb: 2 }}>
                <Typography variant="h6">Last Name</Typography>
                {isEditing ? (
                    <TextField
                        name="last_name"
                        value={profile.last_name}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                    />
                ) : (
                    <Typography variant="body1">{profile.last_name}</Typography>
                )}
            </Box>

            <Box sx={{ mb: 2 }}>
                <Typography variant="h6">Email</Typography>
                {isEditing ? (
                    <TextField
                        name="email"
                        value={profile.email}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                    />
                ) : (
                    <Typography variant="body1">{profile.email}</Typography>
                )}
            </Box>

            {isEditing && (
                <Box sx={{ mb: 2 }}>
                    <Typography variant="h6">Password</Typography>
                    <TextField
                        name="password"
                        type="password"
                        value={profile.password}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                    />
                </Box>
            )}

            {isEditing ? (
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Button variant="contained" color="primary" onClick={handleSave}>
                        Save
                    </Button>
                    <Button variant="outlined" color="secondary" onClick={handleCancel}>
                        Cancel
                    </Button>
                </Box>
            ) : (
                <Button variant="outlined" onClick={handleEdit}>
                    Edit Account
                </Button>
            )}
        </Box>
    );
};

export default Account;
