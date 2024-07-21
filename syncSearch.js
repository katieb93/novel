const { createClient } = require('@supabase/supabase-js');
const { MeiliSearch } = require('meilisearch');

// Initialize Supabase client
const supabaseUrl = 'https://your-supabase-url.supabase.co';
const supabaseKey = 'your-supabase-key';
const supabase = createClient(supabaseUrl, supabaseKey);

// Initialize MeiliSearch client
const meiliClient = new MeiliSearch({ host: 'http://127.0.0.1:7700' });

const indexData = async () => {
  // Fetch data from Supabase
  const { data, error } = await supabase
    .from('your_table_name')
    .select('*');

  if (error) {
    console.error('Error fetching data from Supabase:', error);
    return;
  }

  // Index data in MeiliSearch
  const index = meiliClient.index('your_index_name');
  const response = await index.addDocuments(data);

  console.log('Data indexed in MeiliSearch:', response);
};

indexData();
