import React, { useEffect, useRef, useState } from "react";
import { bitgetFutureRdx } from "../reduxStore/slice/bitgetfutureSlice";
import { backEndCallObj, backEndCallObjNoDcyt } from "../../services/mainService";
import BitgetFutureTable from "../../common/BitgetFutureTable";
import { connect } from "react-redux";
import useFetchKeys from "../../common/CotextTest";
import { toast } from "react-toastify";
const BitgitFuture = ({ dispatch, bitgetFuture,getProfile }) => {
  const [formData] = useState({
    platform: "BITGET",
    bot: "FUTURES",
  });

  const [btnDisable, setBtnDisable] = useState(false)
  const [botStatus, setBotStatus] = useState("ADD");

  const { fetchKeys } = useFetchKeys();

  const { bots } = getProfile?.profile || {};


  const { open_trades, totalBalance } = bitgetFuture || {};

  // console.log(open_trades);
  const modelRef = useRef(null)


  const fetchData = async () => {
    try {
      const response = await backEndCallObjNoDcyt(
        "/trades/get_open_trades_data",
        formData
      );
      dispatch(bitgetFutureRdx(response)); // Dispatch the action to Redux
    } catch (error) {
      console.error("Error fetching open trades data:", error);
    }
  };

  useEffect(() => {
    // fetchData();
  }, [dispatch]);

  useEffect(() => {
    if (bots?.BITGET?.FUTURES?.status === "INACTIVE") {
      setBotStatus("Enable");
    } else if (bots?.BITGET?.FUTURES?.status === "ACTIVE") {
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
          <h6 className="mb-0 status-percent fw-bold py-0 px-2">+ 10%</h6>
          <p className="mb-0 text-capitalize primary-color fs-12 fw-semibold">
            % change
          </p>
        </div>
        <div className="border d-flex justify-content-center align-items-center flex-fill p-2">
          {button}
        </div>
      </div>
      <BitgetFutureTable data={bitgetFuture} thead={theadData} />
    </>
  );
};

// Map Redux state to props
const mapStateToProps = (state) => {
  return {
    bitgetFuture: state.bitgetFuture.value, // Access the slice state
    getProfile : state.getProfile.value,
  };
};

export default connect(mapStateToProps)(BitgitFuture);
