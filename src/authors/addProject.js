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
import SearchGenres from '../SearchGenres';
import SearchSubGenres from '../searchSubGenres';
import SearchBookTitles from '../SearchBooksTitles';
import SearchAuthors from '../SearchAuthors';
import SearchMovieTitles from '../SearchMovieTitles';
import SearchTVTitles from '../SearchTVTitles';
import { supabase } from '../supabaseClient';

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

  const [user, setUser] = useState(null);
  const [userProjects, setUserProjects] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: userData, error } = await supabase.auth.getUser();

        if (error) {
          throw error;
        }

        setUser(userData.user);
        fetchUserProjects(userData.user.id);
      } catch (error) {
        console.error('Error fetching user:', error.message);
      }
    };

    fetchUserData();
  }, []);

  const fetchUserProjects = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('author_projects')
        .select('*')
        .eq('user_id', userId);

      if (error) {
        throw error;
      }

      setUserProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error.message);
    }
  };

  const firstName = user && user.user_metadata ? user.user_metadata.first_name : '';
  const lastName = user && user.user_metadata ? user.user_metadata.last_name : '';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormState(prevState => ({
      ...prevState,
      projectPDF: e.target.files[0],
    }));
  };

  const handleSelect = (type, item) => {
    setFormState(prevState => ({
      ...prevState,
      [type]: Array.isArray(prevState[type]) ? [...prevState[type], item] : [item]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let pdfUrl = null;

      if (formState.projectPDF) {
        const { error: uploadError } = await supabase.storage
          .from('author_docs')
          .upload(`${user.id}/${formState.projectPDF.name}`, formState.projectPDF);

        if (uploadError) {
          throw uploadError;
        }

        const { publicURL, error: publicUrlError } = supabase.storage
          .from('author_docs')
          .getPublicUrl(`${user.id}/${formState.projectPDF.name}`);

        if (publicUrlError) {
          throw publicUrlError;
        }

        pdfUrl = publicURL;
      }

      const { data, error } = await supabase
        .from('author_projects')
        .insert([
          {
            broad_genre: formState.broad_genre,
            category: formState.category,
            age_group: formState.age_group,
            genre: formState.genre,
            specific_genre: formState.specific_genre,
            title: formState.title,
            logline: formState.logline,
            synopsis: formState.synopsis,
            novel_comps: formState.selectedBookTitles,
            author_comps: formState.selectedAuthors,
            movie_comps: formState.selectedMovieTitles,
            tv_comps: formState.selectedTVTitles,
            sub_genres: formState.selectedSubGenres,
            pdf_url: pdfUrl,
            user_id: user.id,
          }
        ]);

      if (error) {
        throw error;
      }

      fetchUserProjects(user.id);

      console.log('Data inserted successfully:', data);
    } catch (error) {
      console.error('Error inserting data:', error.message);
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
              <Box mb={2}>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                />
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
                My Projects
              </Typography>
              {userProjects.length > 0 ? (
                userProjects.map(project => (
                  <Paper key={project.id} style={{ marginBottom: '10px', padding: '10px' }}>
                    <Typography><strong>Title:</strong> {project.title}</Typography>
                    <Typography><strong>Logline:</strong> {project.logline}</Typography>
                    <Typography><strong>Synopsis:</strong> {project.synopsis}</Typography>
                    {project.pdf_url && (
                      <Typography>
                        <strong>PDF:</strong> <a href={project.pdf_url} target="_blank" rel="noopener noreferrer">View</a>
                      </Typography>
                    )}
                  </Paper>
                ))
              ) : (
                <Typography>No projects found.</Typography>
              )}
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AddProject;



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

// const AddProject = () => {
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
//     projectPDF: null,
//   });

//   const [user, setUser] = useState(null);

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

//   const firstName = user && user.user_metadata ? user.user_metadata.first_name : '';
//   const lastName = user && user.user_metadata ? user.user_metadata.last_name : '';

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormState(prevState => ({
//       ...prevState,
//       [name]: value,
//     }));
//   };

//   const handleFileChange = (e) => {
//     setFormState(prevState => ({
//       ...prevState,
//       projectPDF: e.target.files[0],
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
//       let pdfUrl = null;

//       if (formState.projectPDF) {
//         const { data: uploadData, error: uploadError } = await supabase.storage
//           .from('author_docs')
//           .upload(`${user.id}/${formState.projectPDF.name}`, formState.projectPDF);

//         if (uploadError) {
//           throw uploadError;
//         }

//         // pdfUrl = supabase.storage.from('author_docs').getPublicUrl(`${user.id}/${formState.projectPDF.name}`).publicURL;
//         pdfUrl = supabase.storage.from('author_docs').getPublicUrl(`${user.id}/${formState.projectPDF.name}`);

//         console.log("RING IN MORE", pdfUrl)
//       }

//       const { data, error } = await supabase
//         .from('author_projects')
//         .insert([
//           {
//             broad_genre: formState.broad_genre,
//             category: formState.category,
//             age_group: formState.age_group,
//             genre: formState.genre,
//             specific_genre: formState.specific_genre,
//             title: formState.title,
//             logline: formState.logline,
//             synopsis: formState.synopsis,
//             novel_comps: formState.selectedBookTitles,
//             author_comps: formState.selectedAuthors,
//             movie_comps: formState.selectedMovieTitles,
//             tv_comps: formState.selectedTVTitles,
//             sub_genres: formState.selectedSubGenres,
//             pdf_url: pdfUrl,
//             user_id: user.id,
//           }
//         ]);

//       if (error) {
//         throw error;
//       }

//       console.log('Data inserted successfully:', data);
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
//               <Box mb={4}>
//                 <TextField
//                   fullWidth
//                   variant="outlined"
//                   label="Title"
//                   name="title"
//                   value={formState.title}
//                   onChange={handleChange}
//                 />
//               </Box>
//               <Box mb={4}>
//                 <TextField
//                   fullWidth
//                   variant="outlined"
//                   label="Logline"
//                   name="logline"
//                   value={formState.logline}
//                   onChange={handleChange}
//                 />
//               </Box>
//               <Box mb={4}>
//                 <TextField
//                   fullWidth
//                   variant="outlined"
//                   label="Synopsis"
//                   name="synopsis"
//                   value={formState.synopsis}
//                   onChange={handleChange}
//                 />
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
//               <Box mb={2}>
//                 <input
//                   type="file"
//                   accept="application/pdf"
//                   onChange={handleFileChange}
//                 />
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
//           </Box>
//         </Grid>
//       </Grid>
//     </Container>
//   );
// };

// export default AddProject;
