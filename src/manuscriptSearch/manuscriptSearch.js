import React, { useEffect, useReducer, useCallback } from "react";
import { Box, Grid, Button } from "@mui/material";
import GenreFilter from "./GenreFilter";
import SearchField from "./SearchField";
import ResultsGrid from "./ResultsGrid";
import { supabase } from '../supabaseClient';

const safeString = (value) => {
  return typeof value === 'string' ? value : '';
};

const parseJSON = (jsonString) => {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    return jsonString; // Return original string if parsing fails
  }
};

const checkMatch = (filters, project) => {
  console.log('Initial filters:', filters);
  console.log('Initial project:', project);

  const parsedProject = {
    ...project,
    broad_genre: parseJSON(project.broad_genre),
    category: parseJSON(project.category),
    age_group: parseJSON(project.age_group),
    genre: parseJSON(project.genre),
    specific_genre: parseJSON(project.specific_genre),
    novel_comps: parseJSON(project.novel_comps),
    author_comps: parseJSON(project.author_comps),
    movie_comps: parseJSON(project.movie_comps),
    tv_comps: parseJSON(project.tv_comps),
    sub_genres: parseJSON(project.sub_genres)
  };

  console.log('Parsed project:', parsedProject);

  for (const key in filters) {
    console.log(`Processing filter key: ${key}`);
    console.log(`Filter value:`, filters[key]);

    if (!filters[key] || filters[key].length === 0) {
      console.log(`Filter for key "${key}" is empty or undefined. Continuing.`);
      continue;
    }

    const filterValue = Array.isArray(filters[key]) ? filters[key] : [filters[key]];

    let projectValue;
    if (key === 'fiction_specific_genres' || key === 'non_fiction_specific_genres') {
      projectValue = parsedProject.specific_genre || [];
    } else if (key === 'fiction_genre' || key === 'non_fiction_genre') {
      projectValue = parsedProject.genre || [];
    } else {
      projectValue = Array.isArray(parsedProject[key]) ? parsedProject[key] : [parsedProject[key]];
    }

    console.log(`Filter array for key "${key}":`, filterValue);
    console.log(`Project array for key "${key}":`, projectValue);

    if (!projectValue || !Array.isArray(projectValue)) {
      projectValue = [safeString(projectValue)];
    }

    const projectFieldValue = projectValue.map(safeString).join(',').toLowerCase();

    console.log(`Combined and lowercased project field value for key "${key}":`, projectFieldValue);

    const isMatch = filterValue.every(val => {
      const filterLowerCase = val.toLowerCase();
      console.log(`Checking if "${filterLowerCase}" is included in "${projectFieldValue}"`);
      return projectFieldValue.includes(filterLowerCase);
    });

    console.log(`Is match for key "${key}":`, isMatch);

    if (!isMatch) {
      console.log(`Filter for key "${key}" did not match. Exiting.`);
      return false;
    }
  }

  console.log('All filters matched successfully.');
  return true;
};

const initialState = {
  search: "",
  selectedFictionGenres: [],
  selectedNonFictionGenres: [],
  selectedFictionSpecificGenres: [],
  selectedNonFictionSpecificGenres: [],
  selectedBroadGenres: [],
  selectedCategories: [],
  selectedAgeGroups: [],
  results: [],
  allProjects: [],
  user: null,
  novel_comps: "",
  author_comps: "",
  movie_comps: "",
  tv_comps: "",
  title: "",
  writer: "",
  genreData: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_SEARCH':
      return { ...state, search: action.payload };
    case 'SET_FICTION_GENRES':
      return { ...state, selectedFictionGenres: action.payload || [] };
    case 'SET_NON_FICTION_GENRES':
      return { ...state, selectedNonFictionGenres: action.payload || [] };
    case 'SET_FICTION_SPECIFIC_GENRES':
      return { ...state, selectedFictionSpecificGenres: action.payload || [] };
    case 'SET_NON_FICTION_SPECIFIC_GENRES':
      return { ...state, selectedNonFictionSpecificGenres: action.payload || [] };
    case 'SET_BROAD_GENRES':
      return { ...state, selectedBroadGenres: action.payload || [] };
    case 'SET_CATEGORIES':
      return { ...state, selectedCategories: action.payload || [] };
    case 'SET_AGE_GROUPS':
      return { ...state, selectedAgeGroups: action.payload || [] };
    case 'SET_RESULTS':
      return { ...state, results: action.payload };
    case 'SET_ALL_PROJECTS':
      return { ...state, allProjects: action.payload };
    case 'SET_GENRE_DATA':
      return { ...state, genreData: action.payload };
    case 'SET_BOOK_COMP':
      return { ...state, bookComp: action.payload };
    case 'SET_AUTHOR_COMPS':
      return { ...state, author_comps: action.payload };
    case 'SET_FILM_COMP':
      return { ...state, movie_comps: action.payload };
    case 'SET_TV_COMPS':
      return { ...state, tv_comps: action.payload };
    case 'SET_TITLE':
      return { ...state, title: action.payload };
    case 'SET_WRITER':
      return { ...state, writer: action.payload };
    default:
      return state;
  }
};

