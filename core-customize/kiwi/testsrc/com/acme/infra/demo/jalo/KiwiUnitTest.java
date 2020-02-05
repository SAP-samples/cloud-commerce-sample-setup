package com.acme.infra.demo.jalo;

import java.util.Arrays;
import java.util.List;
import java.util.ArrayList;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import de.hybris.bootstrap.annotations.UnitTest;
import com.acme.infra.demo.servicelayer.KiwiService;
import com.acme.infra.demo.servicelayer.impl.DefaultKiwiService;
import org.junit.Test;
import static org.junit.Assert.assertEquals;
import org.junit.Before;

import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import de.hybris.platform.servicelayer.search.FlexibleSearchService;
import com.acme.infra.demo.model.InfraDemoItemModel;

/**
 *
 */
@UnitTest
public class KiwiUnitTest {

    @Mock
    private DefaultKiwiService kiwiService;

    @Mock
    private FlexibleSearchService flexibleSearchService;

    @Before
    public void setUp()
    {
        MockitoAnnotations.initMocks(this);
    }

    @Test
    public void test() {
        Long exampleNumberFieldValue = 1000L;

        List<InfraDemoItemModel> mockedList = new ArrayList<InfraDemoItemModel>();
        InfraDemoItemModel model = new InfraDemoItemModel();
        model.setExampleNumberField(exampleNumberFieldValue);
        mockedList.add(model);

        //mock the findInfraDemoItemByExampleNumberField() method
        when(kiwiService.findInfraDemoItemByExampleNumberField(exampleNumberFieldValue)).thenReturn(mockedList);

        //call the mocked method
        List<InfraDemoItemModel> items = kiwiService.findInfraDemoItemByExampleNumberField(exampleNumberFieldValue);

        //check the results
        assertEquals(1, items.size());
        assertEquals(model.getExampleNumberField(),items.get(0).getExampleNumberField());

        //verify that the mocked method has been called
        verify(kiwiService).findInfraDemoItemByExampleNumberField(exampleNumberFieldValue);
    }
}
