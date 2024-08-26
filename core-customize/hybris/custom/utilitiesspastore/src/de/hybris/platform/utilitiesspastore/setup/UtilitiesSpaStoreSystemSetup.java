/*
 * Copyright (c) 2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.platform.utilitiesspastore.setup;

import de.hybris.platform.b2ctelcoservices.setup.CoreSystemSetup;
import de.hybris.platform.commerceservices.dataimport.impl.CoreDataImportService;
import de.hybris.platform.commerceservices.dataimport.impl.SampleDataImportService;
import de.hybris.platform.commerceservices.setup.AbstractSystemSetup;
import de.hybris.platform.commerceservices.setup.data.ImportData;
import de.hybris.platform.commerceservices.setup.events.CoreDataImportedEvent;
import de.hybris.platform.commerceservices.setup.events.SampleDataImportedEvent;
import de.hybris.platform.core.Registry;
import de.hybris.platform.core.initialization.SystemSetup;
import de.hybris.platform.core.initialization.SystemSetupContext;
import de.hybris.platform.core.initialization.SystemSetupParameter;
import de.hybris.platform.core.initialization.SystemSetupParameterMethod;
import de.hybris.platform.servicelayer.config.ConfigurationService;
import de.hybris.platform.utilitiesspastore.constants.UtilitiesspastoreConstants;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;


/**
 * System setup.
 */
@SystemSetup(extension = UtilitiesspastoreConstants.EXTENSIONNAME)
public class UtilitiesSpaStoreSystemSetup extends AbstractSystemSetup
{
  public static final String UTILITIES_SPA_STORE = "utilitiesspa";
  public static final String UTILITIES_SPA_CATALOG_PREFIX = "utilitiesSpa";

  private static final String IMPORT_CORE_DATA = "importCoreData";
  private static final String IMPORT_SAMPLE_DATA = "importSampleData";
  private static final String ACTIVATE_SOLR_CRON_JOBS = "activateSolrCronJobs";
  private static final String IMPORT_ACCESS_RIGHTS = "accessRights";
  private static final String UTILITIES_SPA_CONTENT_CATALOG = "utilitiesSpaContentCatalog";

  private CoreDataImportService coreDataImportService;
  private SampleDataImportService sampleDataImportService;
  private CoreSystemSetup coreSystemSetup;
  private ConfigurationService configurationService;

  public UtilitiesSpaStoreSystemSetup(final ConfigurationService configurationService)
  {
    this.configurationService = configurationService;
  }

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

    final ImportData utilitiesImportData = new ImportData();
    utilitiesImportData.setProductCatalogName(UTILITIES_SPA_CATALOG_PREFIX);
    utilitiesImportData.setContentCatalogNames(Arrays.asList(UTILITIES_SPA_CATALOG_PREFIX));
    utilitiesImportData.setStoreNames(Arrays.asList(UTILITIES_SPA_STORE));
    importData.add(utilitiesImportData);

    getCoreDataImportService().execute(this, context, importData);
    getEventService().publishEvent(new CoreDataImportedEvent(context, importData));

    getSampleDataImportService().execute(this, context, importData);
    getEventService().publishEvent(new SampleDataImportedEvent(context, importData));

    final boolean importAccessRights = getBooleanSystemSetupParameter(context, IMPORT_ACCESS_RIGHTS);
    processCockpit(context, importAccessRights,
      String.format("/%s/import/sampledata/cockpits/productcockpit/productcockpit-users.impex",
        UtilitiesspastoreConstants.EXTENSIONNAME));

    // sync the telco content catalog again as sbg is using the telco content catalog, too
    executeCatalogSyncJob(context, UTILITIES_SPA_CONTENT_CATALOG);

    // as promotions are not catalog aware,
    // we must import them into the online catalog which is only possible after the synchronization
    // as some online products are required
    getSetupImpexService().importImpexFile(
      String.format("/%s/import/sampledata/productCatalogs/%sProductCatalog/promotions.impex",
        UtilitiesspastoreConstants.EXTENSIONNAME, UTILITIES_SPA_CATALOG_PREFIX),
      false);

    executeSolrIndexerCronJob("utilitiesspaIndex", true);

    getSetupImpexService()
      .importImpexFile(String.format("/%s/import/coredata/stores/utilitiesspa/solr_discount.impex",
        UtilitiesspastoreConstants.EXTENSIONNAME), true);
    getSetupImpexService()
      .importImpexFile(String.format("/%s/import/coredata/stores/utilitiesspa/solr_discount_en.impex",
        UtilitiesspastoreConstants.EXTENSIONNAME), true);
    executeSolrIndexerCronJob("utilitiesspaDiscountIndex", true);

    getSetupImpexService().importImpexFile(
      String.format("/%s/import/sampledata/customerInventory/customerInventory.impex",
        UtilitiesspastoreConstants.EXTENSIONNAME),
      false);
    getSetupImpexService().importImpexFile(String.format("/%s/import/sampledata/orders/orders.impex",
    UtilitiesspastoreConstants.EXTENSIONNAME), false);

    getSetupImpexService().importImpexFile(
      String.format("/%s/import/sampledata/common/user-groups.impex", UtilitiesspastoreConstants.EXTENSIONNAME), false);

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

  @Autowired
  public void setCoreDataImportService(final CoreDataImportService coreDataImportService)
  {
    this.coreDataImportService = coreDataImportService;
  }

  public SampleDataImportService getSampleDataImportService()
  {
    return sampleDataImportService;
  }

  @Autowired
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

  protected ConfigurationService getConfigurationService()
  {
    return configurationService;
  }
}
