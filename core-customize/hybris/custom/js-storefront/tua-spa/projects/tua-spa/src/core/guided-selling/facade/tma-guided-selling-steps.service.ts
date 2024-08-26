// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Injectable, OnDestroy } from '@angular/core';
import { ProductService } from '@spartacus/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { TmaGuidedSellingStep, TmaProduct, TmaProductOfferingGroup } from '../../model';
import { first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TmaGuidedSellingStepsService implements OnDestroy {

  protected guidedSellingSteps: TmaGuidedSellingStep[] = [];
  protected guidedSellingStepsChange: Subject<TmaGuidedSellingStep[]> = new Subject<TmaGuidedSellingStep[]>();
  protected _guidedSellingSteps$: Observable<TmaGuidedSellingStep[]> = this.guidedSellingStepsChange.asObservable();
  guidedSellingBpoList = [];

  protected subscription = new Subscription();

  constructor(
    protected productService: ProductService
  ) {
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  /**
   * Returns the guided selling steps for the provided product code.
   *
   * @param productCode - The identifier of the product
   * @return List of {@link TmaGuidedSellingStep}
   */
  getGuidedSellingSteps(productCode: string): TmaGuidedSellingStep[] {
    if (!productCode) {
      return null;
    }
    this.populateGuidedSellingSteps(productCode);
    return this.guidedSellingSteps;
  }

  /**
   * Populates the guidedSellingSteps list recursively with the Product Offering Group of the parent or
   * the BPO itself, if it has no Product Offering Group.
   *
   * @param productCode - The identifier of the BPO
   */
  populateGuidedSellingSteps(productCode: string): void {
    this.subscription.add(
      this.productService.get(productCode)
        .pipe(
          first((result: TmaProduct) => !!result)
        )
        .subscribe((result: TmaProduct) => {
          if (result) {
            result.children.forEach((child: TmaProduct) => {
              if (child.isBundle) {
                if (!this.guidedSellingBpoList.includes(child.code)) {
                  this.guidedSellingBpoList.push(child.code);
                }
                this.populateGuidedSellingSteps(child.code);
              } else {
                this.populateStepsList(result, child);
              }
            });
            this.change();
          }
        })
      );
  }

  /**
   * Sets the first guided selling step as the active step.
   */
  setFirstStepAsActiveStep(): void {
    if (!this.guidedSellingSteps || this.guidedSellingSteps.length === 0) {
      return;
    }

    this.guidedSellingSteps.forEach((step: TmaGuidedSellingStep) => step.active = false);
    this.guidedSellingSteps[0].active = true;
  }

  protected populateStepsList(product: TmaProduct, productChild: TmaProduct) {
    if (product.offeringGroup) {
      this.addOfferingGroupsAsSteps(product.offeringGroup, productChild);
    } else {
      this.addBpoNameAsStep(product);
    }
  }

  protected addOfferingGroupsAsSteps(offeringGroup: TmaProductOfferingGroup[], productChild: TmaProduct): void {
    offeringGroup.forEach((offer: TmaProductOfferingGroup) => {
      const existingStep = this.guidedSellingSteps.find((step: TmaGuidedSellingStep) => step.id === offer.id);
      const childExistingInOffer = offer.childProductOfferings.find((child: TmaProduct) => child.code === productChild.code);
      if (childExistingInOffer && !existingStep) {
        const step: TmaGuidedSellingStep = { id: offer.id, name: offer.name, active: false, inProductGroup: true };
        this.guidedSellingSteps.push(step);
        if (this.guidedSellingSteps.length === 1) {
          this.guidedSellingSteps[0].active = true;
        }
      }
    });
  }

  protected addBpoNameAsStep(product: TmaProduct): void {
    const existingStep = this.guidedSellingSteps.find((step: TmaGuidedSellingStep) => step.id === product.code);
    if (!existingStep) {
      const step: TmaGuidedSellingStep = { id: product.code, name: product.name, active: false, inProductGroup: false };
      this.guidedSellingSteps.push(step);
      if (this.guidedSellingSteps.length === 1) {
        this.guidedSellingSteps[0].active = true;
      }
    }
  }

  protected change(): void {
    this.guidedSellingStepsChange.next(this.guidedSellingSteps);
  }

  get guidedSellingSteps$(): Observable<TmaGuidedSellingStep[]> {
    return this._guidedSellingSteps$;
  }
}
