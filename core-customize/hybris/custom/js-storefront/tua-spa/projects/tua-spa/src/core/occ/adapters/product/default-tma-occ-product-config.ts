// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { OccConfig, ProductScope } from '@spartacus/core';

export const defaultTmaOccProductConfig: OccConfig = {
  backend: {
    occ: {
      endpoints: {
        product: {
          default:
            'products/${productCode}?fields=DEFAULT,averageRating,images(FULL),classifications,manufacturer,numberOfReviews,categories(FULL),baseOptions,baseProduct,variantOptions,variantType,productOfferingPrice(FULL)',
            list:
            'products/${productCode}?fields=code,name,summary,price(formattedValue),images(DEFAULT,galleryIndex)',
          details:
            'products/${productCode}?fields=DEFAULT,averageRating,stock(DEFAULT),description,availableForPickup,code,url,price(DEFAULT),numberOfReviews,manufacturer,categories(FULL),priceRange,multidimensional,configuratorType,configurable,tags,images(FULL),productOfferingPrice(FULL),productSpecification,validFor,classifications',
          attributes: 'products/${productCode}?fields=classifications,poSpecCharValueUses(FULL)',
          variants:
            'products/${productCode}?fields=purchasable,baseOptions(DEFAULT),baseProduct,variantOptions(DEFAULT),variantType',
          list_item:
            'products/${productCode}?fields=code,name,price(formattedValue),images(DEFAULT),baseProduct,productOfferingPrice(FULL)'
        },
        productReviews: 'products/${productCode}/reviews',
        // Uncomment this when occ gets configured
        // productReferences:
        //   'products/${productCode}/references?fields=DEFAULT,references(target(images(FULL)))&referenceType=${referenceType}',
        productReferences:
          'products/${productCode}/references?fields=DEFAULT,references(target(images(FULL)))',
        // tslint:disable:max-line-length
        productSearch:
          'products/search?fields=products(code,name,summary,isBundle,children,price(FULL),images(DEFAULT),stock(FULL),averageRating,poSpecCharValueUses(FULL),variantOptions,productSpecification,productOfferingPrice(FULL)),facets,breadcrumbs,pagination(DEFAULT),sorts(DEFAULT),freeTextSearch,currentQuery',
        // tslint:enable
        productSuggestions: 'products/suggestions',
        placeOrder: 'users/${userId}/orders?fields=FULL'
      },
    },
    loadingScopes: {
      product: {
        details: {
          include: [ProductScope.LIST, ProductScope.VARIANTS],
        },
      },
    },
  },
};
