/*
 * Copyright (c) 2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.platform.b2btelcospastore.setup;

import de.hybris.platform.b2btelcospastore.constants.B2btelcospastoreConstants;
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
import de.hybris.platform.servicelayer.config.ConfigurationService;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;


/**
 * System setup.
 *
 * @since 2105
 */
@SystemSetup(extension = B2btelcospastoreConstants.EXTENSIONNAME)
public class B2bTelcoSpaStoreSystemSetup extends AbstractSystemSetup
{
  public static final String B2BTELCOSPA = "b2btelcospa";
  public static final String IMPORT_ACCESS_RIGHTS = "accessRights";
  private static final String IMPORT_CORE_DATA = "importCoreData";
  private static final String IMPORT_SAMPLE_DATA = "importSampleData";
  private static final String ACTIVATE_SOLR_CRON_JOBS = "activateSolrCronJobs";
  private static final String B2BTELCOSPA_CONTENT_CATALOG = "b2btelcospaContentCatalog";

  private CoreDataImportService coreDataImportService;
  private SampleDataImportService sampleDataImportService;
  private CoreSystemSetup coreSystemSetup;
  private ConfigurationService configurationService;

  public B2bTelcoSpaStoreSystemSetup(final CoreDataImportService coreDataImportService,
    final SampleDataImportService sampleDataImportService, final ConfigurationService configurationService)
  {
    this.coreDataImportService = coreDataImportService;
    this.sampleDataImportService = sampleDataImportService;
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
    final ImportData b2btelcospaImportData = new ImportData();
    b2btelcospaImportData.setProductCatalogName(B2BTELCOSPA);
    b2btelcospaImportData.setContentCatalogNames(Arrays.asList(B2BTELCOSPA));
    b2btelcospaImportData.setStoreNames(Arrays.asList(B2BTELCOSPA));
    importData.add(b2btelcospaImportData);

    getCoreDataImportService().execute(this, context, importData);
    getEventService().publishEvent(new CoreDataImportedEvent(context, importData));

    getSetupImpexService().importImpexFile(
      String.format("/%s/import/sampledata/common/userpricegroup.impex", B2btelcospastoreConstants.EXTENSIONNAME), false);

    getSetupImpexService().importImpexFile(
      String.format("/%s/import/sampledata/common/user-groups.impex", B2btelcospastoreConstants.EXTENSIONNAME), false);

    getSampleDataImportService().execute(this, context, importData);
    getEventService().publishEvent(new SampleDataImportedEvent(context, importData));

    final boolean importAccessRights = getBooleanSystemSetupParameter(context, IMPORT_ACCESS_RIGHTS);
    processCockpit(context, importAccessRights, String.format(
      "/%s/import/sampledata/cockpits/productcockpit/productcockpit-users.impex", B2btelcospastoreConstants.EXTENSIONNAME));
    // sync the b2b telco spa content catalog again as sbg is using the b2b telco spa content catalog, too
    executeCatalogSyncJob(context, B2BTELCOSPA_CONTENT_CATALOG);

    // as promotions are not catalog aware,
    // we must import them into the online catalog which is only possible after the synchronization
    // as some online products are required
    getSetupImpexService()
      .importImpexFile(String.format("/%s/import/sampledata/promotions/promotions-engine-configuration.impex",
        B2btelcospastoreConstants.EXTENSIONNAME), false);
    getSetupImpexService()
      .importImpexFile(String.format("/%s/import/sampledata/productCatalogs/%sProductCatalog/promotions.impex",
        B2btelcospastoreConstants.EXTENSIONNAME, B2BTELCOSPA), false);

    executeSolrIndexerCronJob("b2btelcospaIndex", true);

    getSetupImpexService()
      .importImpexFile(String.format("/%s/import/coredata/stores/b2btelcospa/solr_discount.impex",
        B2btelcospastoreConstants.EXTENSIONNAME), true);
    getSetupImpexService()
      .importImpexFile(String.format("/%s/import/coredata/stores/b2btelcospa/solr_discount_en.impex",
        B2btelcospastoreConstants.EXTENSIONNAME), true);
    executeSolrIndexerCronJob("b2btelcospaDiscountIndex", true);

    getSetupImpexService().importImpexFile(String.format("/%s/import/sampledata/customerInventory/customerInventory.impex",
      B2btelcospastoreConstants.EXTENSIONNAME), false);

    getSetupImpexService()
      .importImpexFile(String.format("/%s/import/coredata/productimport/essentialdata-SimpleProductOffering.impex",
        B2btelcospastoreConstants.EXTENSIONNAME), true);
    getSetupImpexService()
      .importImpexFile(String.format("/%s/import/coredata/productimport/projectdata-SimpleProductOffering.impex",
        B2btelcospastoreConstants.EXTENSIONNAME), true);
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

  public SampleDataImportService getSampleDataImportService()
  {
    return sampleDataImportService;
  }

  public CoreSystemSetup getCoreSystemSetup()
  {
    return coreSystemSetup;
  }

  @Autowired
  public void setCoreSystemSetup(final CoreSystemSetup coreSystemSetup)
  {
    this.coreSystemSetup = coreSystemSetup;
  }

  protected ConfigurationService getConfigurationService()
  {
    return configurationService;
  }
}
