import React from "react";
import Table from "../common/Table";
import mainLogo from "../assets/images/7pools-logo.png";
import SpeedOMeter from "../common/SpeedOMeter";
import Header from "./Header";

const Dashboard = () => {
  return (
    <>
      <div className="container-fluid">
        <div className="row pb-2 row-gap-2">
          <div className="col-xl-9 col-lg-9 col-md-8 col-sm-7">
            <div className="card">
              <div className="card-body">
                <div className="d-flex gap-3 algin-items-center">
                  <div>
                    <img src={mainLogo} alt="7pools-logo" />
                  </div>
                  <h5 className="mb-0 text-uppercase fw-bold d-flex align-items-center">
                    trading bot
                  </h5>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-lg-3 col-md-4 col-sm-5">
            <div className="card">
              <div className="card-body">
                <h6 className="text-capitalize primary-color">bot status</h6>
                <div className="d-flex align-items-center">
                  <p className="mb-0 flex-fill text-capitalize fs-13">
                    binance
                  </p>
                  <progress
                    className="custom-progress"
                    max="100"
                    value="90"
                  ></progress>
                </div>

                <div className="d-flex align-items-center gap-2">
                  <p className="mb-0 flex-fill text-capitalize fs-13">bitget</p>
                  <progress
                    className="custom-progress bitget-progress"
                    max="100"
                    value="60"
                  ></progress>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row row-gap-2 pb-2">
          <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12">
            <div className="card">
              <div className="card-body">
                <SpeedOMeter
                  title="binance SPOT balance"
                  balance={2000}
                  target={5000}
                />
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12">
            <div className="card">
              <div className="card-body">
                <SpeedOMeter
                  title="binance FUTURE balance"
                  balance={6000}
                  target={5000}
                />
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12">
            <div className="card">
              <div className="card-body">
                <SpeedOMeter
                  title="bitget SPOT balance"
                  balance={8000}
                  target={5000}
                />
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12">
            <div className="card">
              <div className="card-body">
                <SpeedOMeter
                  title="bitget FUTURE balance"
                  balance={3000}
                  target={5000}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="row row-gap-2">
          <div className="col-xl-6 col-lg-6 col-md-12">
            <div className="card">
              <div className="card-body">
                <div className="the-bots d-flex gap-2 pb-3">
                  <div className="binance-spot-bot flex-fill text-center p-2 active">
                    <p className="mb-0 text-capitalize fs-14 fw-semibold">
                      binance SPOT bot
                    </p>
                  </div>
                  <div className="bitget-spot-bot flex-fill text-center p-2">
                    <p className="mb-0 text-capitalize fs-14 fw-semibold">
                      bitget SPOT bot
                    </p>
                  </div>
                </div>

                <div className="bot-status d-flex flex-wrap justify-content-between gap-2 pb-3">
                  <div className="border d-flex flex-column align-items-center justify-content-between flex-fill p-2">
                    <h6 className="mb-0 fw-bold">4000</h6>
                    <p className="mb-0 text-capitalize primary-color fs-12 fw-semibold">
                      capital assigned
                    </p>
                  </div>
                  <div className="border d-flex flex-column align-items-center justify-content-between flex-fill p-2">
                    <h6 className="mb-0 fw-bold">5500</h6>
                    <p className="mb-0 text-capitalize primary-color fs-12 fw-semibold">
                      current balance
                    </p>
                  </div>
                  <div className="border d-flex flex-column align-items-center justify-content-between flex-fill p-2">
                    <h6 className="mb-0 status-percent fw-bold px-2 py-0">
                      + 10%
                    </h6>
                    <p className="mb-0 text-capitalize primary-color fs-12 fw-semibold">
                      % change
                    </p>
                  </div>
                  <div className="border d-flex justify-content-center align-items-center flex-fill p-2">
                    <button className="theme-btn text-uppercase">
                      bot enable
                    </button>
                  </div>
                </div>
                <Table />
              </div>
            </div>
          </div>
          <div className="col-xl-6 col-lg-6 col-md-12">
            <div className="card">
              <div className="card-body">
                <div className="the-bots d-flex gap-2 pb-3">
                  <div className="binance-spot-bot flex-fill text-center p-2 active">
                    <p className="mb-0 text-capitalize fs-14 fw-semibold">
                      binance FUTURES bot
                    </p>
                  </div>
                  <div className="bitget-spot-bot flex-fill text-center p-2">
                    <p className="mb-0 text-capitalize fs-14 fw-semibold">
                      bitget FUTURES bot
                    </p>
                  </div>
                </div>

                <div className="bot-status d-flex flex-wrap justify-content-between gap-2 pb-3">
                  <div className="border d-flex flex-column align-items-center justify-content-between flex-fill p-2 ">
                    <h6 className="mb-0 fw-bold">4000</h6>
                    <p className="mb-0 text-capitalize primary-color fs-12 fw-semibold">
                      capital assigned
                    </p>
                  </div>
                  <div className="border d-flex flex-column align-items-center justify-content-between flex-fill p-2">
                    <h6 className="mb-0 fw-bold">5500</h6>
                    <p className="mb-0 text-capitalize primary-color fs-12 fw-semibold">
                      current balance
                    </p>
                  </div>
                  <div className="border d-flex flex-column align-items-center justify-content-between flex-fill p-2">
                    <h6 className="mb-0 status-percent fw-bold py-0 px-2">
                      + 10%
                    </h6>
                    <p className="mb-0 text-capitalize primary-color fs-12 fw-semibold">
                      % change
                    </p>
                  </div>
                  <div className="border d-flex justify-content-center align-items-center flex-fill p-2">
                    <button className="theme-btn text-uppercase">
                      bot enable
                    </button>
                  </div>
                </div>
                <Table />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
