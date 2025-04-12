import { MANGADEX_API_URL } from '../constants/api';

export const createHttpsRequestPromise = async <T>(
  method: string,
  path: string,
  options?: any
): Promise<{ data: T }> => {
  const CORS_URL = process.env.NEXT_PUBLIC_CORS_URL;

  // Construct the full URL
  const fullUrl = `${MANGADEX_API_URL}${path}`;

  // Encode the URL properly
  const encodedUrl = encodeURIComponent(fullUrl);

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

  // const response = await fetch(`${CORS_URL}/v1/cors/${encodedUrl}`, {
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