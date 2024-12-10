import React, { useEffect, useState } from 'react'
import { bitgetFutureRdx } from '../reduxStore/slice/bitgetfutureSlice';
import { backEndCallObjNoDcyt } from '../../services/mainService';
import BitgetFutureTable from '../../common/BitgetFutureTable';
import { connect } from 'react-redux';
const BitgitFuture = ({dispatch , bitgetFuture}) => {

  const [formData] = useState({
    platform: 'BITGET',
    bot: 'FUTURES',
  });

  // const { usdt_balance, open_trades } = binanceSpot || {}; // Ensure it's not undefined
  // console.log(usdt_balance, open_trades)
  // console.log(binanceSpot)


  const {open_trades , totalBalance} = bitgetFuture || {};

  console.log(open_trades)


  const fetchData = async () => {
    try {
      const response = await backEndCallObjNoDcyt(
        '/trades/get_open_trades_data',
        formData
      );
      dispatch(bitgetFutureRdx(response)); // Dispatch the action to Redux
    } catch (error) {
      console.error('Error fetching open trades data:', error);
    }
  };

  useEffect(()=>{
   fetchData()
  },[dispatch])




  return (
    <>
    <div className="bot-status d-flex flex-wrap justify-content-between gap-2 pb-3">
                  <div className="border d-flex flex-column align-items-center justify-content-between flex-fill p-2 ">
                    <h6 className="mb-0 fw-bold">4000</h6>
                    <p className="mb-0 text-capitalize primary-color fs-12 fw-semibold">
                      capital assigned
                    </p>
                  </div>
                  <div className="border d-flex flex-column align-items-center justify-content-between flex-fill p-2">
                    <h6 className="mb-0 fw-bold">5500</h6>
                    <p className="mb-0 text-capitalize primary-color fs-12 fw-semibold">
                      current balance
                    </p>
                  </div>
                  <div className="border d-flex flex-column align-items-center justify-content-between flex-fill p-2">
                    <h6 className="mb-0 status-percent fw-bold py-0 px-2">
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
                <BitgetFutureTable data={bitgetFuture}/>
    </>
  )

}

// Map Redux state to props
const mapStateToProps = (state) => {
  return {
    bitgetFuture: state.bitgetFuture.value, // Access the slice state
  };
};

export default connect(mapStateToProps)(BitgitFuture)