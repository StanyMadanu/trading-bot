import React, { useEffect, useRef, useState, Suspense } from "react";
import Table from "../../common/Table";
import {
  backEndCallObj,
} from "../../services/mainService";
import { connect } from "react-redux";
import { binancefutureRedx } from "../reduxStore/slice/binancefutureSlice";
import { toast } from "react-toastify";
import useFetchKeys from "../../common/CotextTest";
import { useNavigate } from "react-router-dom";
import MiniLoader from "../../common/MiniLoader";

// Lazy load components
const ConfirmPopup = React.lazy(() => import("../models/ConfirmPopup"));
const EditBinanceFutureModal = React.lazy(() =>import("../models/EditBinanceFuture"));

const BinanceFutureBot = ({ dispatch, binanceFuture, getProfile }) => {
  const [formData] = useState({
    platform: "BINANCE",
    bot: "FUTURES",
  });

  const [data, setData] = useState({
    platform: "BINANCE",
    botType: "FUTURES",
    total_investment: "",
  });

  const [btnDisable, setBtnDisable] = useState(false);
  const [loading, setLoading] = useState(false);

  const [botStatus, setBotStatus] = useState("ADD");
  const [datamodal, setDataModala] = useState(false);

  const navigate = useNavigate();
  const { fetchKeys, fetchData } = useFetchKeys();
  const closeRef = useRef(null);

  const { bots, api_keys } = getProfile?.profile || {};
  const { usdt_balance, open_trades, total_investment } = binanceFuture || {}; // Ensure it's not undefined
  // console.log(binanceFuture);

  // const fetchData = async () => {
  //   setLoading(true);
  //   try {
  //     const response = await backEndCallObjNoDcyt(
  //       "/trades/get_open_trades_data",
  //       formData
  //     );
  //     dispatch(binancefutureRedx(response)); // Dispatch the action to Redux
  //   } catch (error) {
  //     console.error("Error fetching open trades data:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const modelRef = useRef(null);

  useEffect(() => {
    if (bots?.[formData?.platform] && api_keys?.[formData?.platform]) {
      if (!binanceFuture) {
        fetchData(formData, setLoading, binancefutureRedx);
      }
    }
  }, [dispatch, bots]);

  useEffect(() => {
    console.log(bots?.BINANCE?.FUTURES?.status)
    if (bots?.BINANCE?.FUTURES?.status === "INACTIVE") {
      setBotStatus("Disable");
    } else if (bots?.BINANCE?.FUTURES?.status === "ACTIVE") {
      setBotStatus("Enable");
    } else {
      setBotStatus("ADD");
    }
  }, [bots]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBtnDisable(true);
    const formattedData = {
      ...formData,
      status:
        bots?.BINANCE?.FUTURES?.status === "INACTIVE" ? "ACTIVE" : "INACTIVE",
    };
    // console.log(formattedData);
    try {
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
    const formattedData = {
      platform: data?.platform,
      bot: data?.botType,
      total_investment: data?.total_investment,
    };
    // console.log(formattedData);
    try {
      const response = await backEndCallObj("/admin/add_bot", formattedData);
      toast.success(response?.success);
      const modalInstance = window.bootstrap.Modal.getInstance(closeRef.current);
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

  const theadData = ["Symbol", "Profit", "PositionAmt"];

  const handleButtonClick = () => {
    if (
      bots?.BINANCE?.FUTURES?.status === "INACTIVE" ||
      bots?.BINANCE?.FUTURES?.status === "ACTIVE"
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
          navigate("/api", { state: { platform: formData?.platform } })
        }
      >
        Add Bot
      </button>
    );
  };

  // const capital_investment = parseFloat(usdt_balance?.availableBalance / total_investment || 0).toFixed(2);
  const difference = usdt_balance?.availableBalance - total_investment;
  let capital_investment = ((difference / total_investment) * 100).toFixed(2);

  if (isNaN(capital_investment)) {
    capital_investment = "0.00";
  }

  return (
    <Suspense fallback={<MiniLoader />}>
      {loading ? (
        <div className="loader">
          <MiniLoader />
        </div>
      ) : (
        <>
          <div className="bot-status d-flex flex-wrap justify-content-between gap-2 pb-1">
            {/* UI Content */}
            <div
              className="border d-flex flex-column align-items-center justify-content-between flex-fill p-1"
              data-bs-toggle="modal"
              data-bs-target="#editBinanceFutureModal"
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
                {parseFloat(usdt_balance?.availableBalance || "0").toFixed(2) ||
                  "0"}
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

          {/* Lazy-loaded Modals */}
          <ConfirmPopup
            label="Bot Status"
            msg={`${botStatus} bot`}
            botStatus={botStatus}
            toggleBotStatus={toggleBotStatus}
            modelRef={modelRef}
            btnDisable={btnDisable}
          />


          <EditBinanceFutureModal
            botType={formData.bot}
            platform={formData.platform}
            fetchData={fetchData}
          />

          <Table data={open_trades} thead={theadData} />
        </>
      )}

      <div className="modal fade" id="botModal" ref={closeRef}>
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
                    id="platform"
                    name="platform"
                    className="form-control"
                    placeholder="Platform"
                    value={data?.platform}
                    readOnly
                  />
                </div>

                <div className="mb-3">
                  <input
                    type="text"
                    id="botType"
                    name="botType"
                    className="form-control"
                    placeholder="Bot Type"
                    value={data?.botType}
                    readOnly
                  />
                </div>

                <div className="my-3">
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
                <div className="text-end px-2">
                  <button
                    className="sign my-2 py-2 px-3 rounded"
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
    </Suspense>
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
