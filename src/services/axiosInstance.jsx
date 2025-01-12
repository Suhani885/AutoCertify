import axios from "axios";

const instance = axios.create({
  baseURL: "https://10.21.98.110:8000",
  withCredentials: true,
});

export default instance;
