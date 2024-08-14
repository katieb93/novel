import React, { useEffect, useState, useRef } from 'react';
import { Box, Typography, TextField, Button, Avatar } from '@mui/material';
import { supabase } from '../supabaseClient'; // Adjust the import path as needed
import Sidebar from './PubSidebar';
import SocialMediaLinks from '../components/SocialMediaLinks';
import ClientsTitles from '../components/ClientsTitles';
import Awards from '../components/Awards';

const PubProfile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);

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

                setProfile(profileData);
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

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                throw new Error("User not logged in");
            }

            const { error: uploadError } = await supabase.storage
                .from('avatar_photos')
                .upload(`${user.id}/${file.name}`, file);

            if (uploadError) throw uploadError;

            const { data: publicData, error: publicUrlError } = supabase.storage
                .from('avatar_photos')
                .getPublicUrl(`${user.id}/${file.name}`);

            if (publicUrlError) throw publicUrlError;

            const avatarUrl = publicData.publicUrl;

            const { error } = await supabase
                .from('profiles')
                .update({ avatar_url: avatarUrl })
                .eq('id', user.id);

            if (error) throw error;

            setProfile(prevProfile => ({
                ...prevProfile,
                avatar_url: avatarUrl,
            }));

            alert('Avatar updated successfully!');
        } catch (error) {
            console.error('Error uploading avatar:', error.message);
        }
    };

    const handleAvatarClick = () => {
        fileInputRef.current.click();
    };

    const handleSave = async () => {
        try {
            const { error } = await supabase
                .from('profiles')
                .update({
                    website: profile.website,
                    twitter: profile.twitter,
                    linkedin: profile.linkedin,
                    facebook: profile.facebook,
                    instagram: profile.instagram,
                    threads: profile.threads,
                    tumblr: profile.tumblr,
                    bio: profile.bio,
                    avatar_url: profile.avatar_url
                })
                .eq('id', profile.id);

            if (error) throw error;

            alert('Profile updated successfully!');
        } catch (error) {
            console.error('Error updating profile:', error.message);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', overflow: 'auto' }}>
            {/* Sidebar on the left */}
            <Sidebar />

            {/* Main content area */}
            <Box sx={{ flexGrow: 1, p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', overflowY: 'auto' }}>
                {/* Avatar */}
                {profile && (
                    <Box sx={{ textAlign: 'center', mb: 2 }}>
                        <Avatar 
                            alt={`${profile.first_name} ${profile.last_name}`} 
                            src={profile.avatar_url || ''}
                            sx={{ width: 100, height: 100, cursor: 'pointer' }}
                            onClick={handleAvatarClick}
                        >
                            {!profile.avatar_url && `${profile.first_name[0]}${profile.last_name[0]}`}
                        </Avatar>
                        <Button
                            variant="contained"
                            color="primary"
                            sx={{ mt: 1 }}
                            onClick={handleAvatarClick}
                        >
                            {profile.avatar_url ? 'Change Photo' : 'Add Photo'}
                        </Button>
                    </Box>
                )}

                {/* Hidden File Input */}
                <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                />

                {/* User Name */}
                {profile && (
                    <Box
                        sx={{
                            backgroundColor: 'rgba(0, 0, 0, 0.7)',
                            color: '#fff',
                            padding: '8px 16px',
                            borderRadius: '4px',
                            mb: 2,
                        }}
                    >
                        <Typography variant="body1">
                            {profile.first_name} {profile.last_name}
                        </Typography>
                    </Box>
                )}

                {/* Editable Bio Textbox */}
                <Box sx={{ mb: 2, maxWidth: 500, width: '100%' }}>
                    <Typography variant="h6">About Me</Typography>
                    <TextField
                        name="bio"
                        multiline
                        rows={4}
                        value={profile.bio || ''}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        sx={{ mb: 2 }}
                    />
                </Box>

                {/* Other profile sections */}
                <ClientsTitles 
                    profile={profile} 
                    onChange={handleChange} 
                    onSave={handleSave} 
                />

                <Awards 
                    profile={profile} 
                    onChange={handleChange} 
                    onSave={handleSave} 
                />

                <TextField
                    label="Website"
                    name="website"
                    variant="outlined"
                    fullWidth
                    sx={{ mb: 2, maxWidth: 500 }}
                    value={profile.website || ''}
                    onChange={handleChange}
                />

                <SocialMediaLinks 
                    profile={profile} 
                    onChange={handleChange} 
                    onSave={handleSave} 
                />

                {/* Save Button for Profile */}
                <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={handleSave}
                    sx={{ mt: 2 }}
                >
                    Save Profile
                </Button>
            </Box>
        </Box>
    );
};

export default PubProfile;
