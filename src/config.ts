/**
 * Reads and prepares configuration for the Cashfree Payment Gateway APIs.
 * Handles environment-based base URLs and API credentials.
 */

export interface ApiConfig {
  base_url?: string;
  header: {
    "x-client-id"?: string;
    "x-client-secret"?: string;
  };
}

export type Config = Record<typeof PAYMENT_API_KEY, ApiConfig>;

const BASE_URLS = {
  sandbox: "https://sandbox.cashfree.com",
  production: "https://api.cashfree.com",
};

export const PAYMENT_API_KEY = "Cashfree Payment Gateway APIs - 2025-01-01";

const DEFAULT_CONFIG: Config = {
  [PAYMENT_API_KEY]: {
    base_url: `${BASE_URLS.sandbox}/pg`,
    header: {},
  },
};

export function readConfig(): Config {
  const config: Config = JSON.parse(JSON.stringify(DEFAULT_CONFIG));
  const isProduction = process.env.ENV === "production";
  const baseUrl = isProduction ? BASE_URLS.production : BASE_URLS.sandbox;

  config[PAYMENT_API_KEY].base_url = `${baseUrl}${
    config[PAYMENT_API_KEY].base_url!.split(BASE_URLS.sandbox)[1]
  }`;

  const appId = process.env.PAYMENTS_APP_ID;
  const appSecret = process.env.PAYMENTS_APP_SECRET;
  if (appId && appSecret) {
    config[PAYMENT_API_KEY].header = {
      "x-client-id": appId,
      "x-client-secret": appSecret,
    };
  }

  return config;
}
