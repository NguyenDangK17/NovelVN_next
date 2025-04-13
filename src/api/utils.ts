import { MANGADEX_API_URL } from '../constants/api';

export const createHttpsRequestPromise = async <T>(
  method: string,
  path: string,
  options?: any
): Promise<{ data: T }> => {
  const fullUrl = `${MANGADEX_API_URL}${path}`;

  const headers = new Headers({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'x-requested-with': 'XMLHttpRequest'
  });

  // If there are custom headers in options, add them
  if (options?.headers) {
    Object.entries(options.headers).forEach(([key, value]) => {
      headers.set(key, value as string);
    });
  }

  const response = await fetch(`${fullUrl}`, {
    method,
    headers,
    ...options
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return { data };
};

export const buildQueryStringFromOptions = (options?: Record<string, any>): string => {
  if (!options || Object.keys(options).length === 0) return "";

  const queryParams: string[] = [];

  for (const key of Object.keys(options)) {
    const value = options[key];
    if (value === undefined) continue;

    if (Array.isArray(value)) {
      value.forEach((v) => {
        queryParams.push(`${encodeURIComponent(key)}[]=${encodeURIComponent(v)}`);
      });
    } else if (value instanceof Date) {
      queryParams.push(`${key}=${value.toISOString().split(".")[0]}`);
    } else if (typeof value === "object") {
      Object.entries(value).forEach(([subKey, subValue]) => {
        queryParams.push(`order[${subKey}]=${subValue}`);
      });
    } else {
      queryParams.push(`${key}=${encodeURIComponent(value)}`);
    }
  }

  return `?${queryParams.join("&")}`;
};
