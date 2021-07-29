/*
 * Copyright (c) 2019 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.platform.yb2bacceleratorstorefront.controllers.misc;

import de.hybris.platform.acceleratorstorefrontcommons.controllers.AbstractController;
import de.hybris.platform.yb2bacceleratorstorefront.controllers.ControllerConstants;

import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

/**
 * Controller for web robots instructions
 */
@Controller
public class RobotsController extends AbstractController
{
	// Number of seconds in one day
	private static final String ONE_DAY = String.valueOf(60 * 60 * 24);

	@RequestMapping(value = "/robots.txt", method = RequestMethod.GET)
	public String getRobots(final HttpServletResponse response)
	{
		// Add cache control header to cache response for a day
		response.setHeader("Cache-Control", "public, max-age=" + ONE_DAY);

		return ControllerConstants.Views.Pages.Misc.MiscRobotsPage;
	}
}
