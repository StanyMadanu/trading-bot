import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import useFetchKeys from "./CotextTest";
import { backEndCallObj, getCurrentUser } from "../services/mainService";
import { toast } from "react-toastify";
import ConfirmPopup from "../components/models/ConfirmPopup";

const AllDataTable = () => {
  // Get reduxName and type from location state
  const location = useLocation();
  const [btnDisabled, setBtnDisabled] = useState(false)
  const [closeTradeBtn , setCloseTradeBtn ] = useState({
    pair: "",
  })
  const { reduxName, type } = location.state || {};

  const user = getCurrentUser();



  const { getCoinicons, getFormattedDate } = useFetchKeys();



  // Access Redux state
  const getRedux = useSelector((state) => state?.[reduxName]);

  const closeTrade = async () => {
    setBtnDisabled(true);

    const formattedData = {
      pair : closeTradeBtn.pair,
    }

    try {
      const response = await backEndCallObj(
        "/admin/close_future_coin",
        formattedData
      );
      // console.log(response, "aaa");
      toast.success(response?.success);
      getCoinicons();
    } catch (error) {
      toast.error(error?.response?.data);
    }
    finally {
      setBtnDisabled(false);
    }
  }

  return (
    <div className="card">
      <div className="card-body">
        <div className="my-4">
          <Link to="/dashboard">
            <button className="text-uppercase py-1 px-3">back</button>
          </Link>
        </div>

        <h5 className="primary-color fw-bold text-capitalize text-center mb-3 text-decoration-underline">
          {type === "FUTURES" ? "FUTURES" : "AMM"} table data
        </h5>

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
                      Volume
                    </p>
                  </th>
                  <th>
                    <p className="mb-0 primary-color fs-14 text-center">
                      Profit
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
                  {
                    user.userType === "ADMIN" ? (
                      <th>
                        <p className="mb-0 primary-color fs-14 text-center">
                          Action
                        </p>
                      </th>
                    ) : (
                      ''
                    )
                  }
                </tr>
              </thead>
              <tbody className="tbody">
                {getRedux?.value?.open_trades?.length > 0 ? (
                  getRedux?.value?.open_trades?.map((row, index) => (
                    <tr key={index}>
                      <td>
                        <img
                          src={getCoinicons(row.symbol)}
                          alt={row.name}
                          className="cryptocurreny-icon-table crypto-icon"
                          width={30}
                        />
                        <p className="mb-0 fs-13 fw-semibold">
                          {row?.symbol || "NA"}
                        </p>
                        <p>{getFormattedDate(row.updateTime)}</p>
                      </td>
                      <td>
                        <p className="mb-0 fs-13 fw-semibold">
                          {parseFloat(row?.positionAmt || "0").toFixed(2)}
                        </p>
                      </td>
                      <td>
                        <p className="mb-0 fs-13 fw-semibold">
                          {parseFloat(row?.unRealizedProfit || "0").toFixed(2)}
                        </p>
                      </td>
                      <td>
                        <p className="mb-0 fs-13 fw-semibold">
                          {parseFloat(row?.entryPrice || "0").toFixed(2)}
                        </p>
                      </td>
                      <td>
                        <p className="mb-0 fs-13 fw-semibold">
                          {parseFloat(row?.markPrice || "0").toFixed(2)}
                        </p>
                      </td>
                      <td>
                        <p className="mb-0 fs-13 fw-semibold">
                          {parseFloat(row?.breakEvenPrice || "0").toFixed(2)}
                        </p>
                      </td>
                      {
                        user.userType === "ADMIN" && (
                          <td>
                            <p className="mb-0 fs-13 fw-semibold">
                              <button className="btn btn-primary btn-sm" data-bs-toggle="modal"
                                data-bs-target="#confirmDelete"
                                onClick={() =>
                                  this.setState({
                                    setCloseTradeBtn: {
                                     pair: row.symbol,
                                    },
                                  })
                                }>Close</button>
                            </p>
                          </td>
                        )
                      }
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6}>
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
                {getRedux?.value?.open_trades?.length > 0 ? (
                  getRedux?.value?.open_trades?.map((item, index) => (
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
                    <td colSpan={7}>
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
      <ConfirmPopup toggleBotStatus={closeTrade}
          botStatus="Close" msg='Close Trade' />
    </div>
  );
};

export default AllDataTable;
