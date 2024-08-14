// /Users/katiebrown/site-for-novels/src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gcypbnptdbpevlrblxrh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdjeXBibnB0ZGJwZXZscmJseHJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjAzODE1MTgsImV4cCI6MjAzNTk1NzUxOH0.GHc5pX5SR2kozHOaSx-6aRjL6kX3uk4Wb4x-zrUtORo';
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpja3FkdWtnb3Jnc3J3enZ1aHN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjAxMTg5OTcsImV4cCI6MjAzNTY5NDk5N30.43BZOxXNy15wfpMWFKuJhxZSogatJWmVsWYlDQ6J_OE
// export const supabase = createClient(supabaseUrl, supabaseAnonKey);

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export { supabase };

// import { createClient } from '@supabase/supabase-js';

// const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
// const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

// if (!supabaseUrl || !supabaseAnonKey) {
//   throw new Error('supabaseUrl and supabaseAnonKey are required.');
// }

// const supabase = createClient(supabaseUrl, supabaseAnonKey);

// export { supabase };