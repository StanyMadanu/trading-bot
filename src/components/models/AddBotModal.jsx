import React, { Component } from 'react';
import Form from '../../basic/form'
import { toast } from 'react-toastify';
import { backEndCallObj } from '../../services/mainService';

class AddBot extends Form {
constructor(props) {
    super(props);
    this.state = {
        data: {
            platform: '',
            total_investment: ''
        },
        errors: {},
        btnDisable: false
    };
}

 handleSubmit = async (data) => {
    this.setState({ btnDisable: true });
    const {botType}= this.props;
    const formattedData = {
      ...data,
      botType
    };

    // console.log(formattedData)
    try {
      // console.log(formattedData);
      const response = await backEndCallObj("admin/add_bot", );
      toast.success(response?.success);
    } catch (error) {
      toast.error(error?.response?.data || "Error adding bot");
    } finally {
      this.setState({ btnDisable: false });
    }
  };


    render() {

        // const { } = this.props;

        const { data, errors ,handleFormSubmit ,btnDisable } = this.state

        const {platform} = this.props

        // setData({...data, platform: platform})  
        
        // this.setState({ data: {...data, platform: platform} })

        return (

            <>
                <div className="modal fade" id="addbot">
                    <div className="modal-dialog text-dark">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4 className="modal-title">Add Bot Configration</h4>
                                <button
                                    type="button"
                                    className="btn-close"
                                    data-bs-dismiss="modal"
                                ></button>
                            </div>

                            <div className="modal-body">
                                <form onSubmit={handleFormSubmit}>
                                    <input type="text" id="platform" name="platform" placeholder="Platform" value={data.platform} required readOnly/>
                                    <div className="mt-3">

                                        <input type="text" id='total_investment' name='total_investment' placeholder='Total Tnvestment' value={data.total_investment} onChange={this.handleChange} required />
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

                            {/* <div className="modal-footer">
                                <div className="d-flex justify-content-center w-100 align-items center">

                                    <button className="btn btn-success" >
                                        Submit
                                    </button>
                                </div>
                            </div> */}
                        </div>
                    </div>
                </div>

            </>
        );
    }
}

export default AddBot;
