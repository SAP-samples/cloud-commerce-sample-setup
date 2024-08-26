// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { createFeatureSelector, createSelector, MemoizedSelector, MemoizedSelectorWithProps } from '@ngrx/store';
import {
  QUERY_SERVICE_QUALIFICATION_FEATURE,
  QueryServiceQualificationError,
  QueryServiceQualificationState,
  StateWithQueryServiceQualification
} from '../query-service-qualification-state';
import { Product } from '@spartacus/core';
import { QueryServiceQualification, RelatedPlaceRefOrValue } from '../../../model';

export const getQueryServiceQualificationFeatureState: MemoizedSelector<
  StateWithQueryServiceQualification,
  QueryServiceQualificationState
> = createFeatureSelector<QueryServiceQualificationState>(
  QUERY_SERVICE_QUALIFICATION_FEATURE
);

export const getAllQueryServiceQualifications: MemoizedSelector<
  StateWithQueryServiceQualification,
  QueryServiceQualification[]
> = createSelector(
  getQueryServiceQualificationFeatureState,
  (state: QueryServiceQualificationState) => state.queryServiceQualification
);

export const getQueryServiceQualificationBySearchCriteria: MemoizedSelectorWithProps<
  StateWithQueryServiceQualification,
  any,
  QueryServiceQualification
> = createSelector(
  getAllQueryServiceQualifications,
  (state: QueryServiceQualification[], props) => {
    if (props.technicalDetails) {
      return state
      ? state.find((serviceQualification: QueryServiceQualification) =>
                          serviceQualification.technicalResources[0].id === props.technicalDetails.id)
        : undefined;
    }
    return state
      ? state.find(
          (serviceQualification: QueryServiceQualification) =>
            serviceQualification.searchCriteria.service.place[0].postcode ===
            props.address.postcode
        )
      : undefined;
  }
);

export const getAllQueryServiceQualificationError: MemoizedSelector<
  StateWithQueryServiceQualification,
  QueryServiceQualificationError[]
> = createSelector(
  getQueryServiceQualificationFeatureState,
  (state: QueryServiceQualificationState) => state.error
);

export const getQueryServiceProductSearchState: MemoizedSelector<
  StateWithQueryServiceQualification,
  Product[]
> = createSelector(
  getQueryServiceQualificationFeatureState,
  (state: QueryServiceQualificationState) => state.searchProductResult
);

export const filterNonServiceableProducts: MemoizedSelectorWithProps<
  StateWithQueryServiceQualification,
  any,
  string[]
> = createSelector(
  getQueryServiceProductSearchState,
  (state: Product[], props) => {
    if (!!state) {
      const nonServiceableProducts = [];
      const stateProducts = [];
      state.forEach((element: Product) => {
        if (!!element) {
          stateProducts.push(element.code);
        }
      });
      if (props !== undefined && props.productCodes !== undefined) {
        props.productCodes.forEach((productCode: string) => {
          if (!stateProducts.includes(productCode)) {
            nonServiceableProducts.push(productCode);
          }
        });
      }
      return nonServiceableProducts;
    }
    return undefined;
  }
);

export const hasQueryServiceQualificationError: MemoizedSelector<
  StateWithQueryServiceQualification,
  boolean
> = createSelector(
  getQueryServiceQualificationFeatureState,
  (state: QueryServiceQualificationState) => {
    if (state) {
      const hasQueryServiceQualification = state.queryServiceQualification ? true : false;
      if (hasQueryServiceQualification) {
        return false;
      } else {
        return state.error.length > 0 ? true : undefined;
      }
    }
    return undefined;
  }
);

export const getSelectedAddress: MemoizedSelector<
  StateWithQueryServiceQualification,
  RelatedPlaceRefOrValue
> = createSelector(
  getAllQueryServiceQualifications,
  (state: QueryServiceQualification[]) => {
    const selectedState = state.find(
      (serviceQualification: QueryServiceQualification) =>
        serviceQualification.searchCriteria.service !== undefined
    );
    return selectedState
      ? selectedState.searchCriteria.service.place[0]
      : undefined;
  }
);

export const getQueryServiceQualificationInCategoryPage: MemoizedSelector<
  StateWithQueryServiceQualification,
  QueryServiceQualification
> = createSelector(
  getAllQueryServiceQualifications,
  (state: QueryServiceQualification[]) => {
    const selectedState = state.find(
      (serviceQualification: QueryServiceQualification) =>
        serviceQualification?.isCategoryPage === true
    );
    return selectedState
      ? selectedState
      : undefined;
  }
);
