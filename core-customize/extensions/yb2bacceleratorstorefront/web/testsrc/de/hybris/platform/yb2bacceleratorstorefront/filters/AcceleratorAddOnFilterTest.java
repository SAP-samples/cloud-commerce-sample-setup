/*
 * Copyright (c) 2019 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.platform.yb2bacceleratorstorefront.filters;

import de.hybris.bootstrap.annotations.UnitTest;
import de.hybris.platform.servicelayer.config.ConfigurationService;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.junit.Before;
import org.junit.Test;
import org.mockito.Answers;
import org.mockito.BDDMockito;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.mockito.Spy;

@UnitTest
public class AcceleratorAddOnFilterTest
{
	private static final String ADDONTWO = "addontwo";
	private static final String STOREFRONT_NAME = "yb2bacceleratorstorefront";

	@Mock(answer = Answers.RETURNS_DEEP_STUBS)
	private HttpServletRequest request;
	@Mock
	private HttpServletResponse response;
	@Mock
	private FilterChain filterChain;
	@Mock
	private AcceleratorAddOnFilter.ExtensionAccessor extensionAccessor;
	@Mock(answer = Answers.RETURNS_DEEP_STUBS)
	private ConfigurationService configurationService;
	@Spy
	@InjectMocks
	private final AcceleratorAddOnFilter filter = new AcceleratorAddOnFilter();

	@Before
	public void prepare() throws FileNotFoundException
	{
		MockitoAnnotations.initMocks(this);
		Mockito.doReturn("/addons/").when(request).getAttribute("javax.servlet.include.servlet_path");
	}

	private void setAddOnFilterActive(final boolean active)
	{
		BDDMockito.given(
				Boolean.valueOf(configurationService.getConfiguration().getBoolean(
						AcceleratorAddOnFilter.ADDON_FILTER_ACTIVE_PROPERTY, false))).willReturn(Boolean.valueOf(active));
	}


	@Test
	public void testPlainResource() throws ServletException, IOException
	{
		setAddOnFilterActive(true);

		final File addOnRootDir = Mockito.mock(File.class);
		BDDMockito.given(addOnRootDir.getAbsolutePath()).willReturn("/some/otherdir/" + ADDONTWO);

		Mockito.doReturn(addOnRootDir).when(extensionAccessor).getExtensionDir(ADDONTWO);

		final String remotePath = "/some/dir/" + STOREFRONT_NAME + "/web/webroot/_ui/addons/" + ADDONTWO
				+ "/some/special/resource.txt";

		Mockito.doReturn(remotePath).when(request).getRequestURI();
		Mockito.doReturn(remotePath).when(filter).getFullPathNameFromRequest(request);

		filter.doFilter(request, response, filterChain);
		Mockito.verify(filter).copyFileInternalIfNeeded(
				"/some/otherdir/" + ADDONTWO + "/acceleratoraddon/web/webroot/_ui/some/special/resource.txt", remotePath);
	}


	@Test
	public void testTagResource() throws ServletException, IOException
	{
		setAddOnFilterActive(true);

		final File addOnRootDir = Mockito.mock(File.class);
		BDDMockito.given(addOnRootDir.getAbsolutePath()).willReturn("/some/otherdir/" + ADDONTWO);
		Mockito.doReturn(addOnRootDir).when(extensionAccessor).getExtensionDir(ADDONTWO);

		final String remotePath = "/some/dir/" + STOREFRONT_NAME + "/tags/addons/" + ADDONTWO + "/some/special/resource.tag";
		Mockito.doReturn(remotePath).when(request).getRequestURI();

		Mockito.doReturn(remotePath).when(filter).getFullPathNameFromRequest(request);
		Mockito.doReturn("/some/dir/" + STOREFRONT_NAME + "/web/webroot/").when(filter)
				.getAppContextFullPathNameFromRequest(request);

		filter.doFilter(request, response, filterChain);
		Mockito.verify(filter).copyFileInternalIfNeeded(
				"/some/otherdir/" + ADDONTWO + "/acceleratoraddon/web/webroot/WEB-INF/tags/some/special/resource.tag", //
				"/some/dir/" + STOREFRONT_NAME + "/web/webroot/WEB-INF/tags/addons/" + ADDONTWO + "/some/special/resource.tag");
	}
}
