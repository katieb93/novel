// import React from 'react';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       {/* You can leave this part or customize it as needed */}
//       <header className="App-header">
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;

// src/App.js

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';


import Home from './home'; // Adjusted import path
import AuthComponent from './authComponent';
import AuthorsLogIn from './authors/authorsLogIn';
import AddProject from './authors/addProject';
import PublishingLogIn from './publishing/publishingLogIn';
import AddSearch from './publishing/addSearch';
import ManuscriptSearch from './manuscriptSearch/manuscriptSearch';
import Dashboard from './authors/Dashboard';
import AuthorProfile from './authors/AuthorProfile';
import PublicAuthorProfile from './authors/PublicAuthorProfile'; // New public profile component


import PubDashboard from './publishing/PubDashboard';
import PubProfile from './publishing/PubProfile';


import Account from './Account';
import Navbar from './NavBar';

import './App.css';


function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className='app-div'>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="authComponnent" element={<AuthComponent />} />

          <Route path="/authors/authorsLogIn" element={<AuthorsLogIn />} />
          <Route path="/authors/addProject" element={<AddProject />} />
          <Route path="/authors/Dashboard" element={<Dashboard />} />
          <Route path="/authors/AuthorProfile" element={<AuthorProfile />} />
          <Route path="/profile/:name" element={<PublicAuthorProfile />} /> {/* Public profile */}


          <Route path="/publishing/publishingLogIn" element={<PublishingLogIn />} />
          <Route path="/publishing/addSearch" element={<AddSearch />} />
          <Route path="/publishing/PubDashboard" element={<PubDashboard />} />
          <Route path="/publishing/PubProfile" element={<PubProfile />} />

          <Route path="Account" element={<Account />} />
          {/* <Route path="NavBar" element={<Navbar />} /> */}
          <Route path="manuscriptSearch" element={<ManuscriptSearch />} />

          {/* // <Route path="/publishing/login" element={<LogIn />} />
          // <Route path="/authors/authorsCreateAccount" element={<AuthorsCreateAccount />} />
          // <Route path="/publishing/publishingCreateAccount" element={<PublishingCreateAccount />} />
          // <Route path="/publishing/profile" element={<ProfilePage />} />
          // <Route path="/publishing/dashboard" element={<PubDashboard />} />
          // <Route path="/authors/addProject" element={<AddProject />} />  */}

        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;


