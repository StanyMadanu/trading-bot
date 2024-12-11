import React, { useEffect, useRef, useState } from 'react'
import Table from '../../common/Table'
import { backEndCallObj, backEndCallObjNoDcyt } from '../../services/mainService';
import { bitgetSpotRedx } from '../reduxStore/slice/bitgitspotSlice';
import { connect } from 'react-redux';
import BitgetSpotTable from '../../common/BitgetSpotTable';
import ConfirmPopup from '../models/ConfirmPopup';
import EditInvestment from '../models/EditInvestmentModel';
import AddBot from '../models/AddBotModal';
import { toast } from 'react-toastify';
import useFetchKeys from '../../common/CotextTest';


const BinanceSpotBot = ({ dispatch, bitgetSpot, getProfile }) => {
  const [formData] = useState({
    platform: "BITGET",
    bot: "AMM",
  });
  const [btnDisable, setBtnDisable] =useState(false)
  const [botStatus, setBotStatus] = useState("ADD");

  const {fetchKeys} = useFetchKeys();


  const { bots } = getProfile?.profile || {};


  const modelRef = useRef(null)

  const { open_trades, totalBalance } = bitgetSpot || {};

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
    fetchData();
  }, [dispatch]);

  useEffect(() => {
    if (bots?.BITGET?.AMM?.status === "true") {
      setBotStatus("ADD");
    } else if (bots?.BITGET?.AMM?.status === "INACTIVE") {
      setBotStatus("Enable");
    } else if (bots?.BITGET?.AMM?.status === "ACTIVE") {
      setBotStatus("Disable");
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
        bots?.BITGET.AMM.status === "INACTIVE"
          ? "ACTIVE"
          : "INACTIVE",
    };

    console.log(formattedData)
    try {
      // console.log(formattedData);
      setBtnDisable(true);
      const response = await backEndCallObj(
        "/admin/change_bot_status",
        
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


  const toggleBotStatus = async(e) => {

    await handleSubmit(e);
    
    const modalInstance = window.bootstrap.Modal.getInstance(modelRef.current);
    if (modalInstance) modalInstance.hide();
  }

  //table header data
  const theadData = ["Symbol", "Price", "Org Qty"];


  let button;
  switch (bots?.BITGET?.AMM?.status) {
    case 'false':
      button = null; // Do not render a button if AMM is "false"
      break;

    case 'true':
      button = (
        <button
          className="theme-btn text-uppercase"
          type="button"
          data-bs-toggle="modal"
          data-bs-target="#addbot"
        >
          Add Bot
        </button>
      );

      break;


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
          className="theme-btn text-uppercase btn btn-muted"
          type="button"
          data-bs-toggle="modal"
          data-bs-target="#confirmDelete"
        >
          bot Disable
        </button>
      );
      break;

    default:
      button = <span>Invalid Status</span>; // Fallback for unexpected values
      break;
  }


  return (
    <>
      <div className="bot-status d-flex flex-wrap justify-content-between gap-2 pb-3">
        <div className="border d-flex flex-column align-items-center justify-content-between flex-fill p-2" data-bs-toggle="modal"
          data-bs-target="#editInvest">
          <h6 className="mb-0 fw-bold">400</h6>
          <p className="mb-0 text-capitalize primary-color fs-12 fw-semibold">
            capital assigned
          </p>
        </div>
        <div className="border d-flex flex-column align-items-center justify-content-between flex-fill p-2">
          <h6 className="mb-0 fw-bold">
            {parseFloat(totalBalance).toFixed(2)}
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
      <ConfirmPopup label="Bot Status" msg={`${botStatus } bot`} botStatus={botStatus} toggleBotStatus={toggleBotStatus} modelRef={modelRef} btnDisable={btnDisable} />
      <EditInvestment />
      <BitgetSpotTable data={open_trades} thead={theadData} />
      <AddBot platform={formData.platform} botType={formData.bot}/>
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
