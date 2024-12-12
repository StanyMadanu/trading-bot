import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { backEndCall, backEndCallObj } from "../services/mainService";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const Controls = () => {
  const [controlsData, setControlsData] = useState({});
  const unwantedKeys = ["_id", "createdAt", "updatedAt", "__v"];
  const toggleRef = useRef(false); // Ref to prevent multiple clicks

  const [Loading, setLoading] = useState(false);

  useLayoutEffect(() => {
    const fetchData = async () => {
      try {
        const data = await backEndCall("/admin_get/get_controls");
        if (data?.success) {
          // console.log(data);
          setControlsData(data.success);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleAction = async (control) => {
    // Prevent unnecessary calls if already loading
    if (Loading) return;

    // Early return for AMM
    if (control === "AMM") {
      console.warn("###### cannot update AMM as of now ######");
      toast.warning("AMM cannot be updated at the moment")
      return;
    }

    setLoading(true);

    // Directly calculate the new value
    const previousValue = controlsData[control];
    const newValue = !previousValue;

    // Optimistic update
    setControlsData((prevData) => ({
      ...prevData,
      [control]: newValue,
    }));

    const payload = {
      key: control,
      value: newValue,
    };

    // console.log("Payload sent to server:", payload);

    try {
      const response = await backEndCallObj("admin/update_controls", payload);
      if (!response || !response.success) {
        throw new Error("Invalid response from server");
      }
      toast.success(response.success);
    } catch (error) {
      console.error("Error updating control:", error);

      // Revert state on failure
      setControlsData((prevData) => ({
        ...prevData,
        [control]: previousValue, // Revert to the previous value
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card controls">
      <div className="card-body">
        <div className="container">
          <h5 className="my-4 text-capitalize primary-color fw-bold text-center">
            admin controls
          </h5>
          <div className="text-end my-4 px-2">
            <Link to="/cronsetting">
              <p className="fs-14 fw-semibold text-capitalize primary-color text-underline-none">
                cron settings
              </p>
            </Link>
          </div>

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
            <tbody className="fs-13">
              {Object.keys(controlsData)
                .filter((key) => !unwantedKeys.includes(key))
                .map((control, index) => (
                  <tr key={index}>
                    <td>
                      <p className="mb-0 fs-13 lh-2 fw-semibold text-capitalize">
                        {control}
                      </p>
                    </td>
                    <td>
                      <p className="mb-0 fs-13 lh-2 fw-semibold text-capitalize">
                        {controlsData[control] ? "Enabled" : "Disabled"}
                      </p>
                    </td>
                    <td>
                      <div
                        className="toggle-switch"
                        onClick={() => handleAction(control)}
                      >
                        <input
                          className="toggle-input"
                          id={`toggle-${index}`}
                          type="checkbox"
                        />
                        <label
                          className="toggle-label"
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
