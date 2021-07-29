<%@ attribute name="supportedCountries" required="true" type="java.util.List"%>
<%@ attribute name="regions" required="true" type="java.util.List"%>
<%@ attribute name="country" required="false" type="java.lang.String"%>
<%@ attribute name="cancelUrl" required="false" type="java.lang.String"%>
<%@ attribute name="addressBook" required="false" type="java.lang.String"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="formElement" tagdir="/WEB-INF/tags/responsive/formElement"%>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form"%>
<%@ taglib prefix="address" tagdir="/WEB-INF/tags/responsive/address"%>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<%@ taglib prefix="ycommerce" uri="http://hybris.com/tld/ycommercetags"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>

<spring:htmlEscape defaultHtmlEscape="true" />

<c:if test="${not empty deliveryAddresses}">
	<button type="button" class="btn btn-default btn-block js-address-book">
		<spring:theme code="checkout.checkout.multi.deliveryAddress.viewAddressBook" />
	</button>
	<br>
</c:if>

<c:if test="${empty addressFormEnabled or addressFormEnabled}">
	<form:form method="post" modelAttribute="addressForm">
		<form:hidden path="addressId" class="add_edit_delivery_address_id"
			status="${not empty suggestedAddresses ? 'hasSuggestedAddresses' : ''}" />
		<input type="hidden" name="bill_state" id="address.billstate" />
	
		<div id="countrySelector" data-address-code="${fn:escapeXml(addressData.id)}"
			data-country-iso-code="${fn:escapeXml(addressData.country.isocode)}"
			class="form-group">
			<formElement:formSelectBox idKey="address.country"
				labelKey="address.country" path="countryIso" mandatory="true"
				skipBlank="false" skipBlankMessageKey="address.country"
				items="${supportedCountries}" itemValue="isocode"
				selectedValue="${addressForm.countryIso}"
				selectCSSClass="form-control" />
		</div>
		<div id="i18nAddressForm" class="i18nAddressForm">
			<c:if test="${not empty country}">
				<address:addressFormElements regions="${regions}"
					country="${country}" />
			</c:if>
		</div>
		<sec:authorize access="!hasAnyRole('ROLE_ANONYMOUS')">
			<div class="checkbox">
				<c:choose>
					<c:when test="${showSaveToAddressBook}">
						<formElement:formCheckbox idKey="saveAddressInMyAddressBook"
							labelKey="checkout.summary.deliveryAddress.saveAddressInMyAddressBook"
							path="saveInAddressBook" inputCSS="add-address-left-input"
							labelCSS="add-address-left-label" mandatory="true" />
					</c:when>
					<c:when test="${not addressBookEmpty && not isDefaultAddress}">
						<ycommerce:testId code="editAddress_defaultAddress_box">
							<formElement:formCheckbox idKey="defaultAddress"
								labelKey="address.default" path="defaultAddress"
								inputCSS="add-address-left-input"
								labelCSS="add-address-left-label" mandatory="true" />
						</ycommerce:testId>
					</c:when>
				</c:choose>
			</div>
		</sec:authorize>
		<div id="addressform_button_panel" class="form-actions">
			<c:choose>
				<c:when test="${edit eq true && not addressBook}">
					<ycommerce:testId code="multicheckout_saveAddress_button">
						<button
							class="positive right change_address_button show_processing_message"
							type="submit">
							<spring:theme code="checkout.multi.saveAddress" />
						</button>
					</ycommerce:testId>
				</c:when>
				<c:when test="${addressBook eq true}">
					<div class="accountActions">
						<div class="row">
							<div class="col-sm-6 col-sm-push-6 accountButtons">
								<ycommerce:testId code="editAddress_saveAddress_button">
									<button class="btn btn-primary btn-block change_address_button show_processing_message"
											type="submit">
										<spring:theme code="text.button.save" />
									</button>
								</ycommerce:testId>
							</div>
							<div class="col-sm-6 col-sm-pull-6 accountButtons">
								<ycommerce:testId code="editAddress_cancelAddress_button">
									<c:url value="${cancelUrl}" var="cancel"/>
									<a class="btn btn-block btn-default" href="${fn:escapeXml(cancel)}">
										<spring:theme code="text.button.cancel" />
									</a>
								</ycommerce:testId>
							</div>
						</div>
					</div>
				</c:when>
			</c:choose>
		</div>
	</form:form>
</c:if>