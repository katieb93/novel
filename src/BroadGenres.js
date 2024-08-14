import React from 'react';
// import GenreFilter from './GenreFilter';


const BroadGenres = () => {
    const genreData = {
        text: 'General',
        description: 'broad_genre',
        items: [
            { text: 'Fiction'},
            { text: 'Non-Fiction' }
        ]
    };

    // No return statement as nothing needs to be displayed
};

export default BroadGenres;

// import React from 'react';
// import GenreFilter from './GenreFilter';

// const BroadGenres = ({ selectedBroadGenres, handleBroadGenreChange }) => {
//     const genreData = {
//         text: 'General',
//         description: 'broad_genre',
//         items: [
//             { value: 'Fiction', label: 'Fiction' },
//             { value: 'Non-Fiction', label: 'Non-Fiction' }
//         ]
//     };

//     return (
//         <GenreFilter
//             label={genreData.text}
//             genres={genreData.items}
//             selectedGenres={selectedBroadGenres}
//             onChange={handleBroadGenreChange}
//         />
//     );
// };

// export default BroadGenres;
