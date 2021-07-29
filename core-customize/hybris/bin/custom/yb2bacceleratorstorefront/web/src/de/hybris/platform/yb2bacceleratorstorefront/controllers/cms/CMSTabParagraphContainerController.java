/*
 * Copyright (c) 2019 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.platform.yb2bacceleratorstorefront.controllers.cms;

import de.hybris.platform.acceleratorcms.model.components.CMSTabParagraphContainerModel;
import de.hybris.platform.yb2bacceleratorstorefront.controllers.ControllerConstants;

import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;


/**
 * Controller for CMSTabParagraphContainer. This controller is used for displaying the container own page
 */
@Controller("CMSTabParagraphContainerController")
@RequestMapping(value = ControllerConstants.Actions.Cms.CMSTabParagraphContainer)
public class CMSTabParagraphContainerController extends AbstractAcceleratorCMSComponentController<CMSTabParagraphContainerModel>
{
	@Override
	protected void fillModel(final HttpServletRequest request, final Model model, final CMSTabParagraphContainerModel component)
	{
		model.addAttribute("components", component.getSimpleCMSComponents());
	}
}
