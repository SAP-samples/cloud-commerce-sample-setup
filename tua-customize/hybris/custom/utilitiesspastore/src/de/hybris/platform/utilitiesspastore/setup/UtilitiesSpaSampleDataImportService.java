/*
 * Copyright (c) 2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.platform.utilitiesspastore.setup;

import de.hybris.platform.commerceservices.dataimport.impl.SampleDataImportService;
import de.hybris.platform.commerceservices.setup.AbstractSystemSetup;
import de.hybris.platform.core.initialization.SystemSetupContext;
import de.hybris.platform.servicelayer.cronjob.PerformResult;
import de.hybris.platform.servicelayer.model.ModelService;
import de.hybris.platform.servicelayer.type.TypeService;

import org.springframework.beans.factory.annotation.Required;


/**
 * Utilities specific implementation of the {@link SampleDataImportService}.
 * <ul>
 * <li>imports additional sample data for subscriptions and bundles
 * </ul>
 */
public class UtilitiesSpaSampleDataImportService extends SampleDataImportService
{
  private static final String PRODUCT_CATALOG_PATTERN = "%sProductCatalog";
  private static final String SAMPLE_DATA_PATH = "/%s/import/sampledata/productCatalogs/%sProductCatalog/";

  private TypeService typeService;
  private ModelService modelService;

  @Override
  protected void importProductCatalog(final String extensionName, final String productCatalogName)
  {
    // add catalog sync
    importFile(extensionName, productCatalogName, "catalog-sync.impex");

    importFile(extensionName, productCatalogName, "usagespecifications.impex");
    importFile(extensionName, productCatalogName, "billingPlans.impex");
    importFile(extensionName, productCatalogName, "subscriptionterms.impex");
    importFile(extensionName, productCatalogName, "usageunits.impex");
    importFile(extensionName, productCatalogName, "productspecifications.impex");
    importFile(extensionName, productCatalogName, "productofferingprices.impex");

    super.importProductCatalog(extensionName, productCatalogName);

    importFile(extensionName, productCatalogName, "bundledproductoffering-structure.impex");
    importFile(extensionName, productCatalogName, "bundledproductoffering-prices.impex");
    importFile(extensionName, productCatalogName, "bundledproductoffering-pre-configurations.impex");
    importFile(extensionName, productCatalogName, "bundledproductoffering-groups.impex");
    importFile(extensionName, productCatalogName, "compatibilitypolicies.impex");
    importFile(extensionName, productCatalogName, "checklist-policies.impex");
    importFile(extensionName, productCatalogName, "checklist-qualification-policies.impex");
    importFile(extensionName, productCatalogName, "productoffering-variants.impex");
    importFile(extensionName, productCatalogName, "service-request.impex");
  }

  @Override
  public boolean synchronizeProductCatalog(final AbstractSystemSetup systemSetup, final SystemSetupContext context,
    final String catalogName, final boolean syncCatalogs)
  {
    systemSetup.logInfo(context, String.format("Begin synchronizing Product Catalog [%s]", catalogName));

    getSetupSyncJobService().createProductCatalogSyncJob(String.format(PRODUCT_CATALOG_PATTERN, catalogName));

    if (syncCatalogs)
    {
      final PerformResult syncCronJobResult = getSetupSyncJobService()
        .executeCatalogSyncJob(String.format(PRODUCT_CATALOG_PATTERN, catalogName));
      if (isSyncRerunNeeded(syncCronJobResult))
      {
        systemSetup.logInfo(context, String.format("Product Catalog [%s] sync has issues.", catalogName));
        return false;
      }
    }

    return true;
  }

  private void importFile(final String extensionName, final String productCatalogName, final String fileName)
  {
    String filePath = SAMPLE_DATA_PATH + fileName;
    filePath = String.format(filePath, extensionName, productCatalogName);
    getSetupImpexService().importImpexFile(filePath, false);
  }

  /**
   * @return the typeService
   */
  protected TypeService getTypeService()
  {
    return typeService;
  }

  @Required
  public void setTypeService(final TypeService typeService)
  {
    this.typeService = typeService;
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
}
