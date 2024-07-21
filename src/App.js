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

import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className='app-div'>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="authComponnent" element={<AuthComponent />} />

          <Route path="/authors/authorsLogIn" element={<AuthorsLogIn />} />
          <Route path="/authors/addProject" element={<AddProject />} />

          <Route path="/publishing/publishingLogIn" element={<PublishingLogIn />} />
          <Route path="/publishing/addSearch" element={<AddSearch />} />

          

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


