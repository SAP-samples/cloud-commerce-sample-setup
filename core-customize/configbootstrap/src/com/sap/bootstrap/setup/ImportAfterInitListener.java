package com.sap.bootstrap.setup;

import de.hybris.platform.commerceservices.setup.SetupSyncJobService;
import de.hybris.platform.servicelayer.cronjob.PerformResult;
import de.hybris.platform.servicelayer.event.events.AfterInitializationEndEvent;
import de.hybris.platform.servicelayer.event.impl.AbstractEventListener;
import de.hybris.platform.servicelayer.impex.ImportConfig;
import de.hybris.platform.servicelayer.impex.ImportResult;
import de.hybris.platform.servicelayer.impex.ImportService;
import de.hybris.platform.servicelayer.impex.impl.StreamBasedImpExResource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;

import java.util.Arrays;
import java.util.Comparator;
import java.util.List;

import static org.springframework.core.io.support.ResourcePatternResolver.CLASSPATH_ALL_URL_PREFIX;

public class ImportAfterInitListener extends AbstractEventListener<AfterInitializationEndEvent> {

    private static final Logger LOG = LoggerFactory.getLogger(ImportAfterInitListener.class);

    private final ImportService importService;

    private final SetupSyncJobService setupSyncJobService;

    private final PathMatchingResourcePatternResolver resolver = new PathMatchingResourcePatternResolver();

    public ImportAfterInitListener(ImportService importService, SetupSyncJobService setupSyncJobService) {
        this.importService = importService;
        this.setupSyncJobService = setupSyncJobService;
    }

    @Override
    protected void onEvent(AfterInitializationEndEvent afterInitializationEndEvent) {
        try {
            Resource[] resources = resolver.getResources(CLASSPATH_ALL_URL_PREFIX + "/impex/afterinit/**/*.impex");
            List<Resource> resourceList = Arrays.asList(resources);
            resourceList.sort(Comparator.comparing(Resource::getFilename));

            for (Resource resource : resourceList) {
                LOG.info("AfterInit: Importing {}", resource.getFilename());
                ImportConfig cfg = new ImportConfig();
                cfg.setEnableCodeExecution(true);
                cfg.setScript(new StreamBasedImpExResource(resource.getInputStream(), "UTF-8"));
                ImportResult importResult = importService.importData(cfg);
                if (importResult.isError()) {
                    LOG.error("AfterInit: Importing {} FAILED", resource.getFilename());
                }
            }

            // PerformResult result = setupSyncJobService.executeCatalogSyncJob("electronics-spaContentCatalog");
            // LOG.info("AfterInit Sync electronics-spaContentCatalog: {} / {}", result.getStatus(), result.getResult());
        } catch (Exception e) {
            LOG.error("AfterInit import FAILED", e);
        }
    }
}
