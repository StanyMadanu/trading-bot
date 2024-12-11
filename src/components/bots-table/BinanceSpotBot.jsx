import React, { useEffect, useRef, useState } from "react";
import Table from "../../common/Table";
import { backEndCallObj, backEndCallObjNoDcyt } from "../../services/mainService";
import { binancespotRedx } from "../reduxStore/slice/binancespotSlice";
import { connect } from "react-redux";
import BinanceSpotTable from "../../common/BinanceSpotTable";
import ConfirmPopup from "../models/ConfirmPopup";
import AddBot from "../models/AddBotModal";
import { toast } from "react-toastify";
import useFetchKeys from "../../common/CotextTest";
import { useNavigate } from "react-router-dom";



const BinanceSpotBot = ({ dispatch, binanceSpot, getProfile }) => {
  const [formData] = useState({
    platform: "BINANCE",
    bot: "AMM",
  });

  const [botStatus, setBotStatus] = useState('ADD');

  const [btnDisable, setBtnDisable] = useState(false);

  const modelRef = useRef(null);

  const { fetchKeys } = useFetchKeys();



  const navigate = useNavigate();



  // const { usdt_balance, open_trades } = binanceSpot || {}; // Ensure it's not undefined
  // console.log(usdt_balance, open_trades)

  const { open_trades, totalBalance } = binanceSpot || {};
  const { bots, api_keys } = getProfile?.profile || {}

  // console.log(getProfile, binanceSpot)


  // console.log(open_trades);

  const fetchData = async () => {
    try {
      const response = await backEndCallObjNoDcyt(
        "/trades/get_open_trades_data",
        formData
      );
      dispatch(binancespotRedx(response)); // Dispatch the action to Redux
    } catch (error) {
      console.error("Error fetching open trades data:", error);
    }
  };

  useEffect(() => {

    if (bots) {
      fetchData();
    }

  }, [dispatch, bots]);

  useEffect(() => {
    if (bots?.BINANCE?.AMM?.status === "INACTIVE") {
      setBotStatus("Enable");
    } else if (bots?.BINANCE?.AMM?.status === "ACTIVE") {
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
        bots?.BINANCE.AMM.status === "INACTIVE"
          ? "ACTIVE"
          : "INACTIVE",
    };

    // console.log(formattedData)
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
    await handleSubmit(e)
    const modalInstance = window.bootstrap.Modal.getInstance(modelRef.current);
    if (modalInstance) modalInstance.hide();
  }


  //table header data
  const theadData = ["Symbol", "Price", "Org Qty"];

  let button;

  // console.log(bots.BINANCE.AMM.status)

  switch (bots?.BINANCE?.AMM?.status) {

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
          className="btn text-uppercase btn-danger"
          type="button"
          data-bs-toggle="modal"
          data-bs-target="#confirmDelete"
        >
          bot Disable
        </button>
      );
      break;

    default:
      api_keys?.[formData.platform]?.api_key ? (
        button = (
          <button
            className="theme-btn text-uppercase btn btn-success"
            type="button"
            data-bs-toggle="modal"
            data-bs-target="#addbot"
          >
            Add Bot
          </button>
        )) : (
        button = (
          <button
            className="theme-btn text-uppercase btn btn-success"
            type="button"
            onClick={() => navigate('/api', { state: { platform: formData.platform } })}
            >
            Add Bot
          </button>
        )

      )
      break;
  }




  return (
    <>
      <div className="bot-status d-flex flex-wrap justify-content-between gap-2 pb-3">
        <div className="border d-flex flex-column align-items-center justify-content-between flex-fill p-2">
          <h6 className="mb-0 fw-bold">0</h6>
          <p className="mb-0 text-capitalize primary-color fs-12 fw-semibold">
            capital assigned
          </p>
        </div>
        <div className="border d-flex flex-column align-items-center justify-content-between flex-fill p-2">
          <h6 className="mb-0 fw-bold">
            {parseFloat(totalBalance || 0).toFixed(2)}
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
      </div>
      <BinanceSpotTable data={open_trades} tdata={theadData} />

      <ConfirmPopup label="Bot Status" msg={`${botStatus} bot`} botStatus={botStatus} toggleBotStatus={toggleBotStatus} modelRef={modelRef} btnDisable={btnDisable} />
      <AddBot platform={formData.platform} botType={formData.bot} />
    </>
  );
};

// Map Redux state to props
const mapStateToProps = (state) => {
  return {
    binanceSpot: state.binanceSpot.value, // Access the slice state
    getProfile: state.getProfile.value // Access the slice state
  };
};

export default connect(mapStateToProps)(BinanceSpotBot);
