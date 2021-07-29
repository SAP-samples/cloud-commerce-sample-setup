/*
 * Copyright (c) 2019 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.platform.yb2bacceleratorstorefront.controllers.pages;

import de.hybris.platform.acceleratorfacades.cartfileupload.SavedCartFileUploadFacade;
import de.hybris.platform.acceleratorstorefrontcommons.annotations.RequireHardLogIn;
import de.hybris.platform.acceleratorstorefrontcommons.breadcrumb.ResourceBreadcrumbBuilder;
import de.hybris.platform.acceleratorstorefrontcommons.constants.WebConstants;
import de.hybris.platform.acceleratorstorefrontcommons.controllers.ThirdPartyConstants;
import de.hybris.platform.acceleratorstorefrontcommons.controllers.pages.AbstractPageController;
import de.hybris.platform.acceleratorstorefrontcommons.forms.ImportCSVSavedCartForm;
import de.hybris.platform.acceleratorstorefrontcommons.forms.validation.ImportCSVSavedCartFormValidator;
import de.hybris.platform.cms2.exceptions.CMSItemNotFoundException;
import de.hybris.platform.cms2.model.pages.ContentPageModel;
import de.hybris.platform.yb2bacceleratorstorefront.controllers.ControllerConstants;

import java.io.IOException;
import java.io.InputStream;

import javax.annotation.Resource;

import org.apache.log4j.Logger;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;



/**
 * Controller for importing CSV file(s)
 */
@Controller
@RequestMapping("/import/csv")
public class ImportCSVPageController extends AbstractPageController
{
	private static final String SAVED_CART_PATH_SEGMENT = "/saved-cart";
	private static final String IMPORT_CSV_FILE_MAX_SIZE_BYTES_KEY = "import.csv.file.max.size.bytes";
	private static final String IMPORT_CSV_SAVED_CART_CMS_PAGE = "importCSVSavedCartPage";

	private static final Logger LOG = Logger.getLogger(ImportCSVPageController.class);

	@Resource(name = "simpleBreadcrumbBuilder")
	private ResourceBreadcrumbBuilder resourceBreadcrumbBuilder;

	@Resource(name = "importCSVSavedCartFormValidator")
	private ImportCSVSavedCartFormValidator importCSVSavedCartFormValidator;

	@Resource(name = "savedCartFileUploadFacade")
	private SavedCartFileUploadFacade savedCartFileUploadFacade;

	@RequestMapping(value = SAVED_CART_PATH_SEGMENT, method = RequestMethod.GET)
	@RequireHardLogIn
	public String savedCartImport(final Model model) throws CMSItemNotFoundException
	{
		model.addAttribute("csvFileMaxSize", getSiteConfigService().getLong(IMPORT_CSV_FILE_MAX_SIZE_BYTES_KEY, 0));

		final ContentPageModel importCsvSavedCartPage = getContentPageForLabelOrId(IMPORT_CSV_SAVED_CART_CMS_PAGE);
		storeCmsPageInModel(model, importCsvSavedCartPage);
		setUpMetaDataForContentPage(model, importCsvSavedCartPage);
		model.addAttribute(WebConstants.BREADCRUMBS_KEY, resourceBreadcrumbBuilder.getBreadcrumbs("import.csv.savedCart.title"));
		model.addAttribute(ThirdPartyConstants.SeoRobots.META_ROBOTS, ThirdPartyConstants.SeoRobots.NOINDEX_NOFOLLOW);

		return ControllerConstants.Views.Pages.CSV.ImportCSVSavedCartPage;
	}

	@ResponseBody
	@RequestMapping(value = SAVED_CART_PATH_SEGMENT, method = RequestMethod.POST)
	@RequireHardLogIn
	public ResponseEntity<String> handleSavedCartImport(
			@ModelAttribute("importCSVSavedCartForm") final ImportCSVSavedCartForm importCSVSavedCartForm,
			final BindingResult bindingResult) throws IOException
	{
		importCSVSavedCartFormValidator.validate(importCSVSavedCartForm, bindingResult);
		if (bindingResult.hasErrors())
		{
			final String errorMessage = getMessageSource().getMessage(bindingResult.getAllErrors().get(0).getCode(), null,
					getI18nService().getCurrentLocale());
			return new ResponseEntity<String>(errorMessage, HttpStatus.BAD_REQUEST);
		}
		else
		{
			try (final InputStream inputStream = importCSVSavedCartForm.getCsvFile().getInputStream())
			{
				savedCartFileUploadFacade.createCartFromFileUpload(inputStream,
						importCSVSavedCartForm.getCsvFile().getOriginalFilename(),
						importCSVSavedCartForm.getCsvFile().getContentType());
				return new ResponseEntity<String>(HttpStatus.OK);
			}
			catch (final IOException e)
			{
				if (LOG.isDebugEnabled())
				{
					LOG.debug(e.getMessage(), e);
				}

				return new ResponseEntity<String>(HttpStatus.INTERNAL_SERVER_ERROR);
			}

		}
	}
}
