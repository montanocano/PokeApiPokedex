import axios, { AxiosInstance, AxiosResponse, AxiosError } from "axios";
import { ApiString } from "./apiString";

// errores custom para manejar los distintos fallos de red
// asi en el UI podemos mostrar mensajes diferentes segun el error

export class ApiTimeoutError extends Error {
  constructor() {
    super("Se agotó el tiempo de conexión. Intenta de nuevo.");
    this.name = "ApiTimeoutError";
  }
}

export class ApiNetworkError extends Error {
  constructor() {
    super("No hay conexión a internet. Revisa tu red.");
    this.name = "ApiNetworkError";
  }
}

export class ApiHttpError extends Error {
  statusCode: number;

  constructor(statusCode: number, statusText: string) {
    super(`Error HTTP ${statusCode}: ${statusText}`);
    this.name = "ApiHttpError";
    this.statusCode = statusCode;
  }
}

// timeout de 10 seg como dice el PRD
const TIMEOUT = 10000;

function createClient(): AxiosInstance {
  const client = axios.create({
    baseURL: ApiString.getAPIBase(),
    timeout: TIMEOUT,
    headers: {
      Accept: "application/json",
    },
  });

  // interceptor de respuesta
  // en success -> devolvemos solo el .data para no tener que hacer res.data todo el rato
  // en error -> lo clasificamos en nuestros errores custom
  client.interceptors.response.use(
    (response: AxiosResponse) => response.data,
    (error: AxiosError) => {
      // timeout
      if (error.code === "ECONNABORTED") {
        return Promise.reject(new ApiTimeoutError());
      }

      // no hay respuesta del servidor -> problema de red
      if (!error.response) {
        return Promise.reject(new ApiNetworkError());
      }

      // error http normal (404, 500, etc)
      return Promise.reject(
        new ApiHttpError(
          error.response.status,
          error.response.statusText || "Error desconocido"
        )
      );
    }
  );

  return client;
}

// exportamos una sola instancia para toda la app
export const apiClient = createClient();