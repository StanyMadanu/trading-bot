import React from "react";
import { Link } from "react-router-dom";
import Bot404 from "../assets/images/404.png";

const NotFound = () => {
  return (
    <div className="notfound d-flex align-items-center">
      <div className="card">
        <div className="card-body d-flex flex-column align-items-center justify-content-center ">
          <div>
            <img src={Bot404} alt="404-image" />
          </div>
          <div>
            <span>Take me to </span>
            <Link className="" to="/">
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
