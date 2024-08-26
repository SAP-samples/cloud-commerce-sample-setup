// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { TmaTechnicalDetails } from '../../../core';


@Component({
  selector: 'cx-technical-id-form',
  templateUrl: './tma-technical-id-form.component.html',
  styleUrls: ['./tma-technical-id-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TmaTechnicalIdFormComponent implements OnInit, AfterViewChecked {

  @Input()
  technicalId: TmaTechnicalDetails;

  @Output()
  technicalIdSelected = new EventEmitter<TmaTechnicalDetails>()

  technicalDetails: FormGroup = this.fb.group({
    technicalId: ['', Validators.required]
  });


  constructor(
    protected fb: FormBuilder,
    protected changeDetectorRef: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
    this.updateTechnicalDetails();
  }

  ngAfterViewChecked() {
    this.changeDetectorRef.detectChanges();
  }

  technicalIdSelect(technicalDetails): void {
    this.technicalIdSelected.emit(technicalDetails);
  }

  updateTechnicalDetails(): void {
    if (this.technicalId && this.technicalId.id) {
      this.technicalDetails['controls'].technicalId.setValue(this.technicalId.id);
    }
  }
}
