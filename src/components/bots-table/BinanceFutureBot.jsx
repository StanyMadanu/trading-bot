import React, { useEffect, useRef, useState, Suspense } from "react";
import Table from "../../common/Table";
import {
  backEndCallObj,
  backEndCallObjNoDcyt,
} from "../../services/mainService";
import { connect } from "react-redux";
import { binancefutureRedx } from "../reduxStore/slice/binancefutureSlice";
import { toast } from "react-toastify";
import useFetchKeys from "../../common/CotextTest";
import { useNavigate } from "react-router-dom";

// Lazy load components
const ConfirmPopup = React.lazy(() => import("../models/ConfirmPopup"));
const EditBinanceFutureModal = React.lazy(() =>
  import("../models/EditBinanceFuture")
);
// const AddBot = React.lazy(() => import("../models/AddBotModal"));

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

  const [botStatus, setBotStatus] = useState("ADD");
  const [datamodal, setDataModala] = useState(false);

  const navigate = useNavigate();
  const { fetchKeys } = useFetchKeys();

  const { bots, api_keys } = getProfile?.profile || {};
  const { usdt_balance, open_trades } = binanceFuture || {}; // Ensure it's not undefined

  const fetchData = async () => {
    try {
      const response = await backEndCallObjNoDcyt(
        "/trades/get_open_trades_data",
        formData
      );
      dispatch(binancefutureRedx(response)); // Dispatch the action to Redux
    } catch (error) {
      console.error("Error fetching open trades data:", error);
    }
  };

  const modelRef = useRef(null);

  useEffect(() => {
    if (bots?.[formData?.platform] && api_keys?.[formData?.platform]) {
      fetchData();
    }
  }, [dispatch, bots]);

  useEffect(() => {
    if (bots?.BINANCE?.FUTURES?.status === "INACTIVE") {
      setBotStatus("Enable");
    } else if (bots?.BINANCE?.FUTURES?.status === "ACTIVE") {
      setBotStatus("Disable");
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
    // console.log(data)
    try {
      const response = await backEndCallObj("/admin/add_bot", data);
      toast.success(response?.success);
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

  const theadData = ["Symbol", "Price", "Org Qty"];

  let button;
  switch (bots?.BINANCE?.FUTURES?.status) {
    case "INACTIVE":
      button = (
        <button
          className="theme-btn text-uppercase"
          type="button"
          data-bs-toggle="modal"
          data-bs-target="#confirmDelete"
        >
          enable bot
        </button>
      );
      break;

    case "ACTIVE":
      button = (
        <button
          className="text-uppercase theme-btn"
          type="button"
          data-bs-toggle="modal"
          data-bs-target="#confirmDelete"
        >
          disable bot
        </button>
      );
      break;

    default:
      button = api_keys?.[formData.platform]?.api_key ? (
        <button
          className="theme-btn text-uppercase"
          type="button"
          data-bs-toggle="modal"
          data-bs-target="#botModal"
          onClick={() => {
            setDataModala((prev) => !prev); // Properly toggle state
          }}
        >
          Add Bot
        </button>
      ) : (
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
      break;
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="bot-status d-flex flex-wrap justify-content-between gap-2 pb-3">
        {/* UI Content */}
        <div
          className="border d-flex flex-column align-items-center justify-content-between flex-fill p-2"
          data-bs-toggle="modal"
          data-bs-target="#editBinanceFutureModal"
        >
          <h6 className="mb-0 fw-bold">0</h6>
          <p className="mb-0 text-capitalize primary-color fs-12 fw-semibold">
            capital assigned
          </p>
        </div>
        <div className="border d-flex flex-column align-items-center justify-content-between flex-fill p-2">
          <h6 className="mb-0 fw-bold">
            {parseFloat(usdt_balance?.balance || "0").toFixed(2) || "0"}
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

      {/* Lazy-loaded Modals */}
      <ConfirmPopup
        label="Bot Status"
        msg={`${botStatus} bot`}
        botStatus={botStatus}
        toggleBotStatus={toggleBotStatus}
        modelRef={modelRef}
        btnDisable={btnDisable}
      />
      {/* <EditInvestment botType={formData.bot} platform={formData.platform} 
        onSuccess={() => {
          console.log("Investment Updated Successfully!");
          // Optional logic: Close modal, refresh data, etc.
        }} /> */}

      <EditBinanceFutureModal
        botType={formData.bot}
        platform={formData.platform}
      />
      {/* {
        datamodal && (
          <AddBot platform={formData.platform} botType={formData.bot} />
        )
      } */}
      {/* Table Component */}
      <Table data={open_trades} thead={theadData} />

      <div className="modal fade" id="botModal">
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
                    value={data.platform}
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
                    value={data.botType}
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
                    value={data.total_investment}
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
