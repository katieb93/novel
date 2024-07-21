
import React, { useState } from 'react';
import { supabase } from './supabaseClient'; // Adjust the path based on your project structure
import { useNavigate } from 'react-router-dom';

function AuthComponent({ user_type, redirectUrl }) {
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    user_type: null // Initialize user_type in formData
  });
  const [signedUp, setSignedUp] = useState(false); // Track whether user has signed up
  const navigate = useNavigate();


  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'user_type') {
      setFormData({ ...formData, user_type: value });
    } else {
      setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    }
  };

  const handleSignUp = async () => {
    try {
      let userTypeValue = null;

      // Map user_type to Supabase-specific values for sign-up
      switch (user_type) {
        case 'author':
          userTypeValue = 1;
          break;
        case 'publishing':
          switch (formData.user_type) {
            case 'agent':
              userTypeValue = 2;
              break;
            case 'editor':
              userTypeValue = 3;
              break;
            case 'other':
              userTypeValue = 4;
              break;
            default:
              // Handle default case
              break;
          }
          break;
        default:
          // Handle default case
          break;
      }

      // Sign up with Supabase
      const { error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.first_name,
            last_name: formData.last_name,
            user_type: userTypeValue // Pass mapped user_type to Supabase
          },
          redirectTo: redirectUrl // Corrected redirect option name
        }
      });

      if (signUpError) {
        setError(signUpError.message);
      } else {
        // Automatically sign in after sign up
        await handleSignIn(); // Immediately sign in after successful sign up
        setSignedUp(true); // Set signedUp to true after successful sign-up
      }
    } catch (error) {
      setError(error.message);
    }
  };


  // const handleSignIn = async () => {

   
  //   try {
  //     const {
  //       data: { user },
  //       error,
  //     } = await supabase.auth.signInWithPassword({
  //       email: formData.email,
  //       password: formData.password,
  //     });

  //     console.log("USER NYMPH", user)
  
  //     if (error) {
  //       setError(error.message);
  //     } else {
  //       // ../authors/addProject
  //       // navigate('/Users/katiebrown/site-for-novels/src/authors/addProject.js');

  //       const user_type = user.user_metadata.user_type;
  //       console.log("JAZZY HERE", user_type)

  //       navigate('../authors/addProject');

  //       navigate('../publishing/addSearch');

  //     }
  //   } catch (error) {
  //     setError(error.message);
  //   }
  // };

  const handleSignIn = async () => {

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });


  
      if (error) {
        setError(error.message);
      } else {


        console.log("TIME ZONE ONE", user_type)

  
        if (user_type === 'author') {
          navigate('../authors/addProject');
        } else {
          navigate('../publishing/addSearch');
        }
      }
    } catch (error) {
      setError(error.message);
    }
  };
  

  // Render sign-up form if user has not signed up yet
  if (!signedUp) {
    return (
      <div>
        <h2>Sign Up</h2>
        <form onSubmit={(e) => { e.preventDefault(); handleSignUp(); }}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="first_name"
            placeholder="First Name"
            value={formData.first_name}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="last_name"
            placeholder="Last Name"
            value={formData.last_name}
            onChange={handleInputChange}
            required
          />
          
          {user_type === 'publishing' && (
            <div>
              <label>
                <input
                  type="radio"
                  name="user_type"
                  value="agent"
                  checked={formData.user_type === 'agent'}
                  onChange={handleInputChange}
                />
                Agent
              </label>
              <label>
                <input
                  type="radio"
                  name="user_type"
                  value="editor"
                  checked={formData.user_type === 'editor'}
                  onChange={handleInputChange}
                />
                Editor
              </label>
              <label>
                <input
                  type="radio"
                  name="user_type"
                  value="other"
                  checked={formData.user_type === 'other'}
                  onChange={handleInputChange}
                />
                Other
              </label>
            </div>
          )}
          
          <button type="submit">Sign Up</button>
        </form>
        
        <p>Already have an account? <button onClick={() => setSignedUp(true)}>Sign In</button></p>
        
        {error && <p>{error}</p>}
      </div>
    );
  }

  // Render sign-in form if user has already signed up
  return (
    <div>
      <h2>Sign In</h2>
      <form onSubmit={(e) => { e.preventDefault(); handleSignIn(); }}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleInputChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleInputChange}
          required
        />
        <button type="submit">Sign In</button>
      </form>
      
      {error && <p>{error}</p>}
    </div>
  );
}

export default AuthComponent;
