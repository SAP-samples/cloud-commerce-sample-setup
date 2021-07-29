/*
 * Copyright (c) 2019 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.platform.yb2bacceleratorstorefront.renderer;

import de.hybris.platform.acceleratorcms.component.renderer.CMSComponentRenderer;
import de.hybris.platform.acceleratorcms.model.components.ImageMapComponentModel;
import org.apache.commons.lang.StringUtils;
import org.owasp.html.HtmlPolicyBuilder;
import org.owasp.html.PolicyFactory;

import javax.servlet.ServletException;
import javax.servlet.jsp.JspWriter;
import javax.servlet.jsp.PageContext;
import java.io.IOException;


public class ImageMapComponentRenderer implements CMSComponentRenderer<ImageMapComponentModel>
{

	protected static final PolicyFactory policy = new HtmlPolicyBuilder().allowStandardUrlProtocols()
			.allowElements("div", "img", "map", "area").allowAttributes("src", "class", "title", "usemap", "alt", "srcset")
			.onElements("img").allowAttributes("shape", "coords", "href", "alt", "target").onElements("area").allowAttributes("name")
			.onElements("map").toFactory();

	@Override
	public void renderComponent(final PageContext pageContext, final ImageMapComponentModel component)
			throws IOException
	{
		final StringBuilder html = new StringBuilder();
		final String altText = StringUtils.defaultIfBlank(component.getMedia().getAltText(), "");
		html.append("<div>");
		html.append("<img");
		if (StringUtils.isNotBlank(altText))
		{
			html.append(" title=\"");
			html.append(altText);
			html.append("\" ");
			html.append(" alt=\"");
			html.append(altText);
			html.append("\" ");
		}
		html.append(" src=\"");
		html.append(component.getMedia().getURL());
		html.append("\" ");
		html.append(" usemap=\"#map\">");
		html.append("<map name=\"map\">");
		html.append(component.getImageMapHTML());
		html.append("</map>");
		html.append("</div>");

		final String sanitizedHTML = policy.sanitize(html.toString());
		final JspWriter out = pageContext.getOut();
		out.write(sanitizedHTML);
	}
}
