import React, { useEffect, useState, useRef } from 'react';
import { Box, Typography, TextField, Button, Avatar, Modal, Container } from '@mui/material';
import { supabase } from '../supabaseClient';
import Sidebar from './AuthorSidebar';
import SocialMediaLinks from '../components/SocialMediaLinks';
import Credits from '../components/Credits';
import Awards from '../components/Awards';
import AddProject from './addProject'; // Adjust the import path as needed

const AuthorProfile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [open, setOpen] = useState(false); // State to manage modal visibility
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
                    bio: profile.bio,
                    website: profile.website,
                    twitter: profile.twitter,
                    linkedin: profile.linkedin,
                    facebook: profile.facebook,
                    instagram: profile.instagram,
                    threads: profile.threads,
                    tumblr: profile.tumblr,
                    avatar_url: profile.avatar_url
                })
                .eq('id', profile.id);

            if (error) throw error;

            setIsEditing(false);
            alert('Profile updated successfully!');
        } catch (error) {
            console.error('Error updating profile:', error.message);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
    };

    const handleEdit = () => {
        setIsEditing(true);
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
        <Box sx={{ display: 'flex', minHeight: '100vh', overflow: 'auto' }}>
            <Sidebar onAddProjectClick={handleOpen} />

            <Box sx={{ flexGrow: 1, p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', overflowY: 'auto' }}>
                {profile && (
                    <Box
                        sx={{ textAlign: 'center', mb: 2 }}
                    >
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

                <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                />

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

                <Box sx={{ mb: 2, maxWidth: 500, width: '100%' }}>
                    <Typography variant="h6">Bio</Typography>
                    {isEditing ? (
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
                    ) : (
                        <Typography variant="body1" sx={{ mb: 2 }}>
                            {profile.bio || 'No bio available.'}
                        </Typography>
                    )}
                </Box>

                <Box sx={{ mb: 2, maxWidth: 500, width: '100%' }}>
                    <Typography variant="h6">Website</Typography>
                    {isEditing ? (
                        <TextField
                            label="Website"
                            name="website"
                            variant="outlined"
                            fullWidth
                            sx={{ mb: 2 }}
                            value={profile.website || ''}
                            onChange={handleChange}
                        />
                    ) : (
                        <Typography variant="body1" sx={{ mb: 2 }}>
                            {profile.website || 'No website available.'}
                        </Typography>
                    )}
                </Box>

                {isEditing ? (
                    <>
                        <Credits 
                            profile={profile} 
                            onChange={handleChange} 
                            onSave={handleSave} 
                        />
                        <Awards 
                            profile={profile} 
                            onChange={handleChange} 
                            onSave={handleSave} 
                        />
                        <SocialMediaLinks 
                            profile={profile} 
                            onChange={handleChange} 
                            onSave={handleSave} 
                        />
                    </>
                ) : (
                    <>
                        <Credits profile={profile} />
                        <Awards profile={profile} />
                        <SocialMediaLinks profile={profile} />
                    </>
                )}

                {isEditing ? (
                    <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                        <Button variant="contained" color="primary" onClick={handleSave}>
                            Save
                        </Button>
                        <Button variant="outlined" color="secondary" onClick={handleCancel}>
                            Cancel
                        </Button>
                    </Box>
                ) : (
                    <Button variant="outlined" onClick={handleEdit} sx={{ mt: 2 }}>
                        Edit Profile
                    </Button>
                )}

                {/* Modal for Add Project */}
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="add-project-modal-title"
                    aria-describedby="add-project-modal-description"
                    sx={{ overflow: 'auto' }}
                >
                    <Container
                        maxWidth="sm"
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
                        <AddProject />
                    </Container>
                </Modal>
            </Box>
        </Box>
    );
};

export default AuthorProfile;
