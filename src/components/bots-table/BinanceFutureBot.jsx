import React, { useEffect, useRef, useState } from "react";
import Table from "../../common/Table";
import { backEndCallObj, backEndCallObjNoDcyt } from "../../services/mainService";
import { connect } from "react-redux";
import { binancefutureRedx } from "../reduxStore/slice/binancefutureSlice";
import { toast } from "react-toastify";
import useFetchKeys from "../../common/CotextTest";
import ConfirmPopup from "../models/ConfirmPopup";
import EditInvestment from "../models/EditInvestmentModel";
import AddBot from "../models/AddBotModal";

const BinanceFutureBot = ({ dispatch, binanceFuture, getProfile }) => {
  const [formData] = useState({
    platform: "BINANCE",
    bot: "FUTURES",
  });

  const [btnDisable, setBtnDisable] = useState(false)
  const [botStatus, setBotStatus] = useState("ADD");

  const { fetchKeys } = useFetchKeys();

  const { bots } = getProfile?.profile || {};

  const { usdt_balance, open_trades } = binanceFuture || {}; // Ensure it's not undefined




  const fetchData = async () => {
    try {
      const response = await backEndCallObjNoDcyt(
        "/trades/get_open_trades_data",
        formData
      );
      dispatch(binancefutureRedx(response)); // Dispatch the action to Redux
      console.log("Fetched Data:", response);
    } catch (error) {
      console.error("Error fetching open trades data:", error);
    }
  };

  const modelRef = useRef(null)


  useEffect(() => {
    fetchData();
  }, [dispatch]);

  useEffect(() => {
    if (bots?.BINANCE?.FUTURES?.status === "INACTIVE") {
      setBotStatus("Enable");
    } else if (bots?.BINANCE?.FUTURES?.status === "ACTIVE") {
      setBotStatus("Disable");
    }
    else {
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
      status:
        bots?.BINANCE?.FUTURES?.status === "INACTIVE"
          ? "ACTIVE"
          : "INACTIVE",
    };

    console.log(formattedData)
    try {
      // console.log(formattedData);
      setBtnDisable(true);
      const response = await backEndCallObj(
        "/admin/change_bot_status", formattedData

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
  }

  //table header data
  const theadData = ["Symbol", "Price", "Org Qty"];

  let button;
  switch (bots?.BINANCE?.FUTURES?.status) {
    case 'INACTIVE':
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


    case 'ACTIVE':
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
      button = (
        <button
          className="theme-btn text-uppercase btn btn-success"
          type="button"
          data-bs-toggle="modal"
          data-bs-target="#addbot"
        >
          Add Bot
        </button>
      );
      break;
  }

  return (
    <>
      <div className="bot-status d-flex flex-wrap justify-content-between gap-2 pb-3">
        {/* UI Content */}
        <div className="border d-flex flex-column align-items-center justify-content-between flex-fill p-2">
          <h6 className="mb-0 fw-bold">4000</h6>
          <p className="mb-0 text-capitalize primary-color fs-12 fw-semibold">
            capital assigned
          </p>
        </div>
        <div className="border d-flex flex-column align-items-center justify-content-between flex-fill p-2">
          <h6 className="mb-0 fw-bold">
            {parseFloat(usdt_balance?.balance).toFixed(2) || "0"}
          </h6>
          <p className="mb-0 text-capitalize primary-color fs-12 fw-semibold">
            current balance
          </p>
        </div>
        <div className="border d-flex flex-column align-items-center justify-content-between flex-fill p-2">
          <h6 className="mb-0 status-percent fw-bold py-0 px-2">+ 10%</h6>
          <p className="mb-0 text-capitalize primary-color fs-12 fw-semibold">
            % change
          </p>
        </div>
        <div className="border d-flex justify-content-center align-items-center flex-fill p-2">
          {button}
        </div>
      </div>
      {/* Table Component */}

      <ConfirmPopup label="Bot Status" msg={`${botStatus} bot`} botStatus={botStatus} toggleBotStatus={toggleBotStatus} modelRef={modelRef} btnDisable={btnDisable} />
      <EditInvestment />
      <AddBot platform={formData.platform} botType={formData.bot} />
      <Table data={open_trades} thead={theadData} />
    </>
  );
};

// Map Redux state to props
const mapStateToProps = (state) => {
  return {
    binanceFuture: state.binanceFuture.value, // Access the slice state
    getProfile: state.getProfile.value,
  };
};

export default connect(mapStateToProps)(BinanceFutureBot);
