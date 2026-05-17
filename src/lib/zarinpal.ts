import axios from "axios";

export const zarinpal = {
  request: async (amount: number, description: string) => {
    const response = await axios.post("/api/payment/request", {
      amount,
      description,
    });
    return response.data;
  },
  
  verify: async (authority: string, amount: number) => {
    const response = await axios.post("/api/payment/verify", {
      authority,
      amount,
    });
    return response.data;
  },
};
