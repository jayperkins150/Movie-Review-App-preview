import { NavLink } from 'react-router-dom';
import './Header.css';

const Header = () => {
  return (
    <nav className="navbar">
      <header className="header">
        <h1 className="logo">Movie Review App</h1>

        <div className="nav-links">
          <NavLink to="/" className="nav-link">
            Home
          </NavLink>

          <span className="nav-divider">&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;</span>

          <NavLink to="/reviews" className="nav-link">
            All Reviews
          </NavLink>

          <span className="nav-divider">&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;</span>

          <NavLink to="/top-rated" className="nav-link">
            Top Rated
          </NavLink>

          <span className="nav-divider">&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;</span>

          <NavLink to="/about" className="nav-link">
            About
          </NavLink>
        </div>
      </header>
    </nav>
  );
};

export default Header;
