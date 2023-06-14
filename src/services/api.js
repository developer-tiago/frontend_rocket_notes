import axios from "axios";

export const api = axios.create({
  baseURL: "https://rocketnotes-api-bn9k.onrender.com"
});
