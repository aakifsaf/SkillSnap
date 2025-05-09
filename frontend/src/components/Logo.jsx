import React from 'react';
import { Link } from 'react-router-dom';

const Logo = ({ darkMode }) => (
  <Link to="/" className={`text-3xl font-bold transition-colors duration-300 ${darkMode ? 'text-white hover:text-purple-300' : 'text-slate-800 hover:text-purple-600'}`}>
    Skill<span className={`${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>Snap</span>
  </Link>
);

export default Logo;
