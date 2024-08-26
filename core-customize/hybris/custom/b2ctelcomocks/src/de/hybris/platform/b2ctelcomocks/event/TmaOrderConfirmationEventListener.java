/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company.  All rights reserved.
 */

package de.hybris.platform.b2ctelcomocks.event;

import de.hybris.platform.b2ctelcoservices.model.*;
import de.hybris.platform.core.model.order.AbstractOrderEntryModel;
import de.hybris.platform.core.model.order.OrderModel;
import de.hybris.platform.core.model.user.UserModel;
import de.hybris.platform.orderprocessing.events.OrderPlacedEvent;
import de.hybris.platform.servicelayer.internal.dao.DefaultGenericDao;
import de.hybris.platform.servicelayer.keygenerator.KeyGenerator;
import de.hybris.platform.subscribedproductservices.services.TuaProductService;
import de.hybris.platform.subscriptionservices.enums.TermOfServiceFrequency;
import de.hybris.platform.subscriptionservices.model.SubscriptionTermModel;
import de.hybris.platform.tuadatamodel.enums.TuaPriceType;
import de.hybris.platform.tuadatamodel.enums.TuaProductStatusType;
import de.hybris.platform.tuadatamodel.model.*;
import de.hybris.platform.yacceleratorcore.event.OrderConfirmationEventListener;

import java.util.*;

import org.apache.commons.lang.StringUtils;
import org.springframework.util.CollectionUtils;
import org.springframework.util.ObjectUtils;


/**
 * Event listener for updating the subscribed products for a customer based on the order.
 *
 * @since 2302
 */
public class TmaOrderConfirmationEventListener extends OrderConfirmationEventListener
{
	private static final String CUSTOMER = "Customer";
	public static final String RECURRING = "RECURRING";
	public static final String USAGE = "USAGE";

	private KeyGenerator keyGenerator;
	private Map<String, String> priceTypesMap;
	private TuaProductService tuaProductService;

	private DefaultGenericDao<TmaNormalizedTermOfServiceFrequencyModel> termsOfServiceDao;

	public TmaOrderConfirmationEventListener(final KeyGenerator keyGenerator,
		final	Map<String, String> priceTypesMap, final TuaProductService tuaProductService,
			final DefaultGenericDao<TmaNormalizedTermOfServiceFrequencyModel> termsOfServiceDao)
	{
		this.keyGenerator = keyGenerator;
		this.priceTypesMap = priceTypesMap;
		this.tuaProductService = tuaProductService;
		this.termsOfServiceDao = termsOfServiceDao;
	}

	@Override
	protected void onEvent(final OrderPlacedEvent event)
	{
		super.onEvent(event);

		updateProducts(event.getProcess().getOrder());
	}

	private void updateProducts(final OrderModel orderModel)
	{
		final UserModel user = orderModel.getUser();

		if (ObjectUtils.isEmpty(user) || ObjectUtils.isEmpty(user.getTuaParty()) || CollectionUtils
				.isEmpty(orderModel.getEntries()))
		{
			return;
		}

		final TuaPartyRoleModel tuaPartyRole = createPartyRole(user);

		for (final AbstractOrderEntryModel orderEntry : orderModel.getEntries())
		{
			if (orderEntry.getSubscriptionInfo() != null && orderEntry.getSubscriptionInfo().getProductValue() != null)
			{
				removeOldSubscriptionIfAny(orderEntry);

				final TuaProductModel tuaProduct = orderEntry.getSubscriptionInfo().getProductValue();
				tuaProduct.setPartyRoles(Collections.singleton(tuaPartyRole));
				tuaProduct.setIsCustomerVisible(true);
				tuaProduct.setStatus(TuaProductStatusType.ACTIVE);
				tuaProduct.setProductPrices(Collections.singleton(createProductPricesFromEntryPrice(orderEntry.getPrice())));
				tuaProduct.setStartDate(new Date());
				tuaProduct.setTerminationDate(
						getSubscriptionEndDate(orderEntry.getSubscriptionInfo().getSubscriptionTerm(), new Date()));

				getModelService().save(tuaProduct);
			}
		}
	}

	private TuaPartyRoleModel createPartyRole(final UserModel user)
	{
		final TuaPartyRoleModel tuaPartyRole = getModelService().create(TuaPartyRoleModel.class);
		tuaPartyRole.setRole(CUSTOMER);
		tuaPartyRole.setParty(user.getTuaParty());
		getModelService().save(tuaPartyRole);

		return tuaPartyRole;
	}

	private void removeOldSubscriptionIfAny(final AbstractOrderEntryModel orderEntry)
	{
		if (StringUtils.isNotEmpty(orderEntry.getSubscriptionInfo().getSubscribedProductId()))
		{
			getModelService().remove(
					getTuaProductService().getProduct(orderEntry.getSubscriptionInfo().getSubscribedProductId()));
		}
	}

