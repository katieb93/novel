import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Box,
  Container,
  Grid,
  Paper,
  Typography
} from '@mui/material';
import SearchGenres from '../search-components/SearchGenres';
import SearchSubGenres from '../search-components/searchSubGenres';
import SearchBookTitles from '../search-components/SearchBooksTitles';
import SearchAuthors from '../search-components/SearchAuthors';
import SearchMovieTitles from '../search-components/SearchMovieTitles';
import SearchTVTitles from '../search-components/SearchTVTitles';

import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

const AddProject = () => {
  const [formState, setFormState] = useState({
    broad_genre: '',
    category: '',
    age_group: [],
    genre: [],
    specific_genre: [],
    title: '',
    logline: '',
    synopsis: '',
    selectedAuthors: [],
    selectedMovieTitles: [],
    selectedTVTitles: [],
    selectedSubGenres: [],
    projectPDF: null,
  });

  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [userProjects, setUserProjects] = useState([]);

  console.log("userProjects", userProjects)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) throw error;
        setUser(user);
        fetchUserProjects(user.id);
      } catch (error) {
        console.error('Error fetching user:', error.message);
      }
    };
    fetchUserData();
  }, []);

  const fetchUserProjects = async (userId) => {
    try {
      const { data, error } = await supabase
        // .from('author_projects')
        .from('projects_author')

        .select('*')
        .eq('user_id', userId);
      if (error) throw error;
      setUserProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error.message);
    }
  };

  const firstName = user?.user_metadata?.first_name || '';
  const lastName = user?.user_metadata?.last_name || '';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState(prevState => ({ ...prevState, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormState(prevState => ({ ...prevState, projectPDF: e.target.files[0] }));
  };

  const handleSelect = (type, item) => {
    setFormState(prevState => ({
      ...prevState,
      [type]: Array.isArray(prevState[type]) ? [...prevState[type], item] : [item]
    }));
  };

  const handleManuscriptSearchClick = () => {
    navigate('/manuscriptSearch');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {

      let pdfUrl = null;

      console.log("CHIRP", formState)
      if (formState.projectPDF) {


        const { error: uploadError } = await supabase.storage
          .from('author_docs')
          .upload(`${user.id}/${formState.projectPDF.name}`, formState.projectPDF);
        if (uploadError) throw uploadError;
        
        // console.log("BLUSH", publicURL)

        const { data: publicData, error: publicUrlError } = supabase.storage
          .from('author_docs')
          .getPublicUrl(`${user.id}/${formState.projectPDF.name}`);
        pdfUrl = publicData.publicUrl;

        if (publicUrlError) throw publicUrlError;
        // console.log("SNACK TWO", publicUrlError)
        // console.log("SNACK one", pdfUrl)
        // pdfUrl = publicURL;
        console.log("SNACK", pdfUrl)
      }


      const formatArray = (arr) => `{${(arr || []).map(item => `"${item.replace(/"/g, '\\"')}"`).join(',')}}`;
      const broadGenreString = formatArray(formState.broad_genre);
      const categoryString = formatArray(formState.category);  
      const ageGroupString = formatArray(formState.age_group);
      const genreString = formatArray(formState.genre);
      const specificGenreString = formatArray(formState.specific_genre);
      const novelCompsString = formatArray(formState.selectedBookTitles);
      const authorCompsString = formatArray(formState.selectedAuthors);
      const movieCompsString = formatArray(formState.selectedMovieTitles);
      const tvCompsString = formatArray(formState.selectedTVTitles);
      const subGenresString = formatArray(formState.selectedSubGenres.map(subGenre => `${subGenre.genre}:${subGenre.subGenre}`));
  
      const checkSubsData = {
        broad_genre: broadGenreString,
        category: categoryString,
        age_group: ageGroupString,
        genre: genreString,
        specific_genre: specificGenreString,
        novel_comps: novelCompsString,

        title: formState.title,
        logline: formState.logline,
        synopsis: formState.synopsis,


        author_comps: authorCompsString,
        movie_comps: movieCompsString,
        tv_comps: tvCompsString,

        sub_genres: subGenresString,
        user_id: user.id,

        pdf_url: pdfUrl,

      };
  
      const { data, error } = await supabase
        .from('projects_author')
        .insert([checkSubsData])
        .select();
  
      if (error) throw error;
  
      fetchUserProjects(user.id);
      console.log('Sub-genres inserted successfully:', data);
    } catch (error) {
      console.error('Error inserting sub-genres:', error.message, error);
    }
  };


  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="100vh">
            <Typography variant="h5" gutterBottom>
              Welcome, {firstName} {lastName}!
            </Typography>
            <Button variant="contained" color="primary" onClick={handleManuscriptSearchClick} sx={{ mt: 2 }}>
              Manuscript Search
            </Button>
            <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '600px' }}>
              <Box mb={2}>
                <Paper style={{ maxHeight: '200px', overflow: 'auto' }}>
                  <SearchGenres
                    onSelect={selectedGenres => setFormState(prevState => ({ ...prevState, ...selectedGenres }))}
                    setFormState={setFormState}
                    formState={formState}
                  />
                </Paper>
              </Box>
              <Box mb={4}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Title"
                  name="title"
                  value={formState.title}
                  onChange={handleChange}
                />
              </Box>
              <Box mb={4}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Logline"
                  name="logline"
                  value={formState.logline}
                  onChange={handleChange}
                />
              </Box>
              <Box mb={4}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Synopsis"
                  name="synopsis"
                  value={formState.synopsis}
                  onChange={handleChange}
                />
              </Box>
              <Box mb={1}>
                <SearchBookTitles width="600px" onSelect={bookTitle => handleSelect('selectedBookTitles', bookTitle)} />
              </Box>
              <Box mb={1}>
                <SearchAuthors width="600px" onSelect={author => handleSelect('selectedAuthors', author)} />
              </Box>
              <Box mb={1}>
                <SearchMovieTitles width="600px" onSelect={movieTitle => handleSelect('selectedMovieTitles', movieTitle)} />
              </Box>
              <Box mb={1}>
                <SearchTVTitles width="600px" onSelect={TVTitle => handleSelect('selectedTVTitles', TVTitle)} />
              </Box>
              <Box mb={2}>
                <Paper style={{ maxHeight: '200px', overflow: 'auto' }}>
                  <SearchSubGenres onSelect={subGenre => handleSelect('selectedSubGenres', subGenre)} />
                </Paper>
              </Box>
              <Box mb={2}>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                />
              </Box>
              <Box textAlign="center">
                <Button type="submit" variant="contained" color="primary">
                  Submit
                </Button>
              </Box>
            </form>

          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AddProject;
