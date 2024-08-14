// ManuscriptSearch.js

import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Checkbox,
  FormControlLabel,
  Slider,
  TextField,
  Button,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Container,
  Paper,
} from "@mui/material";
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { supabase } from './supabaseClient';
import GenreData from './openGenres';

const ManuscriptSearch = () => {
  const [isClicked, setIsClicked] = useState(false);
  const [message, setMessage] = useState("🔬 Show Filters");
  const [search, setSearch] = useState("");
  const [genres, setGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [revenueRange, setRevenueRange] = useState([0, 10000000]);
  const [ratings, setRatings] = useState([0, 10]);
  const [languages, setLanguages] = useState([]);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [releaseDate, setReleaseDate] = useState([null, null]);
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortOption, setSortOption] = useState("revenue_desc");
  const [authorProjects, setAuthorProjects] = useState([]);
  const [user, setUser] = useState(null);

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

  useEffect(() => {
    if (user) {
      fetchGenresAndLanguages();
      fetchData();
    }
  }, [user, page, sortOption, search, selectedGenres, revenueRange, ratings, selectedLanguages, releaseDate]);

  const fetchGenresAndLanguages = async () => {
    const genresList = Object.keys(GenreData).map((key) => ({
      value: key,
      label: GenreData[key].text,
    }));
    setGenres(genresList);

    const { data: languagesData } = await supabase.from('languages').select('*');
    setLanguages(languagesData || []);
  };

  const fetchData = async () => {
    let filters = {};
    if (search) filters['title'] = search;
    if (selectedGenres.length > 0) filters['genre'] = selectedGenres;
    if (revenueRange[0] > 0 || revenueRange[1] < 10000000) filters['revenue'] = revenueRange;
    if (ratings[0] > 0 || ratings[1] < 10) filters['ratings'] = ratings;
    if (selectedLanguages.length > 0) filters['languages'] = selectedLanguages;
    if (releaseDate[0] || releaseDate[1]) filters['releaseDate'] = releaseDate;

    console.log('Filters for search projects:', filters);
    fetchAuthorProjects(filters);
  };

  const checkMatch = (filters, project) => {
    for (const key in filters) {
      const filterValue = Array.isArray(filters[key]) ? filters[key] : [filters[key]];
      const projectValue = Array.isArray(project[key]) ? project[key] : [project[key]];

      if (filterValue.length === 0) continue;

      const isMatch = filterValue.every(val => projectValue.includes(val));
      if (!isMatch) return false;
    }
    return true;
  };

  const fetchAuthorProjects = async (filters) => {
    console.log("Fetching author projects with filters:", filters);
    try {
      const { data, error } = await supabase
        .from('author_projects')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching data:', error);
        return;
      }

      if (data.length === 0) {
        console.log('No data found in the table');
      } else {
        const matchingProjects = data.filter(project => checkMatch(filters, project));
        setAuthorProjects(matchingProjects);
        setResults(matchingProjects);
        setTotalPages(Math.ceil(matchingProjects.length / 12));
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const handleSearchChange = (event) => setSearch(event.target.value);
  const handleGenreChange = (event) => setSelectedGenres(event.target.value);
  const handleLanguageChange = (event) => setSelectedLanguages(event.target.value);
  const handleSortChange = (event) => setSortOption(event.target.value);
  const handleRevenueChange = (event, newValue) => setRevenueRange(newValue);
  const handleRatingsChange = (event, newValue) => setRatings(newValue);
  const handleDateChange = (newValue) => setReleaseDate(newValue);
  const handleToggleClick = () => {
    setIsClicked(!isClicked);
    setMessage(isClicked ? "🔬 Show Filters" : "🎬 Show Projects");
  };

  return (
    <Box className="main-container">
      {/* <Box className="navbar">
        <Box className="search-container">
          <TextField
            value={search}
            onChange={handleSearchChange}
            placeholder="Search for author projects..."
            variant="outlined"
            fullWidth
          />
        </Box>
      </Box> */}

      <Box className="sub-container">
        <Grid container>
          <Grid item xs={1}>
            <Box className="left-bar">
              <Box className="filter-heading center">
                <Typography variant="h6">
                  <i className="fa fa-pied-piper-alt" /> Genres
                </Typography>
              </Box>
              <FormControl fullWidth>
                <InputLabel>Genres</InputLabel>
                <Select
                  multiple
                  value={selectedGenres}
                  onChange={handleGenreChange}
                  renderValue={(selected) => selected.join(", ")}
                >
                  {genres.length > 0 && genres.map((genre) => (
                    <MenuItem key={genre.value} value={genre.value}>
                      <FormControlLabel control={<Checkbox checked={selectedGenres.indexOf(genre.value) > -1} />} label={genre.label} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <hr className="blue" />
              <Box className="filter-heading center">
                <Typography variant="h6">
                  <i className="fa fa-dollar" /> Revenue
                </Typography>
              </Box>
              
              <Slider
                value={revenueRange}
                onChange={handleRevenueChange}
                valueLabelDisplay="auto"
                min={0}
                max={10000000}
                step={1000}
              />

              <hr className="blue" />
              <Box className="filter-heading center">
                <Typography variant="h6">
                  <i className="fa fa-star" /> Ratings
                </Typography>
              </Box>
              <Slider
                value={ratings}
                onChange={handleRatingsChange}
                valueLabelDisplay="auto"
                min={0}
                max={10}
                step={0.1}
              />
              <hr className="blue" />
              <Box className="filter-heading center">
                <Typography variant="h6">
                  <i className="fa fa-language" /> Languages
                </Typography>
              </Box>
              <FormControl fullWidth>
                <InputLabel>Languages</InputLabel>
                <Select
                  multiple
                  value={selectedLanguages}
                  onChange={handleLanguageChange}
                  renderValue={(selected) => selected.join(", ")}
                >
                  {languages.length > 0 && languages.map((language) => (
                    <MenuItem key={language.value} value={language.value}>
                      <FormControlLabel control={<Checkbox checked={selectedLanguages.indexOf(language.value) > -1} />} label={language.label} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <hr className="blue" />
              <Box className="filter-heading center">
                <Typography variant="h6">
                  <i className="fa fa-calendar" /> Release Date
                </Typography>
              </Box>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateRangePicker
                  startText="Start"
                  endText="End"
                  value={releaseDate}
                  onChange={handleDateChange}
                  renderInput={(startProps, endProps) => (
                    <>
                      <TextField {...startProps} />
                      <Box sx={{ mx: 2 }}> to </Box>
                      <TextField {...endProps} />
                    </>
                  )}
                />
              </LocalizationProvider>
            </Box>
          </Grid>
          <Grid item xs={11}>
            <Box className="result-container">
              <Box display="flex" justifyContent="space-between" alignItems="center">

                {/* <FormControl fullWidth>
                  <InputLabel>Sort By</InputLabel>
                  <Select value={sortOption} onChange={handleSortChange}>
                    <MenuItem value="revenue_desc">Sort by Revenue (High to Low)</MenuItem>
                    <MenuItem value="popularity_desc">Sort by Popularity (High to Low)</MenuItem>
                    <MenuItem value="vote_average_desc">Sort by Ratings (High to Low)</MenuItem>
                    <MenuItem value="original_title_asc">Sort by Title (A-Z)</MenuItem>
                  </Select>
                </FormControl> */}

                {/* <Button onClick={handleToggleClick} variant="contained">
                  {message}
                </Button> */}

              </Box>

              <Grid container spacing={3} className="list-container">
                {results.length > 0 && results.map((item) => (
                  <Grid item xs={12} sm={6} md={4} key={item.id} className="result-item">
                    <Card className="main-description">
                      <CardContent>
                        <Typography variant="h5" component="div" className="result-title">
                          {item.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" className="overlay-description">
                          {item.logline}
                        </Typography>
                        <Box className="overlay-info">
                          <Box className="rating-time-score-container">
                            <Typography variant="body2" component="p" className="sub-title Rating-data">
                              <b>Genre:<span className="details"> {item.genre}</span></b>
                            </Typography>
                            <Typography variant="body2" component="p" className="time-data">
                              <b><span className="time"><i className="fa fa-clock-o" /> </span><span className="details">{item.release_date}</span></b>
                            </Typography>
                            <Typography variant="body2" component="p" className="sub-title Score-data">
                              <b>Rating:<span className="details"> {item.rating}</span></b>
                            </Typography>
                          </Box>

                          <Box className="revenue-lang-container">
                            <Typography variant="body2" component="p" className="revenue-data">
                              <b><span>Revenue:</span> <span className="details"> ${item.revenue}</span> </b>
                            </Typography>
                            <Typography variant="body2" component="p" className="sub-title language-data">
                              <b>Language:<span className="details"> {item.language}</span></b>
                            </Typography>
                          </Box>

                          {/* <FormControl fullWidth>
                            <InputLabel>Sort By</InputLabel>
                            <Select value={sortOption} onChange={handleSortChange}>
                              <MenuItem value="revenue_desc">Sort by Revenue (High to Low)</MenuItem>
                              <MenuItem value="popularity_desc">Sort by Popularity (High to Low)</MenuItem>
                              <MenuItem value="vote_average_desc">Sort by Ratings (High to Low)</MenuItem>
                              <MenuItem value="original_title_asc">Sort by Title (A-Z)</MenuItem>
                            </Select>
                          </FormControl> */}
                          
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
              {/* <Pagination
                count={totalPages}
                page={page}
                onChange={(event, value) => setPage(value)}
                color="primary"
                className="result-stats"
                sx={{ mt: 2 }}
              /> */}
            </Box>
          </Grid>
        </Grid>
      </Box>

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
    </Box>
  );
};

export default ManuscriptSearch;


// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Grid,
//   Card,
//   CardContent,
//   Typography,
//   Checkbox,
//   FormControlLabel,
//   Slider,
//   TextField,
//   Button,
//   Pagination,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   Container,
//   Paper,
// } from "@mui/material";
// import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
// import { LocalizationProvider } from "@mui/x-date-pickers";
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// import { supabase } from '../supabaseClient';
// import GenreData from '../openGenres';
// import BroadGenres from '../BroadGenres';

// const ManuscriptSearch = () => {
//   const [isClicked, setIsClicked] = useState(false);
//   const [message, setMessage] = useState("🔬 Show Filters");
//   const [search, setSearch] = useState("");
//   const [bookComp, setBookComp] = useState("");
//   const [authorComp, setAuthorComp] = useState("");
//   const [filmComp, setFilmComp] = useState("");
//   const [TVComp, setTVComp] = useState("");
//   const [title, setTitle] = useState("");
//   // const [title, setTitle] = useState("");


//   const [genres, setGenres] = useState([]);
//   const [broadGenres, setBroadGenres] = useState([]);
//   const [selectedGenres, setSelectedGenres] = useState([]);
//   const [revenueRange, setRevenueRange] = useState([0, 10000000]);
//   const [avgRating, setAvgRating] = useState([0, 10]);
//   const [languages, setLanguages] = useState([]);
//   const [selectedLanguages, setSelectedLanguages] = useState([]);
//   const [releaseDate, setReleaseDate] = useState([null, null]);
//   const [results, setResults] = useState([]);
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [sortOption, setSortOption] = useState("revenue_desc");
//   const [authorProjects, setAuthorProjects] = useState([]);
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const { data: userData, error } = await supabase.auth.getUser();
//         if (error) throw error;
//         setUser(userData.user);
//       } catch (error) {
//         console.error('Error fetching user:', error.message);
//       }
//     };

//     fetchUserData();
//   }, []);

//   // useEffect(() => {
//   //   if (user) {
//   //     fetchGenresAndLanguages();
//   //     fetchData();
//   //   }
//   // }, [user, page, sortOption, search, bookComp, authorComp, filmComp, TVComp, selectedGenres, revenueRange, avgRating, selectedLanguages, releaseDate]);

//   // const fetchGenresAndLanguages = async () => {
//   //   const genresList = Object.keys(GenreData).map((key) => ({
//   //     value: key,
//   //     label: GenreData[key].text,
//   //   }));
//   //   setGenres(genresList);

//   //   const { data: languagesData } = await supabase.from('languages').select('*');
//   //   setLanguages(languagesData || []);
//   // };

//   const fetchData = async () => {
//     let filters = {};
//     if (search) filters['title'] = search;
//     if (bookComp) filters['book_comp'] = bookComp;
//     if (authorComp) filters['author_comp'] = authorComp;
//     if (filmComp) filters['film_comp'] = filmComp;
//     if (TVComp) filters['TV_comp'] = TVComp;
//     if (selectedGenres.length > 0) filters['genre'] = selectedGenres;
//     // if (avgRating[0] > 0 || avgRating[1] < 10) filters['avgRating'] = avgRating;
//     if (title) filters['title'] = title;



//     console.log('Filters for search projects:', filters);
//     fetchAuthorProjects(filters);
//   };

//   const [includeNoRatings, setIncludeNoRatings] = useState(false);

//   const handleIncludeNoRatingsChange = (event) => {
//     setIncludeNoRatings(event.target.checked);
//   };

//   const checkMatch = (filters, project) => {
//     for (const key in filters) {
//       const filterValue = Array.isArray(filters[key]) ? filters[key] : [filters[key]];
//       const projectValue = Array.isArray(project[key]) ? project[key] : [project[key]];

//       if (filterValue.length === 0) continue;

//       const isMatch = filterValue.every(val => projectValue.includes(val));
//       if (!isMatch) return false;
//     }
//     return true;
//   };

//   const fetchAuthorProjects = async (filters) => {
//     console.log("Fetching author projects with filters:", filters);
//     try {
//       const { data: projectsData, error: projectsError } = await supabase
//         .from('projects_author')
//         .select('*');
  
//       if (projectsError) {
//         console.error('Error fetching projects data:', projectsError);
//         return;
//       }
  
//       if (projectsData.length === 0) {
//         console.log('No projects found in the table');
//         return;
//       }
  
//       const userIds = projectsData.map(project => project.user_id);
//       console.log("Extracted user IDs:", userIds);

//       const { data: profilesData, error: profilesError } = await supabase
//         .from('profiles')
//         .select('*')
//         .in('id', userIds);
      
//       console.log("Fetched profiles data:", profilesData);

//       if (profilesError) {
//         console.error('Error fetching profiles data:', profilesError);
//         return;
//       }
    
//       const projectsWithAuthors = projectsData.map(project => {
//         const authorProfile = profilesData.find(profile => profile.id === project.user_id);
//         return {
//           ...project,
//           author: authorProfile ? `${authorProfile.first_name} ${authorProfile.last_name}` : 'Unknown Author',
//         };
//       });
  
//       const matchingProjects = projectsWithAuthors.filter(project => checkMatch(filters, project));
//       setAuthorProjects(matchingProjects);
//       setResults(matchingProjects);
//       setTotalPages(Math.ceil(matchingProjects.length / 12));
//     } catch (err) {
//       console.error('Error:', err);
//     }
//   };

//   const handleSearchChange = (event) => setSearch(event.target.value);
//   const handleBookCompChange = (event) => setBookComp(event.target.value);
//   const handleAuthorCompChange = (event) => setAuthorComp(event.target.value);
//   const handleFilmCompChange = (event) => setFilmComp(event.target.value);
//   const handleTVCompChange = (event) => setTVComp(event.target.value);
//   const handleTitleChange = (event) => setTitle(event.target.value);

//   const handleGenreChange = (event) => setSelectedGenres(event.target.value);
//   const handleLanguageChange = (event) => setSelectedLanguages(event.target.value);
//   const handleSortChange = (event) => setSortOption(event.target.value);
//   const handleRevenueChange = (event, newValue) => setRevenueRange(newValue);
//   const handleAvgRatingChange = (event, newValue) => setAvgRating(newValue);
//   const handleDateChange = (newValue) => setReleaseDate(newValue);
//   const handleToggleClick = () => {
//     setIsClicked(!isClicked);
//     setMessage(isClicked ? "🔬 Show Filters" : "🎬 Show Projects");
//   };

//   return (
//     <Box className="main-container">
//       <Grid container>
//         <Grid item xs={3} className="search-side">
//           <Box className="left-bar">
//             <Box className="filter-heading center">
//               <Typography variant="h6">
//                 <i className="fa fa-pied-piper-alt" /> Genres
//               </Typography>
//             </Box>
            
//             <FormControl fullWidth>
//               <InputLabel>Genres</InputLabel>
//               <Select
//                 multiple
//                 value={selectedGenres}
//                 onChange={handleGenreChange}
//                 renderValue={(selected) => selected.join(", ")}
//               >
//                 {genres.length > 0 && genres.map((genre) => (
//                   <MenuItem key={genre.value} value={genre.value}>
//                     <FormControlLabel control={<Checkbox checked={selectedGenres.indexOf(genre.value) > -1} />} label={genre.label} />
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>

//             {/* <hr className="blue" />
//             <Box className="filter-heading center">
//               <Typography variant="h6">
//                 <i className="fa fa-star" /> Average Rating
//               </Typography>
//             </Box>
//             <Slider
//               value={avgRating}
//               onChange={handleAvgRatingChange}
//               valueLabelDisplay="auto"
//               min={0}
//               max={10}
//               step={0.1}
//             />

//             <Box display="flex" alignItems="center" mt={2}>
//               <Checkbox
//                 checked={includeNoRatings}
//                 onChange={handleIncludeNoRatingsChange}
//                 color="primary"
//               />
//               <Typography variant="body1">
//                 Include Manuscripts With No Ratings
//               </Typography>
//             </Box>

//             <hr className="blue" />
//             <Box className="filter-heading center">
//               <Typography variant="h6">
//                 <i className="fa fa-calendar" /> Upload Date
//               </Typography>
//             </Box> */}
            
//             {/* <LocalizationProvider dateAdapter={AdapterDateFns}>
//               <DateRangePicker
//                 startText="Start"
//                 endText="End"
//                 value={releaseDate}
//                 onChange={handleDateChange}
//                 renderInput={(startProps, endProps) => (
//                   <>
//                     <TextField {...startProps} />
//                     <Box sx={{ mx: 2 }}> to </Box>
//                     <TextField {...endProps} />
//                   </>
//                 )}
//               />
//             </LocalizationProvider> */}
            
//             <hr className="blue" />
//             <Box className="filter-heading center">
//               <Typography variant="h6">
//                 <i className="fa fa-book-comp" /> Book Comps
//               </Typography>
//             </Box>
//             <TextField
//               value={bookComp}
//               onChange={handleBookCompChange}
//               placeholder="Search for book comps..."
//               variant="outlined"
//               fullWidth
//             />

//             <hr className="blue" />
//             <Box className="filter-heading center">
//               <Typography variant="h6">
//                 <i className="fa fa-author-comp" /> Author Comps
//               </Typography>
//             </Box>
//             <TextField
//               value={authorComp}
//               onChange={handleAuthorCompChange}
//               placeholder="Search for author comps..."
//               variant="outlined"
//               fullWidth
//             />

//             <hr className="blue" />
//             <Box className="filter-heading center">
//               <Typography variant="h6">
//                 <i className="fa fa-film-comp" /> Film Comps
//               </Typography>
//             </Box>
//             <TextField
//               value={filmComp}
//               onChange={handleFilmCompChange}
//               placeholder="Search for film comps..."
//               variant="outlined"
//               fullWidth
//             />

//             <hr className="blue" />
//             <Box className="filter-heading center">
//               <Typography variant="h6">
//                 <i className="fa fa-TV-comp" /> TV Comps
//               </Typography>
//             </Box>
//             <TextField
//               value={TVComp}
//               onChange={handleTVCompChange}
//               placeholder="Search for TV comps..."
//               variant="outlined"
//               fullWidth
//             />

//             <hr className="blue" />
//             <Box className="filter-heading center">
//               <Typography variant="h6">
//                 <i className="fa fa-titles" /> Title
//               </Typography>
//             </Box>
//             <TextField
//               value={title}
//               onChange={handleTitleChange}
//               placeholder="Search for title comps..."
//               variant="outlined"
//               fullWidth
//             />

//           </Box>
//         </Grid>
        
//         <Grid item xs={9} className="author-projects">
//           <Box className="result-container">
//             <Grid container spacing={3} className="list-container">
//               {results.length > 0 && results.map((item) => (
                
//                 <Grid item xs={12} sm={6} md={4} key={item.id} className="result-item">
//                   <Card className="main-description">
//                     <CardContent>
//                       <Typography variant="h5" component="div" className="result-title">
//                         {item.title ? item.title.toUpperCase() : ''}
//                       </Typography>
//                       <Typography variant="body2" color="text.secondary" className="overlay-description">
//                         {item.logline}
//                       </Typography>
//                       <Typography variant="body2" color="text.secondary" className="overlay-description">
//                         {item.author}
//                       </Typography>

//                       <Box className="overlay-info">
//                         <Box className="rating-time-score-container">
//                           <Typography variant="body2" component="p" className="sub-title Rating-data">
//                             <b>
//                               <span className="details">
//                                 {item.broad_genre && typeof item.broad_genre === 'string' 
//                                   ? item.broad_genre.replace(/[{"}]/g, '').split(',').map(s => s.trim()).join(', ') 
//                                   : ''}
//                               </span>
//                             </b>
//                           </Typography>
//                           <Typography variant="body2" component="p" className="sub-title Rating-data">
//                             <b>
//                               <span className="details">
//                                 {item.category && typeof item.category === 'string' 
//                                   ? item.category.replace(/[{"}]/g, '').split(',').map(s => s.trim()).join(', ') 
//                                   : ''}
//                               </span>
//                             </b>
//                           </Typography>
//                           <Typography variant="body2" component="p" className="sub-title Rating-data">
//                             <b>
//                               <span className="details">
//                                 {item.age_group && typeof item.age_group === 'string' 
//                                   ? item.age_group.replace(/[{"}]/g, '').split(',').map(s => s.trim()).join(', ') 
//                                   : ''}
//                               </span>
//                             </b>
//                           </Typography>

//                           <Typography variant="body2" component="p" className="sub-title Rating-data">
//                             <b>
//                               <span className="details">
//                                 {item.genre && typeof item.genre === 'string' 
//                                   ? item.genre.replace(/[{"}]/g, '').split(',').map(s => s.trim()).join(', ') 
//                                   : ''}
//                               </span>
//                             </b>
//                           </Typography>

//                           <Typography variant="body2" component="p" className="sub-title Rating-data">
//                             <b>
//                               <span className="details">
//                                 {item.specific_genre && typeof item.specific_genre === 'string' 
//                                   ? item.specific_genre.replace(/[{"}]/g, '').split(',').map(s => s.trim()).join(', ') 
//                                   : ''}
//                               </span>
//                             </b>
//                           </Typography>
//                           <Typography variant="body2" component="p" className="sub-title Rating-data">
//                             <b>
//                               <span className="details">
//                                 {item.novel_comps && typeof item.novel_comps === 'string' 
//                                   ? item.novel_comps.replace(/[{"}]/g, '').split(',').map(s => s.trim()).join(', ') 
//                                   : ''}
//                               </span>
//                             </b>
//                           </Typography>
//                           <Typography variant="body2" component="p" className="sub-title Rating-data">
//                             <b>
//                               <span className="details">
//                                 {item.author_comps && typeof item.author_comps === 'string' 
//                                   ? item.author_comps.replace(/[{"}]/g, '').split(',').map(s => s.trim()).join(', ') 
//                                   : ''}
//                               </span>
//                             </b>
//                           </Typography>
//                           <Typography variant="body2" component="p" className="sub-title Rating-data">
//                             <b>
//                               <span className="details">
//                                 {item.movie_comps && typeof item.movie_comps === 'string' 
//                                   ? item.movie_comps.replace(/[{"}]/g, '').split(',').map(s => s.trim()).join(', ') 
//                                   : ''}
//                               </span>
//                             </b>
//                           </Typography>
//                           <Typography variant="body2" component="p" className="sub-title Rating-data">
//                             <b>
//                               <span className="details">
//                                 {item.tv_comps && typeof item.tv_comps === 'string' 
//                                   ? item.tv_comps.replace(/[{"}]/g, '').split(',').map(s => s.trim()).join(', ') 
//                                   : ''}
//                               </span>
//                             </b>
//                           </Typography>
//                           <Typography variant="body2" component="p" className="sub-title Rating-data">
//                             <b>
//                               <span className="details">
//                                 {item.sub_genres && typeof item.sub_genres === 'string' 
//                                   ? item.sub_genres.replace(/[{"}]/g, '').split(',').map(s => s.trim()).join(', ')
//                                   : ''}
//                               </span>
//                             </b>
//                           </Typography>
//                           {item.pdf_url && (
//                             <Typography variant="body2" component="p" className="sub-title Rating-data">
//                               <b>
//                                 <span className="details">
//                                   <a href={item.pdf_url} download target="_blank" rel="noopener noreferrer">
//                                     Download excerpt
//                                   </a>
//                                 </span>
//                               </b>
//                             </Typography>
//                           )}
//                         </Box>
//                       </Box>
//                     </CardContent>
//                   </Card>
//                 </Grid>
//               ))}
//             </Grid>
//           </Box>
//         </Grid>
//       </Grid>
//     </Box>
//   );
// };

// export default ManuscriptSearch;

const checkMatch = (filters, project) => {
  for (const key in filters) {
    const filterValue = Array.isArray(filters[key]) ? filters[key] : [filters[key]];
    const projectValue = Array.isArray(project[key]) ? project[key] : [project[key]];

    if (filterValue.length === 0) continue;

    const isMatch = filterValue.every(val => projectValue?.includes(val));
    if (!isMatch) return false;
  }

  if (filters.writer) {
    const writerFullName = project.author ? `${project.author.first_name} ${project.author.last_name}`.toLowerCase() : '';
    if (!writerFullName.includes(filters.writer.toLowerCase())) {
      return false;
    }
  }

  return true;
};

// // // import React, { useState, useEffect, useReducer, useCallback } from "react";
// // // import { Box, Grid } from "@mui/material";
// // // import GenreFilter from "./GenreFilter";
// // // import SearchField from "./SearchField";
// // // import ResultsGrid from "./ResultsGrid";
// // // import { supabase } from '../supabaseClient';

// // // const checkMatch = (filters, project) => {
// // //   console.log("HERE!")
// // //   console.log("HERE! F", filters)
// // //   console.log("HERE! P", project)


// // //   for (const key in filters) {
// // //     const filterValue = Array.isArray(filters[key]) ? filters[key] : [filters[key]];
// // //     const projectValue = Array.isArray(project[key]) ? project[key] : [project[key]];

// // //     if (filterValue.length === 0) continue;

// // //     const isMatch = filterValue.every(val => {
// // //       const projectFieldValue = projectValue.join(',').toLowerCase(); 
// // //       return projectFieldValue.includes(val.toLowerCase());
// // //     });

// // //     if (!isMatch) return false;
// // //   }

// // //   if (filters.writer) {
// // //     const writerFullName = project.author ? `${project.author.first_name} ${project.author.last_name}`.toLowerCase() : '';
// // //     if (!writerFullName.includes(filters.writer.toLowerCase())) {
// // //       return false;
// // //     }
// // //   }

// // //   return true;
// // // };

// // // const initialState = {
// // //   search: "",
// // //   selectedFictionGenres: [],
// // //   selectedNonFictionGenres: [],
// // //   selectedBroadGenres: [],
// // //   selectedCategories: [],
// // //   selectedSpecificGenres: [],
// // //   selectedAgeGroups: [],
// // //   results: [],
// // //   allProjects: [],
// // //   user: null,
// // //   bookComp: "",
// // //   authorComp: "",
// // //   filmComp: "",
// // //   TVComp: "",
// // //   title: "",
// // //   writer: "",
// // //   genreData: null,
// // // };

// // // const reducer = (state, action) => {
// // //   switch (action.type) {
// // //     case 'SET_USER':
// // //       return { ...state, user: action.payload };
// // //     case 'SET_SEARCH':
// // //       return { ...state, search: action.payload };
// // //     case 'SET_FICTION_GENRES':
// // //       return { ...state, selectedFictionGenres: action.payload || [] };
// // //     case 'SET_NON_FICTION_GENRES':
// // //       return { ...state, selectedNonFictionGenres: action.payload || [] };
// // //     case 'SET_BROAD_GENRES':
// // //       return { ...state, selectedBroadGenres: action.payload || [] };
// // //     case 'SET_CATEGORIES':
// // //       return { ...state, selectedCategories: action.payload || [] };
// // //     case 'SET_SPECIFIC_GENRES':
// // //       return { ...state, selectedSpecificGenres: action.payload || [] };
// // //     case 'SET_AGE_GROUPS':
// // //       return { ...state, selectedAgeGroups: action.payload || [] };
// // //     case 'SET_RESULTS':
// // //       return { ...state, results: action.payload };
// // //     case 'SET_ALL_PROJECTS':
// // //       return { ...state, allProjects: action.payload };
// // //     case 'SET_GENRE_DATA':
// // //       return { ...state, genreData: action.payload };
// // //     case 'SET_BOOK_COMP':
// // //       return { ...state, bookComp: action.payload };
// // //     case 'SET_AUTHOR_COMP':
// // //       return { ...state, authorComp: action.payload };
// // //     case 'SET_FILM_COMP':
// // //       return { ...state, filmComp: action.payload };
// // //     case 'SET_TV_COMP':
// // //       return { ...state, TVComp: action.payload };
// // //     case 'SET_TITLE':
// // //       return { ...state, title: action.payload };
// // //     case 'SET_WRITER':
// // //       return { ...state, writer: action.payload };
// // //     default:
// // //       return state;
// // //   }
// // // };

// // // const ManuscriptSearch = () => {
// // //   const [state, dispatch] = useReducer(reducer, initialState);
// // //   const {
// // //     search,
// // //     selectedFictionGenres,
// // //     selectedNonFictionGenres,
// // //     selectedBroadGenres,
// // //     selectedCategories,
// // //     selectedSpecificGenres,
// // //     selectedAgeGroups,
// // //     results,
// // //     allProjects,
// // //     user,
// // //     writer,
// // //     bookComp,
// // //     authorComp,
// // //     filmComp,
// // //     TVComp,
// // //     title,
// // //     genreData,
// // //   } = state;

// // //   const fetchGenreData = useCallback(async () => {
// // //     try {
// // //       const { data: genreData, error: genreError } = await supabase
// // //         .from('genre_data')
// // //         .select('*');

// // //       if (genreError) throw genreError;

// // //       const columns = [
// // //         'broad_genre', 'category', 'age_group', 'fiction_genres',
// // //         'non_fiction_genres', 'fantasy', 'mystery', 'picture_book',
// // //         'romance', 'arts_entertainment', 'food_lifestyle', 'home_garden',
// // //         'current_events_social_issues', 'health_wellness', 'history_military',
// // //         'hobbies_interests', 'reference_education', 'relationships_personal_growth'
// // //       ];

// // //       const filteredData = columns.reduce((acc, column) => {
// // //         acc[column] = genreData
// // //           .filter(item => item[column] && item[column].trim() !== '')
// // //           .map(item => ({ value: item[column], label: item[column], subGenres: item.subGenres || [] }));
// // //         return acc;
// // //       }, {});

// // //       dispatch({ type: 'SET_GENRE_DATA', payload: filteredData });
// // //     } catch (err) {
// // //       console.error('Error fetching genre data:', err);
// // //     }
// // //   }, []);

// // //   const fetchAllProjects = useCallback(async () => {
// // //     try {
// // //       const { data: projectsData, error: projectsError } = await supabase
// // //         .from('projects_author')
// // //         .select('*');

// // //       if (projectsError) throw projectsError;

// // //       dispatch({ type: 'SET_ALL_PROJECTS', payload: projectsData });
// // //       dispatch({ type: 'SET_RESULTS', payload: projectsData });
// // //     } catch (err) {
// // //       console.error('Error fetching projects:', err);
// // //     }
// // //   }, []);

// // //   const filterProjects = useCallback(() => {
// // //     const filters = {
// // //       title: search,
// // //       fiction_genre: selectedFictionGenres,
// // //       non_fiction_genre: selectedNonFictionGenres,
// // //       broad_genre: selectedBroadGenres,
// // //       category: selectedCategories,
// // //       specific_genre: selectedSpecificGenres,
// // //       age_group: selectedAgeGroups,
// // //       writer,
// // //       bookComp,
// // //       authorComp,
// // //       filmComp,
// // //       TVComp,
// // //     };

// // //     const isFiltering = Object.values(filters).some(value => value && value.length > 0);

// // //     if (isFiltering) {
// // //       const filteredProjects = allProjects.filter(project => checkMatch(filters, project));
// // //       dispatch({ type: 'SET_RESULTS', payload: filteredProjects });
// // //     } else {
// // //       dispatch({ type: 'SET_RESULTS', payload: allProjects });
// // //     }
// // //   }, [
// // //     search, selectedFictionGenres, selectedNonFictionGenres, selectedBroadGenres,
// // //     selectedCategories, selectedSpecificGenres, selectedAgeGroups, writer,
// // //     bookComp, authorComp, filmComp, TVComp, allProjects
// // //   ]);

// // //   useEffect(() => {
// // //     fetchGenreData();
// // //     fetchAllProjects();
// // //   }, [fetchGenreData, fetchAllProjects]);

// // //   useEffect(() => {
// // //     filterProjects();
// // //   }, [
// // //     search, selectedFictionGenres, selectedNonFictionGenres, selectedBroadGenres,
// // //     selectedCategories, selectedSpecificGenres, selectedAgeGroups, writer,
// // //     bookComp, authorComp, filmComp, TVComp, filterProjects
// // //   ]);

// // //   if (!genreData) {
// // //     return <div>Loading...</div>; // Or any other loading indicator
// // //   }

// // //   return (
// // //     <Box className="main-container">
// // //       <Grid container>
// // //         <Grid item xs={3} className="search-side">
// // //           <Box className="left-bar">
// // //             <GenreFilter
// // //               label="Broad Genres"
// // //               genres={genreData.broad_genre || []}
// // //               selectedGenres={selectedBroadGenres}
// // //               onChange={(e) => dispatch({ type: 'SET_BROAD_GENRES', payload: e.target.value })}
// // //               includeSubGenres={true} // Indicate that sub-genres should be shown
// // //             />
// // //             <GenreFilter
// // //               label="Fiction Genres"
// // //               genres={genreData.fiction_genres || []}
// // //               selectedGenres={selectedFictionGenres}
// // //               onChange={(e) => dispatch({ type: 'SET_FICTION_GENRES', payload: e.target.value })}
// // //               includeSubGenres={true} // Indicate that sub-genres should be shown
// // //             />
// // //             <GenreFilter
// // //               label="Non-Fiction Genres"
// // //               genres={genreData.non_fiction_genres || []}
// // //               selectedGenres={selectedNonFictionGenres}
// // //               onChange={(e) => dispatch({ type: 'SET_NON_FICTION_GENRES', payload: e.target.value })}
// // //               includeSubGenres={true} // Indicate that sub-genres should be shown
// // //             />
// // //             <GenreFilter
// // //               label="Categories"
// // //               genres={genreData.category || []}
// // //               selectedGenres={selectedCategories}
// // //               onChange={(e) => dispatch({ type: 'SET_CATEGORIES', payload: e.target.value })}
// // //             />
// // //             <GenreFilter
// // //               label="Specific Genres"
// // //               genres={genreData.specific_genre || []}
// // //               selectedGenres={selectedSpecificGenres}
// // //               onChange={(e) => dispatch({ type: 'SET_SPECIFIC_GENRES', payload: e.target.value })}
// // //             />
// // //             <GenreFilter
// // //               label="Age Groups"
// // //               genres={genreData.age_group || []}
// // //               selectedGenres={selectedAgeGroups}
// // //               onChange={(e) => dispatch({ type: 'SET_AGE_GROUPS', payload: e.target.value })}
// // //             />
// // //             <SearchField label="Book Comps" value={bookComp} onChange={(e) => dispatch({ type: 'SET_BOOK_COMP', payload: e.target.value })} />
// // //             <SearchField label="Author Comps" value={authorComp} onChange={(e) => dispatch({ type: 'SET_AUTHOR_COMP', payload: e.target.value })} />
// // //             <SearchField label="Film Comps" value={filmComp} onChange={(e) => dispatch({ type: 'SET_FILM_COMP', payload: e.target.value })} />
// // //             <SearchField label="TV Comps" value={TVComp} onChange={(e) => dispatch({ type: 'SET_TV_COMP', payload: e.target.value })} />
// // //             <SearchField label="Title" value={title} onChange={(e) => dispatch({ type: 'SET_TITLE', payload: e.target.value })} />
// // //             <SearchField label="Writer's Name" value={writer} onChange={(e) => dispatch({ type: 'SET_WRITER', payload: e.target.value })} />
// // //           </Box>
// // //         </Grid>
        
// // //         <Grid item xs={9} className="author-projects">
// // //           <Box className="result-container">
// // //             <ResultsGrid results={results} />
// // //           </Box>
// // //         </Grid>
// // //       </Grid>
// // //     </Box>
// // //   );
// // // };

// // // export default ManuscriptSearch;
// // import React, { useState, useEffect, useReducer, useCallback } from "react";
// // import { Box, Grid } from "@mui/material";
// // import GenreFilter from "./GenreFilter";
// // import SearchField from "./SearchField";
// // import ResultsGrid from "./ResultsGrid";
// // import { supabase } from '../supabaseClient';

// // // Function to safely convert to a string
// // const safeString = (value) => {
// //   return typeof value === 'string' ? value : '';
// // };

// // // Function to parse JSON strings safely
// // const parseJSON = (jsonString) => {
// //   try {
// //     return JSON.parse(jsonString);
// //   } catch (error) {
// //     return jsonString; // Return original string if parsing fails
// //   }
// // };

// // const checkMatch = (filters, project) => {
// //   console.log("HERE!")
// //   console.log("HERE! F", filters)
// //   console.log("HERE! P", project)

// //   for (const key in filters) {
// //     const filterValue = Array.isArray(filters[key]) ? filters[key] : [filters[key]];
// //     const projectValue = Array.isArray(project[key]) ? project[key] : [project[key]];

// //     if (filterValue.length === 0) continue;

// //     const isMatch = filterValue.every(val => {
// //       const projectFieldValue = safeString(projectValue.join(',')).toLowerCase(); 
// //       return projectFieldValue.includes(val.toLowerCase());
// //     });

// //     if (!isMatch) return false;
// //   }

// //   if (filters.writer) {
// //     const writerFullName = project.author ? `${project.author.first_name} ${project.author.last_name}`.toLowerCase() : '';
// //     if (!writerFullName.includes(filters.writer.toLowerCase())) {
// //       return false;
// //     }
// //   }

// //   return true;
// // };

// // const initialState = {
// //   search: "",
// //   selectedFictionGenres: [],
// //   selectedNonFictionGenres: [],
// //   selectedBroadGenres: [],
// //   selectedCategories: [],
// //   selectedSpecificGenres: [],
// //   selectedAgeGroups: [],
// //   results: [],
// //   allProjects: [],
// //   user: null,
// //   bookComp: "",
// //   authorComp: "",
// //   filmComp: "",
// //   TVComp: "",
// //   title: "",
// //   writer: "",
// //   genreData: null,
// // };

// // const reducer = (state, action) => {
// //   switch (action.type) {
// //     case 'SET_USER':
// //       return { ...state, user: action.payload };
// //     case 'SET_SEARCH':
// //       return { ...state, search: action.payload };
// //     case 'SET_FICTION_GENRES':
// //       return { ...state, selectedFictionGenres: action.payload || [] };
// //     case 'SET_NON_FICTION_GENRES':
// //       return { ...state, selectedNonFictionGenres: action.payload || [] };
// //     case 'SET_BROAD_GENRES':
// //       return { ...state, selectedBroadGenres: action.payload || [] };
// //     case 'SET_CATEGORIES':
// //       return { ...state, selectedCategories: action.payload || [] };
// //     case 'SET_SPECIFIC_GENRES':
// //       return { ...state, selectedSpecificGenres: action.payload || [] };
// //     case 'SET_AGE_GROUPS':
// //       return { ...state, selectedAgeGroups: action.payload || [] };
// //     case 'SET_RESULTS':
// //       return { ...state, results: action.payload };
// //     case 'SET_ALL_PROJECTS':
// //       return { ...state, allProjects: action.payload };
// //     case 'SET_GENRE_DATA':
// //       return { ...state, genreData: action.payload };
// //     case 'SET_BOOK_COMP':
// //       return { ...state, bookComp: action.payload };
// //     case 'SET_AUTHOR_COMP':
// //       return { ...state, authorComp: action.payload };
// //     case 'SET_FILM_COMP':
// //       return { ...state, filmComp: action.payload };
// //     case 'SET_TV_COMP':
// //       return { ...state, TVComp: action.payload };
// //     case 'SET_TITLE':
// //       return { ...state, title: action.payload };
// //     case 'SET_WRITER':
// //       return { ...state, writer: action.payload };
// //     default:
// //       return state;
// //   }
// // };

// // const ManuscriptSearch = () => {
// //   const [state, dispatch] = useReducer(reducer, initialState);
// //   const {
// //     search,
// //     selectedFictionGenres,
// //     selectedNonFictionGenres,
// //     selectedBroadGenres,
// //     selectedCategories,
// //     selectedSpecificGenres,
// //     selectedAgeGroups,
// //     results,
// //     allProjects,
// //     user,
// //     writer,
// //     bookComp,
// //     authorComp,
// //     filmComp,
// //     TVComp,
// //     title,
// //     genreData,
// //   } = state;

// //   const fetchGenreData = useCallback(async () => {
// //     try {
// //       const { data: genreData, error: genreError } = await supabase
// //         .from('genre_data')
// //         .select('*');

// //       if (genreError) throw genreError;

// //       const columns = [
// //         'broad_genre', 'category', 'age_group', 'fiction_genres',
// //         'non_fiction_genres', 'fantasy', 'mystery', 'picture_book',
// //         'romance', 'arts_entertainment', 'food_lifestyle', 'home_garden',
// //         'current_events_social_issues', 'health_wellness', 'history_military',
// //         'hobbies_interests', 'reference_education', 'relationships_personal_growth'
// //       ];

// //       const filteredData = columns.reduce((acc, column) => {
// //         acc[column] = genreData
// //           .filter(item => item[column] && item[column].trim() !== '')
// //           .map(item => ({ value: item[column], label: item[column], subGenres: item.subGenres || [] }));
// //         return acc;
// //       }, {});

// //       dispatch({ type: 'SET_GENRE_DATA', payload: filteredData });
// //     } catch (err) {
// //       console.error('Error fetching genre data:', err);
// //     }
// //   }, []);

// //   const fetchAllProjects = useCallback(async () => {
// //     try {
// //       const { data: projectsData, error: projectsError } = await supabase
// //         .from('projects_author')
// //         .select('*');

// //       if (projectsError) throw projectsError;

// //       // Parse JSON fields before storing them in state
// //       const parsedProjects = projectsData.map(project => ({
// //         ...project,
// //         broad_genre: parseJSON(project.broad_genre),
// //         category: parseJSON(project.category),
// //         age_group: parseJSON(project.age_group),
// //         genre: parseJSON(project.genre),
// //         specific_genre: parseJSON(project.specific_genre),
// //         novel_comps: parseJSON(project.novel_comps),
// //         author_comps: parseJSON(project.author_comps),
// //         movie_comps: parseJSON(project.movie_comps),
// //         tv_comps: parseJSON(project.tv_comps),
// //         sub_genres: parseJSON(project.sub_genres),
// //       }));

// //       dispatch({ type: 'SET_ALL_PROJECTS', payload: parsedProjects });
// //       dispatch({ type: 'SET_RESULTS', payload: parsedProjects });
// //     } catch (err) {
// //       console.error('Error fetching projects:', err);
// //     }
// //   }, []);

// //   const filterProjects = useCallback(() => {
// //     const filters = {
// //       title: search,
// //       fiction_genre: selectedFictionGenres,
// //       non_fiction_genre: selectedNonFictionGenres,
// //       broad_genre: selectedBroadGenres,
// //       category: selectedCategories,
// //       specific_genre: selectedSpecificGenres,
// //       age_group: selectedAgeGroups,
// //       writer,
// //       bookComp,
// //       authorComp,
// //       filmComp,
// //       TVComp,
// //     };

// //     const isFiltering = Object.values(filters).some(value => value && value.length > 0);

// //     if (isFiltering) {
// //       const filteredProjects = allProjects.filter(project => checkMatch(filters, project));
// //       dispatch({ type: 'SET_RESULTS', payload: filteredProjects });
// //     } else {
// //       dispatch({ type: 'SET_RESULTS', payload: allProjects });
// //     }
// //   }, [
// //     search, selectedFictionGenres, selectedNonFictionGenres, selectedBroadGenres,
// //     selectedCategories, selectedSpecificGenres, selectedAgeGroups, writer,
// //     bookComp, authorComp, filmComp, TVComp, allProjects
// //   ]);

// //   useEffect(() => {
// //     fetchGenreData();
// //     fetchAllProjects();
// //   }, [fetchGenreData, fetchAllProjects]);

// //   useEffect(() => {
// //     filterProjects();
// //   }, [
// //     search, selectedFictionGenres, selectedNonFictionGenres, selectedBroadGenres,
// //     selectedCategories, selectedSpecificGenres, selectedAgeGroups, writer,
// //     bookComp, authorComp, filmComp, TVComp, filterProjects
// //   ]);

// //   if (!genreData) {
// //     return <div>Loading...</div>; // Or any other loading indicator
// //   }

// //   return (
// //     <Box className="main-container">
// //       <Grid container>
// //         <Grid item xs={3} className="search-side">
// //           <Box className="left-bar">
// //             <GenreFilter
// //               label="Broad Genres"
// //               genres={genreData.broad_genre || []}
// //               selectedGenres={selectedBroadGenres}
// //               onChange={(e) => dispatch({ type: 'SET_BROAD_GENRES', payload: e.target.value })}
// //               includeSubGenres={true} // Indicate that sub-genres should be shown
// //             />
// //             <GenreFilter
// //               label="Fiction Genres"
// //               genres={genreData.fiction_genres || []}
// //               selectedGenres={selectedFictionGenres}
// //               onChange={(e) => dispatch({ type: 'SET_FICTION_GENRES', payload: e.target.value })}
// //               includeSubGenres={true} // Indicate that sub-genres should be shown
// //             />
// //             <GenreFilter
// //               label="Non-Fiction Genres"
// //               genres={genreData.non_fiction_genres || []}
// //               selectedGenres={selectedNonFictionGenres}
// //               onChange={(e) => dispatch({ type: 'SET_NON_FICTION_GENRES', payload: e.target.value })}
// //               includeSubGenres={true} // Indicate that sub-genres should be shown
// //             />
// //             <GenreFilter
// //               label="Categories"
// //               genres={genreData.category || []}
// //               selectedGenres={selectedCategories}
// //               onChange={(e) => dispatch({ type: 'SET_CATEGORIES', payload: e.target.value })}
// //             />
// //             <GenreFilter
// //               label="Specific Genres"
// //               genres={genreData.specific_genre || []}
// //               selectedGenres={selectedSpecificGenres}
// //               onChange={(e) => dispatch({ type: 'SET_SPECIFIC_GENRES', payload: e.target.value })}
// //             />
// //             <GenreFilter
// //               label="Age Groups"
// //               genres={genreData.age_group || []}
// //               selectedGenres={selectedAgeGroups}
// //               onChange={(e) => dispatch({ type: 'SET_AGE_GROUPS', payload: e.target.value })}
// //             />
// //             <SearchField label="Book Comps" value={bookComp} onChange={(e) => dispatch({ type: 'SET_BOOK_COMP', payload: e.target.value })} />
// //             <SearchField label="Author Comps" value={authorComp} onChange={(e) => dispatch({ type: 'SET_AUTHOR_COMP', payload: e.target.value })} />
// //             <SearchField label="Film Comps" value={filmComp} onChange={(e) => dispatch({ type: 'SET_FILM_COMP', payload: e.target.value })} />
// //             <SearchField label="TV Comps" value={TVComp} onChange={(e) => dispatch({ type: 'SET_TV_COMP', payload: e.target.value })} />
// //             <SearchField label="Title" value={title} onChange={(e) => dispatch({ type: 'SET_TITLE', payload: e.target.value })} />
// //             <SearchField label="Writer's Name" value={writer} onChange={(e) => dispatch({ type: 'SET_WRITER', payload: e.target.value })} />
// //           </Box>
// //         </Grid>
        
// //         <Grid item xs={9} className="author-projects">
// //           <Box className="result-container">
// //             <ResultsGrid results={results} />
// //           </Box>
// //         </Grid>
// //       </Grid>
// //     </Box>
// //   );
// // };

// // export default ManuscriptSearch;

// import React, { useState, useEffect, useReducer, useCallback } from "react";
// import { Box, Grid } from "@mui/material";
// import GenreFilter from "./GenreFilter";
// import SearchField from "./SearchField";
// import ResultsGrid from "./ResultsGrid";
// import { supabase } from '../supabaseClient';

// // Function to safely convert to a string
// const safeString = (value) => {
//   return typeof value === 'string' ? value : '';
// };

// // Function to parse JSON strings safely
// const parseJSON = (jsonString) => {
//   try {
//     return JSON.parse(jsonString);
//   } catch (error) {
//     return jsonString; // Return original string if parsing fails
//   }
// };

// // const checkMatch = (filters, project) => {
// //   console.log("FILT", filters)
// //   console.log("PROJ", project)
// //   for (const key in filters) {
// //     const filterValue = Array.isArray(filters[key]) ? filters[key] : [filters[key]];
// //     const projectValue = Array.isArray(project[key]) ? project[key] : [project[key]];

// //     if (filterValue.length === 0) continue;

// //     const isMatch = filterValue.every(val => {
// //       const projectFieldValue = safeString(projectValue.join(',')).toLowerCase(); 
// //       return projectFieldValue.includes(val.toLowerCase());
// //     });

// //     if (!isMatch) return false;
// //   }

// //   if (filters.writer) {
// //     const writerFullName = project.author ? `${project.author.first_name} ${project.author.last_name}`.toLowerCase() : '';
// //     if (!writerFullName.includes(filters.writer.toLowerCase())) {
// //       return false;
// //     }
// //   }

// //   return true;
// // };

// const checkMatch = (filters, project) => {
//   // Parse JSON fields in project before comparison
//   const parsedProject = {
//     ...project,
//     broad_genre: parseJSON(project.broad_genre),
//     category: parseJSON(project.category),
//     age_group: parseJSON(project.age_group),
//     genre: parseJSON(project.genre),
//     specific_genre: parseJSON(project.specific_genre),
//     novel_comps: parseJSON(project.novel_comps),
//     author_comps: parseJSON(project.author_comps),
//     movie_comps: parseJSON(project.movie_comps),
//     tv_comps: parseJSON(project.tv_comps),
//     sub_genres: parseJSON(project.sub_genres)
//   };

//   console.log("FILT", filters);
//   console.log("PROJ", parsedProject);

//   // Iterate over all the keys in filters
//   for (const key in filters) {
//     if (!filters[key] || filters[key].length === 0) continue;

//     const filterValue = Array.isArray(filters[key]) ? filters[key] : [filters[key]];
//     const projectValue = Array.isArray(parsedProject[key]) ? parsedProject[key] : [parsedProject[key]];

//     // Convert project values to lowercase strings for comparison
//     const projectFieldValue = projectValue.map(safeString).join(',').toLowerCase();

//     // Check if every filter value is included in the project field value
//     const isMatch = filterValue.every(val => projectFieldValue.includes(val.toLowerCase()));

//     // If not all filters match, return false
//     if (!isMatch) return false;
//   }

//   // Special handling for writer, if provided
//   if (filters.writer) {
//     const writerFullName = parsedProject.author ? `${parsedProject.author.first_name} ${parsedProject.author.last_name}`.toLowerCase() : '';
//     if (!writerFullName.includes(filters.writer.toLowerCase())) {
//       return false;
//     }
//   }

//   return true;
// };



// const initialState = {
//   search: "",
//   selectedFictionGenres: [],
//   selectedNonFictionGenres: [],
//   selectedBroadGenres: [],
//   selectedCategories: [],
//   selectedSpecificGenres: [],
//   selectedAgeGroups: [],
//   results: [],
//   allProjects: [],
//   user: null,
//   bookComp: "",
//   authorComp: "",
//   filmComp: "",
//   TVComp: "",
//   title: "",
//   writer: "",
//   genreData: null,
// };

// const reducer = (state, action) => {
//   switch (action.type) {
//     case 'SET_USER':
//       return { ...state, user: action.payload };
//     case 'SET_SEARCH':
//       return { ...state, search: action.payload };
//     case 'SET_FICTION_GENRES':
//       return { ...state, selectedFictionGenres: action.payload || [] };
//     case 'SET_NON_FICTION_GENRES':
//       return { ...state, selectedNonFictionGenres: action.payload || [] };
//     case 'SET_BROAD_GENRES':
//       return { ...state, selectedBroadGenres: action.payload || [] };
//     case 'SET_CATEGORIES':
//       return { ...state, selectedCategories: action.payload || [] };
//     case 'SET_SPECIFIC_GENRES':
//       return { ...state, selectedSpecificGenres: action.payload || [] };
//     case 'SET_AGE_GROUPS':
//       return { ...state, selectedAgeGroups: action.payload || [] };
//     case 'SET_RESULTS':
//       return { ...state, results: action.payload };
//     case 'SET_ALL_PROJECTS':
//       return { ...state, allProjects: action.payload };
//     case 'SET_GENRE_DATA':
//       return { ...state, genreData: action.payload };
//     case 'SET_BOOK_COMP':
//       return { ...state, bookComp: action.payload };
//     case 'SET_AUTHOR_COMP':
//       return { ...state, authorComp: action.payload };
//     case 'SET_FILM_COMP':
//       return { ...state, filmComp: action.payload };
//     case 'SET_TV_COMP':
//       return { ...state, TVComp: action.payload };
//     case 'SET_TITLE':
//       return { ...state, title: action.payload };
//     case 'SET_WRITER':
//       return { ...state, writer: action.payload };
//     default:
//       return state;
//   }
// };

// const ManuscriptSearch = () => {
//   const [state, dispatch] = useReducer(reducer, initialState);
//   const {
//     search,
//     selectedFictionGenres,
//     selectedNonFictionGenres,
//     selectedBroadGenres,
//     selectedCategories,
//     selectedSpecificGenres,
//     selectedAgeGroups,
//     results,
//     allProjects,
//     user,
//     writer,
//     bookComp,
//     authorComp,
//     filmComp,
//     TVComp,
//     title,
//     genreData,
//   } = state;

//   const fetchGenreData = useCallback(async () => {
//     try {
//       const { data: genreData, error: genreError } = await supabase
//         .from('genre_data')
//         .select('*');

//       if (genreError) throw genreError;

//       const columns = [
//         'broad_genre', 'category', 'age_group', 'fiction_genres',
//         'non_fiction_genres', 'fantasy', 'mystery', 'picture_book',
//         'romance', 'arts_entertainment', 'food_lifestyle', 'home_garden',
//         'current_events_social_issues', 'health_wellness', 'history_military',
//         'hobbies_interests', 'reference_education', 'relationships_personal_growth'
//       ];

//       const filteredData = columns.reduce((acc, column) => {
//         acc[column] = genreData
//           .filter(item => item[column] && item[column].trim() !== '')
//           .map(item => ({ value: item[column], label: item[column], subGenres: item.subGenres || [] }));
//         return acc;
//       }, {});

//       dispatch({ type: 'SET_GENRE_DATA', payload: filteredData });
//     } catch (err) {
//       console.error('Error fetching genre data:', err);
//     }
//   }, []);

//   const fetchAllProjects = useCallback(async () => {
//     try {
//       const { data: projectsData, error: projectsError } = await supabase
//         .from('projects_author')
//         .select('*');

//       if (projectsError) throw projectsError;

//       // Parse JSON fields before storing them in state
//       const parsedProjects = projectsData.map(project => ({
//         ...project,
//         broad_genre: parseJSON(project.broad_genre),
//         category: parseJSON(project.category),
//         age_group: parseJSON(project.age_group),
//         genre: parseJSON(project.genre),
//         specific_genre: parseJSON(project.specific_genre),
//         novel_comps: parseJSON(project.novel_comps),
//         author_comps: parseJSON(project.author_comps),
//         movie_comps: parseJSON(project.movie_comps),
//         tv_comps: parseJSON(project.tv_comps),
//         sub_genres: parseJSON(project.sub_genres),
//       }));

//       dispatch({ type: 'SET_ALL_PROJECTS', payload: parsedProjects });
//       dispatch({ type: 'SET_RESULTS', payload: parsedProjects });
//     } catch (err) {
//       console.error('Error fetching projects:', err);
//     }
//   }, []);

//   const filterProjects = useCallback(() => {
//     const filters = {
//       title: search,
//       fiction_genre: selectedFictionGenres,
//       non_fiction_genre: selectedNonFictionGenres,
//       broad_genre: selectedBroadGenres,
//       category: selectedCategories,
//       specific_genre: selectedSpecificGenres,
//       age_group: selectedAgeGroups,
//       writer,
//       bookComp,
//       authorComp,
//       filmComp,
//       TVComp,
//     };

//     // Only filter if there is some meaningful input
//     const isFiltering = Object.values(filters).some(value => value && value.length > 0);

//     if (isFiltering) {
//       const filteredProjects = allProjects.filter(project => checkMatch(filters, project));
//       dispatch({ type: 'SET_RESULTS', payload: filteredProjects });
//     } else {
//       dispatch({ type: 'SET_RESULTS', payload: allProjects });
//     }
//   }, [
//     search, selectedFictionGenres, selectedNonFictionGenres, selectedBroadGenres,
//     selectedCategories, selectedSpecificGenres, selectedAgeGroups, writer,
//     bookComp, authorComp, filmComp, TVComp, allProjects
//   ]);

//   useEffect(() => {
//     const debounceTimeout = setTimeout(() => {
//       filterProjects();
//     }, 300); // Adjust debounce delay as necessary
  
//     return () => clearTimeout(debounceTimeout); // Cleanup timeout on unmount
//   }, [
//     search, selectedFictionGenres, selectedNonFictionGenres, selectedBroadGenres,
//     selectedCategories, selectedSpecificGenres, selectedAgeGroups, writer,
//     bookComp, authorComp, filmComp, TVComp, filterProjects
//   ]);

//   useEffect(() => {
//     fetchGenreData();
//     fetchAllProjects();
//   }, [fetchGenreData, fetchAllProjects]);

//   if (!genreData) {
//     return <div>Loading...</div>; // Or any other loading indicator
//   }

//   console.log("BOG", results)

//   return (
//     <Box className="main-container">
//       <Grid container>
//         <Grid item xs={3} className="search-side">
//           <Box className="left-bar">
//             <GenreFilter
//               label="Broad Genres"
//               genres={genreData.broad_genre || []}
//               selectedGenres={selectedBroadGenres}
//               onChange={(e) => dispatch({ type: 'SET_BROAD_GENRES', payload: e.target.value })}
//               includeSubGenres={true} // Indicate that sub-genres should be shown
//             />
//             <GenreFilter
//               label="Fiction Genres"
//               genres={genreData.fiction_genres || []}
//               selectedGenres={selectedFictionGenres}
//               onChange={(e) => dispatch({ type: 'SET_FICTION_GENRES', payload: e.target.value })}
//               includeSubGenres={true} // Indicate that sub-genres should be shown
//             />
//             <GenreFilter
//               label="Non-Fiction Genres"
//               genres={genreData.non_fiction_genres || []}
//               selectedGenres={selectedNonFictionGenres}
//               onChange={(e) => dispatch({ type: 'SET_NON_FICTION_GENRES', payload: e.target.value })}
//               includeSubGenres={true} // Indicate that sub-genres should be shown
//             />
//             <GenreFilter
//               label="Categories"
//               genres={genreData.category || []}
//               selectedGenres={selectedCategories}
//               onChange={(e) => dispatch({ type: 'SET_CATEGORIES', payload: e.target.value })}
//             />
//             <GenreFilter
//               label="Specific Genres"
//               genres={genreData.specific_genre || []}
//               selectedGenres={selectedSpecificGenres}
//               onChange={(e) => dispatch({ type: 'SET_SPECIFIC_GENRES', payload: e.target.value })}
//             />
//             <GenreFilter
//               label="Age Groups"
//               genres={genreData.age_group || []}
//               selectedGenres={selectedAgeGroups}
//               onChange={(e) => dispatch({ type: 'SET_AGE_GROUPS', payload: e.target.value })}
//             />
//             <SearchField label="Book Comps" value={bookComp} onChange={(e) => dispatch({ type: 'SET_BOOK_COMP', payload: e.target.value })} />
//             <SearchField label="Author Comps" value={authorComp} onChange={(e) => dispatch({ type: 'SET_AUTHOR_COMP', payload: e.target.value })} />
//             <SearchField label="Film Comps" value={filmComp} onChange={(e) => dispatch({ type: 'SET_FILM_COMP', payload: e.target.value })} />
//             <SearchField label="TV Comps" value={TVComp} onChange={(e) => dispatch({ type: 'SET_TV_COMP', payload: e.target.value })} />
//             <SearchField label="Title" value={title} onChange={(e) => dispatch({ type: 'SET_TITLE', payload: e.target.value })} />
//             <SearchField label="Writer's Name" value={writer} onChange={(e) => dispatch({ type: 'SET_WRITER', payload: e.target.value })} />
//           </Box>
//         </Grid>
        
//         <Grid item xs={9} className="author-projects">
//           <Box className="result-container">
//             <ResultsGrid results={results} />
//           </Box>
//         </Grid>
//       </Grid>
//     </Box>
//   );
// };

// export default ManuscriptSearch;