import React, { useState, useEffect } from 'react';
import { MeiliSearch } from 'meilisearch';

const client = new MeiliSearch({ host: 'http://127.0.0.1:7700' });
const index = client.index('your_index_name');

const SearchComponent = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (query) {
      index.search(query).then((res) => {
        setResults(res.hits);
      });
    }
  }, [query]);

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
      />
      <ul>
        {results.map((result) => (
          <li key={result.id}>{result.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default SearchComponent;
