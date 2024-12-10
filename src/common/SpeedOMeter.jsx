import React from "react";
import ReactSpeedometer from "react-d3-speedometer";

const SpeedOMeter = ({ title, balance, target }) => {
  return (
    <>
      <p className="text-capitalize primary-color fw-bold fs-14">{title}</p>
      <ReactSpeedometer
        forceRender={true}
        value={balance}
        maxValue={10000}
        segments={5}
        needleColor="#000"
        startColor="#1C526D"
        endColor="#7CDBF9"
        fluidWidth={false}
        height={180}
        width={250}
      />
      <p className="text-center mt-2 mb-0 fs-14 text-muted">
        Target: {target}K
      </p>
    </>
  );
};

export default SpeedOMeter;
