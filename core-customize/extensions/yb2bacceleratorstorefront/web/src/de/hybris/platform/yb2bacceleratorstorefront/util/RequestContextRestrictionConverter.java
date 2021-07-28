/*
 * Copyright (c) 2019 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.platform.yb2bacceleratorstorefront.util;

import de.hybris.platform.acceleratorservices.data.RequestContextData;
import de.hybris.platform.category.model.CategoryModel;
import de.hybris.platform.cms2.servicelayer.data.CMSDataFactory;
import de.hybris.platform.cms2.servicelayer.data.RestrictionData;
import de.hybris.platform.core.model.product.ProductModel;

import org.springframework.beans.factory.annotation.Required;
import org.springframework.core.convert.converter.Converter;


/**
 */
public class RequestContextRestrictionConverter implements Converter<RequestContextData, RestrictionData>
{
	private CMSDataFactory cmsDataFactory;

	@Override
	public RestrictionData convert(final RequestContextData source)
	{
		return createRestrictionData(source.getCategory(), source.getProduct());
	}

	protected RestrictionData createRestrictionData(final CategoryModel category, final ProductModel product)
	{
		return getCmsDataFactory().createRestrictionData(category, product);
	}

	protected CMSDataFactory getCmsDataFactory()
	{
		return cmsDataFactory;
	}

	@Required
	public void setCmsDataFactory(final CMSDataFactory cmsDataFactory)
	{
		this.cmsDataFactory = cmsDataFactory;
	}
}
