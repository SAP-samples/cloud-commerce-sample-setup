// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { TmaPremiseDetail } from '../../model';

@Injectable({
  providedIn: 'root'
})
export class TmaPremiseDetailInteractionService {

  protected premiseDetails = new Subject<{ premiseDetails: TmaPremiseDetail; entryNumber: number }>();
  protected premiseDetails$ = this.premiseDetails.asObservable();

  constructor() {
  }

  /**
   * Updates the premise details eneterd
   *
   * @param premiseDetails - The premise details
   * @param entryNumber - The entry number
   */
  updatePremiseDetail({ premiseDetails, entryNumber }: { premiseDetails: TmaPremiseDetail; entryNumber: number }) {
    this.premiseDetails.next({ premiseDetails, entryNumber });
  }

  get getPremiseDetails(): Observable<{ premiseDetails: TmaPremiseDetail; entryNumber: number }> {
    return this.premiseDetails$;
  }
}
