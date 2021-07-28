/*
 * Copyright (c) 2019 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.platform.yb2bacceleratorstorefront.web.mvc;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.spy;
import static org.mockito.Mockito.verify;

import de.hybris.bootstrap.annotations.UnitTest;
import de.hybris.platform.acceleratorstorefrontcommons.constants.WebConstants;

import org.apache.commons.lang3.StringUtils;
import org.junit.Before;
import org.junit.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.web.util.UrlPathHelper;
import org.springframework.web.util.WebUtils;


@UnitTest
public class AcceleratorUrlPathHelperTest
{
	private static final String TEST_VALUE = "testValue";

	private MockHttpServletRequest request;

	@Before
	public void setUp()
	{
		request = new MockHttpServletRequest();
	}

	@Test
	public void testGetContextPath()
	{
		final AcceleratorUrlPathHelper pathHelper = new AcceleratorUrlPathHelper();
		request.setAttribute(WebConstants.URL_ENCODING_ATTRIBUTES, TEST_VALUE);
		request.setAttribute(WebUtils.INCLUDE_CONTEXT_PATH_ATTRIBUTE, TEST_VALUE);
		final String result = pathHelper.getContextPath(request);
		assertThat(result).isEmpty();
	}

	@Test
	public void testGetPathWithinServletMapping()
	{
		final AcceleratorUrlPathHelper pathHelper = new AcceleratorUrlPathHelper();
		request.setAttribute(WebUtils.INCLUDE_SERVLET_PATH_ATTRIBUTE, StringUtils.EMPTY);
		final String result = pathHelper.getPathWithinServletMapping(request);
		assertThat(result).isEqualTo("/");
	}

	@Test
	public void testGetPathWithinServletMappingFromParent()
	{
		final AcceleratorUrlPathHelper pathHelper = spy(new AcceleratorUrlPathHelper());
		request.setAttribute(WebUtils.INCLUDE_SERVLET_PATH_ATTRIBUTE, "/zork");
		final String result = pathHelper.getPathWithinServletMapping(request);
		assertThat(result).isEqualTo("/zork");
		verify(pathHelper).getPathWithinServletMapping(request);
	}

	@Test
	public void testSetAlwaysUseFullPath()
	{
		final AcceleratorUrlPathHelper pathHelper = spy(new AcceleratorUrlPathHelper());

		pathHelper.setAlwaysUseFullPath(true);

		assertThat(pathHelper).hasFieldOrPropertyWithValue("alwaysUseFullPath", true);
		verify((UrlPathHelper)pathHelper).setAlwaysUseFullPath(true);
	}

	@Test
	public void setGetLookupPathForRequestHonoursAlwaysUseFullPathSwitch()
	{
		final AcceleratorUrlPathHelper pathHelper = new AcceleratorUrlPathHelper();
		request.setRequestURI("/foobar/context-path");

		pathHelper.setAlwaysUseFullPath(true);
		final String path = pathHelper.getLookupPathForRequest(request);

		assertThat(path).isEqualTo("/foobar/context-path");
	}

	@Test
	public void setGetLookupPathForRequestReturnsPathWithinServletMapping()
	{
		final AcceleratorUrlPathHelper pathHelper = spy(new AcceleratorUrlPathHelper());
		request.setAttribute(WebUtils.INCLUDE_SERVLET_PATH_ATTRIBUTE, StringUtils.EMPTY);
		request.setRequestURI("/foobar/context-path");

		pathHelper.setAlwaysUseFullPath(false);
		final String path = pathHelper.getLookupPathForRequest(request);

		assertThat(path).isEqualTo("/");
	}

	@Test
	public void setGetLookupPathForRequestReturnsPathWithinApplication()
	{
		final AcceleratorUrlPathHelper pathHelper = spy(new AcceleratorUrlPathHelper());
		request.setAttribute(WebUtils.INCLUDE_SERVLET_PATH_ATTRIBUTE, "/zork");
		request.setRequestURI("/foobar/context-path");
		doReturn("").when(pathHelper).getPathWithinServletMapping(request);

		pathHelper.setAlwaysUseFullPath(false);
		final String path = pathHelper.getLookupPathForRequest(request);

		assertThat(path).isEqualTo("/foobar/context-path");
	}
}
