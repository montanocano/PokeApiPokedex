import axios, { AxiosInstance, AxiosResponse, AxiosError } from "axios";
import { ApiString } from "./apiString";

// custom errors so we can show different messages in the UI

export class ApiTimeoutError extends Error {
  constructor() {
    super("Connection timed out. Please try again.");
    this.name = "ApiTimeoutError";
  }
}

export class ApiNetworkError extends Error {
  constructor() {
    super("No internet connection. Check your network.");
    this.name = "ApiNetworkError";
  }
}

export class ApiHttpError extends Error {
  statusCode: number;

  constructor(statusCode: number, statusText: string) {
    super(`HTTP Error ${statusCode}: ${statusText}`);
    this.name = "ApiHttpError";
    this.statusCode = statusCode;
  }
}

// 10 sec timeout
const TIMEOUT = 10000;

function createClient(): AxiosInstance {
  const client = axios.create({
    baseURL: ApiString.getAPIBase(),
    timeout: TIMEOUT,
    headers: {
      Accept: "application/json",
    },
  });

  // response interceptor
  // on success -> return just .data so we dont have to do res.data everywhere
  // on error -> classify it into our custom errors
  client.interceptors.response.use(
    (response: AxiosResponse) => response.data,
    (error: AxiosError) => {
      // timeout
      if (error.code === "ECONNABORTED") {
        return Promise.reject(new ApiTimeoutError());
      }

      // no response from server -> network problem
      if (!error.response) {
        return Promise.reject(new ApiNetworkError());
      }

      // regular http error (404, 500, etc)
      return Promise.reject(
        new ApiHttpError(
          error.response.status,
          error.response.statusText || "Unknown error"
        )
      );
    }
  );

  return client;
}

// single instance for the whole app
export const apiClient = createClient();