// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Converter, ConverterService, Facet, Occ, PRODUCT_NORMALIZER, ProductSearchPage } from '@spartacus/core';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TmaOccProductSearchPageNormalizer
  implements Converter<Occ.ProductSearchPage, ProductSearchPage> {
  constructor(private converterService: ConverterService) {}

  /**
   * Specifies the minimal number of top values in case
   * non have been setup by the business.
   */
  protected DEFAULT_TOP_VALUES = 6;

  convert(
    source: Occ.ProductSearchPage,
    target: ProductSearchPage = {}
  ): ProductSearchPage {
    target = {
      ...target,
      ...(source as any)
    };

    this.normalizeFacets(target);
    if (source.products) {
      target.products = source.products.map(product =>
        this.converterService.convert(product, PRODUCT_NORMALIZER)
      );
    }
    return target;
  }

  private normalizeFacets(target: ProductSearchPage): void {
    this.normalizeFacetValues(target);
    this.normalizeUselessFacets(target);
  }

  /**
   * Filter the facet from the list;
   * any facet that does not have a count <= the total results will be dropped from
   * the facets.
   *
   * @param target {@link ProductSearchPage}
   */
  private normalizeUselessFacets(target: ProductSearchPage): void {
    target.facets = target.facets.filter(facet => {
      return (
        !target.pagination ||
        !target.pagination.totalResults ||
        ((!facet.hasOwnProperty('visible') || facet.visible) &&
          facet.values &&
          facet.values.find(value => {
            return (
              value.count <= target.pagination.totalResults || value.selected
            );
          }))
      );
    });
  }

  /*
   * `topValues` is a feature in Adaptive Search which can limit a large
   * amount of facet values to a small set.
   *
   * @param target {@link ProductSearchPage}
   */
  private normalizeFacetValues(target: ProductSearchPage): void {
    if (target.facets) {
      target.facets = target.facets.map((facetSource: Facet) => {
        const { topValues, ...facetTarget } = facetSource;
        facetTarget.topValueCount = topValues
          ? topValues.length
          : this.DEFAULT_TOP_VALUES;
        return facetTarget;
      });
    }
  }
}
