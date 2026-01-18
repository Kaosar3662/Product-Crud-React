/* eslint-disable react-refresh/only-export-components */
import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Details from './pages/Details';
import Main from './pages/Index';
import { createRoot } from 'react-dom/client';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/products/:slug" element={<Details />} />
      </Routes>
    </BrowserRouter>
  );
}

const root = createRoot(document.getElementById('root'));
root.render(<App />);
