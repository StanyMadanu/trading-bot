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
        segments={1000}
        customSegmentStops={[0, 2000, 4000, 6000, 8000, 10000]}
        customSegmentLabels={[
          {
            text: "2K",
            position: "OUTSIDE",
            fontSize: "13px",
            color: "#1C526D",
          },
          {
            text: "4K",
            position: "OUTSIDE",
            fontSize: "13px",
            color: "#1C526D",
          },
          {
            text: "6K",
            position: "OUTSIDE",
            fontSize: "13px",
            color: "#1C526D",
          },
          {
            text: "8K",
            position: "OUTSIDE",
            fontSize: "13px",
            color: "#1C526D",
          },
          {
            text: "10K",
            position: "OUTSIDE",
            fontSize: "13px",
            color: "#1C526D",
          },
        ]}
        needleColor="#000"
        startColor="#1C526D"
        endColor="#7CDBF9"
        fluidWidth={false}
        height={180}
        width={250}
      />
      <p className="text-center mt-2 mb-0 fs-14 text-muted">
        Target: <span className="primary-color">{target}K</span>
      </p>
    </>
  );
};

export default SpeedOMeter;
