import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const api = axios.create({
  baseURL: "http://10.0.2.2:8080/api", // emulador Android
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para enviar o token em todas as requisições
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("@SAPE:token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
    config.headers["Content-Type"] = "application/json"; // garante JSON
  }
  return config;
});

export default api;
