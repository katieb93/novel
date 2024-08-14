import React from 'react';

const FictionCategories = () => {
    const genreData = {
        text: 'Fiction',
        description: 'category',
        items: [
            { text: 'Novel', next: 2 },
            { text: 'Novella' },
            { text: 'Short Story Collection' },
            { text: 'Picture Book', next: 8 },
            { text: 'Graphic Novel' },
            { text: 'Novel in Verse' },
            { text: 'Poetry Collection' },
            { text: 'Chapter Book' },
            { text: 'Early Reader' }
        ]
    };

    // No return statement as nothing needs to be displayed
};

export default FictionCategories;
