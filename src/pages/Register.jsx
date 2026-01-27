import React, { useState } from 'react';
import apiService from '../Axios/AxiosCall';
import { Link } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    cpassword: '',
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
      await apiService.registerUser(formData);
      setShowSuccess(true);
  };

  return (
    <div className="flex justify-center items-center min-h-[90vh] bg-white px-4 sm:px-6 lg:px-8">
      {showSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg max-w-md w-full text-center">
            <h2 className="text-2xl font-bold mb-4">Account Created 🎉</h2>
            <p className="mb-6 text-green-300">
              Your account has been created successfully.
            </p>
            <Link
              to="/login"
              className="inline-block bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
            >
              Go to Login
            </Link>
          </div>
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        className="p-8 rounded-lg border border-black w-full max-w-2xl"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>

        {/* Name */}
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 mb-2">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your Name"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

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

        {/* Confirm Password */}
        <div className="mb-4">
          <label htmlFor="confirmPassword" className="block text-gray-700 mb-2">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="cpassword"
            value={formData.cpassword}
            onChange={handleChange}
            placeholder="Confirm Password"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Submit button */}
        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded hover:bg-blue-600 transition-colors cursor-pointer"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default Register;
