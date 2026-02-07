import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import apiService from '../Axios/AxiosCall';

export default function Forget() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email is invalid";
    return newErrors;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    await apiService.request('post', '/forgot-password', { email });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div
          className="flex flex-col items-center justify-center border border-black bg-white p-8 rounded-lg max-w-sm w-full"
        >
          <h2 className="text-xl text-green-600 font-semibold mb-4">
            Password reset link sent
          </h2>
          <p>Check your mail-box</p>
          <Link
            to="/login"
            className="inline-block mt-4 px-6 py-2 bg-black text-white rounded hover:bg-blue-600"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-white px-4">
        <div className="bg-white border border-black rounded-lg p-8 max-w-md w-full">
          <h1 className="text-2xl font-semibold mb-6 text-center">
            Forgot Password
          </h1>
          <form onSubmit={handleSubmit}>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 mb-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            <button
              type="submit"
              className="w-full bg-black text-white py-2 rounded hover:bg-blue-600 transition-colors mt-4"
            >
              Send Reset Link
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
