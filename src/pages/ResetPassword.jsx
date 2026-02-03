import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import apiService from '../Axios/AxiosCall';
import Loading from "../Components/Loading";
import Toaster from "../Components/Toaster";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [validToken, setValidToken] = useState(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetSuccess, setResetSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'info' });

  useEffect(() => {
    if (!token || !email) {
      setValidToken(false);
      return;
    }
    apiService.validateResetToken({ email, token })
    .then(() => setValidToken(true))
    .catch(() => setValidToken(false));
  }, [token, email]);

  const validate = () => {
    const newErrors = {};
    if (!password.trim()) newErrors.password = "Password is required";
    else if (password.length < 6) newErrors.password = "Password must be at least 6 characters";

    if (confirmPassword !== password) newErrors.confirmPassword = "Passwords do not match";

    return newErrors;
  };

  async function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setLoading(true);
    setToast({ message: '', type: 'info' });
    try {
      await apiService.resetPassword({ email, token, new_password: password, confirm_password: confirmPassword });
      setResetSuccess(true);
    } catch (err) {
      setToast({
        message:
          err?.response?.data?.message ||
          err?.message ||
          "Failed to reset password",
        type: "error"
      });
    } finally {
      setLoading(false);
    }
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
      <Loading loading={loading} />
      <Toaster message={toast.message} type={toast.type} />
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
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
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
            {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
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
