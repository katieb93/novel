import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient'; // Adjust the import path as needed

export const useProfile = () => {
    const [profile, setProfile] = useState({
        firstName: '',
        lastName: '',
        email: '',
        bio: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();

                if (!user) {
                    throw new Error("User not logged in");
                }

                const { data: profileData, error: profileError } = await supabase
                    .from('profiles')
                    .select('first_name, last_name, email, bio')
                    .eq('id', user.id)
                    .single();

                if (profileError) throw profileError;

                setProfile({
                    firstName: profileData.first_name,
                    lastName: profileData.last_name,
                    email: profileData.email,
                    bio: profileData.bio || ''
                });
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, []);

    return { profile, loading, error, setProfile };
};
