// useFetchGenreData.js
import { useEffect, useCallback } from 'react';
import supabase from '../supabaseClient';

const useFetchGenreData = (setGenreData) => {
  const fetchGenreData = useCallback(async () => {
    try {
      const [
        broadGenreData,
        categoryData,
        ageGroupData,
        fictionGenresData,
        nonFictionGenresData,
        // add other genre fetches
      ] = await Promise.all([
        supabase.from('genres.broad_genres').select('genre_name'),
        supabase.from('genres.categories').select('category_name'),
        supabase.from('genres.age_groups').select('age_group_name'),
        supabase.from('genres.fiction_genres').select('genre_name'),
        supabase.from('genres.non_fiction_genres').select('genre_name'),
        // add other genre fetches
      ]);

      // handle errors
      if (broadGenreData.error || categoryData.error || ageGroupData.error || fictionGenresData.error || nonFictionGenresData.error) {
        throw new Error('Error fetching genre data');
      }

      const broad_genre = broadGenreData.data.map((item) => ({ value: item.genre_name, label: item.genre_name }));
      const category = categoryData.data.map((item) => ({ value: item.category_name, label: item.category_name }));
      const age_group = ageGroupData.data.map((item) => ({ value: item.age_group_name, label: item.age_group_name }));
      const fiction_genres = fictionGenresData.data.map((item) => ({ value: item.genre_name, label: item.genre_name }));
      const non_fiction_genres = nonFictionGenresData.data.map((item) => ({ value: item.genre_name, label: item.genre_name }));

      setGenreData({
        broad_genre,
        category,
        age_group,
        fiction_genres,
        non_fiction_genres,
        // add other genres
      });
    } catch (err) {
      console.error('Error fetching genre data:', err);
    }
  }, [setGenreData]);

  useEffect(() => {
    fetchGenreData();
  }, [fetchGenreData]);
};

export default useFetchGenreData;
