import { defaultConfig } from '@acme/config';

export function getRuntimeConfig() {
  return defaultConfig;
}

export function getRuntimeApiBaseUrl() {
  return process.env.RUNTIME_API_URL ?? getRuntimeConfig().api.baseUrl;
}
