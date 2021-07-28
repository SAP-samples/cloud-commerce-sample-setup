/*
 * Copyright (c) 2019 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.platform.acceleratorstorefrontcommons.controllers.pages;

import de.hybris.bootstrap.annotations.UnitTest;
import de.hybris.platform.acceleratorservices.config.SiteConfigService;
import de.hybris.platform.acceleratorstorefrontcommons.controllers.pages.AbstractSearchPageController.ShowMode;
import de.hybris.platform.commerceservices.search.pagedata.SearchPageData;

import org.junit.Before;
import org.junit.Test;
import org.mockito.Answers;
import org.mockito.BDDMockito;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.springframework.ui.Model;


@UnitTest
public class AbstractSearchPageControllerUnitTest
{

	private static final int DEFAULT_PAGE_SIZE = 20;

	@Mock
	private Model model;

	@Mock(answer = Answers.RETURNS_DEEP_STUBS)
	private SearchPageData<?> searchPageData;

	@Mock
	private SiteConfigService siteConfigService; // The variable is required for the test(used in the AbstractSearchPageController).

	@InjectMocks
	private final AbstractSearchPageController controller = new AbstractSearchPageController()
	{
		//inner class for test in order to create instance of abstract class
	};

	@Before
	public void prepare()
	{
		MockitoAnnotations.initMocks(this);
	}


	//click http://electronics.local:9001/yb2bacceleratorstorefront/Open-Catalogue/Cameras/Digital-Cameras/c/575
	@Test
	public void testPagedDataFlagsCallShowAllOver100ResultsOneDefaultPage()
	{

		BDDMockito.given(Integer.valueOf(searchPageData.getPagination().getNumberOfPages())).willReturn(Integer.valueOf(2));
		BDDMockito.given(Long.valueOf(searchPageData.getPagination().getTotalNumberOfResults()))
				.willReturn(Long.valueOf(AbstractSearchPageController.MAX_PAGE_LIMIT + 1));
		BDDMockito.given(Integer.valueOf(searchPageData.getPagination().getPageSize()))
				.willReturn(Integer.valueOf(DEFAULT_PAGE_SIZE));



		controller.populateModel(model, searchPageData, ShowMode.Page);

		Mockito.verify(model).addAttribute("searchPageData", searchPageData);
		Mockito.verify(model).addAttribute("isShowAllAllowed", Boolean.FALSE);
		Mockito.verify(model).addAttribute("isShowPageAllowed", Boolean.FALSE);
	}

	//click http://electronics.local:9001/yb2bacceleratorstorefront/Open-Catalogue/Cameras/Digital-Cameras/c/575?q=:topRated:category:576
	@Test
	public void testPagedDataFlagsCallShowAllBelow100ResultsOneDefaultPage()
	{

		BDDMockito.given(Integer.valueOf(searchPageData.getPagination().getNumberOfPages())).willReturn(Integer.valueOf(2));
		BDDMockito.given(Long.valueOf(searchPageData.getPagination().getTotalNumberOfResults()))
				.willReturn(Long.valueOf(AbstractSearchPageController.MAX_PAGE_LIMIT - 1));
		BDDMockito.given(Integer.valueOf(searchPageData.getPagination().getPageSize()))
				.willReturn(Integer.valueOf(DEFAULT_PAGE_SIZE));



		controller.populateModel(model, searchPageData, ShowMode.Page);

		Mockito.verify(model).addAttribute("searchPageData", searchPageData);
		Mockito.verify(model).addAttribute("isShowAllAllowed", Boolean.TRUE);
		Mockito.verify(model).addAttribute("isShowPageAllowed", Boolean.FALSE);
	}

	//click http://electronics.local:9001/yb2bacceleratorstorefront/Open-Catalogue/Cameras/Digital-Cameras/c/575?q=:topRated:category:576&show=All
	@Test
	public void testAlldDataFlagsCallShowAllBelow100ResultsOneDefaultPage()
	{

		BDDMockito.given(Integer.valueOf(searchPageData.getPagination().getNumberOfPages())).willReturn(Integer.valueOf(1));
		BDDMockito.given(Long.valueOf(searchPageData.getPagination().getTotalNumberOfResults()))
				.willReturn(Long.valueOf(AbstractSearchPageController.MAX_PAGE_LIMIT - 1));
		BDDMockito.given(Integer.valueOf(searchPageData.getPagination().getPageSize()))
				.willReturn(Integer.valueOf(AbstractSearchPageController.MAX_PAGE_LIMIT));



		controller.populateModel(model, searchPageData, ShowMode.All);

		Mockito.verify(model).addAttribute("searchPageData", searchPageData);
		Mockito.verify(model).addAttribute("isShowAllAllowed", Boolean.FALSE);
		Mockito.verify(model).addAttribute("isShowPageAllowed", Boolean.TRUE);
	}


	//click http://electronics.local:9001/yb2bacceleratorstorefront/Open-Catalogue/Cameras/Digital-Cameras/c/575?q=:topRated:category:576&show=All
	@Test
	public void testAllDataFlagsCallShowAllBelowDefaultPageSizeResultsOneDefaultPage()
	{

		BDDMockito.given(Integer.valueOf(searchPageData.getPagination().getNumberOfPages())).willReturn(Integer.valueOf(1));
		BDDMockito.given(Long.valueOf(searchPageData.getPagination().getTotalNumberOfResults()))
				.willReturn(Long.valueOf(DEFAULT_PAGE_SIZE - 1));
		BDDMockito.given(Integer.valueOf(searchPageData.getPagination().getPageSize()))
				.willReturn(Integer.valueOf(AbstractSearchPageController.MAX_PAGE_LIMIT));



		controller.populateModel(model, searchPageData, ShowMode.Page);

		Mockito.verify(model).addAttribute("searchPageData", searchPageData);
		Mockito.verify(model).addAttribute("isShowAllAllowed", Boolean.FALSE);
		Mockito.verify(model).addAttribute("isShowPageAllowed", Boolean.FALSE);
	}


}
