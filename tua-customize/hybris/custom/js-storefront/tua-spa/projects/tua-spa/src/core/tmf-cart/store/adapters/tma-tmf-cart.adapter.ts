// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { TmaTmfShoppingCart } from '../../../model';
import { Observable } from 'rxjs';

export abstract class TmaTmfCartAdapter {

  /**
   * Abstract method used to updating a cart.
   *
   * @param shoppingCart - The model containing the information about the cart used for updating the cart
   */
  abstract updateCart(shoppingCart: TmaTmfShoppingCart): Observable<TmaTmfShoppingCart>;
}
