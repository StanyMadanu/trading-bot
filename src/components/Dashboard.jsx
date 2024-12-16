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
  const binanceFuture = useSelector((state) => state.binanceFuture.value);
  const binanceSpot = useSelector((state) => state.binanceSpot.value);
  const BitgetFuture = useSelector((state) => state.bitgetFuture.value);
  const BitgetSpot = useSelector((state) => state.bitgetSpot.value);


  console.log(binanceFuture , binanceSpot, BitgetFuture , BitgetSpot)


  return (
    <>
      <div>
        <div className="row row-gap-2 pb-2">
          <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12">
            <div className="card">
              <div className="card-body text-center">
                <SpeedOMeter
                  title="binance SPOT balance"
                  balance={binanceSpot?.total_investment || 0}
                  target={10000}
                />
              </div>
            </div>
          </div>

          <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12">
            <div className="card">
              <div className="card-body text-center">
                <SpeedOMeter
                  title="binance FUTURE balance"
                  balance={binanceFuture?.total_investment || 0}
                  target={10000}
                />
              </div>
            </div>
          </div>

          <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12">
            <div className="card">
              <div className="card-body text-center">
                <SpeedOMeter
                  title="bitget SPOT balance"
                  balance={BitgetSpot?.total_investment || 0}
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
                  balance={BitgetFuture?.total_investment || 0}
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
