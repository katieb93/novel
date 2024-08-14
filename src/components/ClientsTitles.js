import React, { useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';
import { supabase } from '../supabaseClient'; // Adjust the import path as needed

const ClientsTitles = ({ profileId }) => {
    const [clientDetails, setClientDetails] = useState({
        book_title: '',
        author_name: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setClientDetails({
            ...clientDetails,
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
                .from('clients_and_titles')
                .insert([
                    {
                        user_id: user.id,
                        profile_id: profileId,
                        ...clientDetails,
                    },
                ]);

            if (insertError) throw insertError;

            alert('Client and Title added successfully!');
        } catch (error) {
            console.error(error.message);
        }
    };

    return (
        <Box component="form" onSubmit={handleFormSubmit} sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
                Add Client and Title
            </Typography>
            <TextField
                label="Book Title"
                name="book_title"
                value={clientDetails.book_title}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                required
            />
            <TextField
                label="Author Name"
                name="author_name"
                value={clientDetails.author_name}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                required
            />
            <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                Save Client and Title
            </Button>
        </Box>
    );
};

export default ClientsTitles;
