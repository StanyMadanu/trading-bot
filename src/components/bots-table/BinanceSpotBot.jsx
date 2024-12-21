import React, { useEffect, useRef, useState } from "react";
import Table from "../../common/Table";
import {
  backEndCallObj,
  backEndCallObjNoDcyt,
} from "../../services/mainService";
import { binancespotRedx } from "../reduxStore/slice/binancespotSlice";
import { connect } from "react-redux";
import BinanceSpotTable from "../../common/BinanceSpotTable";
import ConfirmPopup from "../models/ConfirmPopup";
import { toast } from "react-toastify";
import useFetchKeys from "../../common/CotextTest";
import { useNavigate } from "react-router-dom";
import EditInvestment from "../models/EditInvestmentModel";
import EditBinanceSpotModal from "../models/EditBinanceSpot";
import MiniLoader from "../../common/MiniLoader";

const BinanceSpotBot = ({ dispatch, binanceSpot, getProfile }) => {
  const [formData] = useState({
    platform: "BINANCE",
    bot: "AMM",
  });

  const [data, setData] = useState({
    platform: "BINANCE",
    botType: "AMM",
    total_investment: "",
  });

  const [botStatus, setBotStatus] = useState("ADD");

  const [btnDisable, setBtnDisable] = useState(false);

  const [loading, setLoading] = useState(false);

  const modelRef = useRef(null);

  const { fetchKeys,fetchData } = useFetchKeys();

  const navigate = useNavigate();

  const closeRef = useRef(null);



  const { open_trades, totalBalance, total_investment } = binanceSpot || {};
  const { bots, api_keys } = getProfile?.profile || {};



  // const fetchData = async () => {
  //   setLoading(true);
  //   try {
  //     const response = await backEndCallObjNoDcyt(
  //       "/trades/get_open_trades_data",
  //       formData
  //     );
  //     console.log(response)
  //     dispatch(binancespotRedx(response)); // Dispatch the action to Redux
  //   } catch (error) {
  //     console.error("Error fetching open trades data:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  useEffect(() => {
    if (bots?.[formData?.platform] && api_keys?.[formData?.platform]) {
      if (!binanceSpot) {
        fetchData(formData , setLoading , binancespotRedx);
      }
    }
  }, [dispatch, bots]);

  useEffect(() => {
    console.log(bots?.BINANCE?.AMM?.status)
    if (bots?.BINANCE?.AMM?.status === "INACTIVE") {
      setBotStatus("Disable");
    } else if (bots?.BINANCE?.AMM?.status === "ACTIVE") {
      setBotStatus("Enable");
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
      status: bots?.BINANCE.AMM.status === "INACTIVE" ? "ACTIVE" : "INACTIVE",
    };

    // console.log(formattedData)
    try {
      // console.log(formattedData);
      setBtnDisable(true);
      const response = await backEndCallObj(
        "/admin/change_bot_status",
        formattedData
      );
      toast.success(response?.success);
      fetchKeys();
    } catch (error) {
      toast.error(error?.response?.data);
    } finally {
      setBtnDisable(false);
    }
  };

  const submitBot = async (data) => {
    setBtnDisable(true);
    // console.log(data)
    const formattedData = {
      platform: data.platform,
      bot: data.botType,
      total_investment: data.total_investment,
    };
    try {
      const response = await backEndCallObj("/admin/add_bot", formattedData);
      toast.success(response?.success);
      const modalInstance = window.bootstrap.Modal.getInstance(this.closeRef.current);
      if (modalInstance) modalInstance.hide();
    } catch (error) {
      toast.error(error?.response?.data || "Error adding bot");
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

  const handleButtonClick = () => {
    if (
      bots?.BITGET?.AMM?.status === "INACTIVE" ||
      bots?.BITGET?.AMM?.status === "ACTIVE"
    ) {
      return (
        <button
          className="theme-btn text-uppercase"
          type="button"
          data-bs-toggle="modal"
          data-bs-target="#confirmDelete"
        >
          {botStatus} Bot
        </button>
      );
    }
    if (api_keys?.[formData?.platform]?.api_key) {
      return (
        <button
          className="theme-btn text-uppercase"
          type="button"
          data-bs-toggle="modal"
          data-bs-target="#bitgetModal"
        >
          Add Bot
        </button>
      );
    }
    return (
      <button
        className="theme-btn text-uppercase"
        type="button"
        onClick={() =>
          navigate("/api", { state: { platform: formData.platform } })
        }
      >
        Add Bot
      </button>
    );
  };

  // const capital_investment = parseFloat(totalBalance / total_investment || 0).toFixed(2);

  const difference = totalBalance - total_investment;
  let capital_investment = ((difference / total_investment) * 100).toFixed(2);

  if (isNaN(capital_investment)) {
    capital_investment = "0.00";
  }

  return (
    <>
      {loading ? (
        <div className="loader">
          <MiniLoader />
        </div>
      ) : (
        <>
          <div className="bot-status d-flex flex-wrap justify-content-between gap-2 pb-1">
            <div
              className="border d-flex flex-column align-items-center justify-content-between flex-fill p-1"
              data-bs-toggle="modal"
              data-bs-target="#editBinanceSpotModal"
            >
              <h6 className="mb-0 fw-bold fs-15">
                {parseFloat(total_investment || 0).toFixed(2)}
              </h6>
              <p className="mb-0 text-capitalize primary-color fs-12 fw-semibold">
                capital assigned
              </p>
            </div>
            <div className="border d-flex flex-column align-items-center justify-content-between flex-fill p-1">
              <h6 className="mb-0 fw-bold fs-15">
                {parseFloat(totalBalance || 0).toFixed(2)}
              </h6>
              <p className="mb-0 text-capitalize primary-color fs-12 fw-semibold">
                current balance
              </p>
            </div>
            <div className="border d-flex flex-column align-items-center justify-content-between flex-fill p-1">
              <h6
                className={`mb-0 status-percent fw-bold px-2 py-1 fs-13 ${capital_investment < 0 ? "bg-danger" : "bg-success"
                  }`}
              >
                {capital_investment > 0
                  ? `+${capital_investment}`
                  : `${capital_investment}`}
                %
              </h6>
              <p
                className={`mb-0 text-capitalize primary-color fs-12 fw-semibold ${capital_investment < 0 ? "text-danger" : "text-success"
                  }`}
              >
                % change
              </p>
            </div>
            <div className="border d-flex justify-content-center align-items-center flex-fill p-1">
              {handleButtonClick()}
            </div>
          </div>
          <BinanceSpotTable data={open_trades} tdata={theadData} />

          <ConfirmPopup
            label="Bot Status"
            msg={`${botStatus} bot`}
            botStatus={botStatus}
            toggleBotStatus={toggleBotStatus}
            modelRef={modelRef}
            btnDisable={btnDisable}
          />


          <EditBinanceSpotModal
            botType={formData.bot}
            platform={formData.platform}
            fetchData={fetchData}
          />

          <div className="modal fade" id="binanceBot" tabIndex="-1" ref={closeRef}>
            <div className="modal-dialog text-dark">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title primary-color text-capitalize">
                    Add Bot Configuration
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                  ></button>
                </div>
                <div className="modal-body">
                  <form
                    onSubmit={(e) => {
                      submitBot(data);
                      e.preventDefault();
                    }}
                  >
                    <div className="mb-3">
                      <input
                        type="text"
                        className="form-control"
                        id="platform"
                        name="platform"
                        placeholder="Platform"
                        value={data?.platform}
                        readOnly
                      />
                    </div>

                    <div className="mb-3">
                      <input
                        type="text"
                        className="form-control"
                        id="botType"
                        name="botType"
                        placeholder="Bot Type"
                        value={data?.botType}
                        readOnly
                      />
                    </div>

                    <div className="mb-3">
                      <input
                        type="number"
                        className="form-control"
                        id="total_investment"
                        name="total_investment"
                        placeholder="Total Investment"
                        value={data?.total_investment}
                        onChange={(e) =>
                          setData({ ...data, total_investment: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="text-end mx-2">
                      <button
                        className="sign mt-3"
                        type="submit"
                        disabled={btnDisable}
                      >
                        Submit
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

// Map Redux state to props
const mapStateToProps = (state) => {
  return {
    binanceSpot: state.binanceSpot.value, // Access the slice state
    getProfile: state.getProfile.value, // Access the slice state
  };
};

export default connect(mapStateToProps)(BinanceSpotBot);
