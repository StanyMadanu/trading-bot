import React from "react";

const Table = ({data}) => {
  const tableData = [1, 2, 3, 4, 5];

  
  return (
    <div className="table-responsive">
      <table className="table table-bordered">
        <thead className="thead">
          <tr>
            <th>
              <p className="mb-0 primary-color fs-14">Symbole</p>
            </th>
            <th>
              <p className="mb-0 primary-color fs-14">Price</p>
            </th>
            <th>
              <p className="mb-0 primary-color fs-14">OrgQty</p>
            </th>
          </tr>
        </thead>
        <tbody className="tbody">
          {data?.map((data, index) => (
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
          ))}
          <tr>
            <td colSpan={3} className="text-center">
              <button className="py-1">view all</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Table;
