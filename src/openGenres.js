const GenreData = {
    
    "General": { 
        text: 'General',
        description: 'broad_genre',
        items: [
            { text: 'Fiction', next: 1 },
            { text: 'Non-Fiction', next: 10 }
        ]
    },
    
    "Fiction": {
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
    },
    "Age Group": { 
        text: 'Age Group',
        description: 'age_group',
        items: [
            { text: 'Adult', next: 3 },
            { text: 'New Adult', next: 4 },
            { text: 'Young Adult', next: 4 },
            { text: 'Middle Grade', next: 5 },
        ],
    },
    "Genres": { 
        text: 'Genres',
        description: 'genre',
        items: [
            { text: 'Action/Adventure' },
            { text: 'Book Club' },
            { text: 'Chick Lit' },
            { text: 'Commercial' },
            { text: 'Contemporary' },
            { text: 'Crime/Police' },
            { text: 'Erotica' },
            { text: 'Family Saga' },
            { text: 'Fantasy', next: 6 },
            { text: 'General Fiction' },
            { text: 'Gothic' },
            { text: 'Historical' },
            { text: 'Horror' },
            { text: 'Humor/Satire' },
            { text: 'LGBTQ+' },
            { text: 'Literary Fiction' },
            { text: 'Military/Espionage' },
            { text: 'Multicultural' },
            { text: 'Mystery', next: 7 },
            { text: 'Offbeat/Quirky' },
            { text: 'Romance', next: 9 },
            { text: 'Religious/Inspirational' },
            { text: 'Science Fiction' },
            { text: 'Speculative' },
            { text: 'Thrillers/Suspense' },
            { text: 'Upmarket' },
            { text: 'Western' },
            { text: 'Women\'s Fiction' },
            { text: 'Christian' },
            { text: 'Fantasy' },
            { text: 'Humor' },
            { text: 'Literary' },
            { text: 'Paranormal' },
            { text: 'Paranormal Romance' },
            { text: 'Thriller/Suspense' },
            { text: 'Adventure' }
        ],
    },
    "Fantasy": { 
        text: 'Fantasy',
        description: 'specific_genre',
        items: [
            { text: 'Contemporary/Urban Fantasy' },
            { text: 'Dark Fantasy' },
            { text: 'High/Epic Fantasy' },
            { text: 'Historical Fantasy' },
            { text: 'Magical Realism' },
            { text: 'Paranormal Fantasy' },
            { text: 'Steampunk Fantasy' },
        ],
    },
    "Mystery": { 
        text: 'Mystery',
        description: 'specific_genre',
        items: [
            { text: 'Cozy' },
            { text: 'Historical' },       
        ],
    },
    "Picture Book": { 
        text: 'Picture Book',
        description: 'specific_genre',
        items: [
            { text: 'Picture Book' },
            { text: 'Author' },
            { text: 'Author/Illustrator' },
            { text: 'Illustrator' },
        ],
    },
    "Romance": { 
        text: 'Romance',
        description: 'specific_genre',
        items: [
            { text: 'Amish Romance' },
            { text: 'Romantic Comedy' },   
            { text: 'Contemporary Romance' },
            { text: 'Fantasy Romance' },
            { text: 'Gothic Romance' },
            { text: 'Historical Romance' },
            { text: 'Inspirational Romance' },
            { text: 'LGBTQ+ Romance' },
            { text: 'Multicultural Romance' },
            { text: 'Paranormal Romance' },
            { text: 'Regency Romance' },
            { text: 'Southern Romance' },
            { text: 'Sweet Romance' },       
            { text: 'Romantic Suspense' },  
            { text: 'Western Romance' },
        ],
    },
    "Non-Fiction": {
        text: 'Non-Fiction',
        description: 'category',
        items: [ 
            { text: 'Arts & Entertainment', next: 11 },
            { text: 'Biography & Memoir', next: 12 },
            { text: 'Business & Finance' },
            { text: 'Food & Lifestyle', next: 13 },
            { text: 'Home & Garden', next: 14 },
            { text: 'Current Events & Social Issues', next: 15 },
            { text: 'Health & Wellness', next: 16 },
            { text: 'History & Military', next: 17 },
            { text: 'Hobbies & Interests', next: 18 },
            { text: 'Reference & Education', next: 19 },
            { text: 'Relationships & Personal Growth', next: 20 },
            { text: 'Religion & Spirituality' },
            { text: 'Science & Technology' },
            { text: 'Social Sciences' },
            { text: 'True Crime & Adventure' },
            { text: 'LGBTQ+' },
            { text: 'Multicultural' },
            { text: 'Nature/Ecology' },
            { text: 'Parenting' },
            { text: 'Women\'s Issues' },
            { text: 'Biography' },
            { text: 'Memoir' },
        ],
    },
    "Arts & Entertainment": { 
        "text": "Arts & Entertainment",
        "description": "genre",
        "items": [
            { "text": "General" },
            { "text": "Art/Photography" }
        ]
    },
    "Food & Lifestyle": { 
        "text": "Food & Lifestyle",
        "description": "genre",
        "items": [
            { "text": "Cookbook" },
            { "text": "Food/Lifestyle" }
        ]
    },
    "Home & Garden": { 
        "text": "Home & Garden",
        "description": "genre",
        "items": [
            { "text": "Decorating/Design" },
            { "text": "Gardening" }
        ]
    },
    "Current Events & Social Issues": { 
        "text": "Current Events & Social Issues",
        "description": "genre",
        "items": [
            { "text": "Cultural/Social Issues" },
            { "text": "Current Affairs/Politics" }
        ]
    },
    "Health & Wellness": { 
        "text": "Health & Wellness",
        "description": "genre",
        "items": [
            { "text": "Health/Fitness" },
            { "text": "Psychology" }
        ]
    },
    "History & Military": { 
        "text": "History & Military",
        "description": "genre",
        "items": [
            { "text": "History" },
            { "text": "Military" }
        ]
    },
    "Hobbies & Interests": { 
        "text": "Hobbies & Interests",
        "description": "genre",
        "items": [
            { "text": "How To" },
            { "text": "Humor/Gift Book" },
            { "text": "Pop Culture" },
            { "text": "Pets" },
            { "text": "Sports" },
            { "text": "Travel" }
        ]
    },
    "Reference & Education": { 
        "text": "Reference & Education",
        "description": "genre",
        "items": [
            { "text": "General Non-Fiction" },
            { "text": "Juvenile/Graphic" },
            { "text": "Reference" }
        ]
    },
    "Relationships & Personal Growth": { 
        "text": "Relationships & Personal Growth",
        "description": "genre",
        "items": [
            { "text": "Relationship/Dating" },
            { "text": "Self-Help" }
        ]
    }
}

export default GenreData;

