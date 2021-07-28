<%@ page trimDirectiveWhitespaces="true"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="template" tagdir="/WEB-INF/tags/responsive/template"%>
<%@ taglib prefix="cms" uri="http://hybris.com/tld/cmstags"%>
<%@ taglib prefix="multiCheckout" tagdir="/WEB-INF/tags/responsive/checkout/multi"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>
<%@ taglib prefix="formElement" tagdir="/WEB-INF/tags/responsive/formElement" %>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>
<%@ taglib prefix="address" tagdir="/WEB-INF/tags/responsive/address" %>
<%@ taglib prefix="ycommerce" uri="http://hybris.com/tld/ycommercetags" %>

<spring:htmlEscape defaultHtmlEscape="true" />

<template:page pageTitle="${pageTitle}" hideHeaderLinks="true">

    <div class="row">
        <div class="col-sm-6">
            <div class="checkout-headline">
                <span class="glyphicon glyphicon-lock"></span>
                <spring:theme code="checkout.multi.secure.checkout"/>
            </div>
            <multiCheckout:checkoutSteps checkoutSteps="${checkoutSteps}" progressBarId="${progressBarId}">
                <jsp:body>
                    <ycommerce:testId code="checkoutStepThree">
                        <div class="checkout-paymentmethod">
                            <div class="checkout-indent">

                                <div class="headline"><spring:theme code="checkout.multi.paymentMethod"/></div>

                                <c:if test="${not empty paymentFormUrl}">
                                    <ycommerce:testId code="paymentDetailsForm">

                                        <form:form id="silentOrderPostForm" name="silentOrderPostForm" modelAttribute="sopPaymentDetailsForm" action="${paymentFormUrl}" method="POST">
                                            <input type="hidden" name="orderPage_receiptResponseURL" value="${fn:escapeXml(silentOrderPageData.parameters['orderPage_receiptResponseURL'])}"/>
                                            <input type="hidden" name="orderPage_declineResponseURL" value="${fn:escapeXml(silentOrderPageData.parameters['orderPage_declineResponseURL'])}"/>
                                            <input type="hidden" name="orderPage_cancelResponseURL" value="${fn:escapeXml(silentOrderPageData.parameters['orderPage_cancelResponseURL'])}"/>
                                            <c:forEach items="${sopPaymentDetailsForm.signatureParams}" var="entry" varStatus="status">
                                                <input type="hidden" id="${fn:escapeXml(entry.key)}" name="${fn:escapeXml(entry.key)}" value="${fn:escapeXml(entry.value)}"/>
                                            </c:forEach>
                                            <c:forEach items="${sopPaymentDetailsForm.subscriptionSignatureParams}" var="entry" varStatus="status">
                                                <input type="hidden" id="${fn:escapeXml(entry.key)}" name="${fn:escapeXml(entry.key)}" value="${fn:escapeXml(entry.value)}"/>
                                            </c:forEach>
                                            <input type="hidden" value="${fn:escapeXml(silentOrderPageData.parameters['billTo_email'])}" name="billTo_email" id="billTo_email">

                                            <div class="form-group">
                                                <c:if test="${not empty paymentInfos}">
                                                    <button type="button" class="btn btn-default btn-block js-saved-payments"><spring:theme code="checkout.multi.paymentMethod.addPaymentDetails.useSavedCard"/></button>
                                                </c:if>
                                            </div>

                                            <div class="form-group">
                                                <formElement:formSelectBox idKey="card_cardType" labelKey="payment.cardType" path="card_cardType" selectCSSClass="form-control" mandatory="true" skipBlank="false" skipBlankMessageKey="payment.cardType.pleaseSelect" items="${sopCardTypes}" tabindex="1"/>
                                            </div>

                                            <div class="form-group">
                                                <formElement:formInputBox idKey="card_nameOnCard" labelKey="payment.nameOnCard" path="card_nameOnCard" inputCSS="form-control" tabindex="2" mandatory="false" />

                                            </div>

                                            <div class="form-group">
                                                <formElement:formInputBox idKey="card_accountNumber" labelKey="payment.cardNumber" path="card_accountNumber" inputCSS="form-control" mandatory="true" tabindex="3" autocomplete="off" />
                                            </div>

                                            <fieldset id="startDate">
                                                <label for="" class="control-label"><spring:theme code="payment.startDate"/></label>
                                                <div class="row">
                                                    <div class="col-xs-6">
                                                        <formElement:formSelectBox idKey="StartMonth" selectCSSClass="form-control" labelKey="payment.month" path="card_startMonth" mandatory="true" skipBlank="false" skipBlankMessageKey="payment.month" items="${months}" tabindex="4"/>
                                                    </div>
                                                    <div class="col-xs-6">
                                                        <formElement:formSelectBox idKey="StartYear" selectCSSClass="form-control" labelKey="payment.year" path="card_startYear" mandatory="true" skipBlank="false" skipBlankMessageKey="payment.year" items="${startYears}" tabindex="7"/>
                                                    </div>
                                                </div>
                                            </fieldset>

                                            <fieldset id="cardDate">
                                                <label for="" class="control-label"><spring:theme code="payment.expiryDate"/></label>
                                                <div class="row">
                                                    <div class="col-xs-6">
                                                        <formElement:formSelectBox idKey="ExpiryMonth" selectCSSClass="form-control" labelKey="payment.month" path="card_expirationMonth" mandatory="true" skipBlank="false" skipBlankMessageKey="payment.month" items="${months}" tabindex="6"/>
                                                    </div>
                                                    <div class="col-xs-6">
                                                        <formElement:formSelectBox idKey="ExpiryYear" selectCSSClass="form-control" labelKey="payment.year" path="card_expirationYear" mandatory="true" skipBlank="false" skipBlankMessageKey="payment.year" items="${expiryYears}" tabindex="7"/>
                                                    </div>
                                                </div>
                                            </fieldset>

                                            <div class="row">
                                                <div class="form-group col-xs-6">
                                                    <formElement:formInputBox idKey="card_cvNumber" labelKey="payment.cvn" path="card_cvNumber" inputCSS="form-control" mandatory="true" tabindex="8" />
                                                </div>
                                            </div>

                                            <div class="row">
                                                <div class="form-group col-xs-6">
                                                    <div id="issueNum">
                                                        <formElement:formInputBox idKey="card_issueNumber" labelKey="payment.issueNumber" path="card_issueNumber" inputCSS="text" mandatory="false" tabindex="9"/>
                                                    </div>
                                                </div>
                                            </div>

                                            <sec:authorize access="!hasAnyRole('ROLE_ANONYMOUS')">
                                                <formElement:formCheckbox idKey="savePaymentMethod" labelKey="checkout.multi.sop.savePaymentInfo" path="savePaymentInfo"
                                                      inputCSS="" labelCSS="" mandatory="false" tabindex="10"/>
                                            </sec:authorize>
                            <hr/>
                            <div class="headline">
                            <spring:theme code="checkout.multi.paymentMethod.addPaymentDetails.billingAddress"/>
                        </div>

                        <c:if test="${cartData.deliveryItemsQuantity > 0}">
                            <div id="useDeliveryAddressData"
                                data-title="${fn:escapeXml(deliveryAddress.title)}"
                                data-firstname="${fn:escapeXml(deliveryAddress.firstName)}"
                                data-lastname="${fn:escapeXml(deliveryAddress.lastName)}"
                                data-line1="${fn:escapeXml(deliveryAddress.line1)}"
                                data-line2="${fn:escapeXml(deliveryAddress.line2)}"
                                data-town="${fn:escapeXml(deliveryAddress.town)}"
                                data-postalcode="${fn:escapeXml(deliveryAddress.postalCode)}"
                                data-countryisocode="${fn:escapeXml(deliveryAddress.country.isocode)}"
                                data-regionisocode="${fn:escapeXml(deliveryAddress.region.isocodeShort)}"
                                data-address-id="${fn:escapeXml(deliveryAddress.id)}"
                            ></div>
                            <formElement:formCheckbox
                                path="useDeliveryAddress"
                                idKey="useDeliveryAddress"
                                labelKey="checkout.multi.sop.useMyDeliveryAddress"
                                tabindex="11"/>
                        </c:if>

                        <input type="hidden" value="${fn:escapeXml(silentOrderPageData.parameters['billTo_email'])}" class="text" name="billTo_email" id="billTo_email">
                        <address:billAddressFormSelector supportedCountries="${countries}" regions="${regions}" tabindex="12"/>
                                            <p><spring:theme code="checkout.multi.paymentMethod.seeOrderSummaryForMoreInformation"/></p>

                                            <button type="button"
                            class="btn btn-primary btn-block submit_silentOrderPostForm checkout-next"><spring:theme code="checkout.multi.paymentMethod.continue"/></button>

                                        </form:form>
                                    </ycommerce:testId>
                                </c:if>
                            </div>
                        </div>

                        <c:if test="${not empty paymentInfos}">
                            <div id="savedpayments">
                                <div id="savedpaymentstitle">
                                    <div class="headline">
                                        <span class="headline-text"><spring:theme code="checkout.multi.paymentMethod.addPaymentDetails.useSavedCard"/></span>
                                    </div>
                                </div>
                                <div id="savedpaymentsbody">
                                    <spring:url var="choosePaymentMethod" value="{contextPath}/checkout/multi/payment-method/choose" htmlEscape="false">
                                        <spring:param name="contextPath" value="${request.contextPath}" />
                                    </spring:url>
                                    <c:forEach items="${paymentInfos}" var="paymentInfo" varStatus="status">
                                        <form action="${fn:escapeXml(choosePaymentMethod)}" method="GET">
                                            <input type="hidden" name="selectedPaymentMethodId" value="${fn:escapeXml(paymentInfo.id)}"/>
                                                    <strong>${fn:escapeXml(paymentInfo.billingAddress.firstName)}&nbsp; ${fn:escapeXml(paymentInfo.billingAddress.lastName)}</strong><br/>
                                                    ${fn:escapeXml(paymentInfo.cardType)}<br/>
                                                    ${fn:escapeXml(paymentInfo.accountHolderName)}<br/>
                                                    ${fn:escapeXml(paymentInfo.cardNumber)}<br/>
                                                    <spring:theme code="checkout.multi.paymentMethod.paymentDetails.expires" arguments="${paymentInfo.expiryMonth},${paymentInfo.expiryYear}"/><br/>
                                                    ${fn:escapeXml(paymentInfo.billingAddress.line1)}<br/>
                                                    ${fn:escapeXml(paymentInfo.billingAddress.town)}&nbsp; ${fn:escapeXml(paymentInfo.billingAddress.region.isocodeShort)}<br/>
                                                    ${fn:escapeXml(paymentInfo.billingAddress.postalCode)}&nbsp; ${fn:escapeXml(paymentInfo.billingAddress.country.isocode)}<br/>
                                                <button type="submit" class="btn btn-primary btn-block" tabindex="${(status.count * 2) - 1}"><spring:theme code="checkout.multi.paymentMethod.addPaymentDetails.useThesePaymentDetails"/></button>
                                        </form>
                                    </c:forEach>
                                </div>
                            </div>
                        </c:if>
                    </ycommerce:testId>
               </jsp:body>

            </multiCheckout:checkoutSteps>
		</div>

        <div class="col-sm-6 hidden-xs">
            <multiCheckout:checkoutOrderDetails cartData="${cartData}" showDeliveryAddress="true" showPaymentInfo="false" showTaxEstimate="false" showTax="true" />
        </div>

		<div class="col-sm-12 col-lg-12">
			<cms:pageSlot position="SideContent" var="feature" element="div" class="checkout-help">
				<cms:component component="${feature}"/>
			</cms:pageSlot>
		</div>
	</div>

</template:page>
