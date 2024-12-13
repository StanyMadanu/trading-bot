import React, { useEffect, useRef, useState, Suspense } from "react";
import { bitgetFutureRdx } from "../reduxStore/slice/bitgetfutureSlice";
import {
  backEndCallObj,
  backEndCallObjNoDcyt,
} from "../../services/mainService";
import BitgetFutureTable from "../../common/BitgetFutureTable";
import { connect } from "react-redux";
import useFetchKeys from "../../common/CotextTest";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import EditBitgetFuture from "../models/EditBitgetFutures";
// Lazy load components
const ConfirmPopup = React.lazy(() => import("../models/ConfirmPopup"));
const EditInvestment = React.lazy(() =>
  import("../models/EditInvestmentModel")
);

const BitgitFuture = ({ dispatch, bitgetFuture, getProfile }) => {
  const [formData] = useState({
    platform: "BITGET",
    bot: "FUTURES",
  });

  const [data, setData] = useState({
    platform: "BITGET",
    botType: "FUTURES",
    total_investment: "",
  });

  const [btnDisable, setBtnDisable] = useState(false);
  const [botStatus, setBotStatus] = useState("ADD");
  const [datamodal, setDataModala] = useState(false);

  const navigate = useNavigate();

  const { fetchKeys } = useFetchKeys();

  const { bots, api_keys } = getProfile?.profile || {};

  const { open_trades, usdt_balance } = bitgetFuture || {};

  // console.log(open_trades);
  const modelRef = useRef(null);

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
    if (bots?.[formData?.platform] && api_keys?.[formData?.platform]) {
      fetchData();
    }
  }, [dispatch, bots]);

  useEffect(() => {
    if (bots?.BITGET?.FUTURES?.status === "INACTIVE") {
      setBotStatus("Enable");
    } else if (bots?.BITGET?.FUTURES?.status === "ACTIVE") {
      setBotStatus("Disable");
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
      status:
        bots?.BITGET?.FUTURES?.status === "INACTIVE" ? "ACTIVE" : "INACTIVE",
    };

    // console.log(formattedData)
    try {
      // console.log(formattedData);
      setBtnDisable(true);
      const response = await backEndCallObj(
        "/admin/change_bot_status",
        formattedData
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

  const submitBot = async (data) => {
    setBtnDisable(true);
    // console.log(data)
    const formattedData = {
      platform:data.platform,
      bot:data.botType,
      total_investment:data.total_investment,
    };
    try {
      const response = await backEndCallObj("/admin/add_bot", formattedData);
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

  //table header data
  const theadData = ["Symbol", "Price", "Org Qty"];

  let button;
  switch (bots?.BITGET?.FUTURES?.status) {
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
      api_keys?.[formData.platform]?.api_key
        ? (button = (
            <button
              className="theme-btn text-uppercase"
              type="button"
              data-bs-toggle="modal"
              data-bs-target="#ADDBOOT"
              onClick={() => {
                setDataModala((prev) => !prev); // Properly toggle state
              }}
            >
              Add Bot
            </button>
          ))
        : (button = (
            <button
              className="theme-btn text-uppercase"
              type="button"
              onClick={() =>
                navigate("/api", { state: { platform: formData.platform } })
              }
            >
              Add Bot
            </button>
          ));
      break;
  }

  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <div className="bot-status d-flex flex-wrap justify-content-between gap-2 pb-3">
          <div
            className="border d-flex flex-column align-items-center justify-content-between flex-fill p-2 "
            data-bs-toggle="modal"
            data-bs-target="#editBitgetFutureModal"
          >
            <h6 className="mb-0 fw-bold">0</h6>
            <p className="mb-0 text-capitalize primary-color fs-12 fw-semibold">
              capital assigned
            </p>
          </div>
          <div className="border d-flex flex-column align-items-center justify-content-between flex-fill p-2">
            <h6 className="mb-0 fw-bold">
              {parseFloat(usdt_balance?.balance || "0").toFixed(2)}
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
        <BitgetFutureTable data={bitgetFuture} thead={theadData} />
        <ConfirmPopup
          label="Bot Status"
          msg={`${botStatus} bot`}
          botStatus={botStatus}
          toggleBotStatus={toggleBotStatus}
          modelRef={modelRef}
          btnDisable={btnDisable}
        />

        <EditBitgetFuture botType={formData.bot} platform={formData.platform} />

        <div className="modal fade" id="ADDBOOT">
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
                      value={data.platform}
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
                      value={data.botType}
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
    </>
  );
};

// Map Redux state to props
const mapStateToProps = (state) => {
  return {
    bitgetFuture: state.bitgetFuture.value, // Access the slice state
    getProfile: state.getProfile.value,
  };
};

export default connect(mapStateToProps)(BitgitFuture);
