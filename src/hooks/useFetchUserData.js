// useFetchUserData.js
import { useEffect } from 'react';
import supabase from '../supabaseClient';

const useFetchUserData = (setUser) => {
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: userData, error } = await supabase.auth.getUser();
        if (error) throw error;
        setUser(userData.user);
      } catch (error) {
        console.error('Error fetching user:', error.message);
      }
    };

    fetchUserData();
  }, [setUser]);
};

export default useFetchUserData;
