/*
 * Copyright (c) 2020 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.platform.b2ctelcomocks.jaxb;

import de.hybris.bootstrap.annotations.IntegrationTest;
import de.hybris.platform.servicelayer.ServicelayerTest;
import de.hybris.platform.webservicescommons.testsupport.client.WebservicesAssert;
import de.hybris.platform.webservicescommons.testsupport.client.WsSecuredRequestBuilder;
import de.hybris.platform.webservicescommons.testsupport.server.NeedsEmbeddedServer;

import java.io.File;
import java.io.IOException;

import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.client.Entity;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import org.apache.commons.io.FileUtils;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import org.springframework.util.Assert;

import de.hybris.platform.b2ctelcomocks.constants.B2ctelcomocksConstants;


@IntegrationTest
@NeedsEmbeddedServer(webExtensions =
{ B2ctelcomocksConstants.EXTENSIONNAME, "oauth2" })
public class XMLExternalEntityExpansionTest extends ServicelayerTest
{
	public static final String OAUTH_CLIENT_ID = "mobile_android";
	public static final String OAUTH_CLIENT_PASS = "secret";

	private static File xxeFile;
	private WsSecuredRequestBuilder wsSecuredRequestBuilder;

	@BeforeClass
	public static void beforeTests() throws IOException
	{
		xxeFile = File.createTempFile("xxeTests", "txt");
		xxeFile.deleteOnExit();
		FileUtils.write(xxeFile, "xxeAttackSuccessful");
	}

	@Before
	public void setUp() throws Exception
	{
		wsSecuredRequestBuilder = new WsSecuredRequestBuilder()//
				.extensionName(B2ctelcomocksConstants.EXTENSIONNAME)//
				.client(OAUTH_CLIENT_ID, OAUTH_CLIENT_PASS);

		createCoreData();
		importCsv("/b2ctelcomocks/test/democustomer-data.impex", "utf-8");
	}

	@Test
	public void testXXEAttackProtection() throws IOException
	{
		final Response response = wsSecuredRequestBuilder.grantClientCredentials().path("/sample/dto").build()
				.accept(MediaType.APPLICATION_XML).post(Entity.xml("<!DOCTYPE user[<!ENTITY xxe SYSTEM \"" + xxeFile.getAbsolutePath()
						+ "\" >]><sampleWSDTO><value>value &xxe;</value></sampleWSDTO>"));

		if (response.getStatus() == HttpServletResponse.SC_CREATED)
		{
			final String wsdto = response.readEntity(String.class);
			Assert.doesNotContain(wsdto, "xxeAttackSuccessful");
		}
		else
		{
			WebservicesAssert.assertResponse(Status.BAD_REQUEST, response);
		}

	}

	@Test
	public void testDTDDisabledByDefault() throws IOException
	{
		final Response response = wsSecuredRequestBuilder.grantClientCredentials().path("/sample/dto").build()
				.accept(MediaType.APPLICATION_XML).post(Entity.xml("<!DOCTYPE sampleWSDTO SYSTEM \"notExisting.dtd\"><sampleWSDTO><value>value</value></sampleWSDTO>"));

		WebservicesAssert.assertResponse(Status.CREATED, response);

	}

}
