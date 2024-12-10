import React, { useEffect, useState } from 'react';
import Table from '../../common/Table';
import { backEndCallObjNoDcyt } from '../../services/mainService';
import {binancespotRedx} from '../reduxStore/slice/binancespotSlice'
import { connect } from 'react-redux';
import BinanceSpotTable from '../../common/BinanceSpotTable';

const BinanceSpotBot = ({dispatch, binanceSpot}) => {

  const [formData] = useState({
    platform: 'BINANCE',
    bot: 'AMM',
  });

  // const { usdt_balance, open_trades } = binanceSpot || {}; // Ensure it's not undefined
  // console.log(usdt_balance, open_trades)
  console.log(binanceSpot)


  const {open_trades , totalBalance} = binanceSpot || {};

  console.log(open_trades)


  const fetchData = async () => {
    try {
      const response = await backEndCallObjNoDcyt(
        '/trades/get_open_trades_data',
        formData
      );
      dispatch(binancespotRedx(response)); // Dispatch the action to Redux
    } catch (error) {
      console.error('Error fetching open trades data:', error);
    }
  };

  useEffect(()=>{
   fetchData()
  },[])

  return (
    <>
      <div className="bot-status d-flex flex-wrap justify-content-between gap-2 pb-3">
        <div className="border d-flex flex-column align-items-center justify-content-between flex-fill p-2">
          <h6 className="mb-0 fw-bold">4000</h6>
          <p className="mb-0 text-capitalize primary-color fs-12 fw-semibold">
            capital assigned
          </p>
        </div>
        <div className="border d-flex flex-column align-items-center justify-content-between flex-fill p-2">
          <h6 className="mb-0 fw-bold">{parseFloat(totalBalance).toFixed(2) || "0"}</h6>
          <p className="mb-0 text-capitalize primary-color fs-12 fw-semibold">
            current balance
          </p>
        </div>
        <div className="border d-flex flex-column align-items-center justify-content-between flex-fill p-2">
          <h6 className="mb-0 status-percent fw-bold px-2 py-0">
            + 10%
          </h6>
          <p className="mb-0 text-capitalize primary-color fs-12 fw-semibold">
            % change
          </p>
        </div>
        <div className="border d-flex justify-content-center align-items-center flex-fill p-2">
          <button className="theme-btn text-uppercase">
            bot enable
          </button>
        </div>
      </div>
      <BinanceSpotTable data={open_trades}/>
    </>
  );
};

// Map Redux state to props
const mapStateToProps = (state) => {
  return {
    binanceSpot: state.binanceSpot.value, // Access the slice state
  };
};

export default connect(mapStateToProps)(BinanceSpotBot);
