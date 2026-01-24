

import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div
        className="p-8 rounded-lg border border-black w-full max-w-3xl text-center"
        style={{ maxWidth: '800px' }}
      >
        <h1 className="text-3xl font-bold mb-4">404 - Page Not Found</h1>
        <p className="mb-6 text-gray-700">The page you are looking for does not exist.</p>
        <Link
          to="/"
          className="inline-block bg-black text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;