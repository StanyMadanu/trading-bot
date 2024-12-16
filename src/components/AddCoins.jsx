import React, { Suspense, lazy } from "react";
import { MdDelete } from "react-icons/md";
import { RiEdit2Fill } from "react-icons/ri";
import coinService from "../services/CoinServices";
import ConfirmPopup from "./models/ConfirmPopup";
import Joi from "joi-browser";
import Form from "../basic/form";
import { toast } from "react-toastify";
// import UpdateCoins from "./models/UpdateCoins";
import Loader from "../common/Loader";

const UpdateCoins = lazy(() => import("./models/UpdateCoins"));

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
    },
    modalData: {},
    modalShow: false,
  };

  schema = {
    pair: Joi.string().uppercase().required().label("Pair"),
    price_precision: Joi.number()
      .positive()
      .required()
      .label("Price Precision"),
    quantity_precision: Joi.number()
      .positive()
      .required()
      .label("Quantity Precision"),
    target_percent: Joi.number().positive().required().label("Target Percent"),
    platform: Joi.string()
      .valid("BINANCE", "BITGET")
      .required()
      .label("Platform"),
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

  // Method to update modal data and show the modal
  handleShowModal = (item) => {
    this.setState({
      modalData: item,
      modalShow: true, // Show the modal
    });

    const modalElement = document.getElementById("updateCoinModal");
    // if (modalElement) {
    const modal = new window.bootstrap.Modal(modalElement);
    modal.show();
    // } else {
    //   console.error("Modal element not found!");
    // }
  };

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
      console.log(payload);
      const response = await coinService.deleteCoins();
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

    // console.log(coinDelate);

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
    // console.log(this.state.data)

    return (
      <div className="card">
        <div className="card-body">
          <div className="container-lg">
            {/* Add Coin Button */}
            <div className="text-end my-3">
              <button
                className="py-2 rounded text-capitalize primary-bg fs-13"
                type="button"
                data-bs-toggle="modal"
                data-bs-target="#addCoinModal"
              >
                Add Coin
              </button>
            </div>

            <h5 className="text-center my-3 fw-bold primary-color text-capitalize">
              Add Coins Table
            </h5>

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
                <tbody className="tbody text-center fs-13">
                  {coinLists?.length > 0 ? (
                    coinLists.map((item, index) => (
                      <tr key={index}>
                        <td>{item.pair}</td>
                        <td className="primary-color fw-semibold">
                          {item.coin_id}
                        </td>
                        <td
                          className={`text-uppercase fw-semibold ${
                            item.status === "ACTIVE"
                              ? "text-success"
                              : "text-danger"
                          }`}
                        >
                          {item.status}
                        </td>
                        <td>{item.price_precision}</td>
                        <td>{item.quantity_precision}</td>
                        <td>{item.target_percent}%</td>
                        <td className="fw-semibold">{item.platform}</td>
                        <td className="fw-semibold">{item.bot}</td>
                        <td className="text-nowrap">
                          <span
                            className="primary-color me-3 cursor-pointer"
                            onClick={() => this.handleShowModal({ item })}
                          >
                            <RiEdit2Fill size={18} />
                          </span>
                          <span
                            className="text-danger cursor-pointer"
                            onClick={() =>
                              this.setState({
                                coinDelate: {
                                  coin_id: item.coin_id,
                                  platform: item.platform,
                                  bot: item.bot,
                                },
                                // toggleCoin: true,
                              })
                            }
                            data-bs-toggle="modal"
                            data-bs-target="#confirmDelete"
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
        <Suspense fallback={"loading...!"}>
          <ConfirmPopup
            toggleBotStatus={this.handleDeleteCoins}
            botStatus="delete"
          />

          {/* {this.state.modalShow && ( */}
          <UpdateCoins coinList={this.state.modalData} />
          {/* )} */}
        </Suspense>

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
                <h5
                  className="modal-title primary-color"
                  id="addCoinModalLabel"
                >
                  Add Coin
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body px-4">
                <form onSubmit={this.handleSubmit}>
                  <div className="row">
                    {[
                      { label: "Pair", id: "pair" },
                      { label: "Price Precision", id: "price_precision" },
                      { label: "Quantity Precision", id: "quantity_precision" },
                      { label: "Target Percent", id: "target_percent" },
                      { label: "Divisible", id: "divisible" },
                      { label: "Trade Amount", id: "TradeAmount" },
                    ].map((field) => (
                      <div key={field.id} className="col-md-6 mb-4">
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
                    <div className="col-md-6 mb-4">
                      <label className="form-label">Platform</label>
                      <select
                        name="platform"
                        value={this.state.data.platform}
                        onChange={this.handleChange}
                        className="form-select"
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
                    <div className="col-md-6 mb-4">
                      <label className="form-label">Bot</label>
                      <select
                        name="bot"
                        value={this.state.data.bot}
                        onChange={this.handleChange}
                        className="form-select"
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
                  <div className="text-end my-4 ">
                    <button
                      type="submit"
                      className="px-3 py-2 rounded"
                      disabled={this.state.btnDisable}
                    >
                      {this.state.btnDisable ? "Submitting..." : "Submit"}
                    </button>
                  </div>
                </form>
              </div>
              {/* <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AddCoins;
