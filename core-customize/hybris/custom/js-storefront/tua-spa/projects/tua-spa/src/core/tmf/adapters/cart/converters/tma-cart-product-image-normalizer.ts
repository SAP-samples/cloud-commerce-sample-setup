// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved
import { Injectable } from '@angular/core';
import { Converter, ImageGroup, ImageType } from '@spartacus/core';
import { Images } from '@spartacus/core/src/model/image.model';
import { Tmf } from '../../../tmf-models';

@Injectable({ providedIn: 'root' })

export class TmaCartProductImageNormalizer implements Converter<Tmf.TmfAttachment[], Images> {
  convert(source: Tmf.TmfAttachment[], target?: Images): Images {
    const images: Images = {};
    if (source) {
      images[ImageType.PRIMARY] = {};
      for (const image of source) {
        const imageContainer: ImageGroup = this.getImageContainer(images);
        const targetImage = { ...image };
        if (image.type) {
          imageContainer[image.type] = targetImage;
        }
      }
    }
    return images;
  }

  protected getImageContainer(images: Images) {
    return images[ImageType.PRIMARY] as ImageGroup;
  }

}
