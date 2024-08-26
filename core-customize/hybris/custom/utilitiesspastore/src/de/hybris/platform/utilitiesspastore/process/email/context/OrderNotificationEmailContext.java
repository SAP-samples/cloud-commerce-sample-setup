/*
 * Copyright (c) 2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.platform.utilitiesspastore.process.email.context;

import de.hybris.platform.acceleratorservices.model.cms2.pages.EmailPageModel;
import de.hybris.platform.acceleratorservices.process.email.context.AbstractEmailContext;
import de.hybris.platform.basecommerce.model.site.BaseSiteModel;
import de.hybris.platform.commercefacades.order.data.OrderData;
import de.hybris.platform.core.model.c2l.LanguageModel;
import de.hybris.platform.core.model.order.OrderModel;
import de.hybris.platform.core.model.user.CustomerModel;
import de.hybris.platform.orderprocessing.model.OrderProcessModel;
import de.hybris.platform.servicelayer.dto.converter.Converter;

import org.springframework.beans.factory.annotation.Required;


/**
 * Velocity context for a order notification email.
 */
public class OrderNotificationEmailContext extends AbstractEmailContext<OrderProcessModel>
{
  private Converter<OrderModel, OrderData> orderConverter;
  private OrderData orderData;

  @Override
  public void init(final OrderProcessModel orderProcessModel, final EmailPageModel emailPageModel)
  {
    super.init(orderProcessModel, emailPageModel);
    orderData = getOrderConverter().convert(orderProcessModel.getOrder());
  }

  @Override
  protected BaseSiteModel getSite(final OrderProcessModel orderProcessModel)
  {
    return orderProcessModel.getOrder().getSite();
  }

  @Override
  protected CustomerModel getCustomer(final OrderProcessModel orderProcessModel)
  {
    return (CustomerModel) orderProcessModel.getOrder().getUser();
  }

  protected Converter<OrderModel, OrderData> getOrderConverter()
  {
    return orderConverter;
  }

  @Required
  public void setOrderConverter(final Converter<OrderModel, OrderData> orderConverter)
  {
    this.orderConverter = orderConverter;
  }

  public OrderData getOrder()
  {
    return orderData;
  }

  @Override
  protected LanguageModel getEmailLanguage(final OrderProcessModel orderProcessModel)
  {
    return orderProcessModel.getOrder().getLanguage();
  }

}
