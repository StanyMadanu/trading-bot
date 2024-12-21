import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import useFetchKeys from "./CotextTest";
import { backEndCallObj, getCurrentUser } from "../services/mainService";
import { toast } from "react-toastify";
import ConfirmPopup from "../components/models/ConfirmPopup";
import { bitgetSpotRedx } from "../components/reduxStore/slice/bitgitspotSlice";
import { binancespotRedx } from "../components/reduxStore/slice/binancespotSlice";
import { binancefutureRedx } from "../components/reduxStore/slice/binancefutureSlice";
import { bitgetFutureRdx } from "../components/reduxStore/slice/bitgetfutureSlice";
// Import the icons
import binanceIcon from "../assets/images/binance-icon-2048x2048-eh77cmwj.png";
import bitgetIcon from "../assets/images/11092.png";
import EditInvestmentModel from "../components/models/EditInvestmentModel";
import { AiOutlineRollback } from "react-icons/ai";
import Buysellfuturemodal from "../components/models/BuysellFutureModal";
const AllDataTable = () => {

  const location = useLocation();
  const navigate = useNavigate();
  const [btnDisable, setBtnDisable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [closeTradeBtn, setCloseTradeBtn] = useState({
    pair: "",
  });
  const [botStatus, setBotStatus] = useState("ADD");
  const [botsModal, setBotsModal] = useState(false);
  const [toggleRedux, setToggleRedux] = useState(false);


  const [sortAscending, setSortAscending] = useState(true); // State for sorting direction
  const { fetchData, fetchKeys } = useFetchKeys();


  const queryParams = new URLSearchParams(location.search);

  const reduxName = toggleRedux ? queryParams.get("extraReduxName") : queryParams.get("reduxName");
  const type = queryParams.get("type");
  const platform = toggleRedux ? queryParams.get("extraPlatform") : queryParams.get("platform");

  const profile = useSelector((state) => state.getProfile?.value?.profile); // Access Redux state

  const Redux = useSelector((state) => state?.[reduxName]?.value);



  const { bots, api_keys } = profile || {};

  const closeRef = useRef(null);
  const modelRef = useRef(null);

  const [data, setData] = useState({
    platform: platform || "BITGET",
    botType: type || "AMM",
    total_investment: "",
  })


  useEffect(() => {
    const formData = { bot: type, platform: platform };

    // Map reduxName to its respective slice reducer
    const sliceMapping = {
      bitgetSpot: bitgetSpotRedx,
      binanceSpot: binancespotRedx,
      binanceFuture: binancefutureRedx,
      bitgetFuture: bitgetFutureRdx,
    };

    const selectedSlice = sliceMapping[reduxName];


    if (selectedSlice) {
      if (!Redux) {
        fetchData(formData, setLoading, selectedSlice);
      }

    } else {
    }
  }, [reduxName, type, platform]);

  useEffect(() => {
    if (bots?.[platform]?.[type]?.status === "INACTIVE") {
      setBotStatus("Disable");
    } else if (bots?.[platform]?.[type]?.status === "ACTIVE") {
      setBotStatus("Enable");
    } else {
      setBotStatus("ADD");
    }
  }, [bots, toggleRedux]);



  const user = getCurrentUser();


  const { getCoinicons, getFormattedDate } = useFetchKeys();

  // Access Redux state
  const getRedux = useSelector((state) => state?.[reduxName]?.value);

  const { usdt_balance } = getRedux || {};


  const closeTrade = async () => {
    setBtnDisable(true);

    const formattedData = {
      pair: closeTradeBtn.pair,
    };


    try {
      const response = await backEndCallObj(
        "/admin/close_future_coin",
        formattedData
      );
      toast.success(response?.success);
      getCoinicons();
    } catch (error) {
      toast.error(error?.response?.data);
    } finally {
      setBtnDisable(false);
    }
  };

  const handleCloseClick = (row) => {
    setCloseTradeBtn({
      pair: row.symbol, // Set the pair as the clicked row's symbol
    });
  };



  const sortProfit = () => {
    setSortAscending(!sortAscending); // Toggle sorting direction
  };

  // Sort data based on profit
  const sortedData = [...(getRedux?.open_trades || [])].sort((a, b) => {
    const profitA = parseFloat(a.unRealizedProfit || 0);
    const profitB = parseFloat(b.unRealizedProfit || 0);
    return sortAscending ? profitA - profitB : profitB - profitA;
  });




  const getIcon = (platform) => {
    const lowerPlatform = platform.toLowerCase();
    if (lowerPlatform.includes("binance")) {
      return binanceIcon;
    } else if (lowerPlatform.includes("bitget")) {
      return bitgetIcon;
    }
    return null;
  };

  const icon = getIcon(platform);

  const changeDateTimeFormate = (timestamp) => {
    const numericTimestamp = Number(timestamp);

    const date = new Date(numericTimestamp);


    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;

    return formattedDate;
  };

  const toggleBotStatus = async (e) => {
    e.preventDefault();
    setBtnDisable(true);

    const formattedData = {
      platform: platform,
      bot: type,
      status: bots?.[platform]?.[type]?.status === "INACTIVE" ? "ACTIVE" : "INACTIVE",
    };

    try {
      setBtnDisable(true);
      const response = await backEndCallObj(
        "/admin/change_bot_status",
        formattedData
      );
      toast.success(response?.success);
      const modalInstance = window.bootstrap.Modal.getInstance(modelRef.current);
      if (modalInstance) modalInstance.hide();
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
      platform: data.platform,
      bot: data.botType,
      total_investment: data.total_investment,
    };
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

  const handleButtonClick = () => {
    if (bots?.[platform]?.[type]?.status === "INACTIVE" || bots?.[platform]?.[type]?.status === "ACTIVE") {
      // Open confirmDelete modal
      const confirmDeleteModal = new window.bootstrap.Modal(document.getElementById("confirmDelete"));
      confirmDeleteModal.show();
    } else if (api_keys?.[platform]?.api_key) {
      // Open bitgetModal
      const bitgetModal = new window.bootstrap.Modal(document.getElementById("bitgetModal"));
      bitgetModal.show();
    } else {
      // Navigate to /api route with state
      navigate("/api", { state: { platform: platform } });
    }
  };

  return (
    <div className="card">
      <div className="card-body">
        <div>
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-1 my-1">
            <button className="text-uppercase py-1 px-3" onClick={() => navigate("/dashboard", { state: { type, platform } })}><AiOutlineRollback className="fs-20" /></button>

            <div className="mx-auto d-flex justify-content-center align-items-center flex-wrap overflow-auto gap-2 gap-md-5">

              <span onClick={() => setToggleRedux(!toggleRedux)}><i class="ri-arrow-left-circle-fill fs-4"></i></span>

              <h5 className="primary-color fw-bold text-capitalize d-flex align-items-center  cursor-pointer custom-font-size mb-0"
                onClick={() => {
                  setBotsModal(true);
                  handleButtonClick();
                }}>

                <div className="d-flex justify-content-between align-items-center">
                  {icon && (
                    <img
                      src={icon}
                      alt={`${platform} icon`}
                      width={20}
                      height={20}
                      className="crypto-platform-icon me-2"
                    />
                  )}
                  {platform} {type === "FUTURES" ? "FUTURES" : "AMM"} DATA <span className={`fs-13 ${botStatus === "Disable" ? "text-danger" : "text-success"}`}>({botStatus})</span>
                </div>

              </h5>

              {/* <img src={rightArrow} width={50} height={40} alt=""  onClick={()=>setToggleRedux(!toggleRedux)} /> */}
              <span onClick={() => setToggleRedux(!toggleRedux)}><i class="ri-arrow-right-circle-fill fs-4"></i></span>




            </div>
          </div>
        </div>
        {/* <h4 className="primary-color fw-bold text-capitalize text-center">Balances</h4> */}




        <div className="d-flex justify-content-between align-items-center">
          <h6
            className="primary-color fw-bold text-capitalize mb-0 custom-font-size cursor-pointer"
            data-bs-toggle="modal"
            data-bs-target="#editInvest"
          >
            <span>Capital Assigned :</span>
            <span> {parseFloat(getRedux?.total_investment || 0).toFixed(2)}</span>
            <span className="ms-1">
              <i className="ri-edit-line"></i>
            </span>
          </h6>

          <button
            className="py-0"
            data-bs-toggle="modal"
            data-bs-target="#buysellfuturemodal"
          >
            Buy Sell
          </button>

          <h6 className="primary-color fw-bold text-capitalize mb-0 custom-font-size">
            <span>{type === "FUTURES" ? "Current Balance" : "Balance"}:</span>
            <span>
              {parseFloat(
                type === "FUTURES"
                  ? usdt_balance?.availableBalance || 0
                  : getRedux?.totalBalance || 0
              ).toFixed(2)}
            </span>
          </h6>
        </div>

        <Buysellfuturemodal />

        <div
          className="d-flex justify-content-start align-items-center overflow-auto mb-1 p-2 ps-0 mx-2"

        >
          {
            type !== "FUTURES" ? (
              Object?.entries(getRedux?.balances || {})?.map(([currency, value], index) => (
                <div
                  key={index}
                  className="text-center mx-1 border rounded shadow-sm d-flex align-items-baseline gap-1 justify-content-center flex-row-reverse p-1 pt-0 w-ft-content "

                >
                  <div
                    className="fs-10 fw-bold primary-color opacity-75"
                  >
                    ({currency})
                  </div>
                  <div
                    className="fs-16 fw-bold mt-1 primary-color"


                  >
                    {value.toFixed(2)}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center mx-1 border rounded shadow-sm d-flex align-items-baseline gap-1 justify-content-center flex-row-reverse p-1 pt-0 w-ft-content"

              >
                <div className="fs-10 fw-bold primary-color"
                >
                  (USDT)
                </div>
                <div
                  className="fs-16 fw-bold mt-1 primary-color"

                >
                  {parseFloat(usdt_balance?.balance || 0).toFixed(2)}
                </div>
              </div>
            )
          }
        </div>





        <div className="table-responsive custome-dataTable">
          {type === "FUTURES" ? (
            // Render Table for FUTURES Type
            <table className="table table-bordered text-center table-striped">
              <thead className="thead primary-bg">
                <tr>
                  <th>
                    <p className="mb-0 primary-color fs-12 text-center">
                      Symbol
                    </p>
                  </th>
                  <th>
                    <p className="mb-0 primary-color fs-12 text-center">
                      PositionAmt
                    </p>
                  </th>
                  <th onClick={sortProfit} className="cursor-pointer">
                    <p className="mb-0 primary-color fs-12 text-center">
                      Profit {sortAscending ? "↑" : "↓"}
                    </p>
                  </th>
                  <th>
                    <p className="mb-0 primary-color fs-12 text-center">
                      Entry Price
                    </p>
                  </th>
                  <th>
                    <p className="mb-0 primary-color fs-12 text-center">
                      Current Price
                    </p>
                  </th>
                  <th>
                    <p className="mb-0 primary-color fs-12 text-center">
                      Target
                    </p>
                  </th>
                  <th>
                    <p className="mb-0 primary-color fs-12 text-center">
                      Side
                    </p>
                  </th>

                  <th>
                    <p className="mb-0 primary-color fs-12 text-center">
                      Action
                    </p>
                  </th>
                </tr>
              </thead>
              <tbody className="tbody">
                {loading ? (
                  // Render the loading spinner
                  <tr>
                    <td colSpan={10} className="text-center py-5">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      <p className="mt-2">Loading data...</p>
                    </td>
                  </tr>
                ) : sortedData?.length > 0 ? (
                  // Render rows when data is available
                  sortedData?.map((row, index) => (
                    <tr key={index}>
                      <td>
                        <div className="d-flex gap-2 align-items-center justify-content-center">
                          <img
                            src={getCoinicons(row?.symbol)}
                            alt={row?.name}
                            className="cryptocurreny-icon-table crypto-icon"
                            width={30}
                          />
                          <p className="mb-0 fs-12 fw-semibold lh-2">
                            {row?.symbol || "NA"}
                          </p>
                        </div>
                      </td>
                      <td>
                        <p className={`mb-0 fs-12 fw-semibold lh-2`}>
                          {parseFloat(row?.positionAmt || "0").toFixed(2)}
                        </p>
                      </td>
                      <td>
                        <p
                          className={`mb-0 fs-12 fw-semibold lh-2 ${row?.unRealizedProfit < 0 ? "text-danger" : "text-success"
                            }`}
                        >
                          {parseFloat(row?.unRealizedProfit || "0").toFixed(2)}
                        </p>
                      </td>
                      <td>
                        <p className="mb-0 fs-12 fw-semibold lh-2">
                          {parseFloat(row?.entryPrice || "0").toFixed(2)}
                        </p>
                      </td>
                      <td>
                        <p className="mb-0 fs-12 fw-semibold lh-2">
                          {parseFloat(row?.markPrice || "0").toFixed(2)}
                        </p>
                      </td>
                      <td>
                        <p className="mb-0 fs-12 fw-semibold lh-2">
                          {parseFloat(row?.breakEvenPrice || "0").toFixed(2)}
                        </p>
                      </td>
                      <td>
                        <p className="mb-0 fs-12 fw-semibold lh-2">
                          {row?.positionAmt > 0 ? "Buy" : row?.positionAmt < 0 ? "Sell" : "0"}
                        </p>
                      </td>
                      <td>
                        <div className="d-flex align-items-center justify-content-center gap-3">
                          {user?.user_type === "ADMIN" && (
                            <button
                              className="px-2 py-1 fs-13 rounded"
                              data-bs-toggle="modal"
                              data-bs-target="#confirmDelete"
                              onClick={() => handleCloseClick(row)}
                            >
                              Close
                            </button>
                          )}
                          <a
                            className="primary-color text-decoration-none fw-semibold cursor-pointer fs-14"
                            data-bs-toggle="modal"
                            data-bs-target="#viewModal"
                            onClick={() => setData(row)}
                          >
                            view
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  // Render when no data is found
                  <tr>
                    <td colSpan={10} className="text-center py-5">
                      <p className="text-center mb-0">No Data Found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          ) : type === "AMM" ? (
            // Render Table for AMM Type
            <table className="table table-bordered text-center table-striped">
              <thead className="thead primary-bg">
                <tr>
                  <th>
                    <p className="mb-0 primary-color fs-12">Symbol</p>
                  </th>
                  <th>
                    <p className="mb-0 primary-color fs-12">Order ID</p>
                  </th>
                  <th>
                    <p className="mb-0 primary-color fs-12">{platform === "BINANCE" ? "Price" : "Avg Price"}</p>
                  </th>
                  <th>
                    <p className="mb-0 primary-color fs-12">{platform === "BINANCE" ? "origQty" : "Size"}</p>
                  </th>
                  <th>
                    <p className="mb-0 primary-color fs-12">Created At</p>
                  </th>
                  <th>
                    <p className="mb-0 primary-color fs-12 text-center">
                      Action
                    </p>
                  </th>
                </tr>
              </thead>
              <tbody className="tbody">
                {loading ? (
                  // Loader while data is loading
                  <tr>
                    <td colSpan={10} className="text-center py-5">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      <p className="mt-2 mb-0 fw-semibold">Loading data...</p>
                    </td>
                  </tr>
                ) : sortedData?.length > 0 ? (
                  // Data rows after loading
                  sortedData.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <div className="d-flex gap-2 align-items-center justify-content-start">
                          <img
                            src={getCoinicons(item?.symbol)}
                            alt={item?.name}
                            className="cryptocurreny-icon-table crypto-icon"
                            width={20}
                          />
                          <p className="mb-0 fs-12 fw-semibold">{item?.symbol || "NA"}</p>
                        </div>
                      </td>
                      <td>
                        <p className="mb-0 fs-12 fw-semibold">{item?.orderId}</p>
                      </td>
                      <td>
                        <p className="mb-0 fs-12 fw-semibold">
                          {parseFloat(platform === "BINANCE" ? item?.price : item?.priceAvg).toFixed(2)}
                        </p>
                      </td>
                      <td>
                        <p className="mb-0 fs-12 fw-semibold">
                          {platform === "BINANCE" ? JSON.parse(item.origQty || 0).toFixed(2) : item?.size}
                        </p>
                      </td>
                      <td>
                        <p className="mb-0 fs-12 fw-semibold">{platform === "BINANCE" ? changeDateTimeFormate(item?.time) : changeDateTimeFormate(item?.cTime)}</p>
                      </td>
                      <td>
                        <a
                          className="primary-color text-decoration-none fw-semibold cursor-pointer fs-14"
                          data-bs-toggle="modal"
                          data-bs-target="#viewModal"
                          onClick={() => setData(item)}
                        >
                          view
                        </a>
                      </td>
                    </tr>
                  ))
                ) : (
                  // Fallback for no data
                  <tr>
                    <td colSpan={10} className="text-center py-5">
                      <p className="mb-0 fw-semibold">No Data Found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          ) : (
            // If type is unknown
            <p className="text-center mb-0">Invalid Data Type</p>
          )}
        </div>
      </div>


      {/* bot status modal */}


      {
        botsModal ? (<>
          <ConfirmPopup
            label="Bot Status"
            msg={`${botStatus} bot`}
            botStatus={botStatus}
            toggleBotStatus={toggleBotStatus}
            modelRef={modelRef}
            btnDisable={btnDisable}
          />

        </>) : (
          <>
            <ConfirmPopup
              label="Close Trade"
              toggleBotStatus={closeTrade}
              botStatus="Close"
              msg="Close Trade"
            />
          </>
        )
      }


      <EditInvestmentModel
        botType={type}
        platform={platform}
        fetchData={fetchData}
      />

      {/* view modal */}
      <>
        <div
          className="modal fade"
          id="viewModal"
          tabindex="-1"
          aria-labelledby="viewModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title primary-color" id="viewModalLabel">
                  View Data
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                {/* Dynamically Render Key-Value Pairs */}
                <div className="row">
                  {Object.entries(data).map(([key, value]) => {
                    // Check if the key is "updatedTime" and apply the date formatting
                    const displayValue =
                      key === "updateTime"
                        ? getFormattedDate(value)
                        : key === "cTime" || key === "uTime"
                          ? changeDateTimeFormate(value)
                          : value;

                    return (
                      <div key={key} className="col-md-6 mb-4">
                        <label className="form-label text-capitalize">
                          {key.replace("_", " ")} {/* Format the key */}
                        </label>
                        <input
                          type="text"
                          value={displayValue || ""}
                          readOnly
                          className="form-control"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>


            </div>
          </div>
        </div>
      </>

      {/* Add Bot Modal */}

      <div className="modal fade" id="bitgetModal" ref={closeRef}>
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
                    value={data?.platform}
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
                    value={data?.botType}
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

    </div >
  );
};

export default AllDataTable;