	private TuaProductPriceModel createProductPricesFromEntryPrice(final TmaAbstractOrderPriceModel entryPrice)
	{
		if (entryPrice instanceof TmaAbstractOrderCompositePriceModel)
		{
			final TmaAbstractOrderCompositePriceModel entryCompositePrice = (TmaAbstractOrderCompositePriceModel) entryPrice;

			final TuaCompositeProdPriceModel newCompositeProdPrice = new TuaCompositeProdPriceModel();
			newCompositeProdPrice.setId((String) getKeyGenerator().generate());

			final Set<TuaProductPriceModel> childList = new HashSet<>();

			for (TmaAbstractOrderPriceModel childPrice : entryCompositePrice.getChildPrices())
			{
				childList.add(createProductPricesFromEntryPrice(childPrice));
			}

			newCompositeProdPrice.setChildPrices(childList);

			return newCompositeProdPrice;
		}
		else
		{
			if (entryPrice instanceof TmaAbstractOrderComponentPriceModel)
			{
				return createComponentPricesFromEntryPrice(entryPrice);
			}
		}

		return null;
	}

	private TuaProductPriceModel createComponentPricesFromEntryPrice(final TmaAbstractOrderPriceModel entryPrice)
	{
		final TuaProdPriceChargeModel componentProdPrice = new TuaProdPriceChargeModel();
		componentProdPrice.setId((String) getKeyGenerator().generate());
		componentProdPrice.setCurrency(((TmaAbstractOrderComponentPriceModel) entryPrice).getCurrency());
		componentProdPrice.setTaxIncludedAmount(((TmaAbstractOrderComponentPriceModel) entryPrice).getTaxIncludedAmount());
		componentProdPrice.setDutyFreeAmount(((TmaAbstractOrderComponentPriceModel) entryPrice).getDutyFreeAmount());

		if (getPriceTypesMap().containsKey(entryPrice.getItemtype()))
		{
			componentProdPrice.setPriceType(TuaPriceType.valueOf(getPriceTypesMap().get(entryPrice.getItemtype())));

			if (getPriceTypesMap().get(entryPrice.getItemtype()).equals(RECURRING))
			{
				componentProdPrice.setRecurringChargePeriod(
						String.format("%d-%d", ((TmaAbstractOrderRecurringChargePriceModel) entryPrice).getCycleStart(),
								((TmaAbstractOrderRecurringChargePriceModel) entryPrice).getCycleEnd()));
			}
			else
			{
				if (getPriceTypesMap().get(entryPrice.getItemtype()).equals(USAGE))
				{
					componentProdPrice.setUnitOfMeasure(((TmaAbstractOrderUsageChargePriceModel) entryPrice).getUsageUnit().getId());
				}
			}
		}

		return componentProdPrice;
	}

	private Date getSubscriptionEndDate(final SubscriptionTermModel subscriptionTerm, final Date startDate)
	{
		final TermOfServiceFrequency frequency = subscriptionTerm.getTermOfServiceFrequency();
		final Integer contractDuration = getContractDuration(subscriptionTerm);
		final String frequencyCode = frequency == null ? null : frequency.getCode();
		return getSubscriptionEndDate(frequencyCode, contractDuration, startDate);
	}

	private Integer getContractDuration(final SubscriptionTermModel subscriptionTerm)
	{
		Integer contractDuration = subscriptionTerm.getTermOfServiceNumber();
		// if no contract duration is provided as terms of service fallback to 1
		return contractDuration == null ? 1 : contractDuration;
	}

	public Date getSubscriptionEndDate(final String frequencyCode, final Integer duration, final Date startDate)
	{
		final TermOfServiceFrequency frequency = getTermOfServiceFrequency(frequencyCode);
		final Integer normalizedDuration = getTimeNormalizationFactor(frequency) * duration;

		final Calendar cal = Calendar.getInstance();
		cal.setTime(startDate);
		cal.add(Calendar.MONTH, normalizedDuration);
		return cal.getTime();
	}

	private TermOfServiceFrequency getTermOfServiceFrequency(final String frequencyCode)
	{
		return Arrays.stream(TermOfServiceFrequency.values())
				.filter(frequency -> frequency.getCode().equalsIgnoreCase(frequencyCode)).findFirst()
				.orElse(TermOfServiceFrequency.MONTHLY);
	}

	private Integer getTimeNormalizationFactor(final TermOfServiceFrequency frequency)
	{
		final Map<String, Object> params = new HashMap<>();
		params.put(TmaNormalizedTermOfServiceFrequencyModel.SOURCE, TermOfServiceFrequency.MONTHLY);
		params.put(TmaNormalizedTermOfServiceFrequencyModel.TARGET, frequency);

		final List<TmaNormalizedTermOfServiceFrequencyModel> normalizedFrequency = getTermsOfServiceDao().find(params);

		return normalizedFrequency == null || normalizedFrequency.isEmpty() ? Integer.valueOf(1)
				: normalizedFrequency.get(0).getNormalizationFactor();
	}

	protected Map<String, String> getPriceTypesMap()
	{
		return priceTypesMap;
	}

	protected KeyGenerator getKeyGenerator()
	{
		return keyGenerator;
	}

	protected TuaProductService getTuaProductService()
	{
		return tuaProductService;
	}

	protected DefaultGenericDao<TmaNormalizedTermOfServiceFrequencyModel> getTermsOfServiceDao()
	{
		return termsOfServiceDao;
	}
}
