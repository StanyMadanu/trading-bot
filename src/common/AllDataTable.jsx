import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import useFetchKeys from "./CotextTest";
import { backEndCallObj, getCurrentUser } from "../services/mainService";
import { toast } from "react-toastify";
import ConfirmPopup from "../components/models/ConfirmPopup";

const AllDataTable = () => {
  // Get reduxName and type from location state
  const location = useLocation();
  const navigate = useNavigate();
  const [btnDisabled, setBtnDisabled] = useState(false);
  const [closeTradeBtn, setCloseTradeBtn] = useState({
    pair: "",
  });
  const [sortAscending, setSortAscending] = useState(true); // State for sorting direction


  const { reduxName, type, platform } = location.state || {};

  const [data, setData] = useState({
  })

  const user = getCurrentUser();


  const { getCoinicons, getFormattedDate } = useFetchKeys();

  // Access Redux state
  const getRedux = useSelector((state) => state?.[reduxName]?.value);

  const { usdt_balance } = getRedux || {};

  console.log(usdt_balance);

  const closeTrade = async () => {
    setBtnDisabled(true);

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
      setBtnDisabled(false);
    }
  };

  const handleCloseClick = (row) => {
    setCloseTradeBtn({
      pair: row.symbol, // Set the pair as the clicked row's symbol
    });
  };

  // const testing = [
  //   {
  //     adlQuantile: 1,
  //     breakEvenPrice: "102415.4605306",
  //     entryPrice: "102466.6938776",
  //     isAutoAddMargin: "false",
  //     isolated: false,
  //     isolatedMargin: "0.00000000",
  //     isolatedWallet: "0",
  //     leverage: "50",
  //     liquidationPrice: "132997.73880747",
  //     marginType: "cross",
  //     markPrice: "106824.26514894",
  //     maxNotionalValue: "12000000",
  //     notional: "-10468.77798459",
  //     positionAmt: "-0.098",
  //     positionSide: "BOTH",
  //     symbol: "BTCUSDT",
  //     unRealizedProfit: "427.04198459",
  //     updateTime: 1734315439913
  //   },
  //   {
  //     adlQuantile: 2,
  //     breakEvenPrice: "102500.4505306",
  //     entryPrice: "102550.6938776",
  //     isAutoAddMargin: "true",
  //     isolated: true,
  //     isolatedMargin: "0.10000000",
  //     isolatedWallet: "0.001",
  //     leverage: "20",
  //     liquidationPrice: "132000.73880747",
  //     marginType: "isolated",
  //     markPrice: "106900.26514894",
  //     maxNotionalValue: "5000000",
  //     notional: "-5000.77798459",
  //     positionAmt: "-0.050",
  //     positionSide: "LONG",
  //     symbol: "ETHUSDT",
  //     unRealizedProfit: "-250.04198459",
  //     updateTime: 1734315439914
  //   },
  //   {
  //     adlQuantile: 3,
  //     breakEvenPrice: "104000.4505306",
  //     entryPrice: "104050.6938776",
  //     isAutoAddMargin: "false",
  //     isolated: false,
  //     isolatedMargin: "0.00000000",
  //     isolatedWallet: "0",
  //     leverage: "30",
  //     liquidationPrice: "135000.73880747",
  //     marginType: "cross",
  //     markPrice: "107500.26514894",
  //     maxNotionalValue: "8000000",
  //     notional: "-8000.77798459",
  //     positionAmt: "-0.075",
  //     positionSide: "SHORT",
  //     symbol: "XRPUSDT",
  //     unRealizedProfit: "-350.04198459",
  //     updateTime: 1734315439915
  //   },
  //   {
  //     adlQuantile: 4,
  //     breakEvenPrice: "105000.4505306",
  //     entryPrice: "105100.6938776",
  //     isAutoAddMargin: "true",
  //     isolated: true,
  //     isolatedMargin: "0.20000000",
  //     isolatedWallet: "0.002",
  //     leverage: "10",
  //     liquidationPrice: "137000.73880747",
  //     marginType: "isolated",
  //     markPrice: "108000.26514894",
  //     maxNotionalValue: "6000000",
  //     notional: "-6000.77798459",
  //     positionAmt: "-0.060",
  //     positionSide: "BOTH",
  //     symbol: "SOLUSDT",
  //     unRealizedProfit: "300.04198459",
  //     updateTime: 1734315439916
  //   }
  // ];

  // Sorting Logic for Profit

  const sortProfit = () => {
    setSortAscending(!sortAscending); // Toggle sorting direction
  };

  // Sort data based on profit
  const sortedData = [...(getRedux?.open_trades || [])].sort((a, b) => {
    const profitA = parseFloat(a.unRealizedProfit || 0);
    const profitB = parseFloat(b.unRealizedProfit || 0);
    return sortAscending ? profitA - profitB : profitB - profitA;
  });
  // const sortedData = [...(testing || [])].sort((a, b) => {
  //   const profitA = parseFloat(a.unRealizedProfit || 0);
  //   const profitB = parseFloat(b.unRealizedProfit || 0);
  //   return sortAscending ? profitA - profitB : profitB - profitA;
  // });


  return (
    <div className="card">
      <div className="card-body">
        <div className="my-4">
          <div onClick={() => navigate("/dashboard", { state: { type, platform } })}>
            <button className="text-uppercase py-1 px-3">Back</button>
          </div>
        </div>

        <div className="d-flex justify-content-between align-items-center mb-3">

          <h6 className="primary-color fw-bold text-capitalize">
            {type === "FUTURES" && <>
              <span>Balance :</span>
              <span> {parseFloat(usdt_balance?.balance).toFixed(2)}</span>
            </>
            }

          </h6>


          <h5 className="primary-color fw-bold text-capitalize">
            {type === "FUTURES" ? "FUTURES" : "AMM"} DATA
          </h5>


          <h6 className="primary-color fw-bold text-capitalize">
            {type === "FUTURES" && <>
              <span>Current Balance :</span>
              <span> {parseFloat(usdt_balance?.availableBalance).toFixed(2)}</span>
            </>
            }

          </h6>

        </div>



        <div className="table-responsive">
          {type === "FUTURES" ? (
            // Render Table for FUTURES Type
            <table className="table table-bordered text-center">
              <thead className="thead primary-bg">
                <tr>
                  <th>
                    <p className="mb-0 primary-color fs-14 text-center">
                      Symbol
                    </p>
                  </th>
                  <th>
                    <p className="mb-0 primary-color fs-14 text-center">
                      PositionAmt
                    </p>
                  </th>
                  <th onClick={sortProfit} className="cursor-pointer">
                    <p className="mb-0 primary-color fs-14 text-center">
                      Profit {sortAscending ? "↑" : "↓"}
                    </p>
                  </th>
                  <th>
                    <p className="mb-0 primary-color fs-14 text-center">
                      Entry Price
                    </p>
                  </th>
                  <th>
                    <p className="mb-0 primary-color fs-14 text-center">
                      Current Price
                    </p>
                  </th>
                  <th>
                    <p className="mb-0 primary-color fs-14 text-center">
                      Target
                    </p>
                  </th>
                  <th>
                    <p className="mb-0 primary-color fs-14 text-center">
                      PositionSide
                    </p>
                  </th>
                  {user.user_type === "ADMIN" ? (
                    <th>
                      <p className="mb-0 primary-color fs-14 text-center">
                        Action
                      </p>
                    </th>
                  ) : (
                    ""
                  )}
                </tr>
              </thead>
              <tbody className="tbody">
                {sortedData.length > 0 ? (
                  sortedData.map((row, index) => (
                    <tr key={index}>
                      <td>
                        <div className="d-flex gap-2 align-items-center justify-content-center">
                          <img
                            src={getCoinicons(row.symbol)}
                            alt={row.name}
                            className="cryptocurreny-icon-table crypto-icon"
                            width={30}
                          />
                          <p className="mb-0 fs-13 fw-semibold lh-2">
                            {row?.symbol || "NA"}
                          </p>
                          {/* <p>{getFormattedDate(row.updateTime)}</p> */}
                        </div>
                      </td>
                      <td>
                        <p className={`mb-0 fs-13 fw-semibold lh-2`}>
                          {parseFloat(row?.positionAmt || "0").toFixed(2)}
                        </p>
                      </td>
                      <td>
                        <p className={`mb-0 fs-13 fw-semibold lh-2 ${row.unRealizedProfit < 0 ? "text-danger" : "text-success"}`}>
                          {parseFloat(row?.unRealizedProfit || "0").toFixed(2)}
                        </p>
                      </td>
                      <td>
                        <p className="mb-0 fs-13 fw-semibold lh-2">
                          {parseFloat(row?.entryPrice || "0").toFixed(2)}
                        </p>
                      </td>
                      <td>
                        <p className="mb-0 fs-13 fw-semibold lh-2">
                          {parseFloat(row?.markPrice || "0").toFixed(2)}
                        </p>
                      </td>
                      <td>
                        <p className="mb-0 fs-13 fw-semibold lh-2">
                          {parseFloat(row?.breakEvenPrice || "0").toFixed(2)}
                        </p>
                      </td>
                      <td>
                        <p className="mb-0 fs-13 fw-semibold lh-2">
                          {row?.positionSide}
                        </p>
                      </td>
                      <td>
                        <div className="d-flex align-items-center justify-content-center gap-3">
                          {user.user_type === "ADMIN" && (
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
                  <tr>
                    <td colSpan={10}>
                      <p className="text-center mb-0">No Data Found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          ) : type === "AMM" ? (
            // Render Table for AMM Type
            <table className="table table-bordered text-center">
              <thead className="thead primary-bg">
                <tr>
                  <th>
                    <p className="mb-0 primary-color fs-14">Symbol</p>
                  </th>
                  <th>
                    <p className="mb-0 primary-color fs-14">Order ID</p>
                  </th>
                  <th>
                    <p className="mb-0 primary-color fs-14">Price</p>
                  </th>
                  <th>
                    <p className="mb-0 primary-color fs-14">Org Qty</p>
                  </th>
                  <th>
                    <p className="mb-0 primary-color fs-14">Side</p>
                  </th>
                  <th>
                    <p className="mb-0 primary-color fs-14">Status</p>
                  </th>
                  <th>
                    <p className="mb-0 primary-color fs-14">Stop Price</p>
                  </th>
                </tr>
              </thead>
              <tbody className="tbody">
                {getRedux?.open_trades?.length > 0 ? (
                  getRedux?.open_trades?.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <div className="d-flex align-items-center">
                          <div>
                            <td>
                              <img
                                src={getCoinicons(item.symbol)}
                                alt={item.name}
                                className="cryptocurreny-icon-table crypto-icon"
                                width={30}
                              />
                              <p className="mb-0 fs-13 fw-semibold">
                                {item?.symbol || "NA"}
                              </p>
                              <p>{getFormattedDate(item.updateTime)}</p>
                            </td>
                          </div>
                        </div>
                      </td>
                      <td>
                        <p className="mb-0 fs-13 fw-semibold">{item.orderId}</p>
                      </td>
                      <td>
                        <p className="mb-0 fs-13 fw-semibold">
                          ${parseFloat(item.price).toFixed(2)}
                        </p>
                      </td>
                      <td>
                        <p className="mb-0 fs-13 fw-semibold">
                          {`${parseFloat(item.origQty).toFixed(2)}`}
                        </p>
                      </td>
                      <td>
                        <p
                          className={`mb-0 fs-13 fw-semibold ${item.side === "BUY" ? "text-success" : "text-danger"
                            }`}
                        >
                          {item.side}
                        </p>
                      </td>
                      <td>
                        <p className="mb-0 fs-13 fw-semibold">{item.status}</p>
                      </td>
                      <td>
                        <p className="mb-0 fs-13 fw-semibold">
                          {`${parseFloat(item.stopPrice).toFixed(2)}`}
                        </p>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={10}>
                      <p className="text-center mb-0">No Data Found</p>
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
      <ConfirmPopup
        label="Close Trade"
        toggleBotStatus={closeTrade}
        botStatus="Close"
        msg="Close Trade"
      />

      {/* view modal */}
      <>
        <div
          class="modal fade"
          id="viewModal"
          tabindex="-1"
          aria-labelledby="viewModalLabel"
          aria-hidden="true"
        >
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title primary-color" id="viewModalLabel">
                  View Data
                </h5>
                <button
                  type="button"
                  class="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                {/* Dynamically Render Key-Value Pairs */}
                <div className="row">
                  {Object.entries(data).map(([key, value]) => {
                    // Check if the key is "updatedTime" and apply the date formatting
                    const displayValue = key === "updateTime" ? getFormattedDate(value) : value;

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
    </div>
  );
};

export default AllDataTable;
