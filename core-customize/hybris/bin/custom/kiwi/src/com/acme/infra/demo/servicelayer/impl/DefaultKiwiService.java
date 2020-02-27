package com.acme.infra.demo.servicelayer.impl;

import com.acme.infra.demo.servicelayer.KiwiService;

import java.util.List;

import com.acme.infra.demo.model.InfraDemoItemModel;

import javax.annotation.Resource;

import de.hybris.platform.servicelayer.search.SearchResult;
import de.hybris.platform.servicelayer.search.FlexibleSearchService;

import com.google.common.collect.ImmutableMap;

/**
 *
 */
public class DefaultKiwiService implements KiwiService {

    @Resource
    private FlexibleSearchService flexibleSearchService;

    public void setFlexibleSearchService(final FlexibleSearchService flexibleSearchService)
    {
        this.flexibleSearchService = flexibleSearchService;
    }

    public List<InfraDemoItemModel> findInfraDemoItemByExampleNumberField(Long exampleNumberFieldValue) {
        SearchResult<InfraDemoItemModel> result =
                flexibleSearchService.search(
                        "select {PK} from {InfraDemoItem} where {exampleNumberField} = ?exampleNumberField",
                        ImmutableMap.of("exampleNumberField", exampleNumberFieldValue.toString()));

        List<InfraDemoItemModel> items = result.getResult();
        return items;
    }

}
