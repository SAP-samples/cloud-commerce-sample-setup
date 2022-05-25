/*
 * Copyright (c) 2022 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.platform.yb2bacceleratorstorefront.controllers.pages;

import de.hybris.bootstrap.annotations.UnitTest;
import de.hybris.platform.acceleratorstorefrontcommons.controllers.pages.AbstractSearchPageController;
import de.hybris.platform.acceleratorstorefrontcommons.controllers.util.GlobalMessage;
import de.hybris.platform.acceleratorstorefrontcommons.controllers.util.GlobalMessages;
import de.hybris.platform.cms2.exceptions.CMSItemNotFoundException;
import de.hybris.platform.commercefacades.order.QuoteFacade;
import de.hybris.platform.commerceservices.search.pagedata.PageableData;
import de.hybris.platform.servicelayer.exceptions.UnknownIdentifierException;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;
import org.springframework.ui.Model;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import org.springframework.web.servlet.mvc.support.RedirectAttributesModelMap;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;


@UnitTest
@RunWith(MockitoJUnitRunner.class)
public class MyQuotesControllerTest
{
	private static final String REDIRECT_TO_MY_ACCOUNT = "redirect:/my-account";

	@InjectMocks
	private final MyQuotesController myQuotesController = new MyQuotesController();

	@Mock
	private Model model;

	@Mock
	private QuoteFacade quoteFacade;

	@Test
	public void testExceptionThrownFromMyAccountMyQuotes() throws CMSItemNotFoundException
	{
		final RedirectAttributes redirectModel = new RedirectAttributesModelMap();
		when(quoteFacade.getPagedQuotes(any(PageableData.class))).thenThrow(UnknownIdentifierException.class);

		final String result = myQuotesController.quotes(1, AbstractSearchPageController.ShowMode.Page, "asc", model, redirectModel);
		assertThat(result).isEqualTo(REDIRECT_TO_MY_ACCOUNT);
		final boolean hasMessageInErrorHolder = containsMessage(redirectModel, GlobalMessages.ERROR_MESSAGES_HOLDER, "quote.list.error");
		assertThat(hasMessageInErrorHolder).overridingErrorMessage("Expecting GlobalMessages to contain 'quote.list.error' but it did not.").isTrue();
	}

	private boolean containsMessage(final RedirectAttributes model, final String messageHolder, final String messageKey)
	{
		final Map<String, ?> flashModelMap = model.getFlashAttributes();
		if (flashModelMap.containsKey(messageHolder))
		{
			final List<GlobalMessage> messages = new ArrayList<>((List<GlobalMessage>) flashModelMap.get(messageHolder));
			return messages.stream().anyMatch(GlobalMessage -> GlobalMessage.getCode().equals(messageKey));
		}
		else
		{
			return false;
		}
	}

}
