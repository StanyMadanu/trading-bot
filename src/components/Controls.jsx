import React from "react";
import Table from "../common/Table";

const Controls = () => {
  // controls dummy data - use real data later
  const controlsData = [
    { control: "register", currentStatus: "disabled", action: true },
    { control: "login", currentStatus: "disabled", action: true },
    { control: "all bots", currentStatus: "disabled", action: true },
    { control: "amm", currentStatus: "disabled", action: true },
    { control: "binance AMM", currentStatus: "disabled", action: true },
    { control: "bitget AMM", currentStatus: "disabled", action: true },
    { control: "futures", currentStatus: "disabled", action: true },
    { control: "binance futures", currentStatus: "disabled", action: true },
    { control: "bitget futures", currentStatus: "disabled", action: true },
  ];
  return (
    <div className="card controls">
      <div className="card-body">
        <div className="container">
          <h5 className="my-4 text-capitalize primary-color fw-bold text-center">
            admin controls
          </h5>
          <table className="table table-bordered text-center">
            <thead className="thead primary-bg">
              <tr>
                <th>
                  <p className="mb-0 primary-color fs-14 text-capitalize">
                    admin controls
                  </p>
                </th>
                <th>
                  <p className="mb-0 primary-color fs-14 text-capitalize">
                    current status
                  </p>
                </th>
                <th>
                  <p className="mb-0 primary-color fs-14 text-capitalize">
                    enable/disable
                  </p>
                </th>
              </tr>
            </thead>
            <tbody>
              {controlsData?.map((control, index) => (
                <tr key={index}>
                  <td>
                    <p className="mb-0 fs-13 fw-semibold text-capitalize">
                      {control.control}
                    </p>
                  </td>
                  <td>
                    <p className="mb-0 fs-13 fw-semibold text-capitalize">
                      {control.currentStatus}
                    </p>
                  </td>
                  <td>
                    {control.action}
                    <div class="toggle-switch">
                      <input
                        class="toggle-input"
                        id={`toggle-${index}`}
                        type="checkbox"
                      />
                      <label
                        class="toggle-label"
                        htmlFor={`toggle-${index}`}
                      ></label>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Controls;
