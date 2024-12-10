import React from 'react'
import Table from '../../common/Table'

const BinanceSpotBot = () => {
    return (
        <>
            <div className="bot-status d-flex flex-wrap justify-content-between gap-2 pb-3">
                <div className="border d-flex flex-column align-items-center justify-content-between flex-fill p-2">
                    <h6 className="mb-0 fw-bold">400</h6>
                    <p className="mb-0 text-capitalize primary-color fs-12 fw-semibold">
                        capital assigned
                    </p>
                </div>
                <div className="border d-flex flex-column align-items-center justify-content-between flex-fill p-2">
                    <h6 className="mb-0 fw-bold">500</h6>
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
        </>
    )
}

export default BinanceSpotBot;