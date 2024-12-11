import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { backEndCall, backEndCallObj } from "../services/mainService";
import Joi from "joi-browser";
import { toast } from "react-toastify";
import { useLocation } from 'react-router-dom';


const Api = ({ getProfile }) => {
  const [data, setData] = useState({});
  const [error, setErrors] = useState({})
  const { api_keys } = getProfile?.profile || {};
  const [btnDisable, setBtnDisable] = useState(false)

  const location = useLocation();
  const { platform } = location.state || {}; //

  const [activeApi, setActiveApi] = useState(platform || "BINANCE");


  // console.log(platform)

  const schema = {
    api_key: Joi.string().min(30).required(),
    secret_key: Joi.string().min(30).required(),
    passphrase: Joi.string().min(5).when("keys", {
      is: "BITGET",
      then: Joi.required(),
      otherwise: Joi.optional(),
    })
  };


  useEffect(() => {
    // console.log(activeApi)
    if (api_keys) {
      // console.log(activeApi)
      setData({
        api_key: api_keys?.[activeApi.toUpperCase()]?.api_key || "",
        secret_key: "", // Reset secret_key as it should not be pre-filled
      });
    }
  }, [activeApi, getProfile]); // Run when `getProfile` or `activeApi` changes

  const validate = (data) => {
    const result = Joi.validate(data, schema, { abortEarly: false });
    if (!result.error) return null;

    const validationErrors = {};
    for (let item of result.error.details) {
      validationErrors[item.path[0]] = item.message;
    }
    return validationErrors;
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    const fieldSchema = { [id]: schema[id] };
    const result = Joi.validate({ [id]: value }, fieldSchema);
    if (result.error) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [id]: result.error.details[0].message,
      }));
    } else {
      setErrors((prevErrors) => {
        const { [id]: _, ...rest } = prevErrors;
        return rest;
      });
    }

    setData((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleSubmit = async (e, apiType) => {
    e.preventDefault();
    setBtnDisable(true);

    const validationErrors = validate(data);
    setErrors(validationErrors || {});
    if (validationErrors) {
      setBtnDisable(false);
      return;
    }

    const formattedData = {
      api_key: data.api_key,
      secret_key: data.secret_key,
      passphrase: data?.passphrase,
      keys: apiType, // "BINANCE" or "BITGET"
      type: api_keys?.[apiType]?.api_key ? "UPDATE" : "ADD",
    };

    // console.log(formattedData)

    try {
      const response = await backEndCallObj("/admin/add_update_keys", formattedData);
      if (!response) return;
      toast.success(response?.success);


      // console.log(keysResponse);
      const keysResponse = await backEndCall("/admin_get/profile");
      const { api_keys } = keysResponse?.profile;

      // console.log(api_keys, apiType)

      // console.log(api_keys?.[apiType]?.api_key)


      setData((prevData) => ({
        ...prevData,
        api_key: api_keys?.[apiType]?.api_key,
        secret_key: '',
        passphrase: ''
      }));
    } catch (error) {
      toast.error(error?.response?.data || "Something went wrong");
    } finally {
      setBtnDisable(false);
    }
  };

  // Updated renderForm function
  const renderForm = (apiType) => (
    <form className="my-5" onSubmit={(e) => handleSubmit(e, apiType)}>
      {/* {console.log(data)} */}
      <div className="mb-4">
        <label className="form-label text-uppercase fs-15 fw-bold">api key</label>
        <input
          type="text"
          className="form-control"
          id="api_key"
          placeholder="Enter API key"
          value={data.api_key || ""}
          onChange={handleChange}
        />
        {error.api_key && <small className="text-danger">{error.api_key}</small>}
      </div>
      <div className="mb-4">
        <label className="form-label text-uppercase fs-15 fw-bold">secret key</label>
        <input
          type="password"
          className="form-control"
          id="secret_key"
          placeholder="Secret key"
          value={data.secret_key || ""}
          onChange={handleChange}
        />
        {error.secret_key && <small className="text-danger">{error.secret_key}</small>}
      </div>

      {
        apiType === "BITGET" &&
        <div className="mb-5">
          <label className="form-label text-uppercase fs-15 fw-bold">Passphrase</label>
          <input
            type="text"
            className="form-control"
            id="passphrase"
            placeholder="Passphrase"
            value={data.passphrase || ""}
            onChange={handleChange}
          />
          {error.secret_key && <small className="text-danger">{error.passphrase}</small>}
        </div>

      }

      <div className="text-end">
        <button className="text-capitalize" disabled={btnDisable}>
          {/* {console.log(apiType)} */}
          {/* {console.log(api_keys?.[apiType]?.api_key)} */}
          {btnDisable ? "Wait..." : api_keys?.[apiType]?.api_key ? "Update" : "Add"}
        </button>
      </div>
    </form>
  );

  return (
    <div className="api">
      <div className="card">
        <div className="card-body">
          <div className="container">
            <h5 className="text-center text-uppercase fw-bold mb-5 mt-3 primary-color">
              api settings
            </h5>
            <div className="d-flex gap-2 flex-wrap">
              {["BINANCE", "BITGET"].map((api) => (
                <div
                  key={api}
                  className={`binance-api flex-fill d-flex justify-content-center align-items-center py-2 ${activeApi === api ? "active" : ""
                    }`}
                  onClick={() => setActiveApi(api)}
                >
                  <p className="text-capitalize mb-0 fw-semibold">{api} API</p>
                </div>
              ))}
            </div>
            {activeApi === "BINANCE" ? renderForm("BINANCE") : renderForm("BITGET")}
          </div>
        </div>
      </div>
    </div>
  );
};

// Map Redux state to props
const mapStateToProps = (state) => ({
  getProfile: state.getProfile.value, // Access the slice state
});

export default connect(mapStateToProps)(Api);










