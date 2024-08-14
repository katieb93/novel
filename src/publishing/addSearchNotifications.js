import { createClient } from '@supabase/supabase-js';
import React, { useState, useEffect, useCallback } from 'react';
import {
  Button,
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Autocomplete,
  TextField,
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';

import PubSearchSubGenres from '../search-components/PubSearchSubGenres';
import PubSearchBookTitles from '../search-components/PubSearchBookTitles';
import PubSearchAuthors from '../search-components/PubSearchAuthors';
import PubSearchMovieTitles from '../search-components/PubSearchMovieTitles';
import PubSearchTVTitles from '../search-components/PubSearchTVTitles';

const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const initializeFormState = () => {
  const categories = [
    'broad_genre',
    'category',
    'age_group',
    'fiction_genres',
    'fiction_specific_genres',
    'non_fiction_genres',
    'non_fiction_specific_genres',
    'selectedAuthors',
    'selectedMovieTitles',
    'selectedTVTitles',
    'selectedSubGenres',
    'selectedNovels',
  ];
  const initialState = {};
  categories.forEach((category) => {
    initialState[`${category}_must`] = [];
    initialState[`${category}_can`] = [];
    initialState[`${category}_exclude`] = [];
  });
  return initialState;
};

const transformLabel = (label) => {
  if (label === 'fiction_specific_genres') {
      return 'Specific Genres (Fiction)';
  }
  if (label === 'non_fiction_specific_genres') {
      return 'Specific Genres (Non-Fiction)';
  }
  if (label === 'category') {
      return 'Specific Genres (Non-Fiction)';
  }

  return label
      .replace('_', ' ')    // Replace underscores with spaces
      .replace(/\b\w/g, l => l.toUpperCase());  // Capitalize each word
};

const initializeCurrentSelections = () => {
  const categories = [
    'broad_genre',
    'category',
    'age_group',
    'fiction_genres',
    'fiction_specific_genres',
    'non_fiction_genres',
    'non_fiction_specific_genres',
    'selectedAuthors',
    'selectedMovieTitles',
    'selectedTVTitles',
    'selectedSubGenres',
    'selectedNovels',
  ];
  const initialSelections = {};
  categories.forEach((category) => {
    initialSelections[category] = { value: null, condition: 'must' };
  });
  return initialSelections;
};

const AddSearchNotifications = () => {
  const [formState, setFormState] = useState(initializeFormState());
  const [currentSelections, setCurrentSelections] = useState(initializeCurrentSelections());
  const [user, setUser] = useState(null);
  const [userSearches, setUserSearches] = useState([]);
  const [authorProjects, setAuthorProjects] = useState([]);
  const [genreData, setGenreData] = useState({});

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
  }, []);

  const fetchGenreData = useCallback(async () => {
    try {
      const tables = [
        'broad_genres',
        'categories',
        'age_groups',
        'fiction_genres',
        'non_fiction_genres',
        'fantasy',
        'mystery',
        'romance',
        'picture_book',
        'arts_entertainment',
        'current_events_social_issues',
        'food_lifestyle',
        'health_wellness',
        'history_military',
        'hobbies_interests',
        'home_garden',
        'reference_education',
        'relationships_personal_growth',
      ];

      const responses = await Promise.all(
        tables.map(async (table) => {
          let data = [];
          let error = null;

          if (table === 'age_groups') {
            ({ data, error } = await supabase.from(table).select('age_group_name'));
          } else {
            ({ data, error } = await supabase.from(table).select('genre_name'));
          }

          if (error) {
            console.error(`Error fetching ${table}:`, error.message);
          }

          return data || [];
        })
      );

      const genreMap = {
        broad_genre: responses[0],
        category: responses[1].map((item) => ({ value: item.genre_name, label: item.genre_name })),
        age_group: responses[2].map((item) => ({ value: item.age_group_name, label: item.age_group_name })),
        fiction_genres: responses[3],
        non_fiction_genres: responses[4],
        fiction_specific_genres: responses.slice(5, 9).flat(),
        non_fiction_specific_genres: responses.slice(9).flat(),
      };

      const mapGenres = (data) =>
        data.map((item) => ({ value: item.genre_name, label: item.genre_name }));

      setGenreData({
        broad_genre: mapGenres(genreMap.broad_genre),
        category: genreMap.category,
        age_group: genreMap.age_group,
        fiction_genres: mapGenres(genreMap.fiction_genres),
        fiction_specific_genres: mapGenres(genreMap.fiction_specific_genres),
        non_fiction_genres: mapGenres(genreMap.non_fiction_genres),
        non_fiction_specific_genres: mapGenres(genreMap.non_fiction_specific_genres),
      });
    } catch (err) {
      console.error('Error fetching genre data:', err);
    }
  }, []);

  useEffect(() => {
    fetchGenreData();
  }, [fetchGenreData]);

  const handleAddSelection = (type) => {
    const { value, condition } = currentSelections[type];
    if (value) {
      const key = `${type}_${condition}`;
      setFormState((prev) => ({
        ...prev,
        [key]: [...prev[key], value],
      }));
      setCurrentSelections((prev) => ({
        ...prev,
        [type]: { value: null, condition: 'must' },
      }));
    }
  };

  const handleSelect = (type, value) => {
    setCurrentSelections((prev) => ({
      ...prev,
      [type]: { ...prev[type], value: value ? value.label || value : null },
    }));
  };

  const handleConditionChange = (type, condition) => {
    setCurrentSelections((prev) => ({
      ...prev,
      [type]: { ...prev[type], condition },
    }));
  };

  const handleDeleteSelection = (type, index, condition) => {
    const key = `${type}_${condition}`;
    setFormState((prev) => ({
      ...prev,
      [key]: prev[key].filter((_, i) => i !== index),
    }));
  };

  const renderSelectedItems = (type) => (
    ['must', 'can', 'exclude'].map((condition) => (
      formState[`${type}_${condition}`].length > 0 && (
        <Box key={condition} mt={1} pl={2}>
          {formState[`${type}_${condition}`].map((item, index) => (
            <Box key={index} display="flex" alignItems="center">
              <Typography variant="body2" style={{ flexGrow: 1 }}>
                {typeof item === 'object' ? `${item.genre}: ${item.subGenre}` : item} ({condition})
              </Typography>
              <DeleteOutlineIcon
                style={{ cursor: 'pointer', color: 'red' }}
                onClick={() => handleDeleteSelection(type, index, condition)}
              />
            </Box>
          ))}
        </Box>
      )
    ))
  );

  const renderDropdownWithCondition = (label, type, options) => (
    <Box mb={2}>
      <Box display="flex" alignItems="center">
        <Autocomplete
          options={options || []}
          getOptionLabel={(option) => option.label}
          onChange={(event, value) => handleSelect(type, value)}
          renderInput={(params) => (
            <TextField {...params} label={transformLabel(label)} variant="outlined" />
          )}
          style={{ flexGrow: 1 }}
        />
        <FormControl margin="normal" style={{ marginLeft: 10 }}>
          <InputLabel>{transformLabel('Condition')}</InputLabel>
          <Select
            value={currentSelections[type]?.condition || 'must'}
            onChange={(e) => handleConditionChange(type, e.target.value)}
          >
            <MenuItem value="must">Must Include</MenuItem>
            <MenuItem value="can">Can Include</MenuItem>
            <MenuItem value="exclude">Exclude</MenuItem>
          </Select>
        </FormControl>
        <Button
          onClick={() => handleAddSelection(type)}
          variant="contained"
          color="primary"
          style={{ marginLeft: 10 }}
        >
          Add
        </Button>
      </Box>
      {renderSelectedItems(type)}
    </Box>
  );

  const renderSearchComponentWithCondition = (label, type, Component) => (
    <Box mb={1}>
      <Box display="flex" alignItems="center">
        <Component onSelect={(item) => handleSelect(type, item)} />
        <FormControl margin="normal" style={{ marginLeft: 10 }}>
          <InputLabel>{transformLabel('Condition')}</InputLabel>
          <Select
            value={currentSelections[type]?.condition || 'must'}
            onChange={(e) => handleConditionChange(type, e.target.value)}
          >
            <MenuItem value="must">Must Include</MenuItem>
            <MenuItem value="can">Can Include</MenuItem>
            <MenuItem value="exclude">Exclude</MenuItem>
          </Select>
        </FormControl>
        <Button
          onClick={() => handleAddSelection(type)}
          variant="contained"
          color="primary"
          style={{ marginLeft: 10 }}
        >
          Add
        </Button>
      </Box>
      {renderSelectedItems(type)}
    </Box>
  );

  // Matching function to check if a project matches the user's saved searches
  const matchesSearchCriteria = (project, search) => {
    // Implement your matching logic here
    // Example: check if the project's genre is in the search's must list
    if (search.broad_genre_must && !search.broad_genre_must.includes(project.genre)) {
      return false;
    }
    // Add more conditions as needed
    return true;
  };

  useEffect(() => {
    const subscribeToProjectInserts = async () => {
      // Get the user's searches from the database
      const { data: userSearches, error } = await supabase
        .from('pub_searches')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching user searches:', error.message);
        return;
      }

      // Subscribe to the 'projects' table for new inserts
      const subscription = supabase
        .from('projects')
        .on('INSERT', async (payload) => {
          const newProject = payload.new;

          // Check if the new project matches any of the user's searches
          userSearches.forEach(search => {
            if (matchesSearchCriteria(newProject, search)) {
              NotificationManager.success('A new project matches your search criteria!');
            }
          });
        })
        .subscribe();

      // Cleanup the subscription on component unmount
      return () => {
        supabase.removeSubscription(subscription);
      };
    };

    if (user) {
      subscribeToProjectInserts();
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const formatArrayForPostgres = (array) => {
            return array.length ? `{${array.map(item => `"${item}"`).join(',')}}` : '{}';
        };

        const searchPayload = {
            broad_genre_must: formatArrayForPostgres(formState.broad_genre_must),
            broad_genre_can: formatArrayForPostgres(formState.broad_genre_can),
            broad_genre_exclude: formatArrayForPostgres(formState.broad_genre_exclude),
            category_must: formatArrayForPostgres(formState.category_must),
            category_can: formatArrayForPostgres(formState.category_can),
            category_exclude: formatArrayForPostgres(formState.category_exclude),
            age_group_must: formatArrayForPostgres(formState.age_group_must),
            age_group_can: formatArrayForPostgres(formState.age_group_can),
            age_group_exclude: formatArrayForPostgres(formState.age_group_exclude),
            novel_comps_must: formatArrayForPostgres(formState.selectedNovels_must),
            novel_comps_can: formatArrayForPostgres(formState.selectedNovels_can),
            novel_comps_exclude: formatArrayForPostgres(formState.selectedNovels_exclude),
            author_comps_must: formatArrayForPostgres(formState.selectedAuthors_must),
            author_comps_can: formatArrayForPostgres(formState.selectedAuthors_can),
            author_comps_exclude: formatArrayForPostgres(formState.selectedAuthors_exclude),
            movie_comps_must: formatArrayForPostgres(formState.selectedMovieTitles_must),
            movie_comps_can: formatArrayForPostgres(formState.selectedMovieTitles_can),
            movie_comps_exclude: formatArrayForPostgres(formState.selectedMovieTitles_exclude),
            tv_comps_must: formatArrayForPostgres(formState.selectedTVTitles_must),
            tv_comps_can: formatArrayForPostgres(formState.selectedTVTitles_can),
            tv_comps_exclude: formatArrayForPostgres(formState.selectedTVTitles_exclude),
            sub_genres_must: formatArrayForPostgres(formState.selectedSubGenres_must),
            sub_genres_can: formatArrayForPostgres(formState.selectedSubGenres_can),
            sub_genres_exclude: formatArrayForPostgres(formState.selectedSubGenres_exclude),
            fiction_genre_must: formatArrayForPostgres(formState.fiction_genres_must),
            fiction_genre_can: formatArrayForPostgres(formState.fiction_genres_can),
            fiction_genre_exclude: formatArrayForPostgres(formState.fiction_genres_exclude),
            fiction_specific_genre_must: formatArrayForPostgres(formState.fiction_specific_genres_must),
            fiction_specific_genre_can: formatArrayForPostgres(formState.fiction_specific_genres_can),
            fiction_specific_genre_exclude: formatArrayForPostgres(formState.fiction_specific_genres_exclude),
            non_fiction_genre_must: formatArrayForPostgres(formState.non_fiction_genres_must),
            non_fiction_genre_can: formatArrayForPostgres(formState.non_fiction_genres_can),
            non_fiction_genre_exclude: formatArrayForPostgres(formState.non_fiction_genres_exclude),
            non_fiction_specific_genre_must: formatArrayForPostgres(formState.non_fiction_specific_genres_must),
            non_fiction_specific_genre_can: formatArrayForPostgres(formState.non_fiction_specific_genres_can),
            non_fiction_specific_genre_exclude: formatArrayForPostgres(formState.non_fiction_specific_genres_exclude),
            user_id: user.id,
        };

        const { data: searchData, error: insertError } = await supabase.from('pub_searches').insert([searchPayload]).select();
        if (insertError) throw insertError;

        const searchId = searchData[0].id;

        const { data: projects, error: searchError } = await supabase.rpc('search_projects', { search_id: searchId });

        if (searchError) throw searchError;

        setAuthorProjects(projects);

    } catch (error) {
        console.error('Error during search operation:', error.message);
    }
  };

  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            minHeight="100vh"
          >
            <form
              onSubmit={handleSubmit}
              style={{ width: '100%', maxWidth: '600px' }}
            >
              {Object.keys(genreData).map((type) =>
                renderDropdownWithCondition(
                  transformLabel(type),
                  type,
                  genreData[type]
                )
              )}

              {renderSearchComponentWithCondition('Book Titles', 'selectedNovels', PubSearchBookTitles)}
              {renderSearchComponentWithCondition('Authors', 'selectedAuthors', PubSearchAuthors)}
              {renderSearchComponentWithCondition('Movie Titles', 'selectedMovieTitles', PubSearchMovieTitles)}
              {renderSearchComponentWithCondition('TV Titles', 'selectedTVTitles', PubSearchTVTitles)}
              {renderSearchComponentWithCondition('Sub Genres', 'selectedSubGenres', PubSearchSubGenres)}

              <Box textAlign="center">
                <Button type="submit" variant="contained" color="primary">
                  Submit
                </Button>
              </Box>
            </form>

            <Box mt={4} width="100%">
              <Typography variant="h6" gutterBottom>
                Your Searches
              </Typography>
              {userSearches.length > 0 ? (
                userSearches.map((search) => (
                  <Paper
                    key={search.id}
                    style={{ marginBottom: '10px', padding: '10px' }}
                  >
                    {Object.keys(search)
                      .filter((key) => key.endsWith('must') || key.endsWith('can') || key.endsWith('exclude'))
                      .map((key) => (
                        <Typography key={key}>
                          <strong>{key.replace(/_/g, ' ')}:</strong> {search[key].join(', ')}
                        </Typography>
                      ))}
                    <Button
                      onClick={() => console.log(search)}
                      variant="contained"
                      color="primary"
                    >
                      Search Projects
                    </Button>
                  </Paper>
                ))
              ) : (
                <Typography>No searches found.</Typography>
              )}
            </Box>

            <Box mt={4} width="100%">
              <Typography variant="h6" gutterBottom>
                Author Projects
              </Typography>
              {authorProjects.length > 0 ? (
                authorProjects.map((project) => (
                  <Paper
                    key={project.id}
                    style={{ marginBottom: '10px', padding: '10px' }}
                  >
                    {Object.entries(project).map(([key, value]) => (
                      <Typography key={key}>
                        <strong>{key.replace(/_/g, ' ')}:</strong> {Array.isArray(value) ? value.join(', ') : value}
                      </Typography>
                    ))}
                  </Paper>
                ))
              ) : (
                <Typography>No author projects found.</Typography>
              )}
            </Box>
          </Box>
        </Grid>
      </Grid>
      <NotificationContainer />
    </Container>
  );
};

export default AddSearchNotifications;
