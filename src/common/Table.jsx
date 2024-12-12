import React from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import useFetchKeys from "./CotextTest";

const Table = ({ data, thead }) => {
  const navigate = useNavigate();

  const { getCoinicons, getFormattedDate } = useFetchKeys();

  return (
    <div className="table-responsive">
      <table className="table table-bordered text-center">
        <thead className="thead primary-bg">
          <tr>
            {thead.map((head) => (
              <th>
                <p className="mb-0 primary-color fs-14">{head}</p>
              </th>
            ))}
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
                    {/* <p className="mb-0 fs-13 fw-semibold">{data.symbol}</p> */}
                  </div>
                </td>
                <td>
                  <p className="mb-0 fs-13 fw-semibold">{data.entryPrice}</p>
                </td>
                <td>
                  <p className="mb-0 fs-13 fw-semibold">{data.adlQuantile}</p>
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
                    state: { reduxName: "binanceFuture", type: "FUTURES" },
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

export default Table;
