# Novly

## Overview

Novly is a comprehensive web-based platform designed to revolutionize the novel publishing industry. It connects authors seeking feedback and visibility for their manuscripts with agents and editors looking for promising projects to develop. Built with React and Node.js, Novly focuses equally on frontend and backend functionalities, utilizing multiple APIs and maintaining a robust database to manage user data and other relevant sources.

Deployed here: https://novelysite.netlify.app/

## Table of Contents

- [Novly](#novly)
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

## Features

### For Authors
- User-friendly project submission interface
- Manuscript upload and management
- Query letter and synopsis submission
- Genre and target audience tagging
- Publishing opportunity search
- Submission tracking and status updates
- Public profile creation and management

### For Agents and Editors
- Customizable search preferences
- Advanced filtering options (genre, word count, target audience, etc.)
- Manuscript preview and request system
- Author communication tools
- Project tracking and management
- Public profile management
- Saved/favorited projects view
- Notifications for new matching projects

### General
- Secure user authentication and authorization
- Responsive design for desktop and mobile use
- Real-time notifications
- Analytics dashboard for user insights
- Project search functionality for all users

## User Flows

### Authors
1. Create an account or log in
2. Access dashboard
3. View/edit public profile
4. Create new project or edit existing projects
5. Search available projects

### Publishing Professionals
1. Create an account or log in
2. Access dashboard
3. View/edit public profile
4. View and adjust current searches
5. View saved/favorited projects
6. View notifications for new matching projects
7. Search available projects

## Tech Stack

- Frontend: React.js with Material-UI
- Backend: Node.js with Express.js
- Database: PostgreSQL (via Supabase)
- Authentication: Supabase Auth
- File Storage: Supabase Storage
- State Management: Redux
- API: RESTful with potential for GraphQL integration
- Testing: Jest and React Testing Library
- CI/CD: GitHub Actions

## Databases & APIs

### APIs
- Google Books API: For novel comparisons
- The Movie DB API: For media comparisons

### Database Structure
- Users
- Projects (for writers)
- Author Profiles
- Publishing Profiles
- Genres (Books)
- User-Type (Authors, Agents, Editors, Other Publishing Professionals)
- Book Tropes

## Elevated Features

1. Advanced Search and Recommendation System
   - Sophisticated tagging and search based on genre, themes, and tropes
   - Machine learning algorithms for project recommendations

2. User Profiles with Customizable Dashboards
   - Personalized dashboards for different user roles
   - Customizable public profiles

3. API Integrations for Comprehensive Data Sources
   - Enhanced project listings with comparative data

4. Notifications and Alerts
   - Alert system for matching projects

## Stretch Goals

1. Collaborative Tools for Authors and Professionals
   - Real-time feedback and annotation tools

2. Analytics and Reporting
   - Engagement tracking for authors
   - Market trend analysis for professionals

3. Advanced Agent Search for Authors
   - Extensive database of literary agents and publishers
   - Keyword-based search and filtering

## Prerequisites

- Node.js (v14.0.0 or later)
- npm (v6.0.0 or later) or yarn (v1.22.0 or later)
- Git
- Supabase account
- (Optional) PostgreSQL for local development

## Conclusion

Novly offers a dynamic and supportive ecosystem for the publishing industry, facilitating manuscript visibility and improvement for writers while providing powerful tools for agents and editors to discover and develop promising projects. The integration of advanced functionalities and stretch goals ensures that the platform goes beyond basic CRUD operations, offering a comprehensive solution for all stakeholders in the publishing process.