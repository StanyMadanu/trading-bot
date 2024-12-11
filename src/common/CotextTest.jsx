import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { backEndCall, getJwt } from "../services/mainService";
import { profileRedux } from "../components/reduxStore/slice/profileSlice";

const useFetchKeys = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [keysLoading, setKeysLoading] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [apiKeys, setApiKeys] = useState(null);

  // Function to Fetch Keys
  const fetchKeys = async () => {
    if (keysLoading) return;

    try {
      setKeysLoading(true);
      const res = await backEndCall("/admin_get/profile");

      if (!res) return;

      setProfileData(res);
      setApiKeys(res.profile.api_keys || {});

      // Dispatch the profile data to Redux
      dispatch(profileRedux(res));
      console.log("Fetched Data:", res);

      const jwt = getJwt();
      if (jwt && Object.keys(res.profile.api_keys || {}).length > 0) {
        setTimeout(() => navigate("/dashboard"), 200);
      } else {
        setTimeout(() => navigate("/apis"), 200);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setKeysLoading(false);
    }
  };

  // Return states and functions for use in components
  return { fetchKeys, keysLoading, profileData, apiKeys };
};

export default useFetchKeys;
