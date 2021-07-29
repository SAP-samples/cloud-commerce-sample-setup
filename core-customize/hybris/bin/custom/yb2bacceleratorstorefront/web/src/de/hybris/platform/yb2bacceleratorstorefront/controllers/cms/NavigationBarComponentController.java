/*
 * Copyright (c) 2019 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.platform.yb2bacceleratorstorefront.controllers.cms;

import de.hybris.platform.acceleratorcms.enums.NavigationBarMenuLayout;
import de.hybris.platform.acceleratorcms.model.components.NavigationBarComponentModel;
import de.hybris.platform.yb2bacceleratorstorefront.controllers.ControllerConstants;

import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;


/**
 *
 */
@Controller("NavigationBarComponentController")
@RequestMapping(value = ControllerConstants.Actions.Cms.NavigationBarComponent)
public class NavigationBarComponentController extends AbstractAcceleratorCMSComponentController<NavigationBarComponentModel>
{
	@Override
	protected void fillModel(final HttpServletRequest request, final Model model, final NavigationBarComponentModel component)
	{
		if (component.getDropDownLayout() != null)
		{
			model.addAttribute("dropDownLayout", component.getDropDownLayout().getCode().toLowerCase());
		}
		else if (component.getNavigationNode() != null && component.getNavigationNode().getChildren() != null
				&& !component.getNavigationNode().getChildren().isEmpty())
		{
			// Component has children but not drop down layout, default to auto
			model.addAttribute("dropDownLayout", NavigationBarMenuLayout.AUTO.getCode().toLowerCase());
		}
	}
}
