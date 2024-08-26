/*
 * Copyright (c) 2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.platform.mediaspastore.setup;

import de.hybris.platform.b2ctelcoservices.setup.CoreSystemSetup;
import de.hybris.platform.commerceservices.dataimport.impl.CoreDataImportService;
import de.hybris.platform.commerceservices.dataimport.impl.SampleDataImportService;
import de.hybris.platform.commerceservices.setup.AbstractSystemSetup;
import de.hybris.platform.commerceservices.setup.data.ImportData;
import de.hybris.platform.commerceservices.setup.events.CoreDataImportedEvent;
import de.hybris.platform.commerceservices.setup.events.SampleDataImportedEvent;
import de.hybris.platform.core.initialization.SystemSetup;
import de.hybris.platform.core.initialization.SystemSetupContext;
import de.hybris.platform.core.initialization.SystemSetupParameter;
import de.hybris.platform.core.initialization.SystemSetupParameterMethod;
import de.hybris.platform.mediaspastore.constants.MediaspastoreConstants;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Required;


/**
 * System setup of the Media SPA Store.
 *
 * @since 2102
 */
@SystemSetup(extension = MediaspastoreConstants.EXTENSIONNAME)
public class MediaspaStoreSystemSetup extends AbstractSystemSetup
{
	public static final String IMPORT_ACCESS_RIGHTS = "accessRights";
	private static final String MEDIASPA = "mediaspa";
	private static final List<String> CONTENT_CATALOG_NAMES = Collections.singletonList(MEDIASPA);
	private static final String IMPORT_CORE_DATA = "importCoreData";
	private static final String IMPORT_SAMPLE_DATA = "importSampleData";
	private static final String ACTIVATE_SOLR_CRON_JOBS = "activateSolrCronJobs";
	private static final String MEDIASPA_CONTENT_CATALOG = "mediaspaContentCatalog";
	private static final String CUSTOMER_INVENTORY_PATH = "/%s/import/sampledata/customerInventory/%s";

	private CoreDataImportService coreDataImportService;
	private SampleDataImportService sampleDataImportService;
	private CoreSystemSetup coreSystemSetup;

	@SystemSetupParameterMethod
	@Override
	public List<SystemSetupParameter> getInitializationOptions()
	{
		final List<SystemSetupParameter> params = new ArrayList<>();

		params.add(createBooleanSystemSetupParameter(IMPORT_CORE_DATA, "Import Core Data", true));
		params.add(createBooleanSystemSetupParameter(IMPORT_SAMPLE_DATA, "Import Sample Data", true));
		params.add(createBooleanSystemSetupParameter(ACTIVATE_SOLR_CRON_JOBS, "Activate Solr Cron Jobs", true));
		params.add(createBooleanSystemSetupParameter(IMPORT_ACCESS_RIGHTS, "Import Users & Groups", true));
		return params;
	}

	/**
	 * This method will be called during the system initialization.
	 *
	 * @param context
	 * 		the context provides the selected parameters and values
	 */
	@SystemSetup(type = SystemSetup.Type.PROJECT, process = SystemSetup.Process.ALL)
	public void createProjectData(final SystemSetupContext context)
	{
		final List<ImportData> importData = new ArrayList<>();

		final ImportData mediaImportData = new ImportData();
		mediaImportData.setProductCatalogName(MEDIASPA);
		mediaImportData.setContentCatalogNames(Arrays.asList(MEDIASPA));
		mediaImportData.setStoreNames(Arrays.asList(MEDIASPA));
		importData.add(mediaImportData);

		getSetupImpexService()
				.importImpexFile(String.format("/%s/import/sampledata/users/users.impex",
						MediaspastoreConstants.EXTENSIONNAME), false);

		getCoreDataImportService().execute(this, context, importData);
		getEventService().publishEvent(new CoreDataImportedEvent(context, importData));

		getSampleDataImportService().execute(this, context, importData);
		getEventService().publishEvent(new SampleDataImportedEvent(context, importData));

		final boolean importAccessRights = getBooleanSystemSetupParameter(context, IMPORT_ACCESS_RIGHTS);
		processCockpit(context, importAccessRights,
				String.format("/%s/import/sampledata/cockpits/productcockpit/productcockpit-users.impex",
						MediaspastoreConstants.EXTENSIONNAME));
		// sync the media content catalog again as sbg is using the media content catalog, too
		executeCatalogSyncJob(context, MEDIASPA_CONTENT_CATALOG);

		// as promotions are not catalog aware,
		// we must import them into the online catalog which is only possible after the synchronization
		// as some online products are required
		getSetupImpexService()
				.importImpexFile(String.format("/%s/import/sampledata/promotions/promotions-engine-configuration.impex",
						MediaspastoreConstants.EXTENSIONNAME), false);
		getSetupImpexService()
				.importImpexFile(String.format("/%s/import/sampledata/productCatalogs/%sProductCatalog/promotions.impex",
						MediaspastoreConstants.EXTENSIONNAME, MEDIASPA), false);

		getSetupImpexService().importImpexFile(
				String.format("/%s/import/sampledata/common/user-groups.impex", MediaspastoreConstants.EXTENSIONNAME), false);

		getSetupImpexService()
				.importImpexFile(String.format("/%s/import/sampledata/orders/orders.impex", MediaspastoreConstants.EXTENSIONNAME),
						false);
		getSetupImpexService().importImpexFile(
				String.format(CUSTOMER_INVENTORY_PATH, MediaspastoreConstants.EXTENSIONNAME, "customerInventory.impex"),
				false);

		executeSolrIndexerCronJob("mediaspaIndex", true);

		getSetupImpexService()
				.importImpexFile(String.format("/%s/import/coredata/stores/mediaspa/solr_discount.impex",
						MediaspastoreConstants.EXTENSIONNAME), true);
		getSetupImpexService()
				.importImpexFile(String.format("/%s/import/coredata/stores/mediaspa/solr_discount_en.impex",
						MediaspastoreConstants.EXTENSIONNAME), true);
		executeSolrIndexerCronJob("mediaspaDiscountIndex", true);
	}

	protected void processCockpit(final SystemSetupContext context, final boolean importAccessRights, final String... files)
	{
		if (importAccessRights)
		{
			for (final String file : files)
			{
				importImpexFile(context, file);
			}
		}
	}

	public CoreDataImportService getCoreDataImportService()
	{
		return coreDataImportService;
	}

	@Required
	public void setCoreDataImportService(final CoreDataImportService coreDataImportService)
	{
		this.coreDataImportService = coreDataImportService;
	}

	public SampleDataImportService getSampleDataImportService()
	{
		return sampleDataImportService;
	}

	@Required
	public void setSampleDataImportService(final SampleDataImportService sampleDataImportService)
	{
		this.sampleDataImportService = sampleDataImportService;
	}

	public CoreSystemSetup getCoreSystemSetup()
	{
		return coreSystemSetup;
	}

	@Autowired
	public void setCoreSystemSetup(CoreSystemSetup coreSystemSetup)
	{
		this.coreSystemSetup = coreSystemSetup;
	}
}
