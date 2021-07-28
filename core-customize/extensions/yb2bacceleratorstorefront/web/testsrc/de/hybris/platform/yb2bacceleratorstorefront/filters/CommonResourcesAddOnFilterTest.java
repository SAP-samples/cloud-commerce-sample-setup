/*
 * Copyright (c) 2019 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.platform.yb2bacceleratorstorefront.filters;

import de.hybris.bootstrap.annotations.UnitTest;

import java.io.File;
import java.io.IOException;

import javax.servlet.ServletException;

import org.apache.commons.io.FilenameUtils;
import org.junit.Test;
import org.mockito.Mockito;


@UnitTest
public class CommonResourcesAddOnFilterTest extends AbstractAddOnFilterTest
{
	@Test
	public void testResourceForNotExistingTarget() throws ServletException, IOException
	{
		//create specific resource
		createResource(addOnSourceResource, "/", "c.txt");
		prepareRequest("c.txt");
		prepareLocalContextPathRequest(STOREFRONT_NAME + "/_ui/addons/" + ADDONTWO_NAME + "/c.txt");
		filter.doFilter(request, response, filterChain);
		verifyFileCreated(webTargetResource,"/", "c.txt");
	}

	@Test
	public void testResourceForNotExistingTargetInSubFolder() throws ServletException, IOException
	{
		//create specific resource
		createResource(addOnSourceResource, "/a/b/c", "c.txt");
		prepareRequest("/a/b/c/c.txt");
		prepareLocalContextPathRequest(STOREFRONT_NAME + "/_ui/addons/" + ADDONTWO_NAME + "/a/b/c/c.txt");
		filter.doFilter(request, response, filterChain);
		verifyFileCreated(webTargetResource, "/a/b/c", "c.txt");
	}


	@Test
	public void testResourceForUpdateExistingTarget() throws ServletException, IOException, InterruptedException
	{
		//assume resource exists 
		createResource(webTargetResource, "/", "c.txt");
		waitASecond();
		//updating locally  
		createResourceWithContent(addOnSourceResource, "/", "c.txt", "changed here");
		prepareRequest("c.txt");
		prepareLocalContextPathRequest(STOREFRONT_NAME + "/_ui/addons/" + ADDONTWO_NAME + "/c.txt");
		filter.doFilter(request, response, filterChain);
		verifyFileCreatedWithContent(webTargetResource, "/", "c.txt", "changed here");
	}


	@Test
	public void testResourceForUpdateExistingTargetInSubFolder() throws ServletException, IOException, InterruptedException
	{
		//assume resource exists 
		createResource(webTargetResource, "/a/b/c", "c.txt");
		waitASecond();
		//updating locally  
		createResourceWithContent(addOnSourceResource, "/a/b/c", "c.txt", "changed here");
		prepareRequest("/a/b/c/c.txt");
		prepareLocalContextPathRequest(STOREFRONT_NAME + "/_ui/addons/" + ADDONTWO_NAME + "/a/b/c/c.txt");
		filter.doFilter(request, response, filterChain);
		verifyFileCreatedWithContent(webTargetResource, "/a/b/c", "c.txt", "changed here");
	}


	@Override
	protected String getFolder()
	{
		return UI_FOLDER;
	}


	@Override
	protected void prepareRequest(final String remotePath)
	{
		final String normalized = FilenameUtils.normalize(new File(webTargetResource, remotePath).getPath(), true);
		Mockito.doReturn(normalized).when(filter).getFullPathNameFromRequest(request);
	}

}
