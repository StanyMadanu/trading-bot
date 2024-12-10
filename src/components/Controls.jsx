import React from "react";
import Table from "../common/Table";

const Controls = () => {
  //table header data
  const theadData = ["admin controls", "current status", "enable/disable"];

  return (
    <div className="card">
      <div className="card-body">
        <h4>controls</h4>

        <Table thead={theadData} />
      </div>
    </div>
  );
};

export default Controls;
