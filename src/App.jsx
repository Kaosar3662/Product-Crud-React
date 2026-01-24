import React from 'react';
import {
  BrowserRouter as Router,
  Outlet,
} from 'react-router-dom';
import Navigation from './Components/Navigation';

function App() {
  return (
    <>
      <Navigation />
      <Outlet />
    </>
  );
}

export default App;
