// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { createSelector, MemoizedSelectorWithProps } from '@ngrx/store';
import { Address, StateWithUser, UsersSelectors } from '@spartacus/core';

/**
 * Returns the address which matches the provided address.
 *
 * @return The {@link Address} which matches the provided address
 */
export const getAddress: MemoizedSelectorWithProps<StateWithUser, any, Address> =
  createSelector(UsersSelectors.getAddresses, (state: Address[], props) => {
    return state ? state.slice().reverse().find((address: Address) =>
      (address.town === props.address.town) &&
      (address.country.isocode === props.address.country.isocode) &&
      (address.line1 === props.address.line1) &&
      (address.line2 === props.address.line2) &&
      (address.postalCode === props.address.postalCode) &&
      (address.region ? address.region.isocode === props.address.region.isocode : !props.address.region)
    ) : null;
  });
