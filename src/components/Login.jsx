import React from "react";
import { Link } from "react-router-dom";
import tradingBot from "../assets/images/tradingbot.jpg";
import tradingBott from "../assets/images/tradingbott.webp";

const Login = () => {
  return (
    <div className="login">
      <div className="row align-items-center justify-content-center">
        <div className="col-xl-5 col-lg-5 d-none d-lg-flex login-leftside-content flex-column align-items-center justify-content-center fx-white">
          <img
            className="trading-bot-img"
            src={tradingBott}
            alt="trading-bot"
          />
          <div className="text-center my-3">
            <h4 className="fw-bold secondary-color">Enroll Smart Trading</h4>
            <p className="muted-text fs-14">
              Empowering your trades with precision and <br /> automation – the
              ultimate trading bot solution.
            </p>
          </div>
        </div>
        <div className="col-xl-4 col-lg-5 col-md-6 col-sm-8 col-11">
          <div className="d-flex flex-column align-items-center justify-content-center login-credentials-wrapper rounded px-4 px-lg-5 py-5">
            <h4 className="mb-5 primary-color fw-bold">Login</h4>
            <div className="inputGroup field mb-4">
              <input
                className="inputField px-2"
                type="input"
                placeholder="Name"
                id="userEmail"
                required=""
              />
              <label htmlFor="userEmail" className="inputLabel">
                Username or email
              </label>
            </div>

            <div className="inputGroup field mb-4">
              <input
                className="inputField px-2"
                type="password"
                placeholder="Name"
                id="userPassword"
                required=""
              />
              <label htmlFor="userPassword" className="inputLabel">
                Password
              </label>
            </div>

            <Link to="" className="fs-13 ms-auto mb-2 primary-color">
              Forgot password?
            </Link>

            <div className="w-100 my-3">
              <button className="w-100">Sign in</button>
            </div>

            <div className="my-3">
              <span className="fs-13">Are you new? </span>
              <Link to="" className="fs-13 ms-auto mb-2 primary-color">
                Create an Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
