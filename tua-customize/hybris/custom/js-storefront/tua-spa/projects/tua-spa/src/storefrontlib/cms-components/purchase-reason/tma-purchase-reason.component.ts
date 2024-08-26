// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import {
  TmaChecklistAction,
  TmaChecklistActionType,
} from '../../../core';
import { TmaChecklistActionService } from '../../../core';
import {
  LOCAL_STORAGE,
  TmaChecklistActionTypeCheckService,
  TmaConstantResourceModel
} from '../../../core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

const { MOVE
} = LOCAL_STORAGE.REASON_FOR_PURCHASE;

@Component({
  selector: 'cx-purchase-reason',
  templateUrl: './tma-purchase-reason.component.html',
  styleUrls: ['./tma-purchase-reason.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TmaPurchaseReasonComponent implements OnInit, OnDestroy, AfterViewChecked {

  @Input()
  contractStartDate: string;

  @Input()
  serviceProvider: string;

  @Input()
  selectedReasonPurchase: string;

  @Input()
  checklistAction$: Observable<TmaChecklistAction[]>;

  @Output()
  updatePurchaseReason = new EventEmitter<any>();

  minDate: Date;
  maxDate: Date;

  protected baseSiteId: string;
  protected subscription = new Subscription();

  purchaseReasonForm: FormGroup;

  constructor(
    protected fb: FormBuilder,
    protected tmaChecklistActionService: TmaChecklistActionService,
    protected checklistActionTypeCheckService: TmaChecklistActionTypeCheckService,
    protected changeDetectorRef: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
    this.minDate = new Date();
    this.maxDate = new Date();
    this.minDate.setDate(this.minDate.getDate() + 1);
    this.maxDate.setFullYear(this.maxDate.getFullYear() + 1000);
    this.purchaseReasonForm = this.buildForm(this.selectedReasonPurchase);
    this.updateContractStartDate();
    this.updatePreviousProvider();
  }

  ngAfterViewChecked(): void {
    this.changeDetectorRef.detectChanges();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  /**
   * Check if the installation address action type is provided
   *
   * @param checklistActionList - list of checklist actions
   * @param type - checklist action type
   * @return True if the checklist type is found in the checklist actions list, otherwise false
   */
  hasChecklistActionOfType(checklistActionList: TmaChecklistAction[], type: TmaChecklistActionType): boolean {
    return this.checklistActionTypeCheckService.hasChecklistActionOfType(checklistActionList, type);
  }

  /**
   * Enables/disables the 'Yes' button if the service provider input changes
   */
  updatePurchaseReasonForm(purchaseReasonForm): void {
    this.updatePurchaseReason.emit(purchaseReasonForm);
  }

  /**
   * Get the checklist action type
   *
   * @return A {@link TmaChecklistActionType}
   */
  get checklistActionType(): typeof TmaChecklistActionType {
    return TmaChecklistActionType;
  }

  private buildForm(selectedReasonPurchase: string): FormGroup {
    if (selectedReasonPurchase === MOVE) {
      return this.fb.group({
        contractStartDateInput: [null, Validators.required]
      });
    } else {
      return this.fb.group({
        contractStartDateInput: [null, Validators.required],
        previousProviderName: [null, Validators.required]
      });
    }
  }

  updateContractStartDate(): void {
    if (this.contractStartDate) {
      this.purchaseReasonForm['controls'].contractStartDateInput.setValue(this.formatDate(new Date(this.contractStartDate)));
    }
    this.changeDetectorRef.detectChanges();

  }

  updatePreviousProvider(): void {
    if (this.serviceProvider) {
      this.purchaseReasonForm['controls'].previousProviderName.setValue(this.serviceProvider);
    }
    this.changeDetectorRef.detectChanges();

  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  get constants(): TmaConstantResourceModel {
    return LOCAL_STORAGE;
  }

}
