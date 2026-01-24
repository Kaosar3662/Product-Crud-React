import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navigation = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(prev => !prev);

  const links = [
    { name: 'Products', path: '/' },
    { name: 'Register', path: '/register' },
    { name: 'Login', path: '/login' },
  ];

  return (
    <>
      <nav className="bg-black w-full fixed z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <div className="shrink-0">
              <Link to="/" className="text-xl font-bold text-white">
                Product_CRUD
              </Link>
            </div>

            {/* Desktop Links */}
            <div className="hidden md:flex space-x-6">
              {links.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="text-white hover:text-blue-500 transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button onClick={toggleMenu} className="text-white focus:outline-none">
                {menuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-white px-2 pt-2 pb-4 space-y-1 shadow-md">
            {links.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="block px-3 py-2 rounded text-white-700 hover:text-blue-500 transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </div>
        )}
      </nav>

      {/* Spacer to prevent content jump */}
      <div className="h-16 md:h-16"></div>
    </>
  );
};

export default Navigation;