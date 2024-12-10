import React from "react";
import { Link } from "react-router-dom";

const Table = ({ data, thead }) => {
  return (
    <div className="table-responsive">
      <table className="table table-bordered">
        <thead className="thead">
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
                    <p className="mb-0 table-dot"></p>
                    <p className="mb-0 fs-13 fw-semibold">{data.symbol}</p>
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
              <Link to="/allDataTable">
                <button className="py-1">view all</button>
              </Link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Table;
