import React from "react";
import "./Header.css";

const Header = () => {
  return (
    <nav className="navbar">
      <header className="header">
        <h1 className="logo">Movie Review App</h1>

        <div className="nav-links">
          <a href="#">&nbsp;Home&nbsp;</a>
          <a>&nbsp;&nbsp;|&nbsp;&nbsp;</a>
          <a href="#">&nbsp;All Reviews&nbsp;</a>
          <a>&nbsp;&nbsp;|&nbsp;&nbsp;</a>
          <a href="#">&nbsp;Top Rated&nbsp;</a>
          <a>&nbsp;&nbsp;|&nbsp;&nbsp;</a>
          <a href="#">&nbsp;About&nbsp;</a>
        </div>
      </header>
    </nav>
  );
};

export default Header;
