/**
 * Standard XAOCS API response envelope.
 * Use these helpers to ensure consistent response shapes across all API routes.
 */

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  errors?: Array<{ field: string; message: string }>;
  meta?: ResponseMeta;
  status?: number;
}

export interface ResponseMeta {
  page?: number;
  perPage?: number;
  total?: number;
  lastPage?: number;
  [key: string]: unknown;
}

/** 200 OK with data */
export function ok<T>(data: T, meta?: ResponseMeta): ApiResponse<T> {
  return { success: true, data, ...(meta ? { meta } : {}) };
}

/** 201 Created with data */
export function created<T>(data: T): ApiResponse<T> {
  return { success: true, data };
}

/** Error response */
export function fail(error: string, status = 400): ApiResponse {
  return { success: false, error, status };
}

/** Validation error response */
export function validationFail(
  errors: Array<{ field: string; message: string }>
): ApiResponse {
  return { success: false, errors };
}

/** Paginated response */
export function paginated<T>(
  data: T[],
  total: number,
  page: number,
  perPage: number
): ApiResponse<T[]> {
  return {
    success: true,
    data,
    meta: {
      page,
      perPage,
      total,
      lastPage: Math.ceil(total / perPage),
    },
  };
}
