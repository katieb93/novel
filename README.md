
# Novely

## Overview

Novely is a comprehensive web-based platform designed to revolutionize the novel publishing industry. It connects authors seeking feedback and visibility for their manuscripts with agents and editors looking for promising projects to develop. Built with React and Node.js, Novely focuses equally on frontend and backend functionalities, utilizing multiple APIs and maintaining a robust database to manage user data and other relevant sources.

Please note, all UI design is in development.

**[Deployed here](https://novelysite.netlify.app/)**

## Table of Contents

- [Novely](#novely)
  - [Overview](#overview)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
    - [For Authors](#for-authors)
    - [For Agents and Editors](#for-agents-and-editors)
    - [General](#general)
  - [User Flows](#user-flows)
    - [Authors](#authors)
    - [Publishing Professionals](#publishing-professionals)
  - [Tech Stack](#tech-stack)
  - [Databases \& APIs](#databases--apis)
    - [APIs](#apis)
    - [Database Structure](#database-structure)
  - [Elevated Features](#elevated-features)
  - [Stretch Goals](#stretch-goals)
  - [Prerequisites](#prerequisites)
  - [Conclusion](#conclusion)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Configuration](#configuration)
    - [Supabase Setup](#supabase-setup)
    - [Search Setup](#search-setup)
  - [Dependencies](#dependencies)
  - [Documentation](#documentation)
    - [Key Components](#key-components)
    - [Specific Search Components](#specific-search-components)
  - [Testing](#testing)
    - [ManuscriptSearch Component Tests](#manuscriptsearch-component-tests)
    - [Example: Publishing Dashboard](#example-publishing-dashboard)
    - [Example: Adding a Search](#example-adding-a-search)
  - [Troubleshooting](#troubleshooting)
  - [Contributors](#contributors)
  - [License](#license)

## Features

### For Authors

-   User-friendly project submission interface (In-Development)
-   Professional Evaluations (In-Development)
-   Manuscript Excerpt upload and management
-   Query letter and synopsis submission
-   Genre and target audience tagging
-   Public profile creation and management

### For Agents and Editors

-   Customizable search preferences (In-Development)
-   Advanced filtering options (genre, word count, target audience, etc.) (In-Development)
-   Author communication tools
-   Public profile management
-   Saved/favorited projects view
-   Notifications for new matching projects (In-Development)

### General

-   Secure user authentication and authorization
-   Responsive design for desktop and mobile use
-   Real-time notifications
-   Analytics dashboard for user insights
-   Project search functionality for all users

## User Flows

### Authors

-   Create an account or log in
-   Access dashboard
-   View/edit public profile
-   Create new project or edit existing projects
-   Search available projects

### Publishing Professionals

-   Create an account or log in
-   Access dashboard
-   View/edit public profile
-   View and adjust current searches
-   View saved/favorited projects
-   View notifications for new matching projects
-   Search available projects

## Tech Stack

-   **Frontend**: React.js with Material-UI
-   **Backend**: Node.js with Express.js
-   **Database**: PostgreSQL (via Supabase)
-   **Authentication**: Supabase Auth
-   **File Storage**: Supabase Storage
-   **State Management**: Redux
-   **API**: RESTful with potential for GraphQL integration
-   **Testing**: Jest and React Testing Library
-   **CI/CD**: GitHub Actions

## Databases & APIs

### APIs

-   **Google Books API**: For novel comparisons
-   **The Movie DB API**: For media comparisons

### Database Structure

-   **Users**
-   **Projects** (for writers)
-   **Author Profiles**
-   **Publishing Profiles**
-   **Genres** (Books)
-   **User-Type** (Authors, Agents, Editors, Other Publishing Professionals)
-   **Book Tropes**

## Elevated Features

-   **Advanced Search and Recommendation System**
    -   Sophisticated tagging and search based on genre, themes, and tropes
    -   Machine learning algorithms for project recommendations
-   **User Profiles with Customizable Dashboards**
    -   Personalized dashboards for different user roles
    -   Customizable public profiles
-   **API Integrations for Comprehensive Data Sources**
    -   Enhanced project listings with comparative data
-   **Notifications and Alerts**
    -   Alert system for matching projects

## Stretch Goals

-   **Collaborative Tools for Authors and Professionals**
    -   Real-time feedback and annotation tools
-   **Analytics and Reporting**
    -   Engagement tracking for authors
    -   Market trend analysis for professionals
-   **Advanced Agent Search for Authors**
    -   Extensive database of literary agents and publishers
    -   Keyword-based search and filtering

## Prerequisites

-   Node.js (v14.0.0 or later)
-   npm (v6.0.0 or later) or yarn (v1.22.0 or later)
-   Git
-   Supabase account
-   (Optional) PostgreSQL for local development

## Conclusion

Novely offers a dynamic and supportive ecosystem for the publishing industry, facilitating manuscript visibility and improvement for writers while providing powerful tools for agents and editors to discover and develop promising projects. The integration of advanced functionalities and stretch goals ensures that the platform goes beyond basic CRUD operations, offering a comprehensive solution for all stakeholders in the publishing process.

## Installation

To get started with Novely, follow these steps:

1.  Clone the repository:
    
    bash
    
    Copy code
    
    `git clone https://github.com/yourusername/Novely.git` 
    
2.  Navigate to the project directory:
    
    bash
    
    Copy code
    
    `cd Novely` 
    
3.  Install dependencies:
    
    bash
    
    Copy code
    
    `npm install` 
    
4.  Set up environment variables:
    
    Create a `.env` file in the root of your project and add the following:
    
    bash
    
    Copy code
    
    `REACT_APP_SUPABASE_URL=https://gcypbnptdbpevlrblxrh.supabase.co
    REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdjeXBibnB0ZGJwZXZscmJseHJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjAzODE1MTgsImV4cCI6MjAzNTk1NzUxOH0.GHc5pX5SR2kozHOaSx-6aRjL6kX3uk4Wb4x-zrUtORo
    
    REACT_APP_GOOGLE_API_KEY=AIzaSyDVmj3OG-NQ-DC3QJSxEMeZ1nHHzgQIPCw
    
    REACT_APP_MOVIE_DB_API_KEY=2e86fdf07364dbc226f56093c21d1a39
    REACT_APP_MOVIE_DB_BEARER_TOKEN=Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyZTg2ZmRmMDczNjRkYmMyMjZmNTYwOTNjMjFkMWEzOSIsInN1YiI6IjY2NmYxZmY3MjlkZDA4ZjBhMGE2MzI4OSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.KLZsIbcES50gM8iqhHjhos8yHjYIFT7a9PvJ4K-Bwck` 
    
5.  Start the development server:
    
    bash
    
    Copy code
    
    `npm start` 
    

## Usage

Novely provides a platform where authors can submit their manuscripts, and publishing professionals can search and review submissions. Key components include:

-   **Home Page**: The entry point of the application with navigation options for authors and publishing professionals.
-   **Search Component**: A powerful search interface allowing users to filter manuscripts based on various genres, categories, and more.
-   **Authentication**: Secure sign-up and login for authors and publishing professionals using Supabase.
-   **User Dashboard**: Separate dashboards for authors and publishing professionals, tailored to their specific needs.
-   **Project Submission**: Authors can submit their projects, including details like genre, age group, and a synopsis.
-   **Profile Management**: Users can update their profiles with awards, credits, and social media links.
-   **Publishing Dashboard**: Publishing professionals have access to a dedicated dashboard where they can manage their profile, view saved searches, bookmarks, and likes.

## Configuration

### Supabase Setup

Ensure that you have the correct Supabase URL and Anon Key in your `.env` file. These keys are essential for authentication and database interaction.

### Search Setup

The search functionality is powered by a custom implementation that interacts with Supabase to filter manuscripts based on various criteria.

## Dependencies

-   **React**: Frontend library for building user interfaces.
-   **Supabase**: Backend as a service for authentication and database.
-   **Material UI**: React components for faster and easier web development.

## Documentation

### Key Components

-   **App.js**: The main component that sets up routing and initializes the application.
-   **Home.js**: The home page, providing entry points for different user types.
-   **AuthComponent.js**: Handles authentication and registration logic for both authors and publishing professionals.
-   **Dashboard.js**: The author’s dashboard, including a carousel of projects and options for adding new projects.
-   **AddProject.js**: A form for authors to submit detailed information about their manuscripts.
-   **ManuscriptSearch.js**: The main component for filtering and displaying search results based on various manuscript attributes.
-   **GenreFilter.js**: A component for selecting genres and subgenres as part of the search criteria.
-   **SearchField.js**: A reusable text field component for entering search terms.
-   **ResultsGrid.js**: Displays search results in a grid format, using the ProjectCard component.
-   **ProjectCard.js**: A card component that displays detailed information about a manuscript, including interactions like bookmarks and likes.
-   **PubDashboard.js**: The main dashboard for publishing professionals, allowing them to manage searches, bookmarks, and likes.
-   **PubProfile.js**: A profile management component for publishing professionals, including social media links, awards, and client titles.
-   **PubSearches.js**: Displays a list of saved searches for publishing professionals.
-   **PubBookmarks.js**: Displays a list of bookmarked projects for publishing professionals.
-   **PubLikes.js**: Displays a list of liked projects for publishing professionals.
-   **AddSearch.js**: Allows publishing professionals to add search criteria for manuscript notifications.
-   **AddSearchNotifications.js**: Handles the logic for notifying publishing professionals when new manuscripts match their search criteria.

### Specific Search Components

-   **PubSearchAuthors.js**: Allows users to search for authors via the Google Books API.
-   **PubSearchBookTitles.js**: Enables searching for book titles using the Google Books API.
-   **PubSearchMovieTitles.js**: Facilitates movie title searches via The Movie Database (TMDb) API.
-   **PubSearchTVTitles.js**: Supports searching for TV show titles using The Movie Database (TMDb) API.
-   **PubSearchSubGenres.js**: Allows users to filter and select subgenres from a predefined list.
-   **SearchAuthors.js**: Provides an interface to search for authors, similar to PubSearchAuthors.js but tailored for general user use.
-   **SearchBookTitles.js**: Allows searching for book titles, similar to PubSearchBookTitles.js but tailored for general user use.
-   **SearchMovieTitles.js**: Provides an interface for movie title searches, similar to PubSearchMovieTitles.js but tailored for general user use.
-   **SearchTVTitles.js**: Allows searching for TV titles, similar to PubSearchTVTitles.js.
-   **SearchSubGenres.js**: Allows users to select subgenres from a predefined list, similar to PubSearchSubGenres.js.

## Testing

The Novely project includes tests to ensure the functionality of key components, particularly those interacting with Supabase and the search features.

### ManuscriptSearch Component Tests

The ManuscriptSearch component has been tested to ensure that it renders correctly and interacts properly with mock data:

javascript

Copy code

`import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ManuscriptSearch from '../manuscriptSearch/manuscriptSearch';
import { supabase } from '../supabaseClient';

// Mock Supabase client to avoid testing actual Supabase functionality
jest.mock('../supabaseClient', () => ({
  supabase: {
    auth: {
      getUser: jest.fn(),
    },
    from: jest.fn(),
  },
}));

describe('ManuscriptSearch Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the ManuscriptSearch component correctly without Supabase interactions', async () => {
    // Mock Supabase responses with dummy data
    supabase.auth.getUser.mockResolvedValue({
      data: {
        user: {
          id: '123',
          email: 'test@example.com',
        },
      },
    });

    supabase.from.mockImplementation((table) => {
      switch (table) {
        case 'genre_data':
          return {
            select: jest.fn().mockResolvedValue({
              data: [
                { broad_genre: 'Fiction', subGenres: [] },
                { broad_genre: 'Non-Fiction', subGenres: [] },
              ],
              error: null,
            }),
          };
        case 'projects_author':
          return {
            select: jest.fn().mockResolvedValue({
              data: [
                {
                  id: 1,
                  user_id: '123',
                  title: 'Test Project',
                  broad_genre: 'Fiction',
                  category: 'Novel',
                  genre: 'Drama',
                },
              ],
              error: null,
            }),
          };
        default:
          return { select: jest.fn().mockResolvedValue({ data: [], error: null }) };
      }
    });

    render(<ManuscriptSearch />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Search')).toBeInTheDocument();
    });
  });

  it('displays user data correctly after mock fetching', async () => {
    // Mock Supabase responses with dummy data
    supabase.auth.getUser.mockResolvedValue({
      data: {
        user: {
          id: '123',
          email: 'test@example.com',
        },
      },
    });

    supabase.from.mockImplementation((table) => {
      switch (table) {
        case 'genre_data':
          return {
            select: jest.fn().mockResolvedValue({
              data: [
                { broad_genre: 'Fiction', subGenres: [] },
                { broad_genre: 'Non-Fiction', subGenres: [] },
              ],
              error: null,
            }),
          };
        case 'projects_author':
          return {
            select: jest.fn().mockResolvedValue({
              data: [],
              error: null,
            }),
          };
        default:
          return { select: jest.fn().mockResolvedValue({ data: [], error: null }) };
      }
    });

    render(<ManuscriptSearch />);

    await waitFor(() => {
      expect(screen.getByText('Search')).toBeInTheDocument();
    });

    expect(supabase.auth.getUser).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Search')).toBeInTheDocument();
  });
});` 

### Example: Publishing Dashboard

The `PubDashboard.js` component allows publishing professionals to manage their interactions with manuscripts. Here's an overview:

javascript

Copy code

`import React from 'react';
import PubDashboard from './publishing/PubDashboard';

const PublishingPage = () => (
  <div>
    <PubDashboard />
  </div>
);

export default PublishingPage;` 

### Example: Adding a Search

The `AddSearch.js` component allows publishing professionals to define search criteria for manuscripts:

javascript

Copy code

`import React from 'react';
import AddSearch from './publishing/AddSearch';

const SearchPage = () => (
  <div>
    <AddSearch />
  </div>
);

export default SearchPage;` 

## Troubleshooting

-   **Authentication Issues**: Ensure your Supabase keys are correctly set up in the `.env` file.
-   **Search Issues**: Verify that the search filters and results logic are correctly implemented and interacting with the backend as expected.
-   **File Upload Issues**: Check that the Supabase storage bucket is correctly configured for uploading manuscript PDFs.
-   **Profile Management Issues**: Ensure that the profile ID is correctly passed to components handling awards, credits, and social media links.

## Contributors

-   **Your Name** - Initial work - [YourWebsite](https://yourwebsite.com)

## License

This project is licensed under the MIT License - see the LICENSE file for details.