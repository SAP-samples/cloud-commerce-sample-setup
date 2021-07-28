/*
 * Copyright (c) 2019 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.platform.yb2bacceleratorstorefront.controllers.cms;

import de.hybris.platform.cms2.model.contents.components.AbstractCMSComponentModel;
import de.hybris.platform.servicelayer.exceptions.AttributeNotSupportedException;
import de.hybris.platform.servicelayer.model.ModelService;
import de.hybris.platform.yb2bacceleratorstorefront.controllers.ControllerConstants;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;


/**
 * Default Controller for CMS Component. This controller is used for all CMS components that don't have a specific
 * controller to handle them.
 */
@Controller("DefaultCMSComponentController")
@RequestMapping(value = ControllerConstants.Actions.Cms.DefaultCMSComponent)
public class DefaultCMSComponentController extends AbstractAcceleratorCMSComponentController<AbstractCMSComponentModel>
{
	@Resource(name = "modelService")
	private ModelService modelService;

	@Override
	protected void fillModel(final HttpServletRequest request, final Model model, final AbstractCMSComponentModel component)
	{
		// See documentation for CMSComponentService.getReadableEditorProperties, but this will return all frontend
		// properties which we just inject into the model.
		for (final String property : getCmsComponentService().getReadableEditorProperties(component))
		{
			try
			{
				final Object value = modelService.getAttributeValue(component, property);
				model.addAttribute(property, value);
			}
			catch (final AttributeNotSupportedException ignore)
			{
				// ignore
			}
		}
	}

	/**
	 * @param modelService
	 *           the modelService to set
	 */
	public void setModelService(final ModelService modelService)
	{
		this.modelService = modelService;
	}

}
