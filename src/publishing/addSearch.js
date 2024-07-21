

import React, { useState, useEffect } from 'react';
import {
  Button,
  Box,
  Container,
  Grid,
  Paper,
  Typography
} from '@mui/material';
import SearchGenres from '../SearchGenres';
import SearchSubGenres from '../searchSubGenres';
import SearchBookTitles from '../SearchBooksTitles';
import SearchAuthors from '../SearchAuthors';
import SearchMovieTitles from '../SearchMovieTitles';
import SearchTVTitles from '../SearchTVTitles';
import { supabase } from '../supabaseClient';

const AddSearch = () => {
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
  });

  const [user, setUser] = useState(null);
  const [userSearches, setUserSearches] = useState([]);
  const [authorProjects, setAuthorProjects] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: userData, error } = await supabase.auth.getUser();

        if (error) {
          throw error;
        }

        setUser(userData.user);
      } catch (error) {
        console.error('Error fetching user:', error.message);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchUserSearches = async () => {
      if (!user) {
        return;
      }

      try {
        const userId = user.id;
        console.log('User ID:', userId);

        const { data, error } = await supabase
          .from('pub_searches')
          .select('*')
          .eq('user_id', userId);

        if (error) {
          console.error('Error fetching data:', error);
          return;
        }

        if (!data || data.length === 0) {
          console.log('No data found in the table');
        } else {
          console.log('Fetched data:', data);

          // Parse JSON strings into arrays if necessary
          const parsedData = data.map(search => ({
            ...search,
            age_group: parseJsonArray(search.age_group),
            author_comps: parseJsonArray(search.author_comps),
            broad_genre: parseJsonArray(search.broad_genre),
            category: parseJsonArray(search.category),
            genre: parseJsonArray(search.genre),
            movie_comps: parseJsonArray(search.movie_comps),
            specific_genre: parseJsonArray(search.specific_genre),
            sub_genres: parseJsonArray(search.sub_genres),
            tv_comps: parseJsonArray(search.tv_comps),
          }));

          setUserSearches(parsedData || []);
        }
      } catch (err) {
        console.error('Error:', err);
      }
    };

    fetchUserSearches();
  }, [user]);

  const parseJsonArray = (value) => {
    try {
      return JSON.parse(value);
    } catch (e) {
      return [];
    }
  };

  const stringifyArray = (value) => {
    return JSON.stringify(value);
  };

  const checkMatch = (filters, project) => {
    for (const key in filters) {
      const filterValue = parseJsonArray(filters[key]);
      const projectValue = parseJsonArray(project[key]);

      if (filterValue.length === 0) continue;

      const isMatch = filterValue.every(val => projectValue.includes(val));
      if (!isMatch) return false;
    }
    return true;
  };

  const fetchAuthorProjects = async (filters) => {
    console.log("BING CHERRY");
    try {
      console.log('Fetching all author projects with filters:', filters);

      const { data, error } = await supabase
        .from('author_projects')
        .select('*');

      console.log("BING CHERRY ONE");

      if (error) {
        console.error('Error fetching data:', error);
        return;
      }
      console.log("BING CHERRY TWO");

      if (!data || data.length === 0) {
        console.log('No data found in the table');
      } else {
        const matchingProjects = data.filter(project => checkMatch(filters, project));
        setAuthorProjects(matchingProjects);
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const firstName = user && user.user_metadata ? user.user_metadata.first_name : '';
  const lastName = user && user.user_metadata ? user.user_metadata.last_name : '';

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormState(prevState => ({
//       ...prevState,
//       [name]: value,
//     }));
//   };

  const handleSelect = (type, item) => {
    setFormState(prevState => ({
      ...prevState,
      [type]: Array.isArray(prevState[type]) ? [...prevState[type], item] : [item]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data, error } = await supabase
        .from('pub_searches')
        .insert([
          {
            broad_genre: stringifyArray(formState.broad_genre),
            category: stringifyArray(formState.category),
            age_group: stringifyArray(formState.age_group),
            genre: stringifyArray(formState.genre),
            specific_genre: stringifyArray(formState.specific_genre),
            novel_comps: stringifyArray(formState.selectedBookTitles),
            author_comps: stringifyArray(formState.selectedAuthors),
            movie_comps: stringifyArray(formState.selectedMovieTitles),
            tv_comps: stringifyArray(formState.selectedTVTitles),
            sub_genres: stringifyArray(formState.selectedSubGenres),
            user_id: user.id
          }
        ]);

      console.log("Insert response BLAH:", data);

      if (error) {
        console.error('Insert Error:', error);
        throw error;
      }

      if (!data || data.length === 0) {
        console.error('Insert operation returned no data');
        return;
      }

      const newUserSearch = data[0];

      console.log("New user search:", newUserSearch);

      setUserSearches(prevSearches => {
        const updatedSearches = [...prevSearches, newUserSearch];
        console.log('Updated user searches:', updatedSearches);
        return updatedSearches;
      });

    } catch (error) {
      console.error('Error inserting data:', error.message);
    }
  };

  const handleSearchProjects = (search) => {
    let filters = {};
    if (search.broad_genre) {
      filters['broad_genre'] = stringifyArray(search.broad_genre);
    }
    if (search.category) {
      filters['category'] = stringifyArray(search.category);
    }
    if (search.age_group) {
      filters['age_group'] = stringifyArray(search.age_group);
    }
    if (search.genre) {
      filters['genre'] = stringifyArray(search.genre);
    }
    if (search.specific_genre) {
      filters['specific_genre'] = stringifyArray(search.specific_genre);
    }
    if (search.novel_comps) {
      filters['novel_comps'] = stringifyArray(search.novel_comps);
    }
    if (search.author_comps) {
      filters['author_comps'] = stringifyArray(search.author_comps);
    }
    if (search.movie_comps) {
      filters['movie_comps'] = stringifyArray(search.movie_comps);
    }
    if (search.tv_comps) {
      filters['tv_comps'] = stringifyArray(search.tv_comps);
    }
    if (search.sub_genres) {
      filters['sub_genres'] = stringifyArray(search.sub_genres);
    }

    console.log('Filters for search projects:', filters);

    fetchAuthorProjects(filters);
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
            <Typography variant="h5" gutterBottom>
              Welcome, {firstName} {lastName}!
            </Typography>
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
              <Box mb={1}>
                <SearchBookTitles onSelect={bookTitle => handleSelect('selectedBookTitles', bookTitle)} />
              </Box>
              <Box mb={1}>
                <SearchAuthors onSelect={author => handleSelect('selectedAuthors', author)} />
              </Box>
              <Box mb={1}>
                <SearchMovieTitles onSelect={movieTitle => handleSelect('selectedMovieTitles', movieTitle)} />
              </Box>
              <Box mb={1}>
                <SearchTVTitles onSelect={TVTitle => handleSelect('selectedTVTitles', TVTitle)} />
              </Box>
              <Box mb={2}>
                <Paper style={{ maxHeight: '200px', overflow: 'auto' }}>
                  <SearchSubGenres onSelect={subGenre => handleSelect('selectedSubGenres', subGenre)} />
                </Paper>
              </Box>
              <Box textAlign="center">
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                >
                  Submit
                </Button>
              </Box>
            </form>

            <Box mt={4} width="100%">
              <Typography variant="h6" gutterBottom>
                Your Searches
              </Typography>
              {userSearches.length > 0 ? (
                userSearches.map(search => (
                  <Paper key={search.id} style={{ marginBottom: '10px', padding: '10px' }}>
                    <Typography><strong>Broad Genre:</strong> {Array.isArray(search.broad_genre) ? search.broad_genre.join(', ') : search.broad_genre}</Typography>
                    <Typography><strong>Category:</strong> {Array.isArray(search.category) ? search.category.join(', ') : search.category}</Typography>
                    <Typography><strong>Age Group:</strong> {Array.isArray(search.age_group) ? search.age_group.join(', ') : search.age_group}</Typography>
                    <Typography><strong>Genre:</strong> {Array.isArray(search.genre) ? search.genre.join(', ') : search.genre}</Typography>
                    <Typography><strong>Specific Genre:</strong> {Array.isArray(search.specific_genre) ? search.specific_genre.join(', ') : search.specific_genre}</Typography>
                    <Typography><strong>Novel Comparisons:</strong> {Array.isArray(search.novel_comps) ? search.novel_comps.join(', ') : search.novel_comps}</Typography>
                    <Typography><strong>Author Comparisons:</strong> {Array.isArray(search.author_comps) ? search.author_comps.join(', ') : search.author_comps}</Typography>
                    <Typography><strong>Movie Comparisons:</strong> {Array.isArray(search.movie_comps) ? search.movie_comps.join(', ') : search.movie_comps}</Typography>
                    <Typography><strong>TV Comparisons:</strong> {Array.isArray(search.tv_comps) ? search.tv_comps.join(', ') : search.tv_comps}</Typography>
                    <Typography><strong>Sub Genres:</strong> {Array.isArray(search.sub_genres) ? search.sub_genres.join(', ') : search.sub_genres}</Typography>
                    <Button onClick={() => handleSearchProjects(search)} variant="contained" color="primary">
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
                authorProjects.map(project => (
                  <Paper key={project.id} style={{ marginBottom: '10px', padding: '10px' }}>
                    <Typography><strong>Broad Genre:</strong> {project.broad_genre}</Typography>
                    <Typography><strong>Logline:</strong> {project.logline}</Typography>
                    <Typography><strong>Synopsis:</strong> {project.synopsis}</Typography>
                    <Typography><strong>Title:</strong> {project.title}</Typography>
                    <Typography><strong>Category:</strong> {project.category}</Typography>
                    <Typography><strong>Age Group:</strong> {Array.isArray(project.age_group) ? project.age_group.join(', ') : project.age_group}</Typography>
                    <Typography><strong>Genre:</strong> {Array.isArray(project.genre) ? project.genre.join(', ') : project.genre}</Typography>
                  </Paper>
                ))
              ) : (
                <Typography>No author projects found.</Typography>
              )}
            </Box>

          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AddSearch;

// import React, { useState, useEffect } from 'react';
// import {
//   TextField,
//   Button,
//   Box,
//   Container,
//   Grid,
//   Paper,
//   Typography
// } from '@mui/material';
// import SearchGenres from '../SearchGenres';
// import SearchSubGenres from '../searchSubGenres';
// import SearchBookTitles from '../SearchBooksTitles';
// import SearchAuthors from '../SearchAuthors';
// import SearchMovieTitles from '../SearchMovieTitles';
// import SearchTVTitles from '../SearchTVTitles';
// import { supabase } from '../supabaseClient';

// const AddSearch = () => {
//   const [formState, setFormState] = useState({
//     broad_genre: '',
//     category: '',
//     age_group: [],
//     genre: [],
//     specific_genre: [],
//     title: '',
//     logline: '',
//     synopsis: '',
//     selectedAuthors: [],
//     selectedMovieTitles: [],
//     selectedTVTitles: [],
//     selectedSubGenres: [],
//   });

//   const [user, setUser] = useState(null);
//   const [userSearches, setUserSearches] = useState([]);
//   const [authorProjects, setAuthorProjects] = useState([]); // New state for author projects

//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const { data: userData, error } = await supabase.auth.getUser();

//         if (error) {
//           throw error;
//         }

//         setUser(userData.user);
//       } catch (error) {
//         console.error('Error fetching user:', error.message);
//       }
//     };

//     fetchUserData();
//   }, []);

//   useEffect(() => {
//     const fetchUserSearches = async () => {
//       if (!user) {
//         return;
//       }

//       try {
//         const userId = user.id;
//         console.log('User ID:', userId);

//         const { data, error } = await supabase
//           .from('pub_searches')
//           .select('*')
//           .eq('user_id', userId);

//         if (error) {
//           console.error('Error fetching data:', error);
//           return;
//         }

//         if (!data || data.length === 0) {
//           console.log('No data found in the table');
//         } else {
//           console.log('Fetched data:', data);
//           setUserSearches(data || []); // Ensure data is not null
//         }
//       } catch (err) {
//         console.error('Error:', err);
//       }
//     };

//     fetchUserSearches();
//   }, [user]);

//   useEffect(() => {
//     const fetchAuthorProjects = async () => {
//       if (!user) {
//         return;
//       }

//       try {
//         console.log('Fetching all author projects');

//         const { data, error } = await supabase

//             .from('author_projects')
//             .select('*')
//             .filter('age_group::jsonb', '@>', '["Young Adult"]');

          

//         console.log("Fetched author projects:", data);

//         if (error) {
//           console.error('Error fetching data:', error);
//           return;
//         }

//         if (!data || data.length === 0) {
//           console.log('No data found in the table');
//         } else {
//           setAuthorProjects(data || []); // Ensure data is not null
//         }
//       } catch (err) {
//         console.error('Error:', err);
//       }
//     };

//     fetchAuthorProjects();
//   }, [user]);

//   const firstName = user && user.user_metadata ? user.user_metadata.first_name : '';
//   const lastName = user && user.user_metadata ? user.user_metadata.last_name : '';

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormState(prevState => ({
//       ...prevState,
//       [name]: value,
//     }));
//   };

//   const handleSelect = (type, item) => {
//     setFormState(prevState => ({
//       ...prevState,
//       [type]: Array.isArray(prevState[type]) ? [...prevState[type], item] : [item]
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const { data, error } = await supabase
        
//         .from('pub_searches')
//         .insert([
//           {
//             broad_genre: formState.broad_genre,
//             category: formState.category,
//             age_group: formState.age_group,
//             genre: formState.genre,
//             specific_genre: formState.specific_genre,
//             novel_comps: formState.selectedBookTitles,
//             author_comps: formState.selectedAuthors,
//             movie_comps: formState.selectedMovieTitles,
//             tv_comps: formState.selectedTVTitles,
//             sub_genres: formState.selectedSubGenres,
//             user_id: user.id
//           }
//         ]);

//       if (error) {
//         throw error;
//       }

//       const newUserSearch = data[0];
//       setUserSearches(prevSearches => [...prevSearches, newUserSearch]);
//     } catch (error) {
//       console.error('Error inserting data:', error.message);
//     }
//   };

//   return (
//     <Container>
//       <Grid container spacing={2}>
//         <Grid item xs={12}>
//           <Box
//             display="flex"
//             flexDirection="column"
//             alignItems="center"
//             justifyContent="center"
//             minHeight="100vh"
//           >
//             <Typography variant="h5" gutterBottom>
//               Welcome, {firstName} {lastName}!
//             </Typography>
//             <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '600px' }}>
//               <Box mb={2}>
//                 <Paper style={{ maxHeight: '200px', overflow: 'auto' }}>
//                   <SearchGenres
//                     onSelect={selectedGenres => setFormState(prevState => ({ ...prevState, ...selectedGenres }))}
//                     setFormState={setFormState}
//                     formState={formState}
//                   />
//                 </Paper>
//               </Box>
//               <Box mb={1}>
//                 <SearchBookTitles onSelect={bookTitle => handleSelect('selectedBookTitles', bookTitle)} />
//               </Box>
//               <Box mb={1}>
//                 <SearchAuthors onSelect={author => handleSelect('selectedAuthors', author)} />
//               </Box>
//               <Box mb={1}>
//                 <SearchMovieTitles onSelect={movieTitle => handleSelect('selectedMovieTitles', movieTitle)} />
//               </Box>
//               <Box mb={1}>
//                 <SearchTVTitles onSelect={TVTitle => handleSelect('selectedTVTitles', TVTitle)} />
//               </Box>
//               <Box mb={2}>
//                 <Paper style={{ maxHeight: '200px', overflow: 'auto' }}>
//                   <SearchSubGenres onSelect={subGenre => handleSelect('selectedSubGenres', subGenre)} />
//                 </Paper>
//               </Box>
//               <Box textAlign="center">
//                 <Button
//                   type="submit"
//                   variant="contained"
//                   color="primary"
//                 >
//                   Submit
//                 </Button>
//               </Box>
//             </form>

//             <Box mt={4} width="100%">
//               <Typography variant="h6" gutterBottom>
//                 Your Searches
//               </Typography>
//               {userSearches.length > 0 ? (
//                 userSearches.map(search => (
//                   <Paper key={search.id} style={{ marginBottom: '10px', padding: '10px' }}>
//                     <Typography><strong>Broad Genre:</strong> {search.broad_genre}</Typography>
//                     <Typography><strong>Category:</strong> {search.category}</Typography>
//                     <Typography><strong>Age Group:</strong> {Array.isArray(search.age_group) ? search.age_group.join(', ') : search.age_group}</Typography>
//                     <Typography><strong>Genre:</strong> {Array.isArray(search.genre) ? search.genre.join(', ') : search.genre}</Typography>
//                     <Typography><strong>Specific Genre:</strong> {Array.isArray(search.specific_genre) ? search.specific_genre.join(', ') : search.specific_genre}</Typography>
//                     <Typography><strong>Novel Comparisons:</strong> {Array.isArray(search.novel_comps) ? search.novel_comps.join(', ') : search.novel_comps}</Typography>
//                     <Typography><strong>Author Comparisons:</strong> {Array.isArray(search.author_comps) ? search.author_comps.join(', ') : search.author_comps}</Typography>
//                     <Typography><strong>Movie Comparisons:</strong> {Array.isArray(search.movie_comps) ? search.movie_comps.join(', ') : search.movie_comps}</Typography>
//                     <Typography><strong>TV Comparisons:</strong> {Array.isArray(search.tv_comps) ? search.tv_comps.join(', ') : search.tv_comps}</Typography>
//                     <Typography><strong>Sub Genres:</strong> {Array.isArray(search.sub_genres) ? search.sub_genres.join(', ') : search.sub_genres}</Typography>
//                   </Paper>
//                 ))
//               ) : (
//                 <Typography>No searches found.</Typography>
//               )}
//             </Box>

//             <Box mt={4} width="100%">
//               <Typography variant="h6" gutterBottom>
//                 Author Projects
//               </Typography>
//               {authorProjects.length > 0 ? (
//                 authorProjects.map(project => (
//                   <Paper key={project.id} style={{ marginBottom: '10px', padding: '10px' }}>
//                     {/* <Typography><strong>Title:</strong> {project.title}</Typography> */}
//                     <Typography><strong>Broad Genre:</strong> {project.broad_genre}</Typography>
//                     <Typography><strong>Logline:</strong> {project.logline}</Typography>
//                     <Typography><strong>Synopsis:</strong> {project.synopsis}</Typography>
//                     <Typography><strong>Title:</strong> {project.title}</Typography>
//                     <Typography><strong>Category:</strong> {project.category}</Typography>
//                     <Typography><strong>Age Group:</strong> {project.age_group}</Typography>
//                     <Typography><strong>Genre:</strong> {project.genre}</Typography>
//                     {/* Add other fields as needed */}
//                   </Paper>
//                 ))
//               ) : (
//                 <Typography>No author projects found.</Typography>
//               )}
//             </Box>

//           </Box>
//         </Grid>
//       </Grid>
//     </Container>
//   );
// };

// export default AddSearch;
