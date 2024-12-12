import React, { Component } from 'react';
import Form from '../../basic/form'
import { toast } from 'react-toastify';
import { backEndCallObj } from '../../services/mainService';
import Joi from 'joi-browser';

class AddBot extends Form {
    constructor(props) {
    // console.log(props,'props con')
        super(props);
        this.state = {
            data: {
                platform: props.platform,  // Use passed props for initial state
                botType: props.botType,    // Added botType
                total_investment: ''
            },
            errors: {},
            btnDisable: false
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
                            <h4 className="modal-title">Add Bot Configuration</h4>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                            ></button>
                        </div>

                        <div className="modal-body">
                            <form onSubmit={this.handleFormSubmit}>
                                {console.log(data.platform , data.botType,'render')} {/* its showing the data but not displaying the modal why*/ }
                                <input
                                    type="text"
                                    id="platform"
                                    name="platform"
                                    placeholder="Platform"
                                    value={data.platform}
                                    readOnly
                                />
                                <input
                                    type="text"
                                    id="botType"
                                    name="botType"
                                    placeholder="Bot Type"
                                    value={data.botType}
                                    readOnly
                                />
                                <div className="mt-3">
                                    <input
                                        type="number"
                                        id="total_investment"
                                        name="total_investment"
                                        placeholder="Total Investment"
                                        value={data.total_investment}
                                        onChange={this.handleChange}
                                        required
                                    />
                                </div>
                                <button
                                    className="btn btn-secondary sign mt-3"
                                    type="submit"
                                    disabled={btnDisable}
                                >
                                    Submit
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}


export default AddBot;
