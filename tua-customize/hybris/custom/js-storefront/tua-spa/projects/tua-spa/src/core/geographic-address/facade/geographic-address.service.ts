// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Injectable } from '@angular/core';
import * as GeographicAddressActions from '../store/actions/geographic-address.actions';
import { GeographicAddressAction, StateWithGeographicAddress } from '../store';
import { GeographicAddress } from '../../model';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import * as GeographicAddressSelectors from '../store/selectors/geographic-address.selector';
import { Command, CommandService, CommandStrategy } from '@spartacus/core';
import { switchMap, tap } from 'rxjs/operators';
import { GeographicAddressConnector } from '../connectors';
import { TmaUserIdService } from '../../user/facade/tma-user-id.service';

@Injectable()
export class GeographicAddressService {

  protected getGeographicAddressById: Command<{baseSiteId: string, geographicAddressId: string}> =
    this.commandService.create<{baseSiteId: string, geographicAddressId: string}>(
      (payload) =>
        this.userIdService.getCustomerId().pipe(
          switchMap((userId) =>
            this.geographicAddressConnector.getGeographicAddress(userId, payload.baseSiteId, payload.geographicAddressId).pipe(
              tap((address) => {
                return address;
              })
            )
          )
        ),
      {
        strategy: CommandStrategy.Parallel,
      }
    );

  constructor(protected store: Store<StateWithGeographicAddress>,
              protected commandService: CommandService,
              protected geographicAddressConnector: GeographicAddressConnector,
              protected userIdService: TmaUserIdService) {
  }

  /**
   * This method creates the geographic address.
   *
   * @param baseSiteId The id of the baseSite
   * @param geographicAddress The geographic address to be create
   */
  createGeographicAddress(
    baseSiteId: string,
    geographicAddress: GeographicAddress
  ): void {
    this.store.dispatch(
      new GeographicAddressActions.CreateGeographicAddress({
        baseSiteId: baseSiteId,
        geographicAddress: geographicAddress
      })
    );
  }

  /**
   * This method updates the geographic address.
   *
   * @param baseSiteId The id of the baseSite
   * @param geographicAddressId The id of the geographic address to be update
   * @param geographicAddress The geographic address to be update
   */
  updateGeographicAddress(
    baseSiteId: string,
    geographicAddressId: string,
    geographicAddress: GeographicAddress
  ): void {
    this.store.dispatch(
      new GeographicAddressActions.UpdateGeographicAddress({
        baseSiteId: baseSiteId,
        geographicAddressId: geographicAddressId,
        geographicAddress: geographicAddress
      })
    );
  }

  /**
   * Retrieves the geographic address by geographicAddressId.
   *
   * @param baseSiteId The id of the baseSite
   * @param geographicAddressId The id of the geographic address to be update
   */
  getGeographicAddress(
    baseSiteId: string,
    geographicAddressId: string
  ): Observable<GeographicAddress> {
    return this.getGeographicAddressById.execute({baseSiteId, geographicAddressId});
  }

  /**
   * This method retrives the selected installation address.
   *
   * @returns selected installation address as {@link Observable} of {@link GeographicAddress}
   */
  getSelectedInstallationAddress(): Observable<GeographicAddress> {
    return this.store.select(
      GeographicAddressSelectors.getSelectedInstallationGeographicAddress
    );
  }

  /**
   * This method retrives the selected installation address.
   *
   * @returns selected installation address as {@link Observable} of {@link GeographicAddress}
   */
  setSelectedInstallationAddress(address: GeographicAddress): void {
    this.store.dispatch(
      new GeographicAddressAction.SelectedInstallationAddress({
        selectedInstallationAddress: address
      })
    );
  }


  /**
   * This method determines if geographic address has error.
   *
   * @returns true if geographic address has error
   */
  hasGeographicAddressError(): Observable<boolean> {
    return this.store.select(
      GeographicAddressSelectors.getSelectedGeographicAddressError
    );
  }

  /**
   * This method clears the geographic address state.
   */
  clearCreatedGeographicAddressState(): void {
    this.store.dispatch(
      new GeographicAddressActions.ClearCreatedGeographicAddress()
    );
  }

  /**
   * This method clears the geographic address error.
   */
  clearGeographicAddressError(): void {
    this.store.dispatch(
      new GeographicAddressActions.ClearGeographicAddressError()
    );
  }
}
