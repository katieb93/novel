// import React from 'react';
// import AuthComponent from '../authComponent';

// const PublishingLogIn = () => {

//   const userType = 'publishing'; // user type as a string

//   return (
//     <div>
//       <h1>Authors Login</h1>

//       <AuthComponent user_type={userType} redirectUrl="../publishing/addSearch" />

//     </div>
//   );
// };

// export default PublishingLogIn;



import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import AuthComponent from '../authComponent';

const PublishingLogIn = () => {
  const userType = 'publishing'; // user type as a string

  return (
    <Container maxWidth="sm">
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="100vh">
        <Typography variant="h4" gutterBottom>
          Publishing Login
        </Typography>
        <AuthComponent user_type={userType} redirectUrl="/publishing/PubDashboard" />

      </Box>
    </Container>
  );
};

export default PublishingLogIn;
