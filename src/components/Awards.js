import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';
import { supabase } from '../supabaseClient'; // Adjust the import path as needed

const Awards = ({ profileId, readOnly }) => {
    const [awardDetails, setAwardDetails] = useState({
        award_name: '',
        organization: '',
        year_awarded: '',
        description: '',
    });

    const [savedAwards, setSavedAwards] = useState([]);

    useEffect(() => {
        if (readOnly && profileId) {
            const fetchAwards = async () => {
                try {
                    const { data: awardsData, error } = await supabase
                        .from('awards')
                        .select('*')
                        .eq('profile_id', profileId);

                    if (error) throw error;

                    setSavedAwards(awardsData);
                } catch (error) {
                    console.error('Error fetching awards:', error.message);
                }
            };

            fetchAwards();
        }
    }, [profileId, readOnly]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setAwardDetails({
            ...awardDetails,
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
                .from('awards')
                .insert([
                    {
                        user_id: user.id,
                        profile_id: profileId,
                        ...awardDetails,
                    },
                ]);

            if (insertError) throw insertError;

            alert('Award added successfully!');
        } catch (error) {
            console.error(error.message);
        }
    };

    if (readOnly) {
        // Display saved awards in read-only mode
        return (
            <Box sx={{ mt: 4 }}>
                <Typography variant="h6" gutterBottom>
                    Awards
                </Typography>
                {savedAwards.length === 0 ? (
                    <Typography variant="body1">No awards available.</Typography>
                ) : (
                    savedAwards.map((award, index) => (
                        <Box key={index} sx={{ mb: 2 }}>
                            <Typography variant="body1"><strong>{award.award_name}</strong></Typography>
                            <Typography variant="body2">Organization: {award.organization || 'N/A'}</Typography>
                            <Typography variant="body2">Year Awarded: {award.year_awarded || 'N/A'}</Typography>
                            <Typography variant="body2">{award.description}</Typography>
                        </Box>
                    ))
                )}
            </Box>
        );
    }

    // Editable mode
    return (
        <Box component="form" onSubmit={handleFormSubmit} sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
                Add Award
            </Typography>
            <TextField
                label="Award Name"
                name="award_name"
                value={awardDetails.award_name}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                required
            />
            <TextField
                label="Organization"
                name="organization"
                value={awardDetails.organization}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Year Awarded"
                name="year_awarded"
                type="number"
                value={awardDetails.year_awarded}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Description"
                name="description"
                value={awardDetails.description}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
            />
            <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                Save Award
            </Button>
        </Box>
    );
};

export default Awards;
