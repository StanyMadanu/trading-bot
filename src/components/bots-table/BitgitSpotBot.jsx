import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  backEndCallObj,
  backEndCallObjNoDcyt,
} from "../../services/mainService";
import { bitgetSpotRedx } from "../reduxStore/slice/bitgitspotSlice";
import BitgetSpotTable from "../../common/BitgetSpotTable";
import ConfirmPopup from "../models/ConfirmPopup";
import EditInvestment from "../models/EditInvestmentModel";
import useFetchKeys from "../../common/CotextTest";

const BinanceSpotBot = ({ dispatch, bitgetSpot, getProfile }) => {
  const [formData] = useState({
    platform: "BITGET",
    bot: "AMM",
  });
  const [data, setData] = useState({
    platform: "BITGET",
    botType: "AMM",
    total_investment: "",
  });
  const [btnDisable, setBtnDisable] = useState(false);
  const [botStatus, setBotStatus] = useState("ADD");

  const navigate = useNavigate();
  const { fetchKeys } = useFetchKeys();
  const { bots, api_keys } = getProfile?.profile || {};
  const modelRef = useRef(null);

  const { open_trades, totalBalance, total_investment } = bitgetSpot || {};

  const fetchData = async () => {
    try {
      const response = await backEndCallObjNoDcyt(
        "/trades/get_open_trades_data",
        formData
      );
      dispatch(bitgetSpotRedx(response)); // Dispatch the action to Redux
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
    if (bots?.BITGET?.AMM?.status === "INACTIVE") {
      setBotStatus("Enable");
    } else if (bots?.BITGET?.AMM?.status === "ACTIVE") {
      setBotStatus("Disable");
    } else {
      setBotStatus("ADD");
    }
  }, [bots]);

  const submitBot = async (data) => {
    setBtnDisable(true);
    const formattedData = {
      platform: data.platform,
      bot: data.botType,
      total_investment: data.total_investment,
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBtnDisable(true);

    const formattedData = {
      ...formData,
      status: bots?.BITGET.AMM.status === "INACTIVE" ? "ACTIVE" : "INACTIVE",
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
    if (api_keys?.[formData.platform]?.api_key) {
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


  const capital_investment = parseFloat(totalBalance / total_investment || 0).toFixed(2);

  return (
    <>
      <div className="bot-status d-flex flex-wrap justify-content-between gap-2 pb-3">
        <div
          className="border d-flex flex-column align-items-center justify-content-between flex-fill p-2"
          data-bs-toggle="modal"
          data-bs-target="#editInvest"
        >
          <h6 className="mb-0 fw-bold">{parseFloat(total_investment || 0).toFixed(2)}</h6>
          <p className="mb-0 text-capitalize primary-color fs-12 fw-semibold">
            Capital Assigned
          </p>
        </div>
        <div className="border d-flex flex-column align-items-center justify-content-between flex-fill p-2">
          <h6 className="mb-0 fw-bold">
            {parseFloat(totalBalance || "0").toFixed(2)}
          </h6>
          <p className="mb-0 text-capitalize primary-color fs-12 fw-semibold">
            Current Balance
          </p>
        </div>
        <div className="border d-flex flex-column align-items-center justify-content-between flex-fill p-2">
          <h6 className="mb-0 status-percent fw-bold px-2 py-0">
            {capital_investment > 0
              ? `+${capital_investment}`
              : `${capital_investment}`}
            %
          </h6>
          <p className="mb-0 text-capitalize primary-color fs-12 fw-semibold">
            % Change
          </p>
        </div>
        <div className="border d-flex justify-content-center align-items-center flex-fill p-2">
          {handleButtonClick()}
        </div>
      </div>
      <ConfirmPopup
        label="Bot Status"
        msg={`${botStatus} bot`}
        botStatus={botStatus}
        toggleBotStatus={toggleBotStatus}
        modelRef={modelRef}
        btnDisable={btnDisable}
      />
      <EditInvestment
        botType={formData.bot}
        platform={formData.platform}
        onSuccess={() => {
          // console.log("Investment Updated Successfully!");
        }}
      />
      <BitgetSpotTable
        data={open_trades}
        thead={["Symbol", "Price", "Org Qty"]}
      />
      <div className="modal fade" id="bitgetModal">
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
                <div className="mb-4">
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

                <div className="mb-4">
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

                <div className="mb-4">
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
  );
};

const mapStateToProps = (state) => ({
  bitgetSpot: state.bitgetSpot.value,
  getProfile: state.getProfile.value,
});

export default connect(mapStateToProps)(BinanceSpotBot);
