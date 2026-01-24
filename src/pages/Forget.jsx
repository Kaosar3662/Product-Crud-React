

import React, { useState } from 'react';

const Forget = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Add forget password request logic here
  };

  return (
    <div className="flex justify-center items-center min-h-[90vh] bg-white px-4 sm:px-6 lg:px-8">
      <form
        onSubmit={handleSubmit}
        className="p-8 rounded-lg border border-black w-full max-w-2xl"
        style={{ maxWidth: '800px' }}
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Forgot Password</h2>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded hover:bg-blue-600 transition-colors"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default Forget;