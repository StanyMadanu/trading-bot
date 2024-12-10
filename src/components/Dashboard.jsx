import React, { useState, Suspense } from "react";
import { useSelector } from "react-redux";
import mainLogo from "../assets/images/7pools-logo.png";
import SpeedOMeter from "../common/SpeedOMeter";

const BinanceSpotBot = React.lazy(() => import("./bots-table/BinanceSpotBot"));
const BinanceFutureBot = React.lazy(() =>
  import("./bots-table/BinanceFutureBot")
);
const BitgitSpotBot = React.lazy(() => import("./bots-table/BitgitSpotBot"));
const BitgitFutureBot = React.lazy(() => import("./bots-table/BitgitFuture"));

const Dashboard = () => {
  const [activeSpotBot, setActiveSpotBot] = useState("bitget"); // SPOT bot
  const [activeFutureBot, setActiveFutureBot] = useState("bitget"); // FUTURES bot

  const profile = useSelector((state) => state.getProfile.value);

  console.log(profile);
  return (
    <>
      <div className="container-fluid">
        <div className="row pb-2 row-gap-2">
          <div className="col-xl-9 col-lg-9 col-md-8 col-sm-7">
            <div className="card">
              <div className="card-body">
                <div className="d-flex gap-3 align-items-center">
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
              <div className="card-body text-center">
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
              <div className="card-body text-center">
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
              <div className="card-body text-center">
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
              <div className="card-body text-center">
                <SpeedOMeter
                  title="bitget FUTURE balance"
                  balance={3000}
                  target={5000}
                />
              </div>
            </div>
          </div>
        </div>

        {/* SPOT BOT SECTION */}
        <div className="row row-gap-2">
          <div className="col-xl-6 col-lg-6 col-md-12">
            <div className="card">
              <div className="card-body">
                <div className="the-bots d-flex gap-2 pb-3">
                  <div
                    className={`binance-spot-bot flex-fill text-center p-2 ${
                      activeSpotBot === "binance" ? "active" : ""
                    }`}
                    onClick={() => setActiveSpotBot("binance")}
                  >
                    <p className="mb-0 text-capitalize fs-14 fw-semibold">
                      binance SPOT bot
                    </p>
                  </div>
                  <div
                    className={`binance-spot-bot flex-fill text-center p-2 ${
                      activeSpotBot === "bitget" ? "active" : ""
                    }`}
                    onClick={() => setActiveSpotBot("bitget")}
                  >
                    <p className="mb-0 text-capitalize fs-14 fw-semibold">
                      bitget SPOT bot
                    </p>
                  </div>
                </div>
                <Suspense fallback={<div>Loading...</div>}>
                  {activeSpotBot === "binance" ? (
                    <BinanceSpotBot />
                  ) : (
                    <BitgitSpotBot />
                  )}
                </Suspense>
              </div>
            </div>
          </div>

          {/* FUTURES BOT SECTION */}
          <div className="col-xl-6 col-lg-6 col-md-12">
            <div className="card">
              <div className="card-body">
                <div className="the-bots d-flex gap-2 pb-3">
                  <div
                    className={`binance-spot-bot flex-fill text-center p-2 ${
                      activeFutureBot === "binance" ? "active" : ""
                    }`}
                    onClick={() => setActiveFutureBot("binance")}
                  >
                    <p className="mb-0 text-capitalize fs-14 fw-semibold">
                      binance FUTURES bot
                    </p>
                  </div>
                  <div
                    className={`binance-spot-bot flex-fill text-center p-2 ${
                      activeFutureBot === "bitget" ? "active" : ""
                    }`}
                    onClick={() => setActiveFutureBot("bitget")}
                  >
                    <p className="mb-0 text-capitalize fs-14 fw-semibold">
                      bitget FUTURES bot
                    </p>
                  </div>
                </div>
                <Suspense fallback={<div>Loading...</div>}>
                  {activeFutureBot === "binance" ? (
                    <BinanceFutureBot />
                  ) : (
                    <BitgitFutureBot />
                  )}
                </Suspense>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
