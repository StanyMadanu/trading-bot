import React from "react";
import { useNavigate } from "react-router-dom";
import useFetchKeys from "./CotextTest";

const BitgetSpotTable = ({ data }) => {
  const navigate = useNavigate();

  const { getCoinicons, getFormattedDate } = useFetchKeys();

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
                    {parseFloat(data?.priceAvg).toFixed(2)}
                  </p>
                </td>
                <td>
                  <p className="mb-0 fs-13 fw-semibold">
                    {parseFloat(data?.size).toFixed(2)}
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
            <td colSpan={3} className="text-center">
              <div
                onClick={() => {
                  navigate("/allDataTable", {
                    state: { reduxName: "bitgetSpot", type: "AMM" },
                  });
                }}
              >
                <button className="py-1">view all</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default BitgetSpotTable;
