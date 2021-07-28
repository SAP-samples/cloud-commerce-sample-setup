/*
 * Copyright (c) 2019 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.platform.yb2bacceleratorstorefront.interceptors.beforeview;

import de.hybris.platform.acceleratorservices.storefront.data.MetaElementData;
import de.hybris.platform.acceleratorstorefrontcommons.controllers.ThirdPartyConstants;
import de.hybris.platform.acceleratorstorefrontcommons.interceptors.BeforeViewHandler;

import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.util.CollectionUtils;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;


public class SeoRobotsFollowBeforeViewHandler implements BeforeViewHandler
{
	private Map<String, String> robotIndexForJSONMapping;

	@Override
	public void beforeView(final HttpServletRequest request, final HttpServletResponse response, final ModelAndView modelAndView)
	{
		// Check to see if the controller has specified a Index/Follow directive for robots
		if (modelAndView != null && !modelAndView.getModel().containsKey(ThirdPartyConstants.SeoRobots.META_ROBOTS))
		{
			// Build a default directive
			String robotsValue = ThirdPartyConstants.SeoRobots.NOINDEX_NOFOLLOW;

			if (RequestMethod.GET.name().equalsIgnoreCase(request.getMethod()))
			{
				//Since no model attribute metaRobots can be set for JSON response, then configure that servlet path in the xml.
				//If its a regular response and this setting has to be overriden then set model attribute metaRobots
				if (CollectionUtils.contains(getRobotIndexForJSONMapping().keySet().iterator(), request.getServletPath()))
				{
					robotsValue = getRobotIndexForJSONMapping().get(request.getServletPath());
				}
				else
				{
					robotsValue = ThirdPartyConstants.SeoRobots.INDEX_FOLLOW;
				}
			}
			else if (RequestMethod.POST.name().equalsIgnoreCase(request.getMethod()))
			{
				robotsValue = ThirdPartyConstants.SeoRobots.NOINDEX_NOFOLLOW;
			}

			modelAndView.addObject(ThirdPartyConstants.SeoRobots.META_ROBOTS, robotsValue);
		}

		if (modelAndView != null && modelAndView.getModel().containsKey("metatags"))
		{
			final MetaElementData metaElement = new MetaElementData();
			metaElement.setName("robots");
			metaElement.setContent((String) modelAndView.getModel().get(ThirdPartyConstants.SeoRobots.META_ROBOTS));
			((List<MetaElementData>) modelAndView.getModel().get("metatags")).add(metaElement);
		}
	}

	protected Map<String, String> getRobotIndexForJSONMapping()
	{
		return robotIndexForJSONMapping;
	}

	public void setRobotIndexForJSONMapping(final Map<String, String> robotIndexForJSONMapping)
	{
		this.robotIndexForJSONMapping = robotIndexForJSONMapping;
	}
}
