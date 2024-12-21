import React, { useEffect, useState } from "react";
import { backEndCallObj } from "../services/mainService";
import Joi from "joi-browser";
import {toast} from "react-toastify";
import DisableAllCoins from "./DisableAllCoins";
import MakeAnAdmin from "./MakeAnAdmin";
import { Link } from "react-router-dom";

const CronSettings = () => {
  const [btnDisable, setBtnDisable] = useState(false);
  const [data, setData] = useState({
    platform: "",
    bot: "",
  });
  const [errors, setErrors] = useState({});

  // Joi Schema
  const schema = {
    platform: Joi.string()
      .valid("BINANCE", "BITGET")
      .required()
      .label("Platform"),
    bot: Joi.string().valid("AMM", "FUTURES").required().label("Bot"),
  };

  // Input Change Handler
  const handleChange = ({ target: { name, value } }) => {
    const newData = { ...data };
    newData[name] = value;
    setData(newData);
  };

  // Validation
  const validate = () => {
    const { error } = Joi.validate(data, schema, { abortEarly: false });
    if (!error) return null;

    const newErrors = {};
    for (let item of error.details) newErrors[item.path[0]] = item.message;
    return newErrors;
  };

  // Submit Handler
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    setErrors(newErrors || {});
    if (newErrors) return;
    // console.log(data)
    setBtnDisable(true);
    try {
      const response = await backEndCallObj("/admin/sell_all_coins", data); //data
      if (response?.success) {
        toast.success(response.success);
      }
    } catch (error) {
      toast.error("Failed to submit.");
    } finally {
      setBtnDisable(false);
    }
  };

  // Helper Functions for Rendering
  const renderSelect = (label, name, options) => (
    <div className="mb-3">
      <label className="form-label">{label}</label>
      <select
        className="form-control"
        name={name}
        value={data[name]}
        onChange={handleChange}
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

  const renderButton = (label, className) => (
    <div className="text-end px-2">
      <button className={className} disabled={btnDisable}>
        {btnDisable ? "wait" : label}
      </button>
    </div>
  );

  return (
    <>
      <div className="card">
        <div className="card-body px-4">
          <div className="container">
            <div className="my-3">
              <Link to="/controls">
                <button className="text-uppercase py-1 px-3">back</button>
              </Link>
            </div>

            <h5 className="mt-3 mb-5 text-center primary-color fw-bold">
              Cron Settings
            </h5>
            <div className="row my-4 justify-content-evenly row-gap-3">
              <div className="col-xl-4 col-lg-4 col-md-6 col-12">
                <div className="card shadow-sm border-0">
                  <div className="card-header text-center primary-bg">
                    <p className="mb-0 fw-bold fs-15 text-capitalize">
                      Sell All Coins
                    </p>
                  </div>
                  <div className="card-body">
                    <form onSubmit={handleFormSubmit}>
                      {renderSelect("Platform", "platform", [
                        { id: "default", value: "", label: "-- Select --" },
                        { id: "binance", value: "BINANCE", label: "Binance" },
                        { id: "bitget", value: "BITGET", label: "Bitget" },
                      ])}
                      {renderSelect("Bot", "bot", [
                        { id: "default", value: "", label: "-- Select --" },
                        { id: "amm", value: "AMM", label: "Amm" },
                        { id: "futures", value: "FUTURES", label: "Futures" },
                      ])}
                      {renderButton("Submit", "mt-4 px-3 py-2 rounded")}
                    </form>
                  </div>
                </div>
              </div>
              <div className="col-xl-4 col-lg-4 col-md-6 col-12">
                <DisableAllCoins />
              </div>
              <div className="col-xl-4 col-lg-4 col-md-6 col-12">
                <MakeAnAdmin />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CronSettings;
