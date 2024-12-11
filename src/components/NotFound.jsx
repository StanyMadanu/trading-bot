import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="card">
      <div className="card-body text-center">
        <h3 className="">404 Page Not Found...</h3>

        <span>Take me to </span>
        <Link className="" to="/">
          Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
