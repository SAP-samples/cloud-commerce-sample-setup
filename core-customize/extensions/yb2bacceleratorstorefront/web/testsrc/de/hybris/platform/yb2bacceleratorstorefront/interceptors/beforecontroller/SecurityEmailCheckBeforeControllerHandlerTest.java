/*
 * Copyright (c) 2019 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.platform.yb2bacceleratorstorefront.interceptors.beforecontroller;

import static org.mockito.Mockito.when;

import de.hybris.bootstrap.annotations.UnitTest;
import de.hybris.platform.acceleratorcms.data.CmsPageRequestContextData;
import de.hybris.platform.acceleratorcms.services.CMSPageContextService;
import de.hybris.platform.cms2.model.preview.PreviewDataModel;
import de.hybris.platform.yb2bacceleratorstorefront.controllers.cms.EmailPageController;

import java.io.IOException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.ModelAndView;


@RunWith(MockitoJUnitRunner.class)
@UnitTest
public class SecurityEmailCheckBeforeControllerHandlerTest
{
	@Mock
	private HttpServletRequest request;

	@Mock
	private HttpServletResponse response;

	@Mock
	private HandlerMethod handlerMethod;

	@Mock
	private CmsPageRequestContextData cmsPageRequestContextData;

	@Mock
	private CMSPageContextService cmsPageContextService;

	@InjectMocks
	private SecurityEmailCheckBeforeControllerHandler securityEmailCheckBeforeControllerHandler;

	@Test
	public void shouldPassthroughWhenInPreviewMode() throws IOException
	{
		setValidPreviewMode(true);
		Assert.assertTrue(securityEmailCheckBeforeControllerHandler.beforeController(request, response, handlerMethod));
	}

	@Test
	public void shouldPassthroughWhenNotInPreviewModeButNotAnEmailPage() throws IOException, NoSuchMethodException
	{
		setValidPreviewMode(false);
		setAssignableFromEmailPage(false);
		Assert.assertTrue(securityEmailCheckBeforeControllerHandler.beforeController(request, response, handlerMethod));
	}

	@Test
	public void shouldBlockWhenNotInPreviewModeAndPageIsAnEmailPage() throws IOException, NoSuchMethodException
	{
		setValidPreviewMode(false);
		setAssignableFromEmailPage(true);
		Assert.assertFalse(securityEmailCheckBeforeControllerHandler.beforeController(request, response, handlerMethod));
	}

	private void setAssignableFromEmailPage(final boolean isAssignableFromEmailPage) throws NoSuchMethodException
	{
		if (isAssignableFromEmailPage)
		{
			when(handlerMethod.getMethod()).thenReturn(EmailPageController.class.getMethod("get", HttpServletRequest.class,
					HttpServletResponse.class, ModelAndView.class, String.class));
		}
		else
		{
			when(handlerMethod.getMethod()).thenReturn(this.getClass().getMethod("someMockMethod"));
		}
	}

	private void setValidPreviewMode(final boolean isValidPreviewMode)
	{
		if (isValidPreviewMode)
		{
			when(cmsPageContextService.getCmsPageRequestContextData(request)).thenReturn(cmsPageRequestContextData);
			when(cmsPageRequestContextData.getPreviewData()).thenReturn(new PreviewDataModel());
		}
		else
		{
			when(cmsPageContextService.getCmsPageRequestContextData(request)).thenReturn(cmsPageRequestContextData);
			when(cmsPageRequestContextData.getPreviewData()).thenReturn(null);
		}
	}

	// For mocking reflect Method
	public void someMockMethod()
	{
		return;
	}


}
