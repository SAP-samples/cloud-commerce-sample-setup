/*
 * Copyright (c) 2019 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.platform.yb2bacceleratorstorefront.controllers.pages;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertThat;

import de.hybris.bootstrap.annotations.UnitTest;
import de.hybris.platform.acceleratorservices.config.SiteConfigService;
import de.hybris.platform.acceleratorservices.storefront.util.PageTitleResolver;
import de.hybris.platform.acceleratorstorefrontcommons.breadcrumb.Breadcrumb;
import de.hybris.platform.acceleratorstorefrontcommons.breadcrumb.ResourceBreadcrumbBuilder;
import de.hybris.platform.acceleratorstorefrontcommons.controllers.ThirdPartyConstants;
import de.hybris.platform.acceleratorstorefrontcommons.controllers.pages.AbstractSearchPageController.ShowMode;
import de.hybris.platform.acceleratorstorefrontcommons.forms.AddressForm;
import de.hybris.platform.acceleratorstorefrontcommons.forms.UpdateEmailForm;
import de.hybris.platform.acceleratorstorefrontcommons.forms.UpdatePasswordForm;
import de.hybris.platform.acceleratorstorefrontcommons.forms.UpdateProfileForm;
import de.hybris.platform.acceleratorstorefrontcommons.forms.validation.AddressValidator;
import de.hybris.platform.acceleratorstorefrontcommons.forms.validation.EmailValidator;
import de.hybris.platform.acceleratorstorefrontcommons.forms.validation.PasswordValidator;
import de.hybris.platform.acceleratorstorefrontcommons.forms.validation.ProfileValidator;
import de.hybris.platform.acceleratorstorefrontcommons.forms.verification.AddressVerificationResultHandler;
import de.hybris.platform.acceleratorstorefrontcommons.util.AddressDataUtil;
import de.hybris.platform.cms2.data.PagePreviewCriteriaData;
import de.hybris.platform.cms2.exceptions.CMSItemNotFoundException;
import de.hybris.platform.cms2.model.pages.AbstractPageModel;
import de.hybris.platform.cms2.model.pages.ContentPageModel;
import de.hybris.platform.cms2.model.pages.PageTemplateModel;
import de.hybris.platform.cms2.servicelayer.services.CMSPageService;
import de.hybris.platform.cms2.servicelayer.services.CMSPreviewService;
import de.hybris.platform.commercefacades.address.AddressVerificationFacade;
import de.hybris.platform.commercefacades.address.data.AddressVerificationResult;
import de.hybris.platform.commercefacades.customer.CustomerFacade;
import de.hybris.platform.commercefacades.i18n.I18NFacade;
import de.hybris.platform.commercefacades.order.CheckoutFacade;
import de.hybris.platform.commercefacades.order.OrderFacade;
import de.hybris.platform.commercefacades.order.data.CCPaymentInfoData;
import de.hybris.platform.commercefacades.order.data.OrderData;
import de.hybris.platform.commercefacades.order.data.OrderHistoryData;
import de.hybris.platform.commercefacades.user.UserFacade;
import de.hybris.platform.commercefacades.user.data.AddressData;
import de.hybris.platform.commercefacades.user.data.CountryData;
import de.hybris.platform.commercefacades.user.data.CustomerData;
import de.hybris.platform.commercefacades.user.data.RegionData;
import de.hybris.platform.commercefacades.user.data.TitleData;
import de.hybris.platform.commercefacades.user.exceptions.PasswordMismatchException;
import de.hybris.platform.commerceservices.address.AddressVerificationDecision;
import de.hybris.platform.commerceservices.customer.DuplicateUidException;
import de.hybris.platform.commerceservices.enums.CountryType;
import de.hybris.platform.commerceservices.search.pagedata.PageableData;
import de.hybris.platform.commerceservices.search.pagedata.PaginationData;
import de.hybris.platform.commerceservices.search.pagedata.SearchPageData;
import de.hybris.platform.servicelayer.exceptions.UnknownIdentifierException;
import de.hybris.platform.servicelayer.i18n.I18NService;
import de.hybris.platform.yb2bacceleratorstorefront.controllers.ControllerConstants;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Locale;

import org.apache.commons.collections.CollectionUtils;
import org.hamcrest.CoreMatchers;
import org.junit.Before;
import org.junit.Test;
import org.mockito.BDDMockito;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.springframework.context.MessageSource;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.validation.support.BindingAwareModelMap;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;


@UnitTest
public class AccountPageControllerTest
{
	private final Model page = Mockito.spy(new BindingAwareModelMap());

	private static final String VIEW_FOR_PAGE = "accountTest.jsp";
	private static final String VIEW_PREFIX = "pages/";
	private static final String FULL_VIEW_PATH = VIEW_PREFIX + VIEW_FOR_PAGE;
	private static final String TITLE_FOR_PAGE = "Account Test Title";

	public static final String CMS_PAGE_MODEL = "cmsPage";
	public static final String FIRST_NAME = "First";
	public static final String LAST_NAME = "Last";
	public static final String EMAIL = "hybris@hybris.com";
	public static final String TITLE_CODE = "Mr.";
	public static final String TEST_CODE = "12345";
	public static final String TEST_COUNTRY_CODE = "US";
	private static final String REDIRECT_TO_EDIT_ADDRESS_PAGE = "redirect:/my-account/edit-address/";
	private static final String REDIRECT_TO_UPDATE_PROFILE = "redirect:/my-account/update-profile";
	private static final String REDIRECT_TO_PAYMENT_INFO_PAGE = "redirect:/my-account/payment-details";
	private static final String REDIRECT_TO_PASSWORD_UPDATE_PAGE = "redirect:/my-account/update-password";
	private static final String REDIRECT_TO_ADDRESS_BOOK_PAGE = "redirect:/my-account/address-book";
	private static final String REDIRECT_TO_ORDER_HISTORY_PAGE = "redirect:/my-account/orders";

	private static final String UPDATE_EMAIL_CMS_PAGE = "update-email";
	private static final String UPDATE_PROFILE_CMS_PAGE = "update-profile";

	@InjectMocks
	private final AccountPageController accountController = Mockito.spy(new AccountPageController());

	@Mock
	private UserFacade userFacade;
	@Mock
	private OrderFacade orderFacade;
	@Mock
	private CheckoutFacade checkoutFacade;
	@Mock
	private CustomerFacade customerFacade;
	@Mock
	private AddressVerificationFacade addressVerificationFacade;
	@Mock
	private I18NFacade i18NFacade;
	@Mock
	private I18NService i18NService;
	@Mock
	private ContentPageModel contentPageModel;
	@Mock
	private AddressData addressData;
	@Mock
	private CountryData countryData;
	@Mock
	private RegionData regionData;
	@Mock
	private CustomerData customerData;
	@Mock
	private TitleData titleData;
	@Mock
	private PaginationData paginationData;
	@Mock
	private OrderHistoryData orderHistoryData;
	@Mock
	private OrderData orderData;
	@Mock
	private ResourceBreadcrumbBuilder accountBreadcrumbBuilder;
	@Mock
	private Breadcrumb breadcrumb;
	@Mock
	private MessageSource messageSource;
	@Mock
	private CMSPageService cmsPageService;
	@Mock
	private PageTitleResolver pageTitleResolver;
	@Mock
	private PageTemplateModel pageTemplateModel;
	@Mock
	private AbstractPageModel abstractPageModel;
	@Mock
	private AddressForm addressForm;
	@Mock
	private UpdateEmailForm emailForm;
	@Mock
	private UpdateProfileForm profileForm;
	@Mock
	private UpdatePasswordForm passwordForm;
	@Mock
	private BindingResult bindingResult;
	@Mock
	private RedirectAttributes redirectModel;
	@Mock
	private AddressVerificationResultHandler addressVerificationResultHandler;
	@Mock
	private PasswordValidator passwordValidator;
	@Mock
	private EmailValidator emailValidator;
	@Mock
	private AddressValidator addressValidator;
	@Mock
	private ProfileValidator profileValidator;
	@Mock
	private SiteConfigService siteConfigService;
	@Mock
	private CMSPreviewService cmsPreviewService;

	private List breadcrumbsList;

	private SearchPageData<OrderHistoryData> searchList;

	private final PagePreviewCriteriaData pagePreviewCriteriaData = new PagePreviewCriteriaData();

	@InjectMocks
	private final AddressDataUtil addressConverter = Mockito.spy(new AddressDataUtil());

	@Before
	public void prepare() throws CMSItemNotFoundException
	{
		MockitoAnnotations.initMocks(this);
		final Locale locale = new Locale("en");
		final List breadcrumbsList = new ArrayList();
		breadcrumbsList.add(breadcrumb);

		BDDMockito.given(cmsPreviewService.getPagePreviewCriteria()).willReturn(pagePreviewCriteriaData);
		BDDMockito.given(accountBreadcrumbBuilder.getBreadcrumbs(Mockito.anyString())).willReturn(breadcrumbsList);
		BDDMockito.given(cmsPageService.getPageForLabelOrId(Mockito.anyString(), Mockito.anyObject()))
				.willReturn(contentPageModel);
		BDDMockito.given(pageTitleResolver.resolveContentPageTitle(Mockito.anyString())).willReturn(TITLE_FOR_PAGE);
		BDDMockito.given(Boolean.valueOf(page.containsAttribute(CMS_PAGE_MODEL))).willReturn(Boolean.TRUE);
		BDDMockito.given(page.asMap().get(CMS_PAGE_MODEL)).willReturn(abstractPageModel);
		BDDMockito.given(abstractPageModel.getMasterTemplate()).willReturn(pageTemplateModel);
		BDDMockito.given(cmsPageService.getFrontendTemplateName(pageTemplateModel)).willReturn(VIEW_FOR_PAGE);

		BDDMockito.given(checkoutFacade.getCountries(CountryType.SHIPPING)).willReturn(Collections.singletonList(countryData));
		BDDMockito.given(userFacade.getTitles()).willReturn(Collections.singletonList(titleData));

		BDDMockito.given(customerData.getFirstName()).willReturn(FIRST_NAME);
		BDDMockito.given(customerData.getLastName()).willReturn(LAST_NAME);
		BDDMockito.given(customerData.getTitleCode()).willReturn(TITLE_CODE);
		BDDMockito.given(customerData.getUid()).willReturn(FIRST_NAME);
		BDDMockito.given(customerFacade.getCurrentCustomer()).willReturn(customerData);
		BDDMockito.given(i18NService.getCurrentLocale()).willReturn(locale);
		BDDMockito.given(i18NFacade.getRegionsForCountryIso(Mockito.anyString())).willReturn(Collections.singletonList(regionData));
		BDDMockito.given(messageSource.getMessage(Mockito.anyString(), Mockito.any(Object[].class), Mockito.eq(locale)))
				.willReturn("ANY STRING");
		BDDMockito.given(i18NFacade.getCountryForIsocode(Mockito.anyString())).willReturn(countryData);
	}

	private void setupAddressCreateEdit()
	{
		BDDMockito.doReturn(addressForm).when(accountController).getPreparedAddressForm();
	}

	private void createBasicAddressFields()
	{
		BDDMockito.given(addressForm.getFirstName()).willReturn(FIRST_NAME);
		BDDMockito.given(addressForm.getLastName()).willReturn(LAST_NAME);
		BDDMockito.given(addressForm.getLine1()).willReturn("LINE 1");
		BDDMockito.given(addressForm.getCountryIso()).willReturn("US");
		BDDMockito.given(addressForm.getRegionIso()).willReturn("NY");
		BDDMockito.given(addressForm.getPostcode()).willReturn("12345");
	}

	private void createEmailForm(final String email, final String password)
	{
		BDDMockito.given(emailForm.getEmail()).willReturn(email);
		BDDMockito.given(emailForm.getPassword()).willReturn(password);
	}

	private void setupExistingOrder()
	{
		BDDMockito.given(Integer.valueOf(paginationData.getNumberOfPages())).willReturn(Integer.valueOf(1));
		final ArrayList orderHistory = new ArrayList<OrderHistoryData>();
		orderHistory.add(orderHistoryData);
		searchList = new SearchPageData<OrderHistoryData>();
		searchList.setResults(orderHistory);
		searchList.setPagination(paginationData);
	}

	// Address Tests
	@Test
	public void shouldGetAddressForm()
	{
		BDDMockito.given(accountController.getCountries()).willReturn(Collections.singletonList(countryData));

		final String countryFragment = accountController.getCountryAddressForm("TEST_ADDRESS_CODE", TEST_COUNTRY_CODE, page);

		Mockito.verify(page).addAttribute("supportedCountries", accountController.getCountries());
		Mockito.verify(page).addAttribute("regions", i18NFacade.getRegionsForCountryIso(TEST_COUNTRY_CODE));
		Mockito.verify(page).addAttribute("country", TEST_COUNTRY_CODE);

		assertEquals(ControllerConstants.Views.Fragments.Account.CountryAddressForm, countryFragment);
	}

	@Test
	public void shouldGetAddressBook() throws CMSItemNotFoundException
	{
		BDDMockito.given(userFacade.getAddressBook()).willReturn(Collections.singletonList(addressData));

		final String addressBookPage = accountController.getAddressBook(page);
		Mockito.verify(page).addAttribute("addressData", Collections.singletonList(addressData));
		Mockito.verify(page).addAttribute("cmsPage", contentPageModel);
		Mockito.verify(page).addAttribute("pageTitle", TITLE_FOR_PAGE);

		assertEquals(FULL_VIEW_PATH, addressBookPage);
	}

	@Test
	public void shouldPrepareAddress()
	{
		final AddressForm addressForm = accountController.getPreparedAddressForm();
		assertEquals(FIRST_NAME, addressForm.getFirstName());
		assertEquals(LAST_NAME, addressForm.getLastName());
		assertEquals(TITLE_CODE, addressForm.getTitleCode());
	}

	@Test
	public void shouldGetAddAddress() throws CMSItemNotFoundException
	{
		BDDMockito.given(userFacade.getAddressBook()).willReturn(Collections.singletonList(addressData));
		setupAddressCreateEdit();
		final String addAddressPage = accountController.addAddress(page);

		Mockito.verify(page).addAttribute("countryData", Collections.singletonList(countryData));
		Mockito.verify(page).addAttribute("titleData", Collections.singletonList(titleData));
		Mockito.verify(page).addAttribute("addressForm", addressForm);
		Mockito.verify(page).addAttribute("addressBookEmpty", Boolean.FALSE);
		Mockito.verify(page).addAttribute("isDefaultAddress", Boolean.FALSE);

		assertEquals(FULL_VIEW_PATH, addAddressPage);
	}

	@Test
	public void shouldNotCreateInvalidAddress() throws CMSItemNotFoundException
	{
		BDDMockito.given(Boolean.valueOf(bindingResult.hasErrors())).willReturn(Boolean.TRUE);

		final String addAddressPage = accountController.addAddress(addressForm, bindingResult, page, redirectModel);

		Mockito.verify(accountController).setUpAddressFormAfterError(addressForm, page);
		assertEquals(FULL_VIEW_PATH, addAddressPage);
	}

	@Test
	public void shouldSuggestValidAddress() throws CMSItemNotFoundException
	{
		final AddressVerificationResult<AddressVerificationDecision> avsResult = new AddressVerificationResult<AddressVerificationDecision>();
		avsResult.setDecision(AddressVerificationDecision.REVIEW);
		createBasicAddressFields();
		BDDMockito.given(addressVerificationFacade.verifyAddressData(Mockito.any(AddressData.class))).willReturn(avsResult);
		BDDMockito.given(Boolean.valueOf(
				addressVerificationResultHandler.handleResult(Mockito.eq(avsResult), Mockito.any(AddressData.class), Mockito.eq(page),
						Mockito.eq(redirectModel), Mockito.eq(bindingResult), Mockito.anyBoolean(), Mockito.anyString())))
				.willReturn(Boolean.TRUE);

		final String addAddressPage = accountController.addAddress(addressForm, bindingResult, page, redirectModel);

		assertEquals(FULL_VIEW_PATH, addAddressPage);
	}

	@Test
	public void shouldCreateValidAddress() throws CMSItemNotFoundException
	{
		final AddressVerificationResult<AddressVerificationDecision> avsResult = new AddressVerificationResult<AddressVerificationDecision>();
		avsResult.setDecision(AddressVerificationDecision.ACCEPT);
		createBasicAddressFields();
		BDDMockito.given(addressVerificationFacade.verifyAddressData(Mockito.any(AddressData.class))).willReturn(avsResult);
		BDDMockito.given(Boolean.valueOf(
				addressVerificationResultHandler.handleResult(Mockito.eq(avsResult), Mockito.any(AddressData.class), Mockito.eq(page),
						Mockito.eq(redirectModel), Mockito.eq(bindingResult), Mockito.anyBoolean(), Mockito.anyString())))
				.willReturn(Boolean.FALSE);

		final String addAddressPage = accountController.addAddress(addressForm, bindingResult, page, redirectModel);

		Mockito.verify(userFacade).addAddress(Mockito.any(AddressData.class));
		assertThat(addAddressPage, CoreMatchers.containsString(REDIRECT_TO_EDIT_ADDRESS_PAGE));
	}

	@Test
	public void shouldGetEditAddress() throws CMSItemNotFoundException
	{
		final String addressBookPage = accountController.editAddress(TEST_CODE, page);

		Mockito.verify(page).addAttribute("countryData", checkoutFacade.getCountries(CountryType.SHIPPING));
		Mockito.verify(page).addAttribute("titleData", userFacade.getTitles());
		Mockito.verify(page).addAttribute("addressBookEmpty",
				Boolean.valueOf(CollectionUtils.isEmpty(userFacade.getAddressBook())));
		Mockito.verify(page).addAttribute(ThirdPartyConstants.SeoRobots.META_ROBOTS,
				ThirdPartyConstants.SeoRobots.NOINDEX_NOFOLLOW);
		Mockito.verify(page).addAttribute("edit", Boolean.TRUE);
		assertEquals(FULL_VIEW_PATH, addressBookPage);
	}

	@Test
	public void shouldNotUpdateInvalidAddress() throws CMSItemNotFoundException
	{
		BDDMockito.given(Boolean.valueOf(bindingResult.hasErrors())).willReturn(Boolean.TRUE);

		final String addressBookPage = accountController.editAddress(addressForm, bindingResult, page, redirectModel);

		Mockito.verify(accountController).setUpAddressFormAfterError(addressForm, page);
		assertEquals(FULL_VIEW_PATH, addressBookPage);
	}

	@Test
	public void shouldSuggestValidUpdateAddress() throws CMSItemNotFoundException
	{
		final AddressVerificationResult<AddressVerificationDecision> avsResult = new AddressVerificationResult<AddressVerificationDecision>();
		avsResult.setDecision(AddressVerificationDecision.REVIEW);
		createBasicAddressFields();
		BDDMockito.given(addressVerificationFacade.verifyAddressData(Mockito.any(AddressData.class))).willReturn(avsResult);
		BDDMockito.given(Boolean.valueOf(
				addressVerificationResultHandler.handleResult(Mockito.eq(avsResult), Mockito.any(AddressData.class), Mockito.eq(page),
						Mockito.eq(redirectModel), Mockito.eq(bindingResult), Mockito.anyBoolean(), Mockito.anyString())))
				.willReturn(Boolean.TRUE);

		final String addAddressPage = accountController.editAddress(addressForm, bindingResult, page, redirectModel);

		assertEquals(FULL_VIEW_PATH, addAddressPage);
	}

	@Test
	public void shouldUpdateValidAddress() throws CMSItemNotFoundException
	{
		final String editAddressPage = accountController.editAddress(addressForm, bindingResult, page, redirectModel);

		Mockito.verify(userFacade).editAddress(Mockito.any(AddressData.class));
		assertThat(editAddressPage, CoreMatchers.containsString(REDIRECT_TO_EDIT_ADDRESS_PAGE));
	}

	@Test
	public void shouldSetDefaultAddress()
	{
		final String addressBookPage = accountController.setDefaultAddress(TEST_CODE, redirectModel);

		Mockito.verify(userFacade).setDefaultAddress(Mockito.any(AddressData.class));
		assertEquals(REDIRECT_TO_ADDRESS_BOOK_PAGE, addressBookPage);
	}

	@Test
	public void shouldRemoveAddress()
	{
		final String addressBookPage = accountController.removeAddress(TEST_CODE, redirectModel);

		Mockito.verify(userFacade).removeAddress(Mockito.any(AddressData.class));
		assertEquals(REDIRECT_TO_ADDRESS_BOOK_PAGE, addressBookPage);
	}

	// Orders Tests
	@Test
	public void shouldGetAllOrders() throws CMSItemNotFoundException
	{
		final ShowMode showMode = ShowMode.All;
		setupExistingOrder();
		BDDMockito.given(orderFacade.getPagedOrderHistoryForStatuses(Mockito.any(PageableData.class))).willReturn(searchList);

		final String orderHistoryPage = accountController.orders(1, showMode, "desc", page);
		Mockito.verify(orderFacade).getPagedOrderHistoryForStatuses(Mockito.any(PageableData.class));
		assertEquals(FULL_VIEW_PATH, orderHistoryPage);
	}

	@Test
	public void shouldNotGetNonExistingOrder() throws CMSItemNotFoundException
	{
		BDDMockito.given(orderFacade.getOrderDetailsForCode(TEST_CODE)).willThrow(UnknownIdentifierException.class);
		final String orderHistoryPage = accountController.order(TEST_CODE, page, redirectModel);

		BDDMockito.verify(page, BDDMockito.times(0)).addAttribute(Mockito.anyString(), Mockito.anyString());
		assertEquals(REDIRECT_TO_ORDER_HISTORY_PAGE, orderHistoryPage);
	}

	@Test
	public void shouldGetExistingOrder() throws CMSItemNotFoundException
	{
		setupExistingOrder();
		BDDMockito.given(orderFacade.getOrderDetailsForCode(TEST_CODE)).willReturn(orderData);

		final String myAccountPage = accountController.order(TEST_CODE, page, redirectModel);

		BDDMockito.verify(page, BDDMockito.times(6)).addAttribute(Mockito.anyString(), Mockito.anyString());
		assertEquals(FULL_VIEW_PATH, myAccountPage);
	}

	// Profile Tests
	@Test
	public void shouldGetProfile() throws CMSItemNotFoundException
	{
		final String updateProfilePage = accountController.profile(page);

		BDDMockito.verify(page, BDDMockito.times(7)).addAttribute(Mockito.anyString(), Mockito.anyString());
		assertEquals(FULL_VIEW_PATH, updateProfilePage);
	}

	@Test
	public void shouldGetUpdateProfile() throws CMSItemNotFoundException
	{
		final String profilePage = accountController.editProfile(page);

		BDDMockito.verify(page, BDDMockito.times(7)).addAttribute(Mockito.anyString(), Mockito.anyString());
		assertEquals(FULL_VIEW_PATH, profilePage);
	}

	@Test
	public void shouldNotUpdateProfile() throws CMSItemNotFoundException, DuplicateUidException
	{
		BDDMockito.given(Boolean.valueOf(bindingResult.hasErrors())).willReturn(Boolean.TRUE);

		final String profilePage = accountController.updateProfile(profileForm, bindingResult, page, redirectModel);

		BDDMockito.verify(customerFacade, BDDMockito.times(0)).updateProfile(Mockito.any(CustomerData.class));
		BDDMockito.verify(accountController).setErrorMessagesAndCMSPage(page, UPDATE_PROFILE_CMS_PAGE);
		assertEquals(FULL_VIEW_PATH, profilePage);
	}

	@Test
	public void shouldNotUpdateDuplicateUidProfile() throws CMSItemNotFoundException, DuplicateUidException
	{
		BDDMockito.doThrow(new DuplicateUidException()).when(customerFacade).updateProfile(Mockito.any(CustomerData.class));

		final String profilePage = accountController.updateProfile(profileForm, bindingResult, page, redirectModel);

		BDDMockito.verify(customerFacade).updateProfile(Mockito.any(CustomerData.class));
		BDDMockito.verify(accountController).setErrorMessagesAndCMSPage(page, UPDATE_PROFILE_CMS_PAGE);
		assertEquals(FULL_VIEW_PATH, profilePage);
	}

	@Test
	public void shouldUpdateProfile() throws CMSItemNotFoundException, DuplicateUidException
	{
		final String profilePage = accountController.updateProfile(profileForm, bindingResult, page, redirectModel);

		BDDMockito.verify(customerFacade).updateProfile(Mockito.any(CustomerData.class));
		assertEquals(REDIRECT_TO_UPDATE_PROFILE, profilePage);
	}

	// E-mail Tests
	@Test
	public void shouldGetEmail() throws CMSItemNotFoundException
	{
		final String emailPage = accountController.editEmail(page);

		BDDMockito.verify(page, BDDMockito.times(6)).addAttribute(Mockito.anyString(), Mockito.anyString());
		assertEquals(FULL_VIEW_PATH, emailPage);
	}

	@Test
	public void shouldNotUpdateInavlidEmail() throws CMSItemNotFoundException
	{
		BDDMockito.given(Boolean.valueOf(bindingResult.hasErrors())).willReturn(Boolean.TRUE);

		final String emailUpdatePage = accountController.updateEmail(emailForm, bindingResult, page, redirectModel);

		BDDMockito.verify(accountController).setErrorMessagesAndCMSPage(page, UPDATE_EMAIL_CMS_PAGE);
		assertEquals(FULL_VIEW_PATH, emailUpdatePage);
	}

	@Test
	public void shouldNotUpdateDuplicateEmail() throws CMSItemNotFoundException, PasswordMismatchException, DuplicateUidException
	{
		createEmailForm(EMAIL, FIRST_NAME);
		BDDMockito.doThrow(new DuplicateUidException()).when(customerFacade).changeUid(Mockito.anyString(), Mockito.anyString());
		final String emailUpdatePage = accountController.updateEmail(emailForm, bindingResult, page, redirectModel);

		BDDMockito.verify(bindingResult).rejectValue("email", "profile.email.unique");
		BDDMockito.verify(accountController).setErrorMessagesAndCMSPage(page, UPDATE_EMAIL_CMS_PAGE);
		assertEquals(FULL_VIEW_PATH, emailUpdatePage);
	}

	@Test
	public void shouldNotUpdateInvalidPassword() throws CMSItemNotFoundException, PasswordMismatchException, DuplicateUidException
	{
		createEmailForm(EMAIL, "123");
		BDDMockito.doThrow(new PasswordMismatchException("error")).when(customerFacade).changeUid(Mockito.anyString(),
				Mockito.anyString());
		final String emailUpdatePage = accountController.updateEmail(emailForm, bindingResult, page, redirectModel);

		BDDMockito.verify(bindingResult).rejectValue("password", "profile.currentPassword.invalid");
		BDDMockito.verify(accountController).setErrorMessagesAndCMSPage(page, UPDATE_EMAIL_CMS_PAGE);
		assertEquals(FULL_VIEW_PATH, emailUpdatePage);
	}

	// Password Tests
	@Test
	public void shouldGetPassword() throws CMSItemNotFoundException
	{
		final String passwordPage = accountController.updatePassword(page);

		BDDMockito.verify(page).addAttribute(BDDMockito.eq("updatePasswordForm"), Mockito.any(UpdatePasswordForm.class));
		assertEquals(FULL_VIEW_PATH, passwordPage);
	}

	@Test
	public void shouldNotUpdatePassword() throws CMSItemNotFoundException
	{
		BDDMockito.given(Boolean.valueOf(bindingResult.hasErrors())).willReturn(Boolean.TRUE);
		BDDMockito.given(accountBreadcrumbBuilder.getBreadcrumbs("text.account.profile.updatePasswordForm"))
				.willReturn(breadcrumbsList);
		final String passwordPage = accountController.updatePassword(passwordForm, bindingResult, page, redirectModel);

		BDDMockito.verify(page).addAttribute("breadcrumbs", breadcrumbsList);
		assertEquals(FULL_VIEW_PATH, passwordPage);
	}

	@Test
	public void shouldNotUpdatePasswordNotEqual() throws CMSItemNotFoundException
	{
		BDDMockito.given(passwordForm.getCurrentPassword()).willReturn(TEST_CODE);
		BDDMockito.given(passwordForm.getNewPassword()).willReturn("Different");

		final String passwordPage = accountController.updatePassword(passwordForm, bindingResult, page, redirectModel);

		BDDMockito.verify(bindingResult).rejectValue("checkNewPassword", "validation.checkPwd.equals", new Object[] {},
				"validation.checkPwd.equals");
		assertEquals(REDIRECT_TO_PASSWORD_UPDATE_PAGE, passwordPage);
	}

	@Test
	public void shouldNotUpdatePasswordNotValid() throws CMSItemNotFoundException
	{
		BDDMockito.given(passwordForm.getCheckNewPassword()).willReturn(TEST_CODE);
		BDDMockito.given(passwordForm.getNewPassword()).willReturn(TEST_CODE);
		Mockito.doThrow(new PasswordMismatchException("error")).when(customerFacade).changePassword(Mockito.anyString(),
				Mockito.anyString());

		final String passwordPage = accountController.updatePassword(passwordForm, bindingResult, page, redirectModel);

		BDDMockito.verify(bindingResult).rejectValue("currentPassword", "profile.currentPassword.invalid", new Object[] {},
				"profile.currentPassword.invalid");
		assertEquals(REDIRECT_TO_PASSWORD_UPDATE_PAGE, passwordPage);
	}

	@Test
	public void shouldUpdatePassword() throws CMSItemNotFoundException
	{
		BDDMockito.given(passwordForm.getCheckNewPassword()).willReturn(TEST_CODE);
		BDDMockito.given(passwordForm.getNewPassword()).willReturn(TEST_CODE);
		BDDMockito.given(passwordForm.getCurrentPassword()).willReturn(TEST_CODE);

		final String passwordPage = accountController.updatePassword(passwordForm, bindingResult, page, redirectModel);

		BDDMockito.verify(customerFacade).changePassword(TEST_CODE, TEST_CODE);
		assertEquals(REDIRECT_TO_PASSWORD_UPDATE_PAGE, passwordPage);
	}

	// Payment Tests
	@Test
	public void shouldGetPaymentDetails() throws CMSItemNotFoundException
	{
		final String paymentDetailsPage = accountController.paymentDetails(page);

		BDDMockito.verify(page, BDDMockito.times(7)).addAttribute(Mockito.anyString(), Mockito.anyString());
		assertEquals(FULL_VIEW_PATH, paymentDetailsPage);
	}

	@Test
	public void shouldSetDefaultPaymentDetailsNull() throws CMSItemNotFoundException
	{
		final String paymentDetailsPage = accountController.setDefaultPaymentDetails(null);

		BDDMockito.verify(userFacade, BDDMockito.times(0)).getCCPaymentInfoForCode(Mockito.anyString());
		BDDMockito.verify(userFacade).setDefaultPaymentInfo(Mockito.any(CCPaymentInfoData.class));
		assertEquals(REDIRECT_TO_PAYMENT_INFO_PAGE, paymentDetailsPage);
	}

	@Test
	public void shouldSetDefaultPaymentDetails() throws CMSItemNotFoundException
	{
		final String paymentDetailsPage = accountController.setDefaultPaymentDetails(TEST_CODE);

		BDDMockito.verify(userFacade, BDDMockito.times(1)).getCCPaymentInfoForCode(Mockito.anyString());
		BDDMockito.verify(userFacade).setDefaultPaymentInfo(Mockito.any(CCPaymentInfoData.class));
		assertEquals(REDIRECT_TO_PAYMENT_INFO_PAGE, paymentDetailsPage);
	}

	@Test
	public void shouldRemovePaymentMethod() throws CMSItemNotFoundException
	{
		final String paymentDetailsPage = accountController.removePaymentMethod(TEST_CODE, redirectModel);

		BDDMockito.verify(userFacade, BDDMockito.times(1)).unlinkCCPaymentInfo(Mockito.anyString());
		assertEquals(REDIRECT_TO_PAYMENT_INFO_PAGE, paymentDetailsPage);
	}
}
