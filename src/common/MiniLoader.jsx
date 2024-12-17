import React from "react";

const MiniLoader = () => {
  return (
    <div className="d-flex justify-content-center align-items-center">
      <div class="pyramid-loader">
        <div class="wrapper">
          <span class="side side1"></span>
          <span class="side side2"></span>
          <span class="side side3"></span>
          <span class="side side4"></span>
          <span class="shadow"></span>
        </div>
      </div>
    </div>
  );
};

export default MiniLoader;
