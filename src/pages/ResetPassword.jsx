import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import apiService from '../Axios/AxiosCall';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [validToken, setValidToken] = useState(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetSuccess, setResetSuccess] = useState(false);
  
  
  useEffect(() => {
    if (!token || !email) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setValidToken(false);
      return;
    }
    apiService.validateResetToken({ email, token })
    .then(() => setValidToken(true))
    .catch(() => setValidToken(false));
  }, [token, email]);
  
  function handleSubmit(e) {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    apiService.resetPassword({ email, token, new_password: password, confirm_password: confirmPassword })
    .then(() => setResetSuccess(true))
    .catch(() => alert("Failed to reset password"));
  }
  

  if (validToken === false) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 flex flex-col justify-center items-center px-6">
        <div className="bg-white rounded-xl p-8 max-w-md w-full text-center">
          <h2 className="text-2xl font-semibold mb-4">Link expired</h2>
          <p className="mb-6">This password reset link is no longer valid.</p>
          <Link
            to="/forget-pass"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg"
            >
            Request new link
          </Link>
        </div>
      </div>
    );
  }
  
  if (resetSuccess) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 flex flex-col justify-center items-center px-6">
        <div className="bg-white rounded-xl p-8 max-w-md w-full text-center">
          <h2 className="text-2xl font-semibold mb-4">Password reset successful</h2>
          <p className="mb-6">You can now log in with your new password.</p>
          <Link
            to="/login"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  if (validToken === null) {
    // no loading
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="max-w-md w-full bg-white rounded-xl border border-black p-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Reset Password</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              minLength={6}
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              minLength={6}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-black hover:bg-blue-700 text-white font-semibold py-3 rounded-lg"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
}
