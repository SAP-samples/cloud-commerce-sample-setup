/*
 * Copyright (c) 2019 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.platform.yb2bacceleratorstorefront.security.impl;

import de.hybris.bootstrap.annotations.UnitTest;
import de.hybris.platform.testframework.HybrisJUnit4Test;
import de.hybris.platform.util.Config;
import de.hybris.platform.yb2bacceleratorstorefront.security.CsrfProtectionMatcher;

import java.util.ArrayList;
import java.util.List;

import org.fest.assertions.Assertions;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.web.bind.annotation.RequestMethod;


/**
 * Unit Test for {@link CsrfProtectionMatcher}
 */
@UnitTest
public class CsrfProtectionMatcherTest extends HybrisJUnit4Test
{
	private static final String CSRF_PROTECTION_EXCLUDE_URLS = "csrf.allowed.url.patterns";
	private CsrfProtectionMatcher csrfProtectionMatcher;
	private MockHttpServletRequest request;
	private String excludeUrlListBackup;

	@Before
	public void setUp()
	{
		excludeUrlListBackup = Config.getParameter(CSRF_PROTECTION_EXCLUDE_URLS);
		Config.setParameter(CSRF_PROTECTION_EXCLUDE_URLS, "^(/[^/?]+)*(/excludeMeOne)$");

		csrfProtectionMatcher = new CsrfProtectionMatcher();
		final List<String> excludeUrlList = new ArrayList<String>();
		excludeUrlList.add("^(/[^/?]+)*(/excludeMeTwo)$");
		csrfProtectionMatcher.setCsrfAllowedUrlPatterns(excludeUrlList);

		request = new MockHttpServletRequest();
	}

	@After
	public void cleanUp()
	{
		Config.setParameter(CSRF_PROTECTION_EXCLUDE_URLS, excludeUrlListBackup);
	}

	@Test
	public void shouldGetMethodReturnFalse()
	{
		request.setMethod(RequestMethod.GET.toString());
		Assertions.assertThat(csrfProtectionMatcher.matches(request)).isFalse();
	}

	@Test
	public void shouldHeadMethodReturnFalse()
	{
		request.setMethod(RequestMethod.HEAD.toString());
		Assertions.assertThat(csrfProtectionMatcher.matches(request)).isFalse();
	}

	@Test
	public void shouldOptionsMethodReturnFalse()
	{
		request.setMethod(RequestMethod.OPTIONS.toString());
		Assertions.assertThat(csrfProtectionMatcher.matches(request)).isFalse();
	}

	@Test
	public void shouldTraceMethodReturnFalse()
	{
		request.setMethod(RequestMethod.TRACE.toString());
		Assertions.assertThat(csrfProtectionMatcher.matches(request)).isFalse();
	}

	@Test
	public void shouldPutMethodReturnFalse()
	{
		request.setMethod(RequestMethod.PUT.toString());
		Assertions.assertThat(csrfProtectionMatcher.matches(request)).isFalse();
	}

	@Test
	public void shouldDeleteMethodReturnFalse()
	{
		request.setMethod(RequestMethod.DELETE.toString());
		Assertions.assertThat(csrfProtectionMatcher.matches(request)).isFalse();
	}

	@Test
	public void shouldPostMethodReturnTrue()
	{
		request.setMethod(RequestMethod.POST.toString());
		Assertions.assertThat(csrfProtectionMatcher.matches(request)).isTrue();
	}

	@Test
	public void shouldPostMethodExcludeURLOneReturnFalse()
	{
		request.setMethod(RequestMethod.POST.toString());
		request.setServletPath("/anyUrlPattern/excludeMeOne");
		Assertions.assertThat(csrfProtectionMatcher.matches(request)).isFalse();
		request.setServletPath("/anyUrlPattern/anotherPattern");
		Assertions.assertThat(csrfProtectionMatcher.matches(request)).isTrue();
	}

	@Test
	public void shouldPostMethodExcludeURLTwoReturnFalse()
	{
		request.setMethod(RequestMethod.POST.toString());
		request.setServletPath("/anyUrlPattern/excludeMeTwo");
		Assertions.assertThat(csrfProtectionMatcher.matches(request)).isFalse();
		request.setServletPath("/anyUrlPattern/anotherPattern");
		Assertions.assertThat(csrfProtectionMatcher.matches(request)).isTrue();
	}
}
