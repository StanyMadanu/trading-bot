import React from "react";

const AllDataTable = ({ theadings, tdata }) => {
  return (
    <div className="card">
      <div className="card-body">
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead className="thead primary-bg">
              <tr>
                <th>
                  <p className="mb-0 primary-color fs-14">heading 1</p>
                </th>
                <th>
                  <p className="mb-0 primary-color fs-14">heading 2</p>
                </th>
                <th>
                  <p className="mb-0 primary-color fs-14">heading 3</p>
                </th>
              </tr>
            </thead>
            <tbody className="tbody">
              <tr>
                <td>
                  <div className="d-flex gap-3 align-items-center">
                    <p className="mb-0 table-dot"></p>
                    <p className="mb-0 fs-13 fw-semibold">data 1</p>
                  </div>
                </td>
                <td>
                  <p className="mb-0 fs-13 fw-semibold">data 2</p>
                </td>
                <td>
                  <p className="mb-0 fs-13 fw-semibold">data 3</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AllDataTable;
