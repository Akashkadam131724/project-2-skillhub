import { logFetchResult } from "@/lib/cache/cache-log";
import type {
  ApiGetOptions,
  CmsApiError,
  CmsRequestOptions,
  QueryParams,
} from "./types";

export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export function toQuery(params: QueryParams = {}) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    if (Array.isArray(value)) {
      if (!value.length) return;
      search.set(key, value.join(","));
      return;
    }
    search.set(key, String(value));
  });
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

export async function apiGet<T = unknown>(
  path: string,
  options: ApiGetOptions = {}
): Promise<T> {
  const { notFoundMessage, next, cache } = options;
  const init: RequestInit & {
    next?: { revalidate?: number | false; tags?: string[] };
  } = {};
  if (next) init.next = next;
  else if (cache) init.cache = cache;
  else init.cache = "no-store";

  const res = await fetch(`${API_URL}${path}`, init);
  logFetchResult(`api GET ${path}`, res, init);
  if (res.status === 404) {
    const err = new Error(notFoundMessage || "Not found") as Error & {
      status?: number;
    };
    err.status = 404;
    throw err;
  }
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { message?: string }).message || "Request failed");
  }
  return res.json() as Promise<T>;
}

export async function apiRequest<T = unknown>(
  path: string,
  { method = "GET", body, next, cache }: CmsRequestOptions = {}
): Promise<T> {
  const init: RequestInit & {
    next?: { revalidate?: number | false; tags?: string[] };
  } = {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  };
  if (next) init.next = next;
  else if (cache) init.cache = cache;
  else init.cache = "no-store";

  const res = await fetch(`${API_URL}${path}`, init);
  if (method === "GET") {
    logFetchResult(`api ${method} ${path}`, res, init);
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(
      (data as { message?: string }).message || "Request failed"
    ) as CmsApiError;
    err.status = res.status;
    err.fields = (data as { fields?: unknown }).fields;
    err.payload = data;
    throw err;
  }
  return data as T;
}
