import React, { Component } from 'react';
import Form from '../../basic/form'

class EditInvestment extends Form {
    
 
    render() {

        // const { } = this.props;

        const {data , errors} = this.state



        return (

            <>
                <div className="modal fade" id="editInvest">
                    <div className="modal-dialog text-dark">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4 className="modal-title">Edit Capital Assign</h4>
                                <button
                                    type="button"
                                    className="btn-close"
                                    data-bs-dismiss="modal"
                                ></button>
                            </div>

                            <div className="modal-body">

                                <form >
                                    <div className="d-flex flex-column-reverse my-4">
                                        <input
                                            className="inputField px-2"
                                            type="number"
                                            name="invest"
                                            // value={data?.invest}
                                            placeholder="Edit Investment"
                                            id="invest"
                                            required=""
                                            // onChange={this.handleNumber}
                                        />
                                        <label htmlFor="userPassword" className="inputLabel">
                                            Capital Assign
                                        </label>
                                        <p className="fs-13 text-danger">{errors?.password}</p>
                                    </div>
                                </form>


                            </div>

                            <div className="modal-footer">
                                <div className="d-flex justify-content-center w-100 align-items center">
                                   
                                    <button className="btn btn-success" >
                                        Submit
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </>
        );
    }
}

export default EditInvestment;
