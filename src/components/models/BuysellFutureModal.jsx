import React from "react";
import { toast } from "react-toastify";
import coinService from "../../services/CoinServices";
import Joi from "joi-browser";
import Form from "../../basic/form";
import { backEndCallObj } from "../../services/mainService";

class Buysellfuturemodal extends Form {
  constructor(props) {
    super(props);
    this.state = {
      data: {
        platform: "BINANCE",
        pair: "",
        amount_in_usdt: "",
      },
      errors: {},
      btnDisable: false,
      side: "",
    };
  }

  schema = {
    platform: Joi.string().valid("BINANCE", "BITGET").required(),
    pair: Joi.string().uppercase().required(),
    amount_in_usdt: Joi.number().positive().required(),
  };

  doSubmit = async () => {
    this.setState({ btnDisable: true });
    try {
      const formattedData = {
        platform: this.state.data.platform,
        pair: this.state.data.pair,
        amount_in_usdt: this.state.data.amount_in_usdt,
        side: this.state.side,
      };
      console.log(formattedData);
      const response = await backEndCallObj("admin/buy_sell_future_coin");

      console.log(response);

      // Show success toast
      toast.success(response?.success || "buy/sell successfully");

      // Reset modal or perform callback if necessary
      this.setState({ data: { pair: "", amount_in_usdt: "", side: "" } }); // Clear form fields;
      if (!response) return;
    } catch (error) {
      toast.error(error?.response?.data || "Failed to update coin.");
    } finally {
      this.setState({ btnDisable: false });
    }
  };

  render() {
    const { data, errors, btnDisable } = this.state;
    return (
      <div
        className="modal fade"
        id="buysellfuturemodal"
        tabIndex="-1"
        aria-labelledby="addCoinModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title primary-color" id="addCoinModalLabel">
                Buy / Sell Coins
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={this.handleSubmit}>
                <div className="row">
                  {[
                    { label: "Pair", id: "pair" },
                    { label: "Amount in USDT", id: "amount_in_usdt" },
                  ].map((field) => (
                    <div key={field.id} className="col-md-6 mb-4">
                      <label className="form-label">{field.label}</label>
                      <input
                        type="text"
                        name={field.id}
                        value={data[field.id] || ""}
                        onChange={this.handleChange}
                        className="form-control"
                        placeholder={`Enter ${field.label}`}
                      />
                      {errors[field.id] && (
                        <div className="text-danger">{errors[field.id]}</div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="col-md-6 mb-4">
                  <label className="form-label">Platform</label>
                  <select
                    name="platform"
                    value={data.platform}
                    onChange={this.handleChange}
                    className="form-control"
                  >
                    <option value="BINANCE">BINANCE</option>
                    <option value="BITGET">BITGET</option>
                  </select>
                  {errors.platform && (
                    <div className="text-danger">{errors.platform}</div>
                  )}
                </div>

                <div className="d-flex justify-content-between my-4 ">
                  <button
                    type="submit"
                    className="px-3 py-2 rounded"
                    disabled={btnDisable}
                    onClick={() => this.setState({ side: "BUY" })}
                  >
                    {btnDisable ? "wait..." : "Buy"}
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-2 rounded"
                    disabled={btnDisable}
                    onClick={() => this.setState({ side: "SELL" })}
                  >
                    {btnDisable ? "wait..." : "Sell"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Buysellfuturemodal;
