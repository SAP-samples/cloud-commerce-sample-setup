/*
 * SPDX-FileCopyrightText: 2023 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Injectable, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { BaseSiteService, EventService } from '@spartacus/core';
import { ChecklistActionAddToCartEvent } from './checklist-action.events';
import { TmaStateWithChecklistAction } from '../store';
import { select, Store } from '@ngrx/store';
import * as TmaChecklistActionSelectors from '../store/selectors/tma-checklist-action.selector';
import { filter, first, take } from 'rxjs/operators';
import {
  Appointment,
  LogicalResourceType,
  RelatedPlaceRef,
  Reservation,
  TmaActionType,
  TmaCheckListActionDetails,
  TmaChecklistActionType,
  TmaPlaceRole,
  TmaProcessTypeEnum,
  TmaProductRelationshipType,
  TmaRelatedPartyRole,
  TmaTmfActionType,
  TmaTmfShoppingCart,
  TmfProduct,
  TmfProductCharacteristic,
  TmfProductRelationship
} from '../../model';
import { TmaConfigurablePscInputsDataHandlingService } from '../../configurable-pscv/services';
import { TmaAddToCartService } from '../../add-to-cart';
import { LOCAL_STORAGE } from '../../util';

const { TECHNICAL_ID, AVERAGE_CONSUMPTION_ESTIMATION } = LOCAL_STORAGE.SUBSCRIBED_PRODUCT.CHARACTERISTIC;

/**
 * Checkout delivery mode event listener.
 */
@Injectable({
  providedIn: 'root',
})
export class ChecklistActionAddToCartEventListener implements OnDestroy {
  protected subscriptions = new Subscription();
  protected baseSiteId: string;

  constructor(protected eventService: EventService,
              protected store: Store<TmaStateWithChecklistAction>,
              protected tmaAddToCartService: TmaAddToCartService,
              protected baseSiteService: BaseSiteService,
              protected configurablePscvusService: TmaConfigurablePscInputsDataHandlingService) {
    this.checkListActionAddToCart();
    this.subscriptions.add(
      this.baseSiteService
        .getActive()
        .pipe(
          first((baseSiteId: string) => baseSiteId != null)
        )
        .subscribe((baseSiteId: string) => (this.baseSiteId = baseSiteId))
      );
  }

  protected checkListActionAddToCart() {
    this.subscriptions.add(
      this.eventService
        .get(ChecklistActionAddToCartEvent).pipe(take(1))
        .subscribe((_) => {
          this.store.pipe(
            select(TmaChecklistActionSelectors.getAllChecklistActionsDetails)
          ).pipe(filter(
            (result) =>
              Object.keys(result).length !== 0
          )).subscribe((res: TmaCheckListActionDetails[]) => {
            const shoppingCart: TmaTmfShoppingCart = {
              cartItem: [
                {
                  action: TmaTmfActionType.ADD,
                  processType: {
                    id: TmaProcessTypeEnum.ACQUISITION
                  },
                }
              ],
            };
            res.forEach((item) => {
              if (item.type === TmaChecklistActionType.APPOINTMENT) {
                shoppingCart.cartItem[0].appointment = this.createAppointment(item.value);
              }
              if (item.type === TmaChecklistActionType.INSTALLATION_ADDRESS) {
                shoppingCart.cartItem[0].product = this.createTmfResource(TmaChecklistActionType.INSTALLATION_ADDRESS, item.value, shoppingCart.cartItem[0].product);
              }
              if (item.type === TmaChecklistActionType.MSISDN) {
                shoppingCart.cartItem[0].product = this.createTmfResource(TmaChecklistActionType.MSISDN, item.value, shoppingCart.cartItem[0].product);
              }
              if (item.type === TmaChecklistActionType.ESTIMATED_CONSUMPTION) {
                shoppingCart.cartItem[0].product = this.createTmfResource(AVERAGE_CONSUMPTION_ESTIMATION, item.value, shoppingCart.cartItem[0].product);
              }
              if (item.type === TmaChecklistActionType.RELIES_ON && shoppingCart.cartItem[0].product !== undefined) {
                shoppingCart.cartItem[0].product.productRelationship = this.createProductRelationship(item);
              }
              if (item.type === TmaChecklistActionType.CONTRACT_START_DATE) {
                shoppingCart.cartItem[0]['contractStartDate'] = item.value;
              }
              if (item.type === TmaChecklistActionType.SERVICE_PROVIDER) {
                if (item.action === TmaActionType.REMOVE) {
                  shoppingCart.cartItem[0].processType.id =  TmaProcessTypeEnum.ACQUISITION;
                } else {
                  shoppingCart.cartItem[0].processType.id = TmaProcessTypeEnum.SWITCH_SERVICE_PROVIDER;
                }
                shoppingCart.cartItem[0].product = this.createTmfResource(TmaRelatedPartyRole.SERVICE_PROVIDER, item.value, shoppingCart.cartItem[0].product, item.action);
              }
            })
            this.tmaAddToCartService.setAddToCartPayloadState(shoppingCart);
          })
        })
    );
  }

  protected populateInstallationAddress(addressId: string): RelatedPlaceRef {
    if (!addressId) {
      return undefined;
    }
    return {
        id: addressId,
        '@referredType': 'GeographicAddress',
        role: TmaPlaceRole.INSTALLATION_ADDRESS
      };
  }

  protected createAppointment(id: string): Appointment {
    if (id === undefined) {
      return undefined;
    }
    return {
      id: id
    };
  }

  protected createTmfResource(
    type: TmaChecklistActionType | TmaRelatedPartyRole,
    value: any,
    product: TmfProduct,
    action?: TmaActionType
  ): TmfProduct {
    if (product === undefined) {
      product = {
        place: [],
        characteristic: []
      };
    }
    if (type === TmaChecklistActionType.MSISDN) {
      product.characteristic.push(this.createMsisdn(value));
      return product;
    }
    if (type === TmaChecklistActionType.INSTALLATION_ADDRESS) {
      if (value.installationAddressId !== undefined) {
        product.place.push(this.populateInstallationAddress(value.installationAddressId));
      }
      else {
        product.place.push(this.populateInstallationAddress(value));
      }
      if (value.technicalId) {
        product.characteristic.push({
          name: TECHNICAL_ID,
          value: value.technicalId
        })
      }
      return product;
    }
    if (type === TmaRelatedPartyRole.SERVICE_PROVIDER) {
      if (action === TmaActionType.REMOVE) {
        product['relatedParty'] = undefined;
        return product;
      }
      product['relatedParty'] = [
        {
          id: value,
          role: type
        }
      ]
      return product;
    }
    if (type === AVERAGE_CONSUMPTION_ESTIMATION) {
      const consumptionValue = value?.consumption?.value ? value?.consumption.value : JSON.parse(value?.consumption)?.value;
      product.characteristic.push({
        name: type,
        value: JSON.stringify(consumptionValue)
      });
      return product;
    }
    if (type) {
      product.characteristic.push({
        name: type,
        value: value
      })
    }
    return product;
  }

  protected createProductRelationship(item: TmaCheckListActionDetails): TmfProductRelationship[] {
    return [
      {
        'type': TmaProductRelationshipType.RELY_ON,
        'product': {
          'id': item.value
        }
      }
    ]
  }

  protected createMsisdn(msisdnValue: Reservation): TmfProductCharacteristic {
    if (!msisdnValue) {
      return undefined;
    }
    return {
        id: msisdnValue.id,
        name: LogicalResourceType.MSISDN,
        value: msisdnValue.reservationItem[0].appliedCapacityAmount[0].resource[0].value
      };
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
