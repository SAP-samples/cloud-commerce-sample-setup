/*
 * Copyright (c) 2019 SAP SE or an SAP affiliate company. All rights reserved.
 * The files in this addon are licensed under the Apache Software License, v. 2
 * except as noted otherwise in the LICENSE file.
 */
package de.hybris.platform.spartacussampledata.setup.impl;

import java.util.List;
import java.util.Map;

import de.hybris.platform.addonsupport.setup.impl.DefaultAddonSampleDataImportService;
import de.hybris.platform.catalog.jalo.SyncItemCronJob;
import de.hybris.platform.catalog.jalo.SyncItemJob;
import de.hybris.platform.catalog.model.CatalogVersionModel;
import de.hybris.platform.catalog.model.SyncItemJobModel;
import de.hybris.platform.commerceservices.setup.data.ImportData;
import de.hybris.platform.commerceservices.util.ResponsiveUtils;
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
	private static final String OPF_STORES_URL = "/opfStore/";
	private static final String OMM_OPF_STORES_URL = "/ommOpfStore/";
	private static final String OMS_OPF_STORES_URL = "/omsOpfStore/";
	private static final String BEGIN_IMPORTING_STORE_MSG = "Begin importing store";
	private static final String PRODUCT_CATALOGS_URL = "/productCatalogs/";
	private static final String CUSTOMER_COUPON_SERVICES_EXTENSION_NAME = "customercouponservices";
	private static final String ORDER_PROCESSES_URL = "/orderProcesses";
	private static final String OPF_ORDER_PROCESS_URL = "/opfOrderProcess/";
	private static final String OMM_OPF_ORDER_PROCESS_URL = "/ommOpfOrderProcess/";
	private static final String OMS_OPF_ORDER_PROCESS_URL = "/omsOpfOrderProcess/";
	private static final String IMPORT_URL = "/import";
	private static final String IMPORT_SAMPLE_DATA = "importSampleData";

	private ModelService modelService;
	private Map<String, String> additionalSampleDataImports;
	private List<String> opfSpecificDataImports;

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

			// 9- import my account data
			importImpexFile(context, importRoot + "/contentCatalogs/" + catalogName + "ContentCatalog/myaccount-navigation.impex", false);
			importImpexFile(context, importRoot + "/contentCatalogs/" + catalogName + "ContentCatalog/myaccount-content.impex", false);

		}
	}

	@Override
	protected void importCommonData(final SystemSetupContext context, final String importRoot)
	{
		super.importCommonData(context, importRoot);

		// import oAuth clients
		importImpexFile(context, importRoot + "/common/oauth-clients.impex", false);
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
	protected void doImportSampleData(final String extensionName, final SystemSetupContext context,
			final List<ImportData> importData, final boolean solrReindex, final boolean triggeredByAddon)
	{
		super.doImportSampleData(extensionName, context, importData, solrReindex, triggeredByAddon);

		if (Utilities.getExtensionNames().contains("opfservices"))
		{
			importOpfSpecificData(extensionName, context, importData, solrReindex, triggeredByAddon);
		}
	}

	/**
	 * This methods imports the OPF-specific impex files required to enable
	 * the OPF feature. If opfservices extension is loaded in the commerce
	 * installation, then these impex files are imported <br/>
	 * To enable the import the following needs to be done: <br/>
	 * 1. Define an entry in the list opfSpecificDataImports via spring config
	 * where the value is the OPF-specific impex file name  <br/>
	 * 2. Add the impex file containing the required data to the corresponding folder. <br/>
	 *
	 * @param extensionName
	 * @param context
	 * @param importData
	 * @param solrReindex
	 * @param triggeredByAddon
	 */
	protected void importOpfSpecificData(final String extensionName, final SystemSetupContext context,
                                        			final List<ImportData> importData, final boolean solrReindex, final boolean triggeredByAddon)
	{
		if (getBooleanSystemSetupParameter(context, IMPORT_SAMPLE_DATA))
		{
			String importRoot = "/" + extensionName + IMPORT_URL;

			if (triggeredByAddon)
			{
				importRoot = importRoot + "/addons/" + context.getExtensionName();
			}

			importOpfOrderProcess(context, importRoot);

			for (final ImportData importd : importData)
			{
				for (final String contentCatalogName : importd.getContentCatalogNames())
				{
					importOpfStoreData(context, importRoot, contentCatalogName);
					importOpfContentData(context, importRoot, contentCatalogName);
				}
			}
		}
	}

	/**
	 * This methods determines which OPF-specific impex files to import
	 * based on the installed extension. <br/>
	 * If sapcpiorderexchangeoms extension is loaded in the commerce
	 * installation, then these OMS+OPF impex files are imported. <br/>
	 * If sapcpiorderexchangeoms extension isn't loaded but sapcpiorderexchange
	 * extension is loaded, then these OMM+OPF impex files are imported. <br/>
	 * If no Integration extension is loaded, then OPF impex files are imported.<br/>
	 *
	 */
	protected void importOpfOrderProcess(final SystemSetupContext context,
										 final String importRoot) {
		if (Utilities.getExtensionNames().contains("sapcpiorderexchangeoms")) {
			opfSpecificDataImports.forEach(i -> {
				importImpexFile(context,
						importRoot + ORDER_PROCESSES_URL + OMS_OPF_ORDER_PROCESS_URL + i, false);
			});
		} else if (Utilities.getExtensionNames().contains("sapcpiorderexchange")) {
			opfSpecificDataImports.forEach(i -> {
				importImpexFile(context,
						importRoot + ORDER_PROCESSES_URL + OMM_OPF_ORDER_PROCESS_URL + i, false);
			});
		} else {
			opfSpecificDataImports.forEach(i -> {
				importImpexFile(context,
						importRoot + ORDER_PROCESSES_URL + OPF_ORDER_PROCESS_URL + i, false);
			});
		}
	}

	protected void importOpfStoreData(final SystemSetupContext context, final String importRoot,
									  final String storeName) {
		if (Utilities.getExtensionNames().contains("sapcpiorderexchangeoms")) {
			opfSpecificDataImports.forEach(i -> {
				importImpexFile(context,
						importRoot + STORES_URL + storeName + OMS_OPF_STORES_URL + i, false);
			});
		} else if (Utilities.getExtensionNames().contains("sapcpiorderexchange")) {
			opfSpecificDataImports.forEach(i -> {
				importImpexFile(context,
						importRoot + STORES_URL + storeName + OMM_OPF_STORES_URL + i, false);
			});
		} else {
			opfSpecificDataImports.forEach(i -> {
				importImpexFile(context, importRoot + STORES_URL + storeName + OPF_STORES_URL + i,
						false);
			});
		}
	}

	protected void importOpfContentData(final SystemSetupContext context, final String importRoot, final String catalogName)
	{
		opfSpecificDataImports.forEach(i -> {
			importImpexFile(context,
					importRoot + "/contentCatalogs/" + catalogName + "ContentCatalog/" + i, false);
		});
	}

	@Override
	protected void importStore(final SystemSetupContext context, final String importRoot, final String storeName)
	{
		super.importStore(context, importRoot,storeName);

		if (ResponsiveUtils.isResponsive())
		{
			importImpexFile(context, importRoot + STORES_URL + storeName + "/store-responsive.impex", false);
		}
	}


	@Override
	protected void importStoreLocations(final SystemSetupContext context, final String importRoot, final String storeName)
	{
		super.importStoreLocations(context, importRoot, storeName);
	}

	@Override
	protected void importStoreInitialData(final SystemSetupContext context, final String importRoot, final List<String> storeNames,
			final String productCatalog, final List<String> contentCatalogs, final boolean solrReindex)
	{
		for (final String storeName : storeNames)
		{

			logInfo(context, BEGIN_IMPORTING_STORE_MSG + " [" + storeName + "]");

			logInfo(context, "Begin importing warehouses for [" + storeName + "]");

			importImpexFile(context, importRoot + STORES_URL + storeName + "/warehouses.impex", false);

			logInfo(context, "Begin importing searchservices for [" + storeName + "]");

			importImpexFile(context, importRoot + STORES_URL + storeName + "/searchservices.impex", false);
		}

		// perform product sync job
		final boolean productSyncSuccess = synchronizeProductCatalog(context, productCatalog, true);
		if (!productSyncSuccess)
		{
			logInfo(context, "Product catalog synchronization for [" + productCatalog
					+ "] did not complete successfully, that's ok, we will rerun it after the content catalog sync.");
		}

		// exclude solr impexes for stores when customercouponservices extensions are not available
		if(isExtensionLoaded(CUSTOMER_COUPON_SERVICES_EXTENSION_NAME)) {
			for (final String storeName : storeNames)
			{
				importImpexFile(context, importRoot + STORES_URL + storeName + "/solr.impex", false);
			}
		} else {
			logInfo(context, "Impex for Coupons was skipped because the extension [" + CUSTOMER_COUPON_SERVICES_EXTENSION_NAME + "] requiring the changes is not included in the setup.");
		}

		synchronizeContent(context, productCatalog, contentCatalogs, productSyncSuccess);

		// Load reviews after synchronization is done
		importImpexFile(context, importRoot + PRODUCT_CATALOGS_URL + productCatalog + "ProductCatalog/reviews.impex", false);

		processStoreNames(context, importRoot, storeNames, productCatalog, solrReindex);
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

	public List<String> getOpfSpecificDataImports()
	{
	return opfSpecificDataImports;
	}
	
	public void setOpfSpecificDataImports(final List<String> opfSpecificDataImports)
	{	
	this.opfSpecificDataImports = opfSpecificDataImports;
	}

}
