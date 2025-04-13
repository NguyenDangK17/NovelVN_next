import { buildQueryStringFromOptions } from "./utils";

const BASE_URL = "https://api.mangadex.org";

export type GetMangaRequestOptions = {
  title?: string;
  authors?: string[];
  artists?: string[];
  year?: number;
  includedTags?: string[];
  excludedTags?: string[];
  limit?: number;
  offset?: number;
  order?: {
    title?: "asc" | "desc";
    year?: "asc" | "desc";
    createdAt?: "asc" | "desc";
  };
};

export async function getManga(options?: GetMangaRequestOptions) {
  const qs = buildQueryStringFromOptions(options);
  const url = `${BASE_URL}/manga${qs}`;

  const response = await fetch(url);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`MangaDex API Error: ${response.status} ${response.statusText}`, {
      cause: errorData,
    });
  }

  return response.json();
}
