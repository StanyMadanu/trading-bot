import { backEndCall, backEndCallObj } from "./mainService";

const getCoins = async () => {
  const data = await backEndCall("/admin_get/get_coins");
  if (!data || !data?.success) return null;
  return data.success;
};
const addCoins = async (payload) => {
  // console.log(payload, "add reponse");
  const response = await backEndCallObj("admin/add_coin", payload);
  // console.log(response, "addcoins");

  if (!response) return null;
  return response;
};
const updateCoins = async (payload) => {
  const data = await backEndCallObj("admin/update_coin", payload);
  // console.log(data);
  if (!data) return null;
  return data;
};
const deleteCoins = async (paload) => {
  const data = await backEndCallObj("admin/update_coin", paload);
  if (!data) return null;
  return data;
};

//admincontrolssettting

const coinService = {
  getCoins,
  updateCoins,
  deleteCoins,
  addCoins,
};

export default coinService;