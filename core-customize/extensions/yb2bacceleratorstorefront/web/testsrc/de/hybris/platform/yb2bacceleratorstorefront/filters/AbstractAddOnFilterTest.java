/*
 * Copyright (c) 2019 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.platform.yb2bacceleratorstorefront.filters;

import de.hybris.platform.servicelayer.config.ConfigurationService;
import de.hybris.platform.yb2bacceleratorstorefront.filters.AcceleratorAddOnFilter.ExtensionAccessor;

import java.io.File;
import java.io.IOException;

import javax.servlet.FilterChain;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.FileUtils;
import org.apache.log4j.Logger;
import org.junit.After;
import org.junit.Assert;
import org.junit.Before;
import org.mockito.Answers;
import org.mockito.BDDMockito;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.mockito.Spy;


public abstract class AbstractAddOnFilterTest
{
	private static final Logger LOG = Logger.getLogger(AbstractAddOnFilterTest.class);

	protected static final String STOREFRONT_NAME = "yb2bacceleratorstorefront";
	protected static final String ADDONTWO_NAME = "addontwo";
	protected static final String UI_FOLDER = "/web/webroot/_ui";
	protected static final String WEB_INF_FOLDER = "/webroot/WEB-INF";
	protected final File rootSandboxDir = new File(System.getProperty("java.io.tmpdir"), "sandbox");
	protected File webTargetResource;
	protected File addOnSourceResource;
	protected File webExtensionPhysicalPath;

	@Mock(answer = Answers.RETURNS_DEEP_STUBS)
	protected HttpServletRequest request;
	@Mock
	protected HttpServletResponse response;
	@Mock
	protected FilterChain filterChain;
	@Mock(answer = Answers.RETURNS_DEEP_STUBS)
	protected ExtensionAccessor extensionAccessor;
	@Mock(answer = Answers.RETURNS_DEEP_STUBS)
	protected ConfigurationService configurationService;
	@Spy
	@InjectMocks
	protected final AcceleratorAddOnFilter filter = new AcceleratorAddOnFilter();

	@Before
	public void prepare() throws IOException
	{
		//log("Starting ...");
		MockitoAnnotations.initMocks(this);

		webTargetResource = createWebTargetDir();
		addOnSourceResource = new File(rootSandboxDir, ADDONTWO_NAME + "/acceleratoraddon" + getFolder());

		FileUtils.forceMkdir(webTargetResource);
		FileUtils.forceMkdir(addOnSourceResource);

		LOG.info("Created sandbox dirs");

		setAddOnFilterActive(true);

		final File addOnExtensionPhysicalPath = new File(rootSandboxDir, ADDONTWO_NAME);
		webExtensionPhysicalPath = createWebCtxPhysicalPath();

		Mockito.doReturn(webExtensionPhysicalPath).when(extensionAccessor).getExtensionDir(STOREFRONT_NAME);
		Mockito.doReturn(addOnExtensionPhysicalPath).when(extensionAccessor).getExtensionDir(ADDONTWO_NAME);
		Mockito.doReturn("/addons/").when(request).getAttribute("javax.servlet.include.servlet_path");
	}

	protected File createWebCtxPhysicalPath()
	{
		return new File(rootSandboxDir, STOREFRONT_NAME);
	}


	protected File createWebTargetDir()
	{
		return new File(rootSandboxDir, STOREFRONT_NAME + "/web" + getFolder() + "/addons/" + ADDONTWO_NAME);
	}

	protected abstract String getFolder();


	@After
	public void doAfter()
	{
		try
		{
			clearUpStructure();
		}
		catch (final Exception e)
		{
			LOG.info("Failed to clear up temp add on structure " + e.getMessage());
		}

	}

	private void clearUpStructure() throws IOException, InterruptedException
	{
		if (rootSandboxDir.exists())
		{
			LOG.info("About to clear sandbox " + rootSandboxDir);
			FileUtils.forceDelete(rootSandboxDir);

			LOG.info("Sandbox exists - " + rootSandboxDir.exists());
		}
	}

	protected void waitASecond() throws InterruptedException
	{
		Thread.sleep(1000);
	}

	protected void createResource(final File rootDir, final String relativePath, final String fileName) throws IOException
	{
		createResourceWithContent(rootDir, relativePath, fileName, "test");
	}

	protected void createResourceWithContent(final File rootDir, final String relativePath, final String fileName,
			final String content) throws IOException
	{
		final File dir = new File(rootDir, relativePath);
		FileUtils.forceMkdir(dir);

		FileUtils.write(new File(dir, fileName), content);
	}

	protected void verifyFileNotCreated(final File rootDir, final String relativePath) throws IOException
	{
		final File dir = new File(rootDir, relativePath);
		Assert.assertFalse("File " + dir + " should not exists", dir.exists());
	}


	protected void verifyFileCreatedWithContent(final File rootDir, final String relativePath, final String fileName,
			final String content) throws IOException
	{
		final File dir = new File(rootDir, relativePath);
		Assert.assertTrue("Directory " + dir + " should exists", dir.exists());

		Assert.assertEquals(content, FileUtils.readFileToString(new File(dir, fileName)));
	}

	protected void verifyFileCreated(final File rootDir, final String relativePath, final String fileName) throws IOException
	{
		verifyFileCreatedWithContent(rootDir, relativePath, fileName, "test");
	}


	protected void setAddOnFilterActive(final boolean active)
	{
		BDDMockito.given(
				Boolean.valueOf(configurationService.getConfiguration().getBoolean(
						AcceleratorAddOnFilter.ADDON_FILTER_ACTIVE_PROPERTY, false))).willReturn(Boolean.valueOf(active));
	}

	protected abstract void prepareRequest(final String remotePath);


	protected void prepareLocalContextPathRequest(final String remotePath)
	{

		Mockito.doReturn(remotePath).when(request).getRequestURI();
	}
}
