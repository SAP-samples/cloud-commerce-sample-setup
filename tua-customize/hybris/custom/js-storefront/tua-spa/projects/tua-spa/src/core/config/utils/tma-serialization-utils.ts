// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { HttpErrorResponse } from '@angular/common/http';
import { ErrorModel, HttpErrorModel } from '@spartacus/core';
import { tmaIsObject } from './tma-deep-merge';

export const UNKNOWN_ERROR = {
  error: 'unknown error',
};

const circularReplacer = () => {
  const seen = new WeakSet();
  return (key: any, value: any) => {
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return undefined;
      }
      seen.add(value);
    }
    return value;
  };
};

export function makeErrorSerializable(
  error: HttpErrorResponse | ErrorModel | any
): HttpErrorModel | Error | any {
  if (error instanceof Error) {
    return {
      message: error.message,
      type: error.name,
      reason: error.stack,
    } as ErrorModel;
  }

  if (error instanceof HttpErrorResponse) {
    let serializableError = error.error;
    if (tmaIsObject(error.error)) {
      serializableError = JSON.stringify(error.error, circularReplacer());
    }

    return {
      message: error.message,
      error: serializableError,
      status: error.status,
      statusText: error.statusText,
      url: error.url,
    } as HttpErrorModel;
  }

  return tmaIsObject(error) ? UNKNOWN_ERROR : error;
}
