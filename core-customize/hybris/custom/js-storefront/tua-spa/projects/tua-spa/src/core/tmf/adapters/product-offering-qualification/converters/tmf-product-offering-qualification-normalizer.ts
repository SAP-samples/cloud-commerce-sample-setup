// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved
import { Injectable } from '@angular/core';
import { Converter } from '@spartacus/core';
import { TmaProductOfferingQualification } from '../../../../../core';
import { Tmf } from '../../../tmf-models';

@Injectable({ providedIn: 'root' })
export class TmfProductOfferingQualificationNormalizer
  implements Converter<Tmf.TmfProductOfferingQualification, TmaProductOfferingQualification> {

  constructor() {
  }

    /**
     * Concerts {@link Tmf.TmfProductOfferingQualification} to {@link TmaProductOfferingQualification}
     *
     * @param source - The object which will be uset to retrieve the values from
     * @param target - The object which will be populated with the values from the source
     * @returns target object of {@link TmaProductOfferingQualification}
     */
    convert(
        source: Tmf.TmfProductOfferingQualification,
        target?: TmaProductOfferingQualification
    ): TmaProductOfferingQualification {
        if (target === undefined) {
            target = {...(source as any) };
        }

        return target;
    }
}