const ManuscriptSearch = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const {
    selectedFictionGenres,
    selectedNonFictionGenres,
    selectedFictionSpecificGenres,
    selectedNonFictionSpecificGenres,
    selectedBroadGenres,
    selectedCategories,
    selectedAgeGroups,
    results,
    allProjects,
    writer,
    bookComp,
    author_comps,
    movie_comps,
    tv_comps,
    title,
    genreData,
    user, 
  } = state;

  const fetchUser = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
  
      if (!user) {
        throw new Error("User not logged in");
      }

      console.log("data", user)
  
      dispatch({ type: 'SET_USER', payload: user });
    } catch (err) {
      console.error('Error fetching user:', err);
    }
  }, []);

  const fetchGenreData = useCallback(async () => {
    try {
      const { data: genreData, error: genreError } = await supabase
        .from('genre_data')
        .select('*');

      if (genreError) throw genreError;

      const filteredData = {
        broad_genre: [],
        category: [],
        age_group: [],
        fiction_genres: [],
        non_fiction_genres: [],
        fiction_specific_genres: [],
        non_fiction_specific_genres: [],
      };

      genreData.forEach(item => {
        if (item.broad_genre && item.broad_genre.trim() !== '') {
          filteredData.broad_genre.push({ value: item.broad_genre, label: item.broad_genre });
        }

        if (item.category && item.category.trim() !== '') {
          filteredData.category.push({ value: item.category, label: item.category });
        }

        if (item.age_group && item.age_group.trim() !== '') {
          filteredData.age_group.push({ value: item.age_group, label: item.age_group });
        }

        if (item.fiction_genres && item.fiction_genres.trim() !== '') {
          filteredData.fiction_genres.push({ value: item.fiction_genres, label: item.fiction_genres });
        }

        if (item.non_fiction_genres && item.non_fiction_genres.trim() !== '') {
          filteredData.non_fiction_genres.push({ value: item.non_fiction_genres, label: item.non_fiction_genres });
        }

        if (item.fantasy && item.fantasy.trim() !== '') {
          filteredData.fiction_specific_genres.push({ value: item.fantasy, label: item.fantasy });
        }
        if (item.mystery && item.mystery.trim() !== '') {
          filteredData.fiction_specific_genres.push({ value: item.mystery, label: item.mystery });
        }
        if (item.picture_book && item.picture_book.trim() !== '') {
          filteredData.fiction_specific_genres.push({ value: item.picture_book, label: item.picture_book });
        }
        if (item.romance && item.romance.trim() !== '') {
          filteredData.fiction_specific_genres.push({ value: item.romance, label: item.romance });
        }

        if (item.arts_entertainment && item.arts_entertainment.trim() !== '') {
          filteredData.non_fiction_specific_genres.push({ value: item.arts_entertainment, label: item.arts_entertainment });
        }
        if (item.food_lifestyle && item.food_lifestyle.trim() !== '') {
          filteredData.non_fiction_specific_genres.push({ value: item.food_lifestyle, label: item.food_lifestyle });
        }
        if (item.home_garden && item.home_garden.trim() !== '') {
          filteredData.non_fiction_specific_genres.push({ value: item.home_garden, label: item.home_garden });
        }
        if (item.current_events_social_issues && item.current_events_social_issues.trim() !== '') {
          filteredData.non_fiction_specific_genres.push({ value: item.current_events_social_issues, label: item.current_events_social_issues });
        }
        if (item.health_wellness && item.health_wellness.trim() !== '') {
          filteredData.non_fiction_specific_genres.push({ value: item.health_wellness, label: item.health_wellness });
        }
        if (item.history_military && item.history_military.trim() !== '') {
          filteredData.non_fiction_specific_genres.push({ value: item.history_military, label: item.history_military });
        }
        if (item.hobbies_interests && item.hobbies_interests.trim() !== '') {
          filteredData.non_fiction_specific_genres.push({ value: item.hobbies_interests, label: item.hobbies_interests });
        }
        if (item.reference_education && item.reference_education.trim() !== '') {
          filteredData.non_fiction_specific_genres.push({ value: item.reference_education, label: item.reference_education });
        }
        if (item.relationships_personal_growth && item.relationships_personal_growth.trim() !== '') {
          filteredData.non_fiction_specific_genres.push({ value: item.relationships_personal_growth, label: item.relationships_personal_growth });
        }
      });

      console.log("filteredData", filteredData)

      dispatch({ type: 'SET_GENRE_DATA', payload: filteredData });
    } catch (err) {
      console.error('Error fetching genre data:', err);
    }
  }, []);

  const fetchAllProjects = useCallback(async () => {
    try {
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects_author')
        .select('*');
  
      if (projectsError) throw projectsError;
  
      const userIds = projectsData.map(project => project.user_id);
  
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .in('id', userIds);
  
      if (profilesError) throw profilesError;
  
      const projectsWithAuthors = projectsData.map(project => {
        const authorProfile = profilesData.find(profile => profile.id === project.user_id);
        return {
          ...project,
          author: authorProfile ? `${authorProfile.first_name} ${authorProfile.last_name}` : 'Unknown Author',
        };
      });
  
      const parsedProjects = projectsWithAuthors.map(project => ({
        ...project,
        broad_genre: parseJSON(project.broad_genre),
        category: parseJSON(project.category),
        age_group: parseJSON(project.age_group),
        genre: parseJSON(project.genre),
        specific_genre: parseJSON(project.specific_genre),
        novel_comps: parseJSON(project.novel_comps),
        author_comps: parseJSON(project.author_comps),
        movie_comps: parseJSON(project.movie_comps),
        tv_comps: parseJSON(project.tv_comps),
        sub_genres: parseJSON(project.sub_genres),
      }));
  
      dispatch({ type: 'SET_ALL_PROJECTS', payload: parsedProjects });
      dispatch({ type: 'SET_RESULTS', payload: parsedProjects });
    } catch (err) {
      console.error('Error fetching projects:', err);
    }
  }, []);
  

  // const fetchAllProjects = useCallback(async () => {
  //   try {
  //     const { data: projectsData, error: projectsError } = await supabase
  //       .from('projects_author')
  //       .select('*');
  
  //     if (projectsError) throw projectsError;
  
  //     const userIds = projectsData.map(project => project.user_id);
  
  //     const { data: profilesData, error: profilesError } = await supabase
  //       .from('profiles')
  //       .select('*')
  //       .in('id', userIds);
  
  //     if (profilesError) {
  //       console.error('Error fetching profiles data:', profilesError);
  //       return;
  //     }
  
  //     const projectsWithAuthors = projectsData.map(project => {
  //       const authorProfile = profilesData.find(profile => profile.id === project.user_id);
  //       return {
  //         ...project,
  //         author: authorProfile ? `${authorProfile.first_name} ${authorProfile.last_name}` : 'Unknown Author',
  //       };
  //     });

  //     console.log("HELM", projectsWithAuthors)
  
  //     const parsedProjects = projectsWithAuthors.map(project => ({
  //       ...project,
  //       broad_genre: parseJSON(project.broad_genre),
  //       category: parseJSON(project.category),
  //       age_group: parseJSON(project.age_group),
  //       genre: parseJSON(project.genre),
  //       specific_genre: parseJSON(project.specific_genre),
  //       novel_comps: parseJSON(project.novel_comps),
  //       author_comps: parseJSON(project.author_comps),
  //       movie_comps: parseJSON(project.movie_comps),
  //       tv_comps: parseJSON(project.tv_comps),
  //       sub_genres: parseJSON(project.sub_genres),
  //     }));
  
  //     dispatch({ type: 'SET_ALL_PROJECTS', payload: parsedProjects });
  //     dispatch({ type: 'SET_RESULTS', payload: parsedProjects });
  //   } catch (err) {
  //     console.error('Error fetching projects:', err);
  //   }
  // }, []);

  const applyFilters = useCallback(() => {
    const filters = {
      title,
      fiction_genre: selectedFictionGenres,
      non_fiction_genre: selectedNonFictionGenres,
      fiction_specific_genres: selectedFictionSpecificGenres,
      non_fiction_specific_genres: selectedNonFictionSpecificGenres,
      broad_genre: selectedBroadGenres,
      category: selectedCategories,
      age_group: selectedAgeGroups,
      writer,
      bookComp,
      author_comps,
      movie_comps,
      tv_comps,
    };
  
    const isFiltering = Object.values(filters).some(value => value && value.length > 0);
  
    if (isFiltering) {
      const filteredProjects = allProjects.filter(project => checkMatch(filters, project));
      dispatch({ type: 'SET_RESULTS', payload: filteredProjects });
    } else {
      dispatch({ type: 'SET_RESULTS', payload: allProjects });
    }
  }, [
    title, selectedFictionGenres, selectedNonFictionGenres, selectedFictionSpecificGenres,
    selectedNonFictionSpecificGenres, selectedBroadGenres, selectedCategories,
    selectedAgeGroups, writer, bookComp, author_comps, movie_comps, tv_comps, allProjects
  ]);
  
  const handleSearchClick = () => {
    applyFilters();
  };

  useEffect(() => {
    fetchUser();
    fetchGenreData();
    fetchAllProjects();
  }, [fetchUser, fetchGenreData, fetchAllProjects]);

  if (!genreData) {
    return <div>Loading...</div>; // Or any other loading indicator
  }

  return (
    <Box className="main-container">
      <Grid container>
        <Grid item xs={3} className="search-side">
          <Box className="left-bar">
            <Button variant="contained" color="primary" onClick={handleSearchClick} sx={{ marginBottom: '16px' }}>
              Search
            </Button>
            <GenreFilter
              label="Broad Genres"
              genres={genreData.broad_genre || []}
              selectedGenres={selectedBroadGenres}
              onChange={(e) => dispatch({ type: 'SET_BROAD_GENRES', payload: e.target.value })}
              includeSubGenres={true}
            />
            <GenreFilter
              label="Fiction Genres"
              genres={genreData.fiction_genres || []}
              selectedGenres={selectedFictionGenres}
              onChange={(e) => dispatch({ type: 'SET_FICTION_GENRES', payload: e.target.value })}
              includeSubGenres={true}
            />
            <GenreFilter
              label="Non-Fiction Genres"
              genres={genreData.non_fiction_genres || []}
              selectedGenres={selectedNonFictionGenres}
              onChange={(e) => dispatch({ type: 'SET_NON_FICTION_GENRES', payload: e.target.value })}
              includeSubGenres={true}
            />
            <GenreFilter
              label="Fiction Specific Genres"
              genres={genreData.fiction_specific_genres || []}
              selectedGenres={selectedFictionSpecificGenres}
              onChange={(e) => dispatch({ type: 'SET_FICTION_SPECIFIC_GENRES', payload: e.target.value })}
            />
            <GenreFilter
              label="Non-Fiction Specific Genres"
              genres={genreData.non_fiction_specific_genres || []}
              selectedGenres={selectedNonFictionSpecificGenres}
              onChange={(e) => dispatch({ type: 'SET_NON_FICTION_SPECIFIC_GENRES', payload: e.target.value })}
            />
            <GenreFilter
              label="Categories"
              genres={genreData.category || []}
              selectedGenres={selectedCategories}
              onChange={(e) => dispatch({ type: 'SET_CATEGORIES', payload: e.target.value })}
            />
            <GenreFilter
              label="Age Groups"
              genres={genreData.age_group || []}
              selectedGenres={selectedAgeGroups}
              onChange={(e) => dispatch({ type: 'SET_AGE_GROUPS', payload: e.target.value })}
            />
            <SearchField label="Book Comps" value={bookComp} onChange={(e) => dispatch({ type: 'SET_BOOK_COMP', payload: e.target.value })} />
            <SearchField label="Author Comps" value={author_comps} onChange={(e) => dispatch({ type: 'SET_AUTHOR_COMPS', payload: e.target.value })} />
            <SearchField label="Film Comps" value={movie_comps} onChange={(e) => dispatch({ type: 'SET_FILM_COMP', payload: e.target.value })} />
            <SearchField label="TV Comps" value={tv_comps} onChange={(e) => dispatch({ type: 'SET_TV_COMPS', payload: e.target.value })} />
            <SearchField label="Title" value={title} onChange={(e) => dispatch({ type: 'SET_TITLE', payload: e.target.value })} />
            <SearchField label="Writer's Name" value={writer} onChange={(e) => dispatch({ type: 'SET_WRITER', payload: e.target.value })} />
          </Box>
        </Grid>
        
        <Grid item xs={9} className="author-projects">
          <Box className="result-container">
            <ResultsGrid results={results} user={user} />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ManuscriptSearch;
