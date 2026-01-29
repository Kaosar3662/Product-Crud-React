import { Link } from "react-router-dom";

const EmailConfirmed = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="border border-black rounded-lg p-10 text-center max-w-md w-full">
        <h1 className="text-2xl font-semibold text-black mb-3">
          Email Verified ✅
        </h1>
        <p className="text-green-700 mb-6">
          Your email has been successfully confirmed.
        </p>

        <Link
          to="/login"
          className="inline-block px-6 py-3 bg-black text-white rounded-lg transition-colors duration-200 hover:bg-blue-600"
        >
          Go to Login
        </Link>
      </div>
    </div>
  );
};

export default EmailConfirmed;
