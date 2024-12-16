import React from "react";
import { Link, useNavigate } from "react-router-dom";
import useFetchKeys from "./CotextTest";
import BuysellFutureModal from "../components/models/BuysellFutureModal";

const BitgetFutureTable = ({ data }) => {
  const { getCoinicons, getFormattedDate } = useFetchKeys();

  const navigate = useNavigate();

  return (
    <div className="table-responsive">
      <table className="table table-bordered text-center">
        <thead className="thead primary-bg">
          <tr>
            <th>
              <p className="mb-0 primary-color fs-14">Symbol</p>
            </th>
            <th>
              <p className="mb-0 primary-color fs-14">Price</p>
            </th>
            <th>
              <p className="mb-0 primary-color fs-14">Org Qty</p>
            </th>
          </tr>
        </thead>
        <tbody className="tbody">
          {data?.length > 0 ? (
            data?.map((data, index) => (
              <tr key={index}>
                <td>
                  <div className="d-flex gap-3 align-items-center">
                    {/* <p className="mb-0 table-dot"></p> */}
                    <td>
                      <img
                        src={getCoinicons(data.symbol)}
                        alt={data.name}
                        className="cryptocurreny-icon-table crypto-icon"
                        width={30}
                      />
                      <p className="mb-0 fs-13 fw-semibold">
                        {data?.symbol || "NA"}
                      </p>
                      <p>{getFormattedDate(data.updateTime)}</p>
                    </td>
                  </div>
                </td>
                <td>
                  <p className="mb-0 fs-13 fw-semibold">
                    {parseFloat(data?.price).toFixed(2)}
                  </p>
                </td>
                <td>
                  <p className="mb-0 fs-13 fw-semibold">
                    {parseFloat(data?.origQty).toFixed(2)}
                  </p>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3}>
                <p className="text-center">No Data Found</p>
              </td>
            </tr>
          )}

          <tr>
            <td colSpan={5} className="text-center">
              <div
                onClick={() => {
                  navigate("/allDataTable", {
                    state: { reduxName: "bitgetFuture", type: "FUTURES" },
                  });
                }}
              >
                <button className="py-1">view all</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div className="text-center">
        <button
          className="py-1"
          data-bs-toggle="modal"
          data-bs-target="#buysellfuturemodal"
        >
          Buy / Sell
        </button>
      </div>
      <BuysellFutureModal />
    </div>
  );
};

export default BitgetFutureTable;
