/*
 * Copyright (c) 2019 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.platform.yb2bacceleratorstorefront.controllers.misc;

import de.hybris.platform.acceleratorservices.urlresolver.SiteBaseUrlResolutionService;
import de.hybris.platform.acceleratorstorefrontcommons.controllers.AbstractController;
import de.hybris.platform.cms2.model.site.CMSSiteModel;
import de.hybris.platform.cms2.servicelayer.services.CMSSiteService;
import de.hybris.platform.core.model.media.MediaModel;
import de.hybris.platform.yb2bacceleratorstorefront.controllers.ControllerConstants;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;


@Controller
public class SiteMapController extends AbstractController
{
	@Resource(name = "cmsSiteService")
	private CMSSiteService cmsSiteService;

	@Resource(name = "siteBaseUrlResolutionService")
	private SiteBaseUrlResolutionService siteBaseUrlResolutionService;

	@RequestMapping(value = "/sitemap.xml", method = RequestMethod.GET, produces = "application/xml")
	public String getSitemapXml(final Model model, final HttpServletResponse response)
	{
		final CMSSiteModel currentSite = cmsSiteService.getCurrentSite();

		final String mediaUrlForSite = siteBaseUrlResolutionService.getMediaUrlForSite(currentSite, false, "");

		final List<String> siteMapUrls = new ArrayList<>();

		final Collection<MediaModel> siteMaps = currentSite.getSiteMaps();
		for (final MediaModel siteMap : siteMaps)
		{
			siteMapUrls.add(mediaUrlForSite + siteMap.getURL());
		}
		model.addAttribute("siteMapUrls", siteMapUrls);

		return ControllerConstants.Views.Pages.Misc.MiscSiteMapPage;
	}
}
