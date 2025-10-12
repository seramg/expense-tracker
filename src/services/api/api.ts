import { AppEnv } from "@/config/env";
import FetchApi from "./fetch/fetch";
import requestInterceptor from "./interceptors/request";
import errorInterceptor from "./interceptors/error";
import responseInterceptor from "./interceptors/response";

const API = new FetchApi({
  baseUrl: AppEnv.API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

API.setOnRequest(requestInterceptor);
API.setOnError(errorInterceptor);
API.setOnResponse(responseInterceptor);

export default API;
