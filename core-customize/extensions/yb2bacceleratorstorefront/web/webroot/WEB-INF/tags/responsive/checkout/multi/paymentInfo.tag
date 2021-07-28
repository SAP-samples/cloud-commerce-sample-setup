<%@ attribute name="cartData" required="true" type="de.hybris.platform.commercefacades.order.data.CartData" %>
<%@ attribute name="paymentInfo" required="true" type="de.hybris.platform.commercefacades.order.data.CCPaymentInfoData" %>
<%@ attribute name="showPaymentInfo" required="false" type="java.lang.Boolean" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>

<spring:htmlEscape defaultHtmlEscape="true" />

<c:if test="${not empty paymentInfo && showPaymentInfo}">
    <ul class="checkout-order-summary-list">
        <li class="checkout-order-summary-list-heading">
            <div class="title"><spring:theme code="checkout.multi.payment" text="Payment:" /></div>
            <div class="address">
                <c:if test="${not empty paymentInfo.billingAddress}"> ${fn:escapeXml(paymentInfo.billingAddress.title)}</c:if>
                ${fn:escapeXml(paymentInfo.accountHolderName)}, ${fn:escapeXml(paymentInfo.cardTypeData.name)},
                ${fn:escapeXml(paymentInfo.cardNumber)}, ${fn:escapeXml(paymentInfo.expiryMonth)}/${fn:escapeXml(paymentInfo.expiryYear)} <br/>
                <c:if test="${not empty paymentInfo.billingAddress}">${fn:escapeXml(paymentInfo.billingAddress.line1)}, <c:if test="${not empty paymentInfo.billingAddress.line2}">${fn:escapeXml(paymentInfo.billingAddress.line2)},</c:if>
                ${fn:escapeXml(paymentInfo.billingAddress.town)}, ${fn:escapeXml(paymentInfo.billingAddress.region.name)}&nbsp;${fn:escapeXml(paymentInfo.billingAddress.postalCode)}, ${fn:escapeXml(paymentInfo.billingAddress.country.name)}</c:if>
                <br/><c:if test="${not empty paymentInfo.billingAddress.phone }">${fn:escapeXml(paymentInfo.billingAddress.phone)}</c:if>
            </div>
        </li>
    </ul>
</c:if>

