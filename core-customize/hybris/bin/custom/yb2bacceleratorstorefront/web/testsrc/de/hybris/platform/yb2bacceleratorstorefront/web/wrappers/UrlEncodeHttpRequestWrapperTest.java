/*
 * Copyright (c) 2019 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.platform.yb2bacceleratorstorefront.web.wrappers;

import de.hybris.bootstrap.annotations.UnitTest;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang.StringUtils;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.mockito.Mockito;


/**
 * Test class for {@link UrlEncodeHttpRequestWrapper}
 */
@UnitTest
public class UrlEncodeHttpRequestWrapperTest
{
	private static final String SLASH = "/";
	private static final String TEST_PATTERN = "test pattern";
	private static final String TEST_REQUEST_URI = "test request uri";
	private static final String TEST_CONTEXT_PATH = "test context path";
	private static final String TEST_SERVLET_PATH = "test servlet path";

	private HttpServletRequest request;
	private UrlEncodeHttpRequestWrapper urlWrapper;

	@Before
	public void setUp()
	{
		request = Mockito.mock(HttpServletRequest.class);
		Mockito.doReturn(TEST_CONTEXT_PATH).when(request).getContextPath();
		urlWrapper = new UrlEncodeHttpRequestWrapper(request, TEST_PATTERN);
	}

	@Test
	public void getContextPathTest()
	{
		Assert.assertEquals(TEST_CONTEXT_PATH + SLASH + TEST_PATTERN, urlWrapper.getContextPath());
	}

	@Test
	public void getRequestURITest()
	{
		mockAndTestRequestURI(TEST_REQUEST_URI);
		mockAndTestRequestURI(TEST_CONTEXT_PATH + TEST_REQUEST_URI);
		mockAndTestRequestURI(TEST_CONTEXT_PATH + SLASH + TEST_PATTERN + TEST_REQUEST_URI);
	}

	@Test
	public void getServletPathTest()
	{
		mockAndTestServletPath(SLASH, StringUtils.EMPTY);
		mockAndTestServletPath(SLASH + TEST_PATTERN, StringUtils.EMPTY);
		mockAndTestServletPath(SLASH + TEST_PATTERN + SLASH, StringUtils.EMPTY);
		mockAndTestServletPath(TEST_SERVLET_PATH + SLASH + TEST_PATTERN + SLASH, TEST_SERVLET_PATH + SLASH);
		mockAndTestServletPath(TEST_SERVLET_PATH, TEST_SERVLET_PATH);
	}

	@Test
	public void urlPatternCheckerTest()
	{
		boolean result = urlWrapper.urlPatternChecker(TEST_CONTEXT_PATH, TEST_PATTERN);
		Assert.assertEquals(false, result);

		result = urlWrapper.urlPatternChecker(TEST_PATTERN + TEST_CONTEXT_PATH, TEST_PATTERN);
		Assert.assertEquals(false, result);

		result = urlWrapper.urlPatternChecker(TEST_CONTEXT_PATH + SLASH + TEST_PATTERN, TEST_PATTERN);
		Assert.assertEquals(true, result);

		result = urlWrapper.urlPatternChecker(TEST_CONTEXT_PATH + SLASH + TEST_PATTERN + SLASH, TEST_PATTERN);
		Assert.assertEquals(true, result);
	}

	protected void mockAndTestRequestURI(final String mockedRequestResponse)
	{
		Mockito.doReturn(mockedRequestResponse).when(request).getRequestURI();
		final String result = urlWrapper.getRequestURI();
		Assert.assertEquals(TEST_CONTEXT_PATH + SLASH + TEST_PATTERN + TEST_REQUEST_URI, result);
	}

	protected void mockAndTestServletPath(final String mockedRequestServletPath, final String expecterWrapperResponse)
	{
		Mockito.doReturn(mockedRequestServletPath).when(request).getServletPath();
		final String result = urlWrapper.getServletPath();
		Assert.assertEquals(expecterWrapperResponse, result);
	}
}
