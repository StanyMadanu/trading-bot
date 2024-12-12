import React, { Component } from 'react';

class ConfirmPopup extends Component {
    render() {

        const { label, msg , botStatus , toggleBotStatus, modelRef , btnDisable } = this.props;


        return (

            <>
                <div className="modal fade" id="confirmDelete" ref={modelRef}>
                    <div className="modal-dialog text-dark">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4 className="modal-title">{label || "Delete"}</h4>
                                <button
                                    type="button"
                                    className="btn-close"
                                    data-bs-dismiss="modal"
                                ></button>
                            </div>

                            <div className="modal-body">
                                <p className="">Are you sure you want to {msg || "delete"}?</p>


                            </div>

                            <div className="modal-footer">
                                <div className="d-flex justify-content-between w-100 align-items center">
                                    <button
                                        type="button"
                                        className="btn btn-success"
                                        data-bs-dismiss="modal"
                                    >
                                        Close
                                    </button>
                                    <button className="btn btn-danger" onClick={(e)=>{toggleBotStatus(e)}} disabled={btnDisable}>
                                        {
                                            btnDisable ?"Wait...": botStatus
                                        }
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

export default ConfirmPopup;
