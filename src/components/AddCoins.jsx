import React from "react";
import { MdDelete } from "react-icons/md";
import { RiEdit2Fill } from "react-icons/ri";
import tether from "../assets/images/tether.png";

const AddCoins = () => {
  const theadData = [
    "pair",
    "coin ID",
    "status",
    "price precision",
    "quantity precision",
    "target percent",
    "platform",
    "bot",
    "action",
  ];
  return (
    <div className="card">
      <div className="card-body">
        <div className="container">
          <h5 className="text-center my-3 fw-bold primary-color text-capitalize">
            add coins table
          </h5>

          <div className="text-end my-3">
            <button
              className="py-2 rounded-pill text-capitalize secondary-bg"
              type="button"
              data-bs-toggle="modal"
              data-bs-target="#addCoinModal"
            >
              add coin
            </button>
          </div>

          <div className="table-responsive">
            <table className="table table-bordered">
              <thead className="thead primary-bg">
                <tr>
                  {theadData.map((data, index) => (
                    <th key={index}>
                      <p className="mb-0 primary-color fs-14 text-capitalize text-center">
                        {data}
                      </p>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="tbody text-center">
                {theadData.map((data, index) => (
                  <tr>
                    <td>
                      <div className="d-flex gap-2 align-items-center">
                        <img src={tether} alt="tether" width={40} />
                        <p className="mb-0 fs-13 fw-semibold text-uppercase">
                          BRETTUSDT
                        </p>
                      </div>
                    </td>
                    <td>
                      <p className="mb-0 fs-13 fw-semibold lh-2">CD13C06CBB5</p>
                    </td>
                    <td>
                      <p className="mb-0 fs-13 fw-semibold text-uppercase lh-2 text-success">
                        active
                      </p>
                    </td>
                    <td>
                      <p className="mb-0 fs-13 fw-semibold lh-2">4</p>
                    </td>
                    <td>
                      <p className="mb-0 fs-13 fw-semibold lh-2">2</p>
                    </td>
                    <td>
                      <p className="mb-0 fs-13 fw-semibold lh-2">2%</p>
                    </td>
                    <td>
                      <p className="mb-0 fs-13 fw-semibold lh-2 text-uppercase">
                        bitget
                      </p>
                    </td>
                    <td>
                      <p className="mb-0 fs-13 fw-semibold lh-2 text-uppercase">
                        amm
                      </p>
                    </td>
                    <td>
                      <div className="fs-13 fw-semibold lh-2">
                        <span className="text-info me-3 cursor-pointer">
                          <RiEdit2Fill size={18} />
                        </span>
                        <span className="text-danger cursor-pointer">
                          <MdDelete size={18} />
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* popup */}
      <div
        className="modal fade"
        id="addCoinModal"
        tabIndex="-1"
        aria-labelledby="addCoinModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1
                className="modal-title fs-5 primary-color"
                id="addCoinModalLabel"
              >
                Add Coin
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="row">
                  <div className="col-xl-6 col-lg-6 col-md-6 col-12">
                    <div className="mb-4">
                      <label
                        htmlFor="pair"
                        className="form-label text-capitalize fs-14"
                      >
                        pair
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="pair"
                        placeholder="Enter pair coin"
                      />
                    </div>
                  </div>
                  <div className="col-xl-6 col-lg-6 col-md-6 col-12">
                    <div className="mb-4">
                      <label
                        htmlFor="PricePrecision"
                        className="form-label text-capitalize fs-14"
                      >
                        Price Precision
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="PricePrecision"
                        placeholder="Enter Price Precision"
                      />
                    </div>
                  </div>
                  <div className="col-xl-6 col-lg-6 col-md-6 col-12">
                    <div className="mb-4">
                      <label
                        htmlFor="QuantityPrecision"
                        className="form-label text-capitalize fs-14"
                      >
                        Quantity Precision
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="QuantityPrecision"
                        placeholder="Enter Quantity Precision"
                      />
                    </div>
                  </div>
                  <div className="col-xl-6 col-lg-6 col-md-6 col-12">
                    <div className="mb-4">
                      <label
                        htmlFor="TargetPercent"
                        className="form-label text-capitalize fs-14"
                      >
                        Target Percent
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="TargetPercent"
                        placeholder="Enter Target Percent"
                      />
                    </div>
                  </div>
                  <div className="col-xl-6 col-lg-6 col-md-6 col-12">
                    <div className="mb-4">
                      <label
                        htmlFor="Platform"
                        className="form-label text-capitalize fs-14"
                      >
                        Platform
                      </label>

                      <select
                        className="form-select form-select-sm"
                        aria-label="form-select example"
                        id="Platform"
                      >
                        <option hidden>--select--</option>
                        <option value="binance">Binance</option>
                        <option value="bitget">Bitget</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-xl-6 col-lg-6 col-md-6 col-12">
                    <div className="mb-4">
                      <label
                        htmlFor="Bot"
                        className="form-label text-capitalize fs-14"
                      >
                        Bot
                      </label>
                      <select
                        className="form-select form-select-sm"
                        aria-label="form-select example"
                        id="Bot"
                      >
                        <option hidden>--select--</option>
                        <option value="amm">AMM</option>
                        <option value="futures">FUTURES</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-xl-6 col-lg-6 col-md-6 col-12">
                    <div className="mb-4">
                      <label
                        htmlFor="divisible"
                        className="form-label text-capitalize fs-14"
                      >
                        divisible
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        id="divisible"
                        placeholder="Divisible"
                      />
                    </div>
                  </div>
                  <div className="col-xl-6 col-lg-6 col-md-6 col-12">
                    <div className="mb-4">
                      <label
                        htmlFor="TradeAmount"
                        className="form-label text-capitalize fs-14"
                      >
                        Trade Amount
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        id="TradeAmount"
                        placeholder="Trade Amount"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <button type="submit" className="text-capitalize">
                    submit
                  </button>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button type="button" className="btn btn-primary">
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCoins;
