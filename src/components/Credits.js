import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';
import { supabase } from '../supabaseClient'; // Adjust the import path as needed

const Credits = ({ profileId, readOnly }) => {
    const [creditDetails, setCreditDetails] = useState({
        credit_type: '',
        title: '',
        description: '',
        date_awarded: '',
    });

    const [savedCredits, setSavedCredits] = useState([]);

    useEffect(() => {
        if (readOnly && profileId) {
            const fetchCredits = async () => {
                try {
                    const { data: creditsData, error } = await supabase
                        .from('credits')
                        .select('*')
                        .eq('profile_id', profileId);

                    if (error) throw error;

                    setSavedCredits(creditsData);
                } catch (error) {
                    console.error('Error fetching credits:', error.message);
                }
            };

            fetchCredits();
        }
    }, [profileId, readOnly]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCreditDetails({
            ...creditDetails,
            [name]: value,
        });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                throw new Error("User not logged in");
            }

            const { error: insertError } = await supabase
                .from('credits')
                .insert([
                    {
                        user_id: user.id,
                        profile_id: profileId,
                        ...creditDetails,
                    },
                ]);

            if (insertError) throw insertError;

            alert('Credit added successfully!');
        } catch (error) {
            console.error(error.message);
        }
    };

    if (readOnly) {
        return (
            <Box sx={{ mt: 4 }}>
                <Typography variant="h6" gutterBottom>
                    Credits
                </Typography>
                {savedCredits.length === 0 ? (
                    <Typography variant="body1">No credits available.</Typography>
                ) : (
                    savedCredits.map((credit, index) => (
                        <Box key={index} sx={{ mb: 2 }}>
                            <Typography variant="body1"><strong>{credit.title}</strong></Typography>
                            <Typography variant="body2">Type: {credit.credit_type || 'N/A'}</Typography>
                            <Typography variant="body2">Date Awarded: {credit.date_awarded || 'N/A'}</Typography>
                            <Typography variant="body2">{credit.description}</Typography>
                        </Box>
                    ))
                )}
            </Box>
        );
    }

    return (
        <Box component="form" onSubmit={handleFormSubmit} sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
                Add Credit
            </Typography>
            <TextField
                label="Credit Type"
                name="credit_type"
                value={creditDetails.credit_type}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                required
            />
            <TextField
                label="Title"
                name="title"
                value={creditDetails.title}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                required
            />
            <TextField
                label="Description"
                name="description"
                value={creditDetails.description}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Date Awarded"
                name="date_awarded"
                type="date"
                value={creditDetails.date_awarded}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                InputLabelProps={{
                    shrink: true,
                }}
            />
            <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                Save Credit
            </Button>
        </Box>
    );
};

export default Credits;
