import React, { useEffect, useRef, useState } from "react";
import Table from "../../common/Table";
import {
  backEndCallObj,
  backEndCallObjNoDcyt,
} from "../../services/mainService";
import { bitgetSpotRedx } from "../reduxStore/slice/bitgitspotSlice";
import { connect } from "react-redux";
import BitgetSpotTable from "../../common/BitgetSpotTable";
import ConfirmPopup from "../models/ConfirmPopup";
import EditInvestment from "../models/EditInvestmentModel";
import AddBot from "../models/AddBotModal";
import { toast } from "react-toastify";
import useFetchKeys from "../../common/CotextTest";
import { useNavigate } from "react-router-dom";

const BinanceSpotBot = ({ dispatch, bitgetSpot, getProfile }) => {
  const [formData] = useState({
    platform: "BITGET",
    bot: "AMM",
  });
  const [btnDisable, setBtnDisable] = useState(false);
  const [botStatus, setBotStatus] = useState("ADD");

  const navigate = useNavigate();

  const { fetchKeys } = useFetchKeys();
  const { bots, api_keys } = getProfile?.profile || {};

  const modelRef = useRef(null);

  const { open_trades, totalBalance } = bitgetSpot || {};

  // console.log(getProfile, bitgetSpot)

  const fetchData = async () => {
    try {
      const response = await backEndCallObjNoDcyt(
        "/trades/get_open_trades_data",
        formData
      );
      dispatch(bitgetSpotRedx(response)); // Dispatch the action to Redux
      // console.log("Fetched Data:", response);
    } catch (error) {
      console.error("Error fetching open trades data:", error);
    }
  };

  useEffect(() => {
    if ((bots?.[formData?.platform]) && api_keys?.[formData?.platform]) {
      fetchData();
    }
  }, [dispatch, bots]);

  useEffect(() => {
    if (bots?.BITGET?.AMM?.status === "INACTIVE") {
      setBotStatus("Enable");
    } else if (bots?.BITGET?.AMM?.status === "ACTIVE") {
      setBotStatus("Disable");
    } else {
      setBotStatus("ADD");
    }
  }, [bots]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBtnDisable(true);
    // const validationErrors = validate();
    // setErrors(validationErrors || {});
    // if (validationErrors) {
    //   setBtnDisable(false);
    //   return;
    // }
    const formattedData = {
      ...formData,
      status: bots?.BITGET.AMM.status === "INACTIVE" ? "ACTIVE" : "INACTIVE",
    };

    // console.log(formattedData)
    try {
      // console.log(formattedData);
      setBtnDisable(true);
      const response = await backEndCallObj(
        "/admin/change_bot_status",
        formattedData
      );
      // console.log(response, "aaa");
      toast.success(response?.success);
      fetchKeys();
    } catch (error) {
      toast.error(error?.response?.data);
    } finally {
      setBtnDisable(false);
    }
  };

  const toggleBotStatus = async (e) => {
    await handleSubmit(e);

    const modalInstance = window.bootstrap.Modal.getInstance(modelRef.current);
    if (modalInstance) modalInstance.hide();
  };

  //table header data
  const theadData = ["Symbol", "Price", "Org Qty"];

  let button;
  switch (bots?.BITGET?.AMM?.status) {
    case "INACTIVE":
      button = (
        <button
          className="theme-btn text-uppercase"
          type="button"
          data-bs-toggle="modal"
          data-bs-target="#confirmDelete"
        >
          bot Enable
        </button>
      );
      break;

    case "ACTIVE":
      button = (
        <button
          className="text-uppercase btn theme-btn  btn-danger"
          type="button"
          data-bs-toggle="modal"
          data-bs-target="#confirmDelete"
        >
          bot Disable
        </button>
      );
      break;

    default:
      api_keys?.[formData.platform]?.api_key
        ? (button = (
            <button
              className="theme-btn text-uppercase btn btn-success"
              type="button"
              data-bs-toggle="modal"
              data-bs-target="#addbot"
            >
              Add Bot
            </button>
          ))
        : (button = (
            <button
              className="theme-btn text-uppercase btn btn-success"
              type="button"
              onClick={() =>
                navigate("/api", { state: { platform: formData.platform } })
              }
            >
              Add Bot
            </button>
          ));

      break;
  }

  return (
    <>
      <div className="bot-status d-flex flex-wrap justify-content-between gap-2 pb-3">
        <div
          className="border d-flex flex-column align-items-center justify-content-between flex-fill p-2"
          data-bs-toggle="modal"
          data-bs-target="#editInvest"
        >
          <h6 className="mb-0 fw-bold">0</h6>
          <p className="mb-0 text-capitalize primary-color fs-12 fw-semibold">
            capital assigned
          </p>
        </div>
        <div className="border d-flex flex-column align-items-center justify-content-between flex-fill p-2">
          <h6 className="mb-0 fw-bold">
            {parseFloat(totalBalance || "0").toFixed(2)}
          </h6>
          <p className="mb-0 text-capitalize primary-color fs-12 fw-semibold">
            current balance
          </p>
        </div>
        <div className="border d-flex flex-column align-items-center justify-content-between flex-fill p-2">
          <h6 className="mb-0 status-percent fw-bold px-2 py-0">+ 10%</h6>
          <p className="mb-0 text-capitalize primary-color fs-12 fw-semibold">
            % change
          </p>
        </div>
        <div className="border d-flex justify-content-center align-items-center flex-fill p-2">
          {button}
        </div>
      </div >
      <ConfirmPopup label="Bot Status" msg={`${botStatus} bot`} botStatus={botStatus} toggleBotStatus={toggleBotStatus} modelRef={modelRef} btnDisable={btnDisable} />
      <EditInvestment botType={formData.bot}
        onSuccess={() => {
          console.log("Investment Updated Successfully!");
          // Optional logic: Close modal, refresh data, etc.
        }}
      />
      <AddBot />
      <BitgetSpotTable data={open_trades} thead={theadData} />
    </>
  );
};

// Map Redux state to props
const mapStateToProps = (state) => {
  return {
    bitgetSpot: state.bitgetSpot.value, // Access the slice state
    getProfile: state.getProfile.value, // Access the slice state
  };
};

export default connect(mapStateToProps)(BinanceSpotBot);
