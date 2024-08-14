import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';
import { Twitter, LinkedIn, Facebook, Instagram, Reddit } from '@mui/icons-material'; // Import icons for social media
import { supabase } from '../supabaseClient'; // Adjust the import path as needed

const SocialMediaLinks = ({ profile, readOnly }) => {
    const [socialLinks, setSocialLinks] = useState({
        twitter: '',
        linkedin: '',
        facebook: '',
        instagram: '',
        threads: '',
    });

    useEffect(() => {
        if (profile) {
            setSocialLinks({
                twitter: profile.twitter || '',
                linkedin: profile.linkedin || '',
                facebook: profile.facebook || '',
                instagram: profile.instagram || '',
                threads: profile.threads || '',
            });
        }
    }, [profile]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSocialLinks({
            ...socialLinks,
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

            const { error: updateError } = await supabase
                .from('profiles')
                .update(socialLinks)
                .eq('id', user.id);

            if (updateError) throw updateError;

            alert('Profile updated successfully!');
        } catch (error) {
            console.error(error.message);
        }
    };

    const renderSocialMediaLink = (icon, handle) => (
        handle ? (
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }} key={handle}>
                {icon}
                <Typography variant="body2" sx={{ ml: 1 }}>
                    {handle}
                </Typography>
            </Box>
        ) : null
    );

    if (readOnly) {
        return (
            <Box sx={{ mt: 2 }}>
                <Typography variant="h6" gutterBottom>
                    Social Media
                </Typography>
                <Box>
                    {renderSocialMediaLink(<Twitter fontSize="small" />, socialLinks.twitter)}
                    {renderSocialMediaLink(<LinkedIn fontSize="small" />, socialLinks.linkedin)}
                    {renderSocialMediaLink(<Facebook fontSize="small" />, socialLinks.facebook)}
                    {renderSocialMediaLink(<Instagram fontSize="small" />, socialLinks.instagram)}
                    {renderSocialMediaLink(<Reddit fontSize="small" />, socialLinks.threads)}
                </Box>
            </Box>
        );
    }

    return (
        <Box sx={{ mt: 2 }}>
            <Box component="form" onSubmit={handleFormSubmit} sx={{ mt: 4 }}>
                <Typography variant="h6" gutterBottom>
                    Update Social Media Links
                </Typography>
                <TextField
                    label="Twitter"
                    name="twitter"
                    value={socialLinks.twitter}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="LinkedIn"
                    name="linkedin"
                    value={socialLinks.linkedin}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Facebook"
                    name="facebook"
                    value={socialLinks.facebook}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Instagram"
                    name="instagram"
                    value={socialLinks.instagram}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Threads"
                    name="threads"
                    value={socialLinks.threads}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                />
                <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                    Save
                </Button>
            </Box>
        </Box>
    );
};

export default SocialMediaLinks;
