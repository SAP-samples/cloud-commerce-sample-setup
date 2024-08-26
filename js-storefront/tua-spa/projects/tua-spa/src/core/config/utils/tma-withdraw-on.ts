// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Observable, OperatorFunction } from 'rxjs';
import { startWith, switchMapTo } from 'rxjs/operators';

/**
 *
 * Withdraw from the source observable when notifier emits a value
 *
 * Withdraw will result in resubscribing to the source observable
 * Operator is useful to kill ongoing emission transformation on notifier emission
 *
 */
export function withdrawOn<T>(
  notifier: Observable<any>
): OperatorFunction<T, T> {
  return (source: Observable<T>) =>
    notifier.pipe(
      startWith(),
      switchMapTo(source)
    );
}
