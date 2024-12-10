import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { backEndCall, getJwt } from "../services/mainService";
import { connect, useDispatch, useSelector } from "react-redux";
import { profileRedux } from "./reduxStore/slice/profileSlice";

const Header = () => {
  const [keysLoading, setKeysLoading] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [apiKeys, setApiKeys] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const profile = useSelector((state) => state.getProfile); // Access Redux state

  // Theme Toggle Handler
  const handleTheme = () => {
    document.body.classList.toggle("dark");
  };

  // Fetch profile and API keys
  const fetchKeys = async () => {
    if (keysLoading) return;

    try {
      setKeysLoading(true);
      const res = await backEndCall("/admin_get/profile");

      if (!res) return;

      setProfileData(res);
      setApiKeys(res.profile.api_keys || {});

      // Dispatch the profile data to Redux
      dispatch(profileRedux(res));

      const jwt = getJwt();
      if (jwt && Object.keys(res.profile.api_keys || {}).length > 0) {
        setTimeout(() => navigate("/dashboard"), 200);
      } else {
        setTimeout(() => navigate("/apis"), 200);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setKeysLoading(false);
    }
  };

  useEffect(() => {
    fetchKeys();
  }, [dispatch]);

  // Logout Handler
  const LogoutHandler = () => {
    localStorage.clear();
    localStorage.removeItem("k-token");
    navigate("/"); // Redirect to home or login page
  };

  return (
    <div className="header">
      <nav className="navbar navbar-expand-lg bg-light sticky-top">
        <div className="container-fluid">
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
            tabIndex="-1"
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
                <li>

                  <div onClick={LogoutHandler} className="nav-link ms-auto">
                    Logout
                  </div>


                  {/* <div>{JSON.stringify(profile?.value?.profile?.user_name || "loading..")}</div> */}

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
