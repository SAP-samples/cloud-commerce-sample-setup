/*
 * Copyright (c) 2019 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.platform.yb2bacceleratorstorefront.renderer;

import com.sap.security.core.server.csi.XSSEncoder;
import de.hybris.platform.acceleratorcms.component.renderer.CMSComponentRenderer;
import de.hybris.platform.acceleratorstorefrontcommons.tags.Functions;
import de.hybris.platform.category.model.CategoryModel;
import de.hybris.platform.cms2.enums.LinkTargets;
import de.hybris.platform.cms2.model.contents.components.CMSLinkComponentModel;
import de.hybris.platform.commercefacades.product.data.CategoryData;
import de.hybris.platform.commercefacades.product.data.ProductData;
import de.hybris.platform.core.model.product.ProductModel;
import de.hybris.platform.servicelayer.dto.converter.Converter;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.jsp.JspException;
import javax.servlet.jsp.JspWriter;
import javax.servlet.jsp.PageContext;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.apache.taglibs.standard.tag.common.core.UrlSupport;
import org.owasp.html.HtmlPolicyBuilder;
import org.owasp.html.PolicyFactory;
import org.springframework.beans.factory.annotation.Required;
import org.springframework.web.util.HtmlUtils;

import static de.hybris.platform.acceleratorstorefrontcommons.tags.HTMLSanitizer.sanitizeHTML;


/**
 */
public class CMSLinkComponentRenderer implements CMSComponentRenderer<CMSLinkComponentModel>
{
	private static final Logger LOG = Logger.getLogger(CMSLinkComponentRenderer.class);

	protected static final PolicyFactory policy = new HtmlPolicyBuilder().allowStandardUrlProtocols()
			.allowElements("a", "span")
			.allowAttributes( "href", "style", "class", "title", "target", "download", "rel", "rev",
					"hreflang", "type", "text", "accesskey", "contenteditable", "contextmenu", "dir", "draggable",
					"dropzone", "hidden", "id", "lang", "spellcheck", "tabindex", "translate")
			.onElements("a")
			.allowAttributes("class")
			.onElements("span")
			.toFactory();


	private Converter<ProductModel, ProductData> productUrlConverter;
	private Converter<CategoryModel, CategoryData> categoryUrlConverter;

	protected Converter<ProductModel, ProductData> getProductUrlConverter()
	{
		return productUrlConverter;
	}

	@Required
	public void setProductUrlConverter(final Converter<ProductModel, ProductData> productUrlConverter)
	{
		this.productUrlConverter = productUrlConverter;
	}

	protected Converter<CategoryModel, CategoryData> getCategoryUrlConverter()
	{
		return categoryUrlConverter;
	}

	@Required
	public void setCategoryUrlConverter(final Converter<CategoryModel, CategoryData> categoryUrlConverter)
	{
		this.categoryUrlConverter = categoryUrlConverter;
	}

	protected String getUrl(final CMSLinkComponentModel component)
	{
		// Call the function getUrlForCMSLinkComponent so that this code is only in one place
		return Functions.getUrlForCMSLinkComponent(component, getProductUrlConverter(), getCategoryUrlConverter());
	}

	@Override
	public void renderComponent(final PageContext pageContext, final CMSLinkComponentModel component) throws ServletException,
			IOException
	{
		try
		{
			final String url = getUrl(component);
			final String encodedUrl = UrlSupport.resolveUrl(url, null, pageContext);
			final String linkName = HtmlUtils.htmlEscape(component.getLinkName());
			
			StringBuilder html = new StringBuilder();

			if (StringUtils.isNotBlank(linkName) && StringUtils.isBlank(encodedUrl))
			{
				// <span class="empty-nav-item">${component.linkName}</span>
				html.append("<span class=\"empty-nav-item\">");
				html.append(linkName);
				html.append("</span>");
			}
			else
			{
				// <a href="${encodedUrl}" ${component.styleAttributes} title="${component.linkName}"
				// ${component.target == null || component.target == 'SAMEWINDOW' ? '' : 'target="_blank"'}>${component.linkName}</a>

				html.append("<a href=\"");
				html.append(encodedUrl);
				html.append("\" ");

				// Write additional attributes onto the link
				if (component.getStyleAttributes() != null)
				{
					html.append(component.getStyleAttributes());
				}

				if (StringUtils.isNotBlank(linkName))
				{
					html.append(" title=\"");
					html.append(linkName);
					html.append("\" ");
				}

				if (component.getTarget() != null && !LinkTargets.SAMEWINDOW.equals(component.getTarget()))
				{
					html.append(" target=\"_blank\"");
				}
				html.append(">");
				if (StringUtils.isNotBlank(linkName))
				{
					html.append(linkName);
				}
				html.append("</a>");
			}

			String sanitizedHTML = policy.sanitize(html.toString());
			final JspWriter out = pageContext.getOut();
			out.write(sanitizedHTML);
		}
		catch (final JspException e)
		{
			if (LOG.isDebugEnabled())
			{
				LOG.debug(e);
			}
		}
	}
}
