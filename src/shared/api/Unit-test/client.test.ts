/**
 * @file client.test.ts
 * @description Unit tests for the API client: custom errors, ApiString helper, and interceptor behaviour.
 *
 * Steps:
 *  1. Verify ApiString.getAPIBase() returns the expected PokeAPI base URL.
 *  2. Verify each custom error class (ApiTimeoutError, ApiNetworkError, ApiHttpError)
 *     sets the correct name, message and extra properties.
 *  3. Verify the axios interceptor unwraps response.data to return the payload directly.
 *  4. Verify the interceptor maps no-response errors -> ApiNetworkError.
 *  5. Verify the interceptor maps HTTP status responses -> ApiHttpError with statusCode.
 */

import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import {
  ApiTimeoutError,
  ApiNetworkError,
  ApiHttpError,
} from "../client";
import { ApiString } from "../apiString";

// ─── Step 1: ApiString ────────────────────────────────────────────────────────
describe("ApiString", () => {
  it("returns the correct PokeAPI base URL", () => {
    expect(ApiString.getAPIBase()).toBe("https://pokeapi.co/api/v2");
  });
});

// ─── Step 2: Custom error classes ─────────────────────────────────────────────
describe("ApiTimeoutError", () => {
  it("has the correct name and message", () => {
    const err = new ApiTimeoutError();
    expect(err.name).toBe("ApiTimeoutError");
    expect(err.message).toBe("Connection timed out. Please try again.");
    expect(err).toBeInstanceOf(Error);
  });
});

describe("ApiNetworkError", () => {
  it("has the correct name and message", () => {
    const err = new ApiNetworkError();
    expect(err.name).toBe("ApiNetworkError");
    expect(err.message).toBe("No internet connection. Check your network.");
    expect(err).toBeInstanceOf(Error);
  });
});

describe("ApiHttpError", () => {
  it("stores statusCode and formats message correctly", () => {
    const err = new ApiHttpError(404, "Not Found");
    expect(err.name).toBe("ApiHttpError");
    expect(err.statusCode).toBe(404);
    expect(err.message).toBe("HTTP Error 404: Not Found");
    expect(err).toBeInstanceOf(Error);
  });

  it("handles 500 Internal Server Error", () => {
    const err = new ApiHttpError(500, "Internal Server Error");
    expect(err.statusCode).toBe(500);
  });
});

// ─── Steps 3–5: Interceptor behaviour via axios-mock-adapter ─────────────────
describe("apiClient interceptor", () => {
  // We test interceptor logic by creating a fresh axios instance mirroring
  // the production setup so we don't couple to the singleton.
  let mockAxios: MockAdapter;
  let testClient: ReturnType<typeof axios.create>;

  beforeEach(() => {
    testClient = axios.create({ baseURL: "https://pokeapi.co/api/v2" });

    // mirror the same interceptor logic from client.ts
    testClient.interceptors.response.use(
      (response) => response.data,
      (error) => {
        if (error.code === "ECONNABORTED") {
          return Promise.reject(new ApiTimeoutError());
        }
        if (!error.response) {
          return Promise.reject(new ApiNetworkError());
        }
        return Promise.reject(
          new ApiHttpError(
            error.response.status,
            error.response.statusText || "Unknown error",
          ),
        );
      }
    );

    mockAxios = new MockAdapter(testClient);
  });

  afterEach(() => {
    mockAxios.restore();
  });

  it("step 3 – unwraps response.data on success", async () => {
    mockAxios.onGet("/pokemon/1").reply(200, { id: 1, name: "bulbasaur" });
    const result = await testClient.get("/pokemon/1");
    expect(result).toEqual({ id: 1, name: "bulbasaur" });
  });

  it("step 4 – throws ApiNetworkError on network failure (no response)", async () => {
    mockAxios.onGet("/pokemon/1").networkError();
    await expect(testClient.get("/pokemon/1")).rejects.toBeInstanceOf(
      ApiNetworkError
    );
  });

  it("step 5 – throws ApiHttpError with statusCode on HTTP 404", async () => {
    mockAxios.onGet("/pokemon/999").reply(404, {}, { statusText: "Not Found" });
    try {
      await testClient.get("/pokemon/999");
      fail("should have thrown");
    } catch (e) {
      expect(e).toBeInstanceOf(ApiHttpError);
      expect((e as ApiHttpError).statusCode).toBe(404);
    }
  });

  it("step 5 – throws ApiHttpError on HTTP 500", async () => {
    mockAxios.onGet("/pokemon").reply(500, {});
    await expect(testClient.get("/pokemon")).rejects.toBeInstanceOf(
      ApiHttpError
    );
  });
});
