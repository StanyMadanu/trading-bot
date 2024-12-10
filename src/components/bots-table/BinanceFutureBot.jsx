import React, { useEffect, useState } from 'react';
import Table from '../../common/Table';
import { backEndCallObjNoDcyt } from '../../services/mainService';
import { connect } from 'react-redux';
import { binancefutureRedx } from '../reduxStore/slice/binancefutureSlice';

const BinanceFutureBot = ({ dispatch, binanceFuture }) => {
  const [formData] = useState({
    platform: 'BINANCE',
    bot: 'FUTURES',
  });

  const { usdt_balance, open_trades } = binanceFuture || {}; // Ensure it's not undefined
  console.log(usdt_balance, open_trades)

  const fetchData = async () => {
    try {
      const response = await backEndCallObjNoDcyt(
        '/trades/get_open_trades_data',
        formData
      );
      dispatch(binancefutureRedx(response)); // Dispatch the action to Redux
      console.log('Fetched Data:', response);
    } catch (error) {
      console.error('Error fetching open trades data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [dispatch]);

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
          <h6 className="mb-0 fw-bold">{ parseFloat(usdt_balance?.balance).toFixed(2) || "0"}</h6>
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
          <button className="theme-btn text-uppercase">bot enable</button>
        </div>
      </div>
      {/* Table Component */}
      
      <Table data={open_trades} />
    </>
  );
};

// Map Redux state to props
const mapStateToProps = (state) => {
  return {
    binanceFuture: state.binanceFuture.value, // Access the slice state
  };
};

export default connect(mapStateToProps)(BinanceFutureBot);
