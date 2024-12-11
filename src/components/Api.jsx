import React from "react";

const Api = () => {
  return (
    <div className="api">
      <div className="card">
        <div className="card-body">
          <div className="container">
            <h5 className="text-center text-uppercase fw-bold mb-5 mt-3 primary-color">
              api settings
            </h5>
            <div className="d-flex gap-2 flex-wrap">
              <div className="binance-api flex-fill d-flex justify-content-center align-items-center py-2 active">
                <p className="text-capitalize mb-0 fw-semibold">binance API</p>
              </div>
              <div className="bitget-api flex-fill d-flex justify-content-center align-items-center py-2">
                <p className="text-capitalize mb-0 fw-semibold">bitget API</p>
              </div>
            </div>
            <form className="my-5">
              <div className="mb-4">
                <label
                  htmlFor="apikey"
                  className="form-label text-uppercase fs-15 fw-bold"
                >
                  api key
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="apikey"
                  placeholder="API key"
                />
              </div>
              <div className="mb-5">
                <label
                  htmlFor="secretkey"
                  className="form-label text-uppercase fs-15 fw-bold"
                >
                  secret key
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="secretkey"
                  placeholder="secret key"
                />
              </div>
              <div className="text-end">
                <button className="text-capitalize">submit</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Api;
