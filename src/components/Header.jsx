import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { backEndCall, getJwt } from "../services/mainService";
import { connect, useDispatch, useSelector } from "react-redux";
import { profileRedux } from "./reduxStore/slice/profileSlice";
import mainLogo from "../assets/images/7pools-logo.png";
import profileImg from "../assets/images/profile-img.png";
import { RiSettings3Fill } from "react-icons/ri";
import { FaPowerOff } from "react-icons/fa";
import { AiFillControl, AiFillApi } from "react-icons/ai";
import { FaUser } from "react-icons/fa6";
import { FaBitcoin } from "react-icons/fa";
import useFetchKeys from "../common/CotextTest";

const Header = () => {
  const [keysLoading, setKeysLoading] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [apiKeys, setApiKeys] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const profile = useSelector((state) => state.getProfile); // Access Redux state

  const {fetchKeys} = useFetchKeys();

  // Theme Toggle Handler
  const handleTheme = () => {
    document.body.classList.toggle("dark");
  };

  // Fetch profile and API keys
 

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
    <div className="header p-2">
      <div className="card">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center flex-wrap">
            <div className="d-flex gap-5 flex-wrap">
              <div className="d-flex gap-3 align-items-center">
                <Link to="/">
                  <img src={mainLogo} alt="7pools-logo" />
                </Link>
                <h5 className="mb-0 text-uppercase fw-bold d-flex align-items-center">
                  trading bot
                </h5>
              </div>

              <div>
                <h6 className="text-capitalize primary-color">bot status</h6>
                <div className="d-flex align-items-center gap-2">
                  <p className="mb-0 flex-fill text-capitalize fs-13">
                    binance
                  </p>
                  <progress
                    className="custom-progress"
                    max="100"
                    value="90"
                  ></progress>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <p className="mb-0 flex-fill text-capitalize fs-13">bitget</p>
                  <progress
                    className="custom-progress bitget-progress"
                    max="100"
                    value="60"
                  ></progress>
                </div>
              </div>
            </div>

            <div className="dropdown ms-auto border-0">
              <div
                className="dropdown-toggle d-flex align-items-center justify-content-end"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <div className="profile-wrapper">
                  <img src={profileImg} alt="user-profile" />
                </div>
              </div>
              <ul className="dropdown-menu border-0 shadow-lg px-3">
                <li>
                  <div className="d-flex gap-2 px-3 border-bottom py-2">
                    <div className="profile-wrapper">
                      <img src={profileImg} alt="user-profile" />
                    </div>
                    <div>
                      <p className="mb-0 fs-14 fw-semibold">Pavan Rebba</p>
                      <p className="mb-0 fs-13 text-secondary">
                        info@example.com
                      </p>
                    </div>
                  </div>
                </li>
                <li className="pt-2">
                  <Link to="/api" className="dropdown-item text-secondary">
                    <span className="me-2">
                      <AiFillApi size={17} />
                    </span>
                    <span className="fs-14 fw-semibold">API</span>
                  </Link>
                </li>
                <li>
                  <Link to="/addcoins" className="dropdown-item text-secondary">
                    <span className="me-2">
                      <FaBitcoin size={17} />
                    </span>
                    <span className="fs-14 fw-semibold">Add Coins</span>
                  </Link>
                </li>
                <li className="pb-2">
                  <Link to="/controls" className="dropdown-item text-secondary">
                    <span className="me-2">
                      <AiFillControl size={17} />
                    </span>
                    <span className="fs-14 fw-semibold">Admin Controls</span>
                  </Link>
                </li>
                <li className="border-top text-center py-2">
                  <Link to="/" className="dropdown-item text-secondary">
                    <span className="me-2">
                      <FaPowerOff size={15} />
                    </span>
                    <span className="fs-14 fw-semibold">Logout</span>
                  </Link>
                </li>
                <li>
                  <div className="d-flex gap-1 align-items-center justify-content-center py-2">
                    <span className="fs-13 text-muted">Theme</span>
                    <div
                      className="theme-toggle rounded-circle"
                      onClick={handleTheme}
                    ></div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
