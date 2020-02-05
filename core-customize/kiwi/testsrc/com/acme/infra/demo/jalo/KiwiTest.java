/*
 * [y] hybris Platform
 *
 * Copyright (c) 2000-2013 hybris AG
 * All rights reserved.
 *
 * This software is the confidential and proprietary information of hybris
 * ("Confidential Information"). You shall not disclose such Confidential
 * Information and shall use it only in accordance with the terms of the
 * license agreement you entered into with hybris.
 * 
 *  
 */
package com.acme.infra.demo.jalo;

import static org.junit.Assert.assertTrue;
import static org.junit.Assert.assertEquals;

//import de.hybris.platform.testframework.HybrisJUnit4TransactionalTest;

import com.acme.infra.demo.servicelayer.KiwiService;
import org.apache.log4j.Logger;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import javax.annotation.Resource;

import java.util.List;

import com.google.common.collect.ImmutableMap;

import de.hybris.platform.servicelayer.model.ModelService;

import de.hybris.platform.servicelayer.ServicelayerBaseTest;

import de.hybris.platform.servicelayer.search.SearchResult;
import de.hybris.platform.servicelayer.search.FlexibleSearchService;

import com.acme.infra.demo.model.InfraDemoItemModel;

import com.acme.infra.demo.servicelayer.KiwiService;

/**
 * JUnit Tests for the Kiwi extension
 */
public class KiwiTest extends ServicelayerBaseTest
{
	/** Edit the local|project.properties to change logging behaviour (properties log4j.*). */
	@SuppressWarnings("unused")
	private static final Logger LOG = Logger.getLogger(KiwiTest.class.getName());

    @Resource
    private ModelService modelService;
    @Resource
    private FlexibleSearchService flexibleSearchService;
    @Resource
    private KiwiService kiwiService;

    private InfraDemoItemModel itemModelWrite;
    private InfraDemoItemModel itemModelRead;

	/**
	 * This is a sample test method.
	 */
	@Test
	public void test()
	{
        String exampleStringFieldValue = "Infra demo test";
        Long exampleNumberFieldValue = 1000L;

        itemModelWrite = modelService.create(InfraDemoItemModel.class);
        itemModelWrite.setExampleStringField(exampleStringFieldValue);
        itemModelWrite.setExampleNumberField(exampleNumberFieldValue);
        modelService.save(itemModelWrite);

        List<InfraDemoItemModel> items = kiwiService.findInfraDemoItemByExampleNumberField(exampleNumberFieldValue);

        if (items.size() > 0) {
            assertEquals("check the exampleStringField field", items.get(0).getExampleStringField(),exampleStringFieldValue);
        } else {
            assertTrue(false);
        }
	}
}
