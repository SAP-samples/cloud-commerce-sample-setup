// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TmaCartQualificationMessageService {
  constructor() {
  }

  public editDataDetails: any = [];
  public subject = new Subject<any> ();
  private messageSource = new BehaviorSubject(this.editDataDetails);
  currentMessage = this.messageSource.asObservable();
  changeMessage(message: boolean) {
    this.messageSource.next(message);
  }
}
