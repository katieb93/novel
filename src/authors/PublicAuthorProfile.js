import React, { useEffect, useState } from 'react';
import { Box, Typography, Avatar } from '@mui/material';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import SocialMediaLinks from '../components/SocialMediaLinks';
import Credits from '../components/Credits';
import Awards from '../components/Awards';

const PublicAuthorProfile = () => {
    const { name } = useParams(); // Get the author's name from the URL
    const [profiles, setProfiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserProfiles = async () => {
            try {
                const nameParts = name.split(' ');
                const firstName = nameParts[0];
                const lastName = nameParts.slice(1).join(' ');

                const { data: profilesData, error: profilesError } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('first_name', firstName)
                    .eq('last_name', lastName);

                if (profilesError) throw profilesError;

                setProfiles(profilesData);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfiles();
    }, [name]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (profiles.length === 0) {
        return <div>No profiles found.</div>;
    }

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', flexDirection: 'column', alignItems: 'center', p: 3 }}>
            {profiles.map((profile, index) => (
                <Box key={index} sx={{ mb: 4 }}>
                    <Avatar 
                        alt={`${profile.first_name} ${profile.last_name}`} 
                        src={profile.avatar_url || ''}
                        sx={{ width: 100, height: 100, mb: 2 }}
                    >
                        {!profile.avatar_url && `${profile.first_name[0]}${profile.last_name[0]}`}
                    </Avatar>

                    <Typography variant="h4" sx={{ mb: 2 }}>
                        {profile.first_name} {profile.last_name}
                    </Typography>

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
                            {profile.bio || 'No bio available.'}
                        </Typography>
                    </Box>

                    <Box sx={{ mb: 2, maxWidth: 500, width: '100%' }}>
                        <Typography variant="h6">Website</Typography>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                            {profile.website || 'No website available.'}
                        </Typography>
                    </Box>

                    <Credits profileId={profile.id} readOnly />
                    <Awards profileId={profile.id} readOnly />
                    <SocialMediaLinks profile={profile} readOnly />
                </Box>
            ))}
        </Box>
    );
};

export default PublicAuthorProfile;
