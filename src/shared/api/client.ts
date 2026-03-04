import axios, {
  AxiosInstance,
  AxiosResponse,
  AxiosError,
} from "axios";
import { ApiString } from "./apiString";

//Custom error types

export class ApiTimeoutError extends Error {
  constructor(message = "Connection timed out. Please try again.") {
    super(message);
    this.name = "ApiTimeoutError";
  }
}

export class ApiNetworkError extends Error {
  constructor(message = "No internet connection. Please check your network.") {
    super(message);
    this.name = "ApiNetworkError";
  }
}

export class ApiHttpError extends Error {
  public readonly statusCode: number;
  public readonly statusText: string;

  constructor(statusCode: number, statusText: string, message?: string) {
    super(message ?? `HTTP Error ${statusCode}: ${statusText}`);
    this.name = "ApiHttpError";
    this.statusCode = statusCode;
    this.statusText = statusText;
  }
}

//Client configuration

const DEFAULT_TIMEOUT = 10_000; // 10 seconds

/**
 * Creates and configures the Axios instance used across the entire app.
 *
 * Features:
 * - Base URL pointing to PokéAPI v2
 * - Global 10-second timeout
 * - Accept: application/json header
 * - Response interceptor that unwraps data and normalises errors
 */
function createApiClient(): AxiosInstance {
  const client = axios.create({
    baseURL: ApiString.getAPIBase(),
    timeout: DEFAULT_TIMEOUT,
    headers: {
      Accept: "application/json",
    },
  });

  //Response interceptor
  // On success  → unwrap the Axios response and return `response.data` directly.
  // On failure  → classify the error into one of our custom types.
  client.interceptors.response.use(
    (response: AxiosResponse) => response.data,
    (error: AxiosError) => {
      // Timeout (ECONNABORTED)
      if (error.code === "ECONNABORTED") {
        return Promise.reject(new ApiTimeoutError());
      }

      // No response at all → network issue
      if (!error.response) {
        return Promise.reject(new ApiNetworkError());
      }

      // Standard HTTP error
      const { status, statusText } = error.response;
      return Promise.reject(
        new ApiHttpError(status, statusText ?? "Unknown error")
      );
    }
  );

  return client;
}

export const apiClient: AxiosInstance = createApiClient();