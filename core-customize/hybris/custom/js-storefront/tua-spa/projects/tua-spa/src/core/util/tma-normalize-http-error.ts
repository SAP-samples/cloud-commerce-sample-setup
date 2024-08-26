// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { HttpErrorResponse } from '@angular/common/http';
import { isDevMode } from '@angular/core';
import { HttpErrorModel } from '@spartacus/core';

/**
 * Normalizes HttpErrorResponse to HttpErrorModel.
 *
 * Can be used as a safe and generic way for embodying http errors into
 * NgRx Action payload, as it will strip potentially unserializable parts from
 * it and warn in debug mode if passed error is not instance of HttpErrorModel
 * (which usually happens when logic in NgRx Effect is not sealed correctly)
 */
export function tmaNormalizeHttpError(
  error: HttpErrorResponse | any
): HttpErrorModel | undefined {
  if (error instanceof HttpErrorResponse) {
    const normalizedError: HttpErrorModel = {
      message: error.message,
      status: error.status,
      statusText: error.statusText,
      url: error.url,
    };

    // include backend's error details
    if (Array.isArray(error.error.errors)) {
      normalizedError.details = error.error.errors;
    } else if (typeof error.error.error === 'string') {
      normalizedError.details = [
        {
          type: error.error.error,
          message: error.error.error_description,
        },
      ];
    }

    return normalizedError;
  }

  if (isDevMode()) {
    console.error(
      'Error passed to normalizeHttpError is not HttpErrorResponse instance',
      error
    );
  }

  return undefined;
}
