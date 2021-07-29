/*
 * Copyright (c) 2019 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.platform.yb2bacceleratorstorefront.controllers.cms;

import de.hybris.platform.acceleratorstorefrontcommons.controllers.cms.AbstractCMSComponentController;
import de.hybris.platform.cms2.model.contents.components.AbstractCMSComponentModel;
import de.hybris.platform.yb2bacceleratorstorefront.controllers.ControllerConstants;

import org.apache.commons.lang.StringUtils;


/**
 * Abstract accelerator CMS component controller providing a common implementation for the getView method.
 */
public abstract class AbstractAcceleratorCMSComponentController<T extends AbstractCMSComponentModel> extends
		AbstractCMSComponentController<T>
{
	@Override
	protected String getView(final T component)
	{
		// build a jsp response based on the component type
		return ControllerConstants.Views.Cms.ComponentPrefix + StringUtils.lowerCase(getTypeCode(component));
	}

}
