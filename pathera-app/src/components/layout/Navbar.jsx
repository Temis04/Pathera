import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, User, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navbar = ({ onLoginClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const scrollToSection = (sectionId) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsOpen(false);
  };

  return (
    <nav className="bg-white shadow-lg fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-28">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              {/* Replace 'pathera-logo.png' with your actual logo filename */}
              <img
                src="/pathera-logo.png"
                alt="Pathera Logo"
                className="h-[100px] w-auto"
                onError={(e) => {
                  // Fallback to text logo if image doesn't load
                  e.target.style.display = 'none';
                  e.target.nextElementSibling.style.display = 'flex';
                }}
              />
              {/* Fallback text logo (hidden by default, shows if image fails) */}
              <div className="hidden w-12 h-12 bg-gradient-to-r from-primary-500 to-primary-700 rounded-lg items-center justify-center">
                <span className="text-white font-bold text-2xl">P</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-gray-700 hover:text-primary-600 transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  to="/cv-reviewer"
                  className="text-gray-700 hover:text-primary-600 transition-colors"
                >
                  CV Reviewer
                </Link>
                <Link
                  to="/personal-statement"
                  className="text-gray-700 hover:text-primary-600 transition-colors"
                >
                  Personal Statement
                </Link>
                <Link
                  to="/ai-interviewer"
                  className="text-gray-700 hover:text-primary-600 transition-colors"
                >
                  AI Interviewer
                </Link>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 text-gray-700">
                    <User className="w-5 h-5" />
                    <span>{user.name}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 text-red-600 hover:text-red-700 transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <button
                  onClick={() => scrollToSection('features')}
                  className="text-gray-700 hover:text-primary-600 transition-colors"
                >
                  Features
                </button>
                <button
                  onClick={() => scrollToSection('pricing')}
                  className="text-gray-700 hover:text-primary-600 transition-colors"
                >
                  Pricing
                </button>
                <button
                  onClick={() => scrollToSection('testimonials')}
                  className="text-gray-700 hover:text-primary-600 transition-colors"
                >
                  Testimonials
                </button>
                <button
                  onClick={onLoginClick}
                  className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Login / Sign Up
                </button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-primary-600"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="block px-3 py-2 text-gray-700 hover:bg-primary-50 rounded-md"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/cv-reviewer"
                  className="block px-3 py-2 text-gray-700 hover:bg-primary-50 rounded-md"
                  onClick={() => setIsOpen(false)}
                >
                  CV Reviewer
                </Link>
                <Link
                  to="/personal-statement"
                  className="block px-3 py-2 text-gray-700 hover:bg-primary-50 rounded-md"
                  onClick={() => setIsOpen(false)}
                >
                  Personal Statement
                </Link>
                <Link
                  to="/ai-interviewer"
                  className="block px-3 py-2 text-gray-700 hover:bg-primary-50 rounded-md"
                  onClick={() => setIsOpen(false)}
                >
                  AI Interviewer
                </Link>
                <div className="px-3 py-2 text-gray-700 font-medium">
                  {user.name}
                </div>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 rounded-md"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => scrollToSection('features')}
                  className="block w-full text-left px-3 py-2 text-gray-700 hover:bg-primary-50 rounded-md"
                >
                  Features
                </button>
                <button
                  onClick={() => scrollToSection('pricing')}
                  className="block w-full text-left px-3 py-2 text-gray-700 hover:bg-primary-50 rounded-md"
                >
                  Pricing
                </button>
                <button
                  onClick={() => scrollToSection('testimonials')}
                  className="block w-full text-left px-3 py-2 text-gray-700 hover:bg-primary-50 rounded-md"
                >
                  Testimonials
                </button>
                <button
                  onClick={() => {
                    onLoginClick();
                    setIsOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 bg-primary-600 text-white hover:bg-primary-700 rounded-md"
                >
                  Login / Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
