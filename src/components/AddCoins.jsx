import React from "react";
import { MdDelete } from "react-icons/md";
import { RiEdit2Fill } from "react-icons/ri";
import coinService from "../services/CoinServices";
import ConfirmPopup from "./models/ConfirmPopup";
import Joi from "joi-browser";
import Form from "../basic/form";
import { toast } from "react-toastify";
import UpdateCoins from "./models/UpdateCoins";

class AddCoins extends Form {
  state = {
    coinLists: [],
    data: {
      pair: "",
      price_precision: "",
      quantity_precision: "",
      target_percent: "",
      platform: "BINANCE",
      bot: "AMM",
    },
    errors: {},
    btnDisable: false,
    coinDelate: {
      coin_id: "",
      platform: "",
      bot: "",
    }
  };

  schema = {
    pair: Joi.string().uppercase().required().label("Pair"),
    price_precision: Joi.number().positive().required().label("Price Precision"),
    quantity_precision: Joi.number().positive().required().label("Quantity Precision"),
    target_percent: Joi.number().positive().required().label("Target Percent"),
    platform: Joi.string().valid("BINANCE", "BITGET").required().label("Platform"),
    bot: Joi.string().valid("AMM", "FUTURES").required().label("Bot"),
    divisible: Joi.number().positive().optional(),
    TradeAmount: Joi.number().optional(),
  };

  componentDidMount() {
    this.fetchCoins();
  }

  async fetchCoins() {
    try {
      const res = await coinService.getCoins();
      if (res) this.setState({ coinLists: res });
    } catch (error) {
      console.error("Error fetching coins:", error);
    }
  }

  doSubmit = async () => {
    this.setState({ btnDisable: true });
    try {
      const response = await coinService.addCoins(this.state.data);
      if (!response) return;
      toast.success("Coin added successfully!");
      this.fetchCoins(); // Refresh coin list
    } catch (error) {
      toast.error(error?.response?.data || "Failed to add coin.");
    } finally {
      this.setState({ btnDisable: false });
    }
  };



  handleDeleteCoins = async () => {
    this.setState({ btnDisable: true });
    try {
      const payload = {
        coin_id: this.state.coinDelate.coin_id,
        status: "DELETE",
        platform: this.state.coinDelate.platform,
        bot: this.state.coinDelate.bot,
      };
      const response = await coinService.deleteCoins(payload);
      toast.success(response.Success);

      if (!response) return;
    } catch (error) {
      // console.log(error);

      toast.error(error?.response?.data);
    } finally {
      this.setState({ btnDisable: false });

    }
  };


  render() {
    const { coinLists, coinDelate } = this.state;

    console.log(coinDelate);

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
    console.log(this.state.data)

    return (
      <div className="card">
        <div className="card-body">
          <div className="container">
            <h5 className="text-center my-3 fw-bold primary-color text-capitalize">
              Add Coins Table
            </h5>

            {/* Add Coin Button */}
            <div className="text-end my-3">
              <button
                className="py-2 rounded-pill text-capitalize secondary-bg"
                type="button"
                data-bs-toggle="modal"
                data-bs-target="#addCoinModal"
              >
                Add Coin
              </button>
            </div>

            {/* Table */}
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead className="thead primary-bg">
                  <tr>
                    {theadData.map((data, index) => (
                      <th key={index} className="text-center">
                        <p className="mb-0 primary-color fs-14 text-capitalize">
                          {data}
                        </p>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="tbody text-center">
                  {coinLists?.length > 0 ? (
                    coinLists.map((item, index) => (
                      <tr key={index}>
                        <td>{item.pair}</td>
                        <td>{item.coin_id}</td>
                        <td
                          className={`text-uppercase ${item.status === "ACTIVE"
                            ? "text-success"
                            : "text-danger"
                            }`}
                        >
                          {item.status}
                        </td>
                        <td>{item.price_precision}</td>
                        <td>{item.quantity_precision}</td>
                        <td>{item.target_percent}%</td>
                        <td>{item.platform}</td>
                        <td>{item.bot}</td>
                        <td>
                          <span
                            className="text-info me-3 cursor-pointer"
                            data-bs-toggle="modal"
                            data-bs-target="#updateCoinModal"
                          >
                            <RiEdit2Fill size={18} />
                          </span>
                          <span
                            className="text-danger cursor-pointer"
                            data-bs-toggle="modal"
                            data-bs-target="#confirmDelete"
                            onClick={() => this.setState({
                              coinDelate: {
                                coin_id: item.coin_id,
                                platform: item.platform,
                                bot: item.bot,
                              }

                            })}
                          >
                            <MdDelete size={18} />
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={theadData.length}>No data found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modals */}
        <ConfirmPopup toggleBotStatus={this.handleDeleteCoins} botStatus="delete" />
        <UpdateCoins />

        {/* Add Coin Modal */}
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
                <h5 className="modal-title primary-color" id="addCoinModalLabel">
                  Add Coin
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
                      { label: "Price Precision", id: "price_precision" },
                      { label: "Quantity Precision", id: "quantity_precision" },
                      { label: "Target Percent", id: "target_percent" },
                      { label: "divisible", id: "divisible" },
                      { label: "Trade Amount", id: "TradeAmount" },
                    ].map((field) => (
                      <div key={field.id} className="col-md-6 mb-3">
                        <label className="form-label">{field.label}</label>
                        <input
                          type="text"
                          name={field.id}
                          value={this.state.data[field.id] || ""}
                          onChange={this.handleChange}
                          className="form-control"
                          placeholder={`Enter ${field.label}`}
                        />
                        {this.state.errors[field.id] && (
                          <div className="text-danger">
                            {this.state.errors[field.id]}
                          </div>
                        )}
                      </div>
                    ))}

                    {/* Platform Select */}
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Platform</label>
                      <select
                        name="platform"
                        value={this.state.data.platform}
                        onChange={this.handleChange}
                        className="form-control"
                      >
                        <option value="BINANCE">BINANCE</option>
                        <option value="BITGET">BITGET</option>
                      </select>
                      {this.state.errors.platform && (
                        <div className="text-danger">
                          {this.state.errors.platform}
                        </div>
                      )}
                    </div>

                    {/* Bot Select */}
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Bot</label>
                      <select
                        name="bot"
                        value={this.state.data.bot}
                        onChange={this.handleChange}
                        className="form-control"
                      >
                        <option value="AMM">AMM</option>
                        <option value="FUTURES">FUTURES</option>
                      </select>
                      {this.state.errors.bot && (
                        <div className="text-danger">
                          {this.state.errors.bot}
                        </div>
                      )}
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={this.state.btnDisable}
                  >
                    {this.state.btnDisable ? "Submitting..." : "Submit"}
                  </button>
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
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AddCoins;
