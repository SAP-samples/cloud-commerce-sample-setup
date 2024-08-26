// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { HttpErrorResponse, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BadRequestHandler, ErrorModel, GlobalMessageType } from '@spartacus/core';
import { LOCAL_STORAGE } from '../../../../util';

const { ORDER_PROCESSING_ERROR } = LOCAL_STORAGE.ORDER_PROCESSING;
const { ILLEGAL_ARGUMENT_ERROR } = LOCAL_STORAGE.ILLEGAL_ARGUMENT;
const { COMMERCE_CART_MODIFICATION_ERROR } = LOCAL_STORAGE.COMMERCE_CART_MODIFICATION;

@Injectable({
  providedIn: 'root'
})
export class TmaBadRequestHandler extends BadRequestHandler {

  handleError(request: HttpRequest<any>, response: HttpErrorResponse): void {
    super.handleError(request, response);
    this.handleOrderProcessingError(request, response);
    this.handleIllegalArgumentError(response);
    this.handleCommerceCartModificationError(response);
  }

  protected handleOrderProcessingError(
    _request: HttpRequest<any>,
    response: HttpErrorResponse
  ): void {
    this.getErrors(response)
      .filter(
        (e) =>
          e.type === ORDER_PROCESSING_ERROR
      )
      .forEach((error: ErrorModel) => {
        this.globalMessageService.add(
          error.message,
          GlobalMessageType.MSG_TYPE_ERROR
        );
      });
  }

  protected handleIllegalArgumentError(
    response: HttpErrorResponse
  ): void {
    this.getErrors(response)
      .filter(
        (e) =>
          e.type === ILLEGAL_ARGUMENT_ERROR
      )
      .forEach((error: ErrorModel) => {
        this.globalMessageService.add(
          error.message,
          GlobalMessageType.MSG_TYPE_ERROR
        );
      });
  }

  protected handleCommerceCartModificationError(
    response: HttpErrorResponse
  ): void {
    this.getErrors(response)
      .filter(
        (e) =>
          e.type === COMMERCE_CART_MODIFICATION_ERROR
      )
      .forEach((error: ErrorModel) => {
        this.globalMessageService.add(
          error.message,
          GlobalMessageType.MSG_TYPE_ERROR
        );
      });
  }
}
