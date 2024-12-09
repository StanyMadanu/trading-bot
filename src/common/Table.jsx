import React from "react";

const Table = () => {
  const tableData = [1, 2, 3, 4, 5];

  return (
    <div className="table-responsive">
      <table className="table table-bordered">
        <thead className="thead">
          <tr>
            <th>
              <p className="mb-0 primary-color fs-14">Header 1</p>
            </th>
            <th>
              <p className="mb-0 primary-color fs-14">Header 2</p>
            </th>
            <th>
              <p className="mb-0 primary-color fs-14">Header 3</p>
            </th>
          </tr>
        </thead>
        <tbody className="tbody">
          {tableData.map((data, index) => (
            <tr key={index}>
              <td>
                <p className="mb-0 fs-13 fw-semibold">data</p>
              </td>
              <td>
                <p className="mb-0 fs-13 fw-semibold">data</p>
              </td>
              <td>
                <p className="mb-0 fs-13 fw-semibold">data</p>
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
