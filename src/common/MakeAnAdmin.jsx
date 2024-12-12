import React from 'react';
import { backEndCallObj } from '../services/mainService';
import Joi from 'joi-browser';
import toast from 'react-hot-toast';
import Form from '../basic/form'



class MakeAnAdmin extends Form {
    constructor(props) {
        super(props);
        // Initialize form data and schema for this specific component
        this.state = {
            data: {
                email: '',
                user_name: '',
                password: '',
                user_type: '',
                access_type: '',
            },
            errors: {},
            btnDisable: false,
        };

        this.schema = {
            email: Joi.string().email().lowercase().required().label("Email"),
            user_name: Joi.string().min(5).max(15).lowercase().required().label("User Name"),
            password: Joi.string().min(5).max(15).required().label("Password"),
            user_type: Joi.string().valid("USER", "ADMIN").required().label("User Type"),
            access_type: Joi.number().required().label("Access Type"),
        };
    }

    
    doSubmit = async () => {
       
        const { data } = this.state;
        // console.log(data);

        this.setState({ btnDisable: true });
        try {
            const response = await backEndCallObj("/admin/add_admin", data);//data
            if (response?.success) {
                toast.success(response.success);
            }
        } catch (error) {
            toast.error(error.message || 'Error occurred while adding admin.');
        } finally {
            this.setState({ btnDisable: false });
        }
    };

    renderInput = (name, label, type = "text") => {
        const { data, errors } = this.state;
        return (
            <div>
                <label className="form-label">{label}</label>
                <input
                    type={type}
                    className="form-control"
                    name={name}
                    value={data[name]}
                    onChange={this.handleChange}
                />
                {errors[name] && <div className="text-danger">{errors[name]}</div>}
            </div>
        );
    };

    renderSelect = (label, name, options) => {
        const { data, errors } = this.state;
        // console.log(data)
        return (
            <div>
                <label className="form-label">{label}</label>
                <select
                    className="form-control"
                    name={name}
                    value={data[name]}
                    onChange={this.handleChange}
                >
                    {options.map((option) => (
                        <option key={option.id} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                {errors[name] && <div className="text-danger">{errors[name]}</div>}
            </div>
        );
    };

    renderButton = (label, className) => {
        const { btnDisable } = this.state;
        return (
            <button className={className} disabled={btnDisable}>
                {label}
            </button>
        );
    };



    render() {
        const { btnDisable } = this.state;
        return (
            <div className="card">
                <div className="card-header text-center">
                    <p className="mb-0 fw-bold fs-20">Make an Admin</p>
                </div>
                <div className="card-body">
                    <form className="form" onSubmit={this.handleSubmit}>
                        {/* Email Input */}
                        <div className="text-start mb-4">
                            {this.renderInput("email", "Email", "email")}
                        </div>

                        {/* User Name Input */}
                        <div className="text-start mb-4">
                            {this.renderInput("user_name", "User Name")}
                        </div>

                        {/* Password Input */}
                        <div className="text-start mb-4">
                            {this.renderInput("password", "Password", "password")}
                        </div>

                        {/* User Type Select */}
                        <div className="text-start mb-4">
                            {this.renderSelect("User Type", "user_type", [
                                { id: "selectoption", value: "", label: "-- Select --" },
                                { id: "user", value: "USER", label: "User" },
                                { id: "admin", value: "ADMIN", label: "Admin" },
                            ])}
                        </div>

                        {/* Access Type Input */}
                        <div className="text-start mb-4">
                            {this.renderInput("access_type", "Access Type", "number")}
                        </div>

                        {/* Submit Button */}
                        {this.renderButton("Submit", "text-uppercase btn btn-primary mt-3")}
                    </form>
                </div>
            </div>
        );
    }
}

export default MakeAnAdmin;
