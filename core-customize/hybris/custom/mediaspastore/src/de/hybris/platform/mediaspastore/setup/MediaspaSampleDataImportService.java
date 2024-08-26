/*
 * Copyright (c) 2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.platform.mediaspastore.setup;

import de.hybris.platform.commerceservices.dataimport.impl.SampleDataImportService;
import de.hybris.platform.commerceservices.setup.AbstractSystemSetup;
import de.hybris.platform.core.initialization.SystemSetupContext;
import de.hybris.platform.mediaspastore.constants.MediaspastoreConstants;
import de.hybris.platform.servicelayer.cronjob.PerformResult;
import de.hybris.platform.servicelayer.model.ModelService;
import de.hybris.platform.servicelayer.type.TypeService;

import org.springframework.beans.factory.annotation.Required;


/**
 * Mediaspa specific implementation of the {@link SampleDataImportService}.
 * <ul>
 * <li>imports additional sample data for subscriptions and bundles
 * </ul>
 *
 * @since 2102
 */
public class MediaspaSampleDataImportService extends SampleDataImportService
{
  private static final String PRODUCT_CATALOG_PARAMETER = "%sProductCatalog";
  private static final String SAMPLE_DATA_PATH = "/%s/import/sampledata/productCatalogs/" + PRODUCT_CATALOG_PARAMETER + "/%s";

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
    importFile(extensionName, productCatalogName, "productofferings-priceclass.impex");
    importFile(extensionName, productCatalogName, "productspecifications.impex");
    importFile(extensionName, productCatalogName, "productofferingprices.impex");

    super.importProductCatalog(extensionName, productCatalogName);

    importFile(extensionName, productCatalogName, "bundledproductoffering-structure.impex");
    importFile(extensionName, productCatalogName, "bundledproductoffering-pre-configurations.impex");
    importFile(extensionName, productCatalogName, "bundledproductoffering-groups.impex");
    importFile(extensionName, productCatalogName, "compatibilitypolicies.impex");
    importFile(extensionName, productCatalogName, "checklist-policies.impex");
    importFile(extensionName, productCatalogName, "productoffering-variants.impex");
    importFile(extensionName, productCatalogName, "productoffering-variants-prices.impex");
    importFile(extensionName, productCatalogName, "productoffering-variants-media.impex");
    importFile(extensionName, productCatalogName, "service-request.impex");

  }

  @Override
  public boolean synchronizeProductCatalog(final AbstractSystemSetup systemSetup, final SystemSetupContext context,
    final String catalogName, final boolean syncCatalogs)
  {
    systemSetup.logInfo(context, String.format("Begin synchronizing Product Catalog [%s]", catalogName));

    getSetupSyncJobService().createProductCatalogSyncJob(String.format(PRODUCT_CATALOG_PARAMETER, catalogName));

    if (syncCatalogs)
    {
      final PerformResult syncCronJobResult = getSetupSyncJobService()
        .executeCatalogSyncJob(String.format(PRODUCT_CATALOG_PARAMETER, catalogName));
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
    final String filePath = String.format(SAMPLE_DATA_PATH, extensionName, productCatalogName, fileName);
    getSetupImpexService().importImpexFile(filePath, false);
  }

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
