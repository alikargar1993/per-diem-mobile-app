import { ApiError } from '@/shared/api/apiError';

export function formatApiErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof ApiError) {
    switch (error.code) {
      case 'UNAUTHORIZED':
        return 'Authentication failed. Check your API token configuration.';
      case 'NOT_FOUND':
        return error.message || 'We could not find what you were looking for.';
      case 'RATE_LIMITED':
        return 'Too many requests. Please wait a moment and try again.';
      case 'UPSTREAM_ERROR':
        return 'The menu service is temporarily unavailable. Please try again.';
      case 'VALIDATION_ERROR':
        return error.message || 'Something in the request was invalid.';
      default:
        return error.message || fallback;
    }
  }
  if (error instanceof Error) {
    if (/network error/i.test(error.message)) {
      return 'No network connection. Check your internet and try again.';
    }
    return error.message || fallback;
  }
  return fallback;
}
