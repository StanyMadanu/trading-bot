import React, { Component } from "react";
import Form from "../../basic/form";
import { toast } from "react-toastify";
import { backEndCallObj } from "../../services/mainService";
import Joi from "joi-browser";

class AddBot extends Form {
  constructor(props) {
    // console.log(props,'props con')
    super(props);
    this.state = {
      data: {
        platform: props.platform, // Use passed props for initial state
        botType: props.botType, // Added botType
        total_investment: "",
      },
      errors: {},
      btnDisable: false,
    };
  }

  // Validation schema
  schema = {
    platform: Joi.string().valid("BINANCE", "BITGET").required(),
    botType: Joi.string().required(),
    total_investment: Joi.number().required(),
  };

  // Handle form submission
  handleSubmit = async (data) => {
    this.setState({ btnDisable: true });
    try {
      const formattedData = { ...data };
      const response = await backEndCallObj("/admin/add_bot", formattedData);
      toast.success(response?.success);
    } catch (error) {
      toast.error(error?.response?.data || "Error adding bot");
    } finally {
      this.setState({ btnDisable: false });
    }
  };

  render() {
    const { data, btnDisable } = this.state;

    // console.log(data)

    return (
      <div className="modal fade" id="addbot">
        <div className="modal-dialog text-dark">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title primary-color text-capitalize">
                add bot configuration
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>

            <div className="modal-body">
              <form onSubmit={this.handleFormSubmit}>
                {console.log(data.platform, data.botType, "render")}{" "}
                {/* its showing the data but not displaying the modal why*/}
                <div className="mb-3">
                  <input
                    type="text"
                    id="platform"
                    className="form-control"
                    name="platform"
                    placeholder="Platform"
                    value={data.platform}
                    readOnly
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control"
                    id="botType"
                    name="botType"
                    placeholder="Bot Type"
                    value={data.botType}
                    readOnly
                  />
                </div>
                <div className="my-3">
                  <input
                    className="form-control"
                    type="number"
                    id="total_investment"
                    name="total_investment"
                    placeholder="Total Investment"
                    value={data.total_investment}
                    onChange={this.handleChange}
                    required
                  />
                </div>
                <div className="text-end px-2">
                  <button
                    className="sign my-2 py-2 px-3 rounded"
                    type="submit"
                    disabled={btnDisable}
                  >
                    Submit
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

export default AddBot;
