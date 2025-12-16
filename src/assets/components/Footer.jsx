import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      © {new Date().getFullYear()} Movie Review App
    </footer>
  );
};

export default Footer;