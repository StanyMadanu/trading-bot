import React, { useEffect, useState } from 'react';
import { backEndCallObj } from '../services/mainService';
import Joi from 'joi-browser';
import toast from 'react-hot-toast';
import DisableAllCoins from './DisableAllCoins';

const CronSettings = () => {
  const [btnDisable, setBtnDisable] = useState(false);
  const [data, setData] = useState({
    platform: '',
    bot: '',
  });
  const [errors, setErrors] = useState({});

  // Joi Schema
  const schema = {
    platform: Joi.string().valid('BINANCE', 'BITGET').required().label('Platform'),
    bot: Joi.string().valid('AMM', 'FUTURES').required().label('Bot'),
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
    console.log(data)
    setBtnDisable(true);
    try {
      const response = await backEndCallObj('/admin/sell_all_coins', ); //data 
      if (response?.success) {
        toast.success(response.success);
      }
    } catch (error) {
      toast.error('Failed to submit.');
    } finally {
      setBtnDisable(false);
    }
  };

  // Helper Functions for Rendering
  const renderSelect = (label, name, options) => (
    <div>
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
    <button className={className} disabled={btnDisable}>
      {label}
    </button>
  );

  return (
    <>
      <h5>Cron Settings</h5>
      <div className="row my-4">
        <div className="col-lg-3">
          <div className="card">
            <div className="card-header text-center">
              <p className="mb-0 fw-bold fs-20">Sell All Coins</p>
            </div>
            <div className="card-body">
              <form onSubmit={handleFormSubmit}>
                {renderSelect('Platform', 'platform', [
                  { id: 'default', value: '', label: '-- Select --' },
                  { id: 'binance', value: 'BINANCE', label: 'Binance' },
                  { id: 'bitget', value: 'BITGET', label: 'Bitget' },
                ])}
                {renderSelect('Bot', 'bot', [
                  { id: 'default', value: '', label: '-- Select --' },
                  { id: 'amm', value: 'AMM', label: 'Amm' },
                  { id: 'futures', value: 'FUTURES', label: 'Futures' },
                ])}
                {renderButton('Submit', 'btn btn-primary mt-3')}
              </form>
            </div>
          </div>
        </div>
      </div>
      <DisableAllCoins />
    </>
  );
};

export default CronSettings;
