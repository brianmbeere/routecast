// Entry point for React frontend
import React, { useState } from 'react';
import HomePage from './pages/HomePage';
import RouteForm from './pages/RouteForm';
import RouteResult from './pages/RouteResult';

function App() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleResult = (res) => {
    setResult(res);
    setLoading(false);
  };

  const handleFormSubmit = async (...args) => {
    setLoading(true);
    setResult(null);
    // RouteForm will call onResult when done
  };

  return (
    <HomePage>
      <RouteForm onResult={handleResult} loading={loading} />
      <RouteResult result={result} loading={loading} />
    </HomePage>
  );
}

export default App;
