import React from 'react';
import { FiGithub, FiHeart } from 'react-icons/fi';

const Footer = ({ darkMode }) => {
  return (
    <footer className={`py-6 text-center border-t transition-colors duration-300 ${darkMode ? 'bg-slate-800/90 border-slate-700 text-slate-400' : 'bg-gray-100 border-gray-200 text-slate-500'}`}>
      <div className="container mx-auto px-4 text-xs sm:text-sm">
        <p className="flex items-center justify-center">
          &copy; {new Date().getFullYear()} SkillSnap. Made with <FiHeart className={`mx-1 ${darkMode ? 'text-pink-500' : 'text-pink-600'}`} /> by a Developer for Developers.
        </p>
        <a 
          href="https://github.com/aakifsaf/SkillSnap" 
          target="_blank" 
          rel="noopener noreferrer" 
          className={`mt-2 inline-flex items-center font-medium underline transition-colors duration-300 ${darkMode ? 'text-purple-300 hover:text-purple-200' : 'text-purple-600 hover:text-purple-700'}`}
        >
          <FiGithub className="mr-1.5" /> View on GitHub
        </a>
      </div>
    </footer>
  );
};

export default Footer;
