"use client";

import React, { useState } from 'react';

type SearchResult = {
  title?: string;
  source_type?: string;
  relevance?: string | number;
};

function App() {
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const handleSearch = async () => {
    if (!query) return;
    
    try {
      const response = await fetch(`http://localhost:4000/api/search?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Document Search</h1>
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search documents..."
          style={{
            padding: '10px',
            width: '300px',
            marginRight: '10px',
            border: '1px solid #ccc',
            borderRadius: '4px'
          }}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button 
          onClick={handleSearch}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Search
        </button>
      </div>

      <div>
        {results.length > 0 ? (
          results.map((result: SearchResult, index: number) => (
            <div key={index} style={{ border: '1px solid #ccc', margin: '10px 0', padding: '15px', borderRadius: '4px' }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>{result.title}</h3>
              <p style={{ margin: '0', color: '#666' }}>Type: {result.source_type}</p>
              <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#888' }}>
                Relevance: {typeof result.relevance === 'string' ? parseFloat(result.relevance).toFixed(3) : (result.relevance ?? 0).toFixed(3)}
              </p>
            </div>
          ))
        ) : query ? (
          <p>No results found for &quot;{query}&quot;</p>
        ) : (
          <p>Enter a search term to find documents</p>
        )}
      </div>
    </div>
  );
}

export default App;
