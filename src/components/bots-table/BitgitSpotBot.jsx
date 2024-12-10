import React, { useEffect, useRef, useState } from 'react'
import Table from '../../common/Table'
import { backEndCallObjNoDcyt } from '../../services/mainService';
import { bitgetSpotRedx } from '../reduxStore/slice/bitgitspotSlice';
import { connect } from 'react-redux';
import BitgetSpotTable from '../../common/BitgetSpotTable';
import ConfirmPopup from '../models/ConfirmPopup';
import EditInvestment from '../models/EditInvestmentModel';


const BinanceSpotBot = ({ dispatch, bitgetSpot }) => {
  const [formData] = useState({
    platform: "BITGET",
    bot: "AMM",
  });
  const [botStatus, setBotStatus] = useState(true)

  const modelRef = useRef(null)

  const { open_trades, totalBalance } = bitgetSpot || {};

  console.log(open_trades);
  const fetchData = async () => {
    try {
      const response = await backEndCallObjNoDcyt(
        "/trades/get_open_trades_data",
        formData
      );
      dispatch(bitgetSpotRedx(response)); // Dispatch the action to Redux
      console.log("Fetched Data:", response);
    } catch (error) {
      console.error("Error fetching open trades data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [dispatch]);


  const toggleBotStatus = () => {
    setBotStatus(!botStatus);
    const modalInstance = window.bootstrap.Modal.getInstance(modelRef.current);
    if (modalInstance) modalInstance.hide();
  }

  //table header data
  const theadData = ["Symbol", "Price", "Org Qty"];

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
          <button className="theme-btn text-uppercase"
            type="button"
            data-bs-toggle="modal"
            data-bs-target="#confirmDelete"
          >bot {botStatus ? "Enable" : "Disable"}</button>
        </div>
      </div>
      <ConfirmPopup label="Bot Status" msg={`${botStatus ? "Enable" : "Disable"} bot`} botStatus={botStatus} toggleBotStatus={toggleBotStatus} modelRef={modelRef} />
      <EditInvestment />
      <BitgetSpotTable data={open_trades} thead={theadData} />
    </>
  );
};

// Map Redux state to props
const mapStateToProps = (state) => {
  return {
    bitgetSpot: state.bitgetSpot.value, // Access the slice state
  };
};

export default connect(mapStateToProps)(BinanceSpotBot);
