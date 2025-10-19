import { ValidationError } from 'yup';
import { MongoError } from 'mongodb';

/**
 * Standard API Error interface
 */
export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string>;
}

/**
 * Type guard to check for Mongo duplicate key error
 */
function isMongoDuplicateKeyError(
  err: unknown,
): err is { code: number; keyValue: Record<string, unknown> } {
  return (
    typeof err === 'object' &&
    err !== null &&
    'code' in err &&
    (err as MongoError).code === 11000 &&
    'keyValue' in err
  );
}

/**
 * Wraps different types of errors into a consistent ApiError
 */
export function handleError(err: unknown): ApiError {
  // Yup validation errors
  if (err instanceof ValidationError) {
    const errors: Record<string, string> = {};
    err.inner.forEach((e) => {
      if (e.path) errors[e.path] = e.message;
    });
    return {
      message: 'Validation failed',
      status: 400,
      errors,
    };
  }

  // Mongoose / MongoDB duplicate key error
  if (isMongoDuplicateKeyError(err)) {
    const field = Object.keys(err.keyValue)[0];
    return {
      message: `${field} already exists`,
      status: 409,
      errors: { [field]: `${field} already exists` },
    };
  }

  // Generic MongoDB or other DB errors
  if (err instanceof MongoError) {
    return {
      message: err.message || 'Database error',
      status: 500,
    };
  }

  // Unknown error fallback
  return {
    message: (err as Error)?.message || 'Internal server error',
    status: 500,
  };
}
