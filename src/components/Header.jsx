import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  const handleTheme = () => {
    document.body.classList.toggle("dark");
  };

  return (
    <div className="header">
      <nav className="navbar navbar-expand-lg bg-light sticky-top">
        <div className="container-fluid">
          {/* <Link to="/" className="navbar-brand">
            Trading Bot
          </Link> */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasNavbar"
            aria-controls="offcanvasNavbar"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div
            className="offcanvas offcanvas-end"
            tabindex="-1"
            id="offcanvasNavbar"
            aria-labelledby="offcanvasNavbarLabel"
          >
            <div className="offcanvas-header">
              <h5 className="offcanvas-title" id="offcanvasNavbarLabel">
                Trading Bot
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="offcanvas"
                aria-label="Close"
              ></button>
            </div>
            <div className="offcanvas-body">
              <ul className="navbar-nav justify-content-start flex-grow-1 pe-3">
                <li className="nav-item">
                  <Link to="/" className="nav-link active" aria-current="page">
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/login" className="nav-link">
                    Login
                  </Link>
                </li>
                <li className="nav-item ms-auto">
                  <div
                    className="theme-toggle rounded-circle ms-auto"
                    onClick={handleTheme}
                  ></div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Header;
