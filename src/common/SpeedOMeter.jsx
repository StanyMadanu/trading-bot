import React from "react";
import GaugeComponent from "react-gauge-component";

const SpeedOMeter = () => {
  return (
    <>
      <GaugeComponent
        value={50}
        type="semicircle"
        labels={{
          tickLabels: {
            type: "outer",
            ticks: [
              { value: 20 },
              { value: 40 },
              { value: 60 },
              { value: 80 },
              { value: 100 },
            ],
          },
        }}
        arc={{
          colorArray: ["#2D799D", "#49B6DD", "#7CDBF9"],
          subArcs: [{ limit: 10 }, { limit: 30 }, {}, {}, {}],
          padding: 0.02,
          width: 0.3,
        }}
        pointer={{
          elastic: true,
          animationDelay: 0,
        }}
      />
    </>
  );
};

export default SpeedOMeter;
