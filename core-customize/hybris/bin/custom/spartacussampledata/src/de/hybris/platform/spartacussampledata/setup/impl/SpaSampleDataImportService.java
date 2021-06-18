/*
 * Copyright (c) 2019 SAP SE or an SAP affiliate company. All rights reserved.
 * The files in this addon are licensed under the Apache Software License, v. 2
 * except as noted otherwise in the LICENSE file.
 */
package de.hybris.platform.spartacussampledata.setup.impl;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Required;

import de.hybris.platform.addonsupport.setup.impl.DefaultAddonSampleDataImportService;
import de.hybris.platform.catalog.jalo.SyncItemCronJob;
import de.hybris.platform.catalog.jalo.SyncItemJob;
import de.hybris.platform.catalog.model.CatalogVersionModel;
import de.hybris.platform.catalog.model.SyncItemJobModel;
import de.hybris.platform.core.initialization.SystemSetupContext;
import de.hybris.platform.cronjob.enums.CronJobResult;
import de.hybris.platform.cronjob.enums.CronJobStatus;
import de.hybris.platform.servicelayer.cronjob.PerformResult;
import de.hybris.platform.servicelayer.model.ModelService;
import de.hybris.platform.util.Utilities;


/**
 * This class extends {@link DefaultAddonSampleDataImportService} and specifies how to import sample data spartacus
 */
@SuppressWarnings("deprecation")
public class SpaSampleDataImportService extends DefaultAddonSampleDataImportService
{
	private static final String SYNC_CONTENT_CATALOG = "electronics->spa";
	private static final String STORES_URL = "/stores/";

	private ModelService modelService;
	private Map<String, String> additionalSampleDataImports;

	@Override
	protected void importContentCatalog(final SystemSetupContext context, final String importRoot, final String catalogName)
	{
		if (catalogName.equals("electronics") || catalogName.equals("powertools") || catalogName.equals("apparel-uk"))
		{
			// 1- create new catalog
			importImpexFile(context, importRoot + "/contentCatalogs/" + catalogName + "ContentCatalog/catalog.impex", false);

			// 2- sync xxxContentCatalog:Staged->xxx-spaContentCatalog:Staged
			final CatalogVersionModel catalog = getCatalogVersionService().getCatalogVersion(catalogName + "-spaContentCatalog", "Staged");
			List<SyncItemJobModel> synItemsJobs = catalog.getIncomingSynchronizations();
			if (synItemsJobs.size() > 0)
			{
				SyncItemJobModel job = synItemsJobs.get(0);
				final SyncItemJob jobItem = getModelService().getSource(job);
				synchronizeSpaContentCatalog(context, jobItem);
			}

			// 3- perform some cleaning
			importImpexFile(context, importRoot + "/contentCatalogs/" + catalogName + "ContentCatalog/cleaning.impex", false);

			// 4- solr ammendments
			importImpexFile(context, importRoot + "/productCatalogs/" + catalogName + "ProductCatalog/solr.impex", false);

		}

		// 4- import content catalog from impex
		super.importContentCatalog(context, importRoot, catalogName);

		if (catalogName.equals("electronics") || catalogName.equals("powertools") || catalogName.equals("apparel-uk"))
		{
			// 5- import additional sample data
			importAdditionalContentData(context, catalogName, importRoot);
			
			// 6- synchronize spaContentCatalog:staged->online
			synchronizeContentCatalog(context, catalogName + "-spa", true);

			// 7- give permission to cmsmanager to do the sync
			importImpexFile(context, importRoot + "/contentCatalogs/" + catalogName + "ContentCatalog/sync.impex", false);

			// 8- import email data
			importImpexFile(context, importRoot + "/contentCatalogs/" + catalogName + "ContentCatalog/email-content.impex", false);

			// 9 - import test data for each catalog
			importImpexFile(context, importRoot + STORES_URL + catalogName + "/test-data.impex", false);
		}
	}


	/**
	 * This methods imports the additional impex files that are required by various
	 * different modules. If those extension are loaded in the commerce
	 * installation, then the impex file is imported <br/>
	 * To enable the import the following needs to be done: <br/>
	 * 1. Define an entry in the map additionalSampleDataImports via spring config
	 * where the key is the extension name, and value is the impex file name <br/>
	 * 2. Include the impex file which contains the required data changes within the
	 * ContentCatalog folder
	 *
	 * @param context
	 * @param catalogName
	 * @param importRoot
	 */
	protected void importAdditionalContentData(final SystemSetupContext context, final String catalogName,
			final String importRoot) {
		additionalSampleDataImports.entrySet().forEach(i -> {
			if (Utilities.getExtensionNames().contains(i.getKey())) {
				importImpexFile(context,
						importRoot + "/contentCatalogs/" + catalogName + "ContentCatalog/" + i.getValue(), false);
			}
		});
	}


	@Override
	protected void importStoreLocations(final SystemSetupContext context, final String importRoot, final String storeName)
	{
		super.importStoreLocations(context, importRoot, storeName);
	}


	private void synchronizeSpaContentCatalog(final SystemSetupContext context, final SyncItemJob syncJobItem)
	{
		logInfo(context, "Begin synchronizing Content Catalog [" + SYNC_CONTENT_CATALOG + "] - synchronizing");

		final SyncItemCronJob syncCronJob = syncJobItem.newExecution();
		syncCronJob.setLogToDatabase(false);
		syncCronJob.setLogToFile(false);
		syncCronJob.setForceUpdate(false);
		syncJobItem.configureFullVersionSync(syncCronJob);

		logInfo(context, "Starting synchronization, this may take a while ...");
		syncJobItem.perform(syncCronJob, true);

		logInfo(context, "Synchronization complete for catalog [" + SYNC_CONTENT_CATALOG + "]");
		final CronJobResult result = modelService.get(syncCronJob.getResult());
		final CronJobStatus status = modelService.get(syncCronJob.getStatus());

		final PerformResult syncCronJobResult = new PerformResult(result, status);
		if (isSyncRerunNeeded(syncCronJobResult))
		{
			logInfo(context, "Catalog catalog [" + SYNC_CONTENT_CATALOG + "] sync has issues.");
		}

		logInfo(context, "Done synchronizing  Content Catalog [" + SYNC_CONTENT_CATALOG + "]");
	}

	protected ModelService getModelService()
	{
		return modelService;
	}

	@Required
	public void setModelService(final ModelService modelService)
	{
		this.modelService = modelService;
	}


	public Map<String, String> getAdditionalSampleDataImports() {
		return additionalSampleDataImports;
	}


	public void setAdditionalSampleDataImports(Map<String, String> additionalSampleDataImports) {
		this.additionalSampleDataImports = additionalSampleDataImports;
	}
}
