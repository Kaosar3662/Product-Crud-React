import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiService from '../Axios/AxiosCall';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem('auth');
    if (auth) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShowSuccess(true);
    }
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();

    const response = await apiService.loginUser(formData);

    // assuming axios response structure
    const token = response?.data?.token;

    if (token) {
      const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

      localStorage.setItem(
        'auth',
        JSON.stringify({
          token,
          expiresAt,
        }),
      );
      window.location.reload();
      setShowSuccess(true);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[90vh] bg-white px-4 sm:px-6 lg:px-8">
      {showSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg max-w-md w-full text-center">
            <h2 className="text-2xl font-bold mb-4">Logged in 🎉</h2>
            <p className="mb-6 text-green-700">
              You have been Logged in successfully.
            </p>
            <Link
              to="/"
              className="inline-block bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
            >
              Go to Products
            </Link>
          </div>
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        className="p-8 rounded-lg border border-black w-full max-w-2xl"
        style={{ maxWidth: '800px' }}
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        {/* Email */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Password */}
        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700 mb-2">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Forgot password */}
        <div className="mb-6 text-right">
          <Link
            to="/forget-pass"
            className="text-blue-500 hover:underline text-sm"
          >
            Forgot password?
          </Link>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded hover:bg-blue-600 transition-colors cursor-pointer"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
